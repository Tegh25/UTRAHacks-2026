#include "motor_func.h"
#include "navigate_target.h"

// ============ MOTOR SETUP ============

/**
 * Initialize motor pins
 * Call this from setup() in main .ino file
 */
void motorSetup() {
  pinMode(MOTOR_L_IN1, OUTPUT);
  pinMode(MOTOR_L_IN2, OUTPUT);
  pinMode(MOTOR_L_PWM, OUTPUT);
  pinMode(MOTOR_R_IN1, OUTPUT);
  pinMode(MOTOR_R_IN2, OUTPUT);
  pinMode(MOTOR_R_PWM, OUTPUT);

  // Start with motors stopped
  motorStop();

  Serial.println("[MOTOR] Motor system initialized");
}

// ============ MOTOR CONTROL FUNCTIONS ============

/**
 * Move robot forward at specified speed
 * Speed: 0-255 PWM value
 */
void motorMoveForward(int speed) {
  // Left motor forward
  digitalWrite(MOTOR_L_IN1, HIGH);
  digitalWrite(MOTOR_L_IN2, LOW);
  analogWrite(MOTOR_L_PWM, speed);

  // Right motor forward
  digitalWrite(MOTOR_R_IN1, HIGH);
  digitalWrite(MOTOR_R_IN2, LOW);
  analogWrite(MOTOR_R_PWM, speed);

  Serial.print("[MOTOR] Forward at speed: ");
  Serial.println(speed);
}

/**
 * Move robot backward at specified speed
 */
void motorMoveBackward(int speed) {
  // Left motor backward
  digitalWrite(MOTOR_L_IN1, LOW);
  digitalWrite(MOTOR_L_IN2, HIGH);
  analogWrite(MOTOR_L_PWM, speed);

  // Right motor backward
  digitalWrite(MOTOR_R_IN1, LOW);
  digitalWrite(MOTOR_R_IN2, HIGH);
  analogWrite(MOTOR_R_PWM, speed);

  Serial.print("[MOTOR] Backward at speed: ");
  Serial.println(speed);
}

/**
 * Turn robot left for specified time
 * Left motor backward, right motor forward
 */
void motorTurnLeft(int speed, unsigned long timeMs) {
  Serial.print("[MOTOR] Turn left at speed: ");
  Serial.print(speed);
  Serial.print(" for ");
  Serial.print(timeMs);
  Serial.println(" ms");

  // Left motor backward
  digitalWrite(MOTOR_L_IN1, LOW);
  digitalWrite(MOTOR_L_IN2, HIGH);
  analogWrite(MOTOR_L_PWM, speed);

  // Right motor forward
  digitalWrite(MOTOR_R_IN1, HIGH);
  digitalWrite(MOTOR_R_IN2, LOW);
  analogWrite(MOTOR_R_PWM, speed);

  delay(timeMs);
  motorStop();
}

/**
 * Turn robot right for specified time
 * Left motor forward, right motor backward
 */
void motorTurnRight(int speed, unsigned long timeMs) {
  Serial.print("[MOTOR] Turn right at speed: ");
  Serial.print(speed);
  Serial.print(" for ");
  Serial.print(timeMs);
  Serial.println(" ms");

  // Left motor forward
  digitalWrite(MOTOR_L_IN1, HIGH);
  digitalWrite(MOTOR_L_IN2, LOW);
  analogWrite(MOTOR_L_PWM, speed);

  // Right motor backward
  digitalWrite(MOTOR_R_IN1, LOW);
  digitalWrite(MOTOR_R_IN2, HIGH);
  analogWrite(MOTOR_R_PWM, speed);

  delay(timeMs);
  motorStop();
}

/**
 * Stop all motors
 */
void motorStop() {
  // Stop left motor
  digitalWrite(MOTOR_L_IN1, LOW);
  digitalWrite(MOTOR_L_IN2, LOW);
  analogWrite(MOTOR_L_PWM, 0);

  // Stop right motor
  digitalWrite(MOTOR_R_IN1, LOW);
  digitalWrite(MOTOR_R_IN2, LOW);
  analogWrite(MOTOR_R_PWM, 0);

  Serial.println("[MOTOR] Stop");
}

// ============ HELPER TURN FUNCTIONS ============

/**
 * Turn around 180 degrees
 */
void turn180() {
  Serial.println("[MOTOR] Executing 180-degree turn");
  motorTurnRight(MOTOR_TURN_SPEED, TURN_180_TIME);
  delay(100);
  motorStop();
}

/**
 * Turn 90 degrees left
 */
void turn90Left() {
  Serial.println("[MOTOR] Executing 90-degree left turn");
  motorTurnLeft(MOTOR_TURN_SPEED, TURN_90_TIME);
  delay(100);
  motorStop();
}

/**
 * Turn 90 degrees right
 */
void turn90Right() {
  Serial.println("[MOTOR] Executing 90-degree right turn");
  motorTurnRight(MOTOR_TURN_SPEED, TURN_90_TIME);
  delay(100);
  motorStop();
}