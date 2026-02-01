/*
  Navigate Obstacle Challenge FSM

  Flow:
  1. Follow red line using IR sensors for correction
  2. If blue detected (1st time) -> pickup box (scaffolding)
  3. If obstacle detected by ultrasonic -> dodge right around it
  4. If blue detected (2nd time) -> drop off box (scaffolding)
  5. If black detected -> stop, course complete

  Dodge sequence (rectangular path around 9cm x 9cm obstacle):
    Turn right 90° -> drive past width -> turn left 90° ->
    drive past length -> turn left 90° -> drive until red found ->
    turn right 90° to realign
*/

#include "navigate_obstacle.h"
#include "color_sensor_func.h"
#include "motor_func.h"
#include "ultrasonic_sensor_func.h"
#include "line_follow_func.h"
#include <string.h>

// ============ FSM STATE VARIABLES ============
static ObstacleState state = OBS_FOLLOW_RED;
static int blueCount = 0;             // Track blue zone encounters
static unsigned long dodgeTimer = 0;  // Timer for timed dodge movements

// ============ COLOR HELPERS ============

bool obsIsRed() {
  return strcmp(readDominantColor(), "RED") == 0;
}

bool obsIsBlue() {
  return strcmp(readDominantColor(), "BLUE") == 0;
}

bool obsIsBlack() {
  return strcmp(readDominantColor(), "BLACK") == 0;
}

// ============ SETUP ============

/**
 * Initialize obstacle course systems
 * Call once from main setup()
 */
void obstacleSetup() {
  state = OBS_FOLLOW_RED;
  blueCount = 0;
  dodgeTimer = 0;

  motorStop();
  Serial.println("[OBS] Obstacle course FSM initialized");
}

// ============ OBSTACLE COURSE FSM ============

void navigateObstacleFSM() {

  switch (state) {

    // ---------------------------------------------------------
    // STATE: FOLLOW RED LINE
    // Main driving state with obstacle/blue/black detection
    // ---------------------------------------------------------
    case OBS_FOLLOW_RED: {

      // Priority 1: Check for black (course end)
      if (obsIsBlack()) {
        Serial.println("[OBS] BLACK detected - course complete!");
        motorStop();
        state = OBS_COMPLETE;
        break;
      }

      // Priority 2: Check for blue zone (pickup/dropoff)
      if (obsIsBlue()) {
        motorStop();
        blueCount++;
        Serial.print("[OBS] BLUE zone detected (#");
        Serial.print(blueCount);
        Serial.println(")");

        if (blueCount == 1) {
          state = OBS_PICKUP_BOX;
        } else {
          state = OBS_DROPOFF_BOX;
        }
        break;
      }

      // Priority 3: Check for obstacle
      if (ultrasonicObjectWithin(OBS_DETECT_CM)) {
        Serial.println("[OBS] Obstacle detected - starting dodge");
        motorStop();
        state = OBS_DODGE_TURN_RIGHT;
        break;
      }

      // Use line follow FSM for IR-based line correction
      lineFollowFSM("RED");
      break;
    }

    // ---------------------------------------------------------
    // STATE: PICKUP BOX (scaffolding)
    // TODO: Implement servo gripper pickup
    // ---------------------------------------------------------
    case OBS_PICKUP_BOX: {
      Serial.println("[OBS] PICKUP_BOX - TODO: implement pickup");

      // TODO: Close gripper to pick up box
      // servoSetAngle(GRIPPER_CLOSE_ANGLE);
      // delay(500);

      delay(300);

      // Resume following red line
      state = OBS_FOLLOW_RED;
      Serial.println("[OBS] Resuming line follow after pickup zone");
      break;
    }

    // ---------------------------------------------------------
    // STATE: DROPOFF BOX (scaffolding)
    // TODO: Implement servo gripper dropoff
    // ---------------------------------------------------------
    case OBS_DROPOFF_BOX: {
      Serial.println("[OBS] DROPOFF_BOX - TODO: implement dropoff");

      // TODO: Open gripper to release box
      // servoSetAngle(GRIPPER_OPEN_ANGLE);
      // delay(500);

      delay(300);

      // Resume following red line
      state = OBS_FOLLOW_RED;
      Serial.println("[OBS] Resuming line follow after dropoff zone");
      break;
    }

    // ---------------------------------------------------------
    // STATE: DODGE - Turn right 90° away from obstacle
    // ---------------------------------------------------------
    case OBS_DODGE_TURN_RIGHT: {
      Serial.println("[OBS] Dodge: turning right 90 degrees");
      motorTurnRight(OBS_TURN_SPEED, OBS_TURN_90_TIME);
      motorStop();
      delay(100);

      // Start timer for driving past obstacle width
      dodgeTimer = millis();
      state = OBS_DODGE_PASS_SIDE;
      break;
    }

    // ---------------------------------------------------------
    // STATE: DODGE - Drive forward to clear obstacle width
    // ---------------------------------------------------------
    case OBS_DODGE_PASS_SIDE: {
      motorMoveForward(OBS_DODGE_SPEED);

      if (millis() - dodgeTimer >= DODGE_SIDE_TIME) {
        motorStop();
        delay(100);
        Serial.println("[OBS] Dodge: cleared obstacle width");
        state = OBS_DODGE_TURN_FORWARD;
      }
      break;
    }

    // ---------------------------------------------------------
    // STATE: DODGE - Turn left 90° to face parallel to line
    // ---------------------------------------------------------
    case OBS_DODGE_TURN_FORWARD: {
      Serial.println("[OBS] Dodge: turning left 90 degrees (parallel)");
      motorTurnLeft(OBS_TURN_SPEED, OBS_TURN_90_TIME);
      motorStop();
      delay(100);

      // Start timer for driving past obstacle length
      dodgeTimer = millis();
      state = OBS_DODGE_PASS_LENGTH;
      break;
    }

    // ---------------------------------------------------------
    // STATE: DODGE - Drive forward to clear obstacle length
    // ---------------------------------------------------------
    case OBS_DODGE_PASS_LENGTH: {
      motorMoveForward(OBS_DODGE_SPEED);

      if (millis() - dodgeTimer >= DODGE_LENGTH_TIME) {
        motorStop();
        delay(100);
        Serial.println("[OBS] Dodge: cleared obstacle length");
        state = OBS_DODGE_TURN_TO_LINE;
      }
      break;
    }

    // ---------------------------------------------------------
    // STATE: DODGE - Turn left 90° to face toward the line
    // ---------------------------------------------------------
    case OBS_DODGE_TURN_TO_LINE: {
      Serial.println("[OBS] Dodge: turning left 90 degrees (toward line)");
      motorTurnLeft(OBS_TURN_SPEED, OBS_TURN_90_TIME);
      motorStop();
      delay(100);

      state = OBS_DODGE_FIND_RED;
      Serial.println("[OBS] Dodge: searching for red line");
      break;
    }

    // ---------------------------------------------------------
    // STATE: DODGE - Drive forward until red line is found
    // ---------------------------------------------------------
    case OBS_DODGE_FIND_RED: {
      motorMoveForward(OBS_SEARCH_SPEED);

      if (obsIsRed()) {
        motorStop();
        delay(100);
        Serial.println("[OBS] Dodge: red line found!");
        state = OBS_DODGE_ALIGN;
      }

      delay(OBS_SENSOR_DELAY);
      break;
    }

    // ---------------------------------------------------------
    // STATE: DODGE - Turn right 90° to realign with line
    // ---------------------------------------------------------
    case OBS_DODGE_ALIGN: {
      Serial.println("[OBS] Dodge: turning right 90 degrees (realign)");
      motorTurnRight(OBS_TURN_SPEED, OBS_TURN_90_TIME);
      motorStop();
      delay(100);

      Serial.println("[OBS] Dodge complete - resuming line follow");
      state = OBS_FOLLOW_RED;
      break;
    }

    // ---------------------------------------------------------
    // STATE: COMPLETE - Course finished
    // ---------------------------------------------------------
    case OBS_COMPLETE: {
      motorStop();
      Serial.println("[OBS] === OBSTACLE COURSE COMPLETE ===");
      return;
    }

    // ---------------------------------------------------------
    // Default safety
    // ---------------------------------------------------------
    default:
      Serial.println("[OBS] ERROR: Unknown state");
      motorStop();
      state = OBS_COMPLETE;
      break;
  }
}
