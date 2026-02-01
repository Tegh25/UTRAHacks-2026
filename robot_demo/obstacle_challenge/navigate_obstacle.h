#ifndef NAVIGATE_OBSTACLE_H
#define NAVIGATE_OBSTACLE_H

#include <Arduino.h>

// ============ OBSTACLE COURSE CONFIGURATION ============

// Speeds
#define OBS_FOLLOW_SPEED   150  // Speed while following line
#define OBS_TURN_SPEED     120  // Speed for 90-degree turns
#define OBS_DODGE_SPEED    140  // Speed while dodging around obstacle
#define OBS_SEARCH_SPEED   100  // Speed while searching for red line

// Turn timing (calibrate to your robot)
#define OBS_TURN_90_TIME   500  // ms for a 90-degree turn

// Obstacle detection
#define OBS_DETECT_CM      15.0  // Distance threshold to trigger dodge (cm)

// Dodge geometry (obstacle is ~9cm x 9cm, add margin)
#define DODGE_SIDE_TIME    400   // ms to drive past obstacle width
#define DODGE_LENGTH_TIME  600   // ms to drive past obstacle length

// Sensor timing
#define OBS_SENSOR_DELAY   30    // ms between sensor checks in follow state

// ============ FSM STATES ============
enum ObstacleState {
  OBS_FOLLOW_RED,          // Following red line, checking for obstacles/blue/black
  OBS_PICKUP_BOX,          // Blue detected (1st time) - pickup scaffolding
  OBS_DROPOFF_BOX,         // Blue detected (2nd time) - dropoff scaffolding
  OBS_DODGE_TURN_RIGHT,    // Turn right 90° away from obstacle
  OBS_DODGE_PASS_SIDE,     // Drive forward to clear obstacle width
  OBS_DODGE_TURN_FORWARD,  // Turn left 90° to face parallel to line
  OBS_DODGE_PASS_LENGTH,   // Drive forward to clear obstacle length
  OBS_DODGE_TURN_TO_LINE,  // Turn left 90° to face toward line
  OBS_DODGE_FIND_RED,      // Drive forward until red line found
  OBS_DODGE_ALIGN,         // Turn right 90° to realign with line direction
  OBS_COMPLETE             // Black detected - course finished
};

// ============ FUNCTION PROTOTYPES ============

// Call once in setup() before entering the obstacle course
void obstacleSetup();

// Call repeatedly in loop() to run the FSM
void navigateObstacleFSM();

// Color helpers
bool obsIsRed();
bool obsIsBlue();
bool obsIsBlack();

#endif  // NAVIGATE_OBSTACLE_H
