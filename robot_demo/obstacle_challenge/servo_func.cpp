/* Servo: position, center, sweep. Used for gripper. */
#include "servo_func.h"

// Servo object
Servo servo;

// Track current angle
int currentAngle = SERVO_CENTER;

// ============ SETUP ============

/**
 * Initialize the servo motor
 * Attaches to configured pin and moves to center position
 */
void servoSetup() {
  servo.attach(SERVO_PIN);
  servoCenter();
  Serial.println("[SERVO] Servo initialized on pin " + String(SERVO_PIN));
}

// ============ POSITION CONTROL ============

/**
 * Set servo to a specific angle
 * @param angle Target angle in degrees (0-180)
 */
void servoSetAngle(int angle) {
  // Clamp to valid range
  angle = constrain(angle, SERVO_MIN_ANGLE, SERVO_MAX_ANGLE);

  servo.write(angle);
  currentAngle = angle;

  Serial.print("[SERVO] Set angle: ");
  Serial.println(angle);
}

/**
 * Get the current servo angle
 * @return Current angle in degrees
 */
int servoGetAngle() {
  return currentAngle;
}

/**
 * Move servo to center position (90 degrees)
 */
void servoCenter() {
  servoSetAngle(SERVO_CENTER);
}

// ============ SWEEP ============

/**
 * Gradually sweep servo between two angles
 * Blocking function - returns when sweep is complete
 *
 * @param startAngle Starting angle in degrees (0-180)
 * @param endAngle   Ending angle in degrees (0-180)
 * @param stepDelay  Delay in ms between each 1-degree step
 */
void servoSweep(int startAngle, int endAngle, int stepDelay) {
  startAngle = constrain(startAngle, SERVO_MIN_ANGLE, SERVO_MAX_ANGLE);
  endAngle = constrain(endAngle, SERVO_MIN_ANGLE, SERVO_MAX_ANGLE);

  Serial.print("[SERVO] Sweep from ");
  Serial.print(startAngle);
  Serial.print(" to ");
  Serial.println(endAngle);

  if (startAngle < endAngle) {
    for (int angle = startAngle; angle <= endAngle; angle++) {
      servo.write(angle);
      delay(stepDelay);
    }
  } else {
    for (int angle = startAngle; angle >= endAngle; angle--) {
      servo.write(angle);
      delay(stepDelay);
    }
  }

  currentAngle = endAngle;
}
