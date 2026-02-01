/*
  Obstacle Challenge - Main Program
  Follows red line, dodges obstacles, picks up/drops off box at blue zones,
  stops when black is detected.
*/

#include <Arduino.h>
#include "color_sensor_func.h"
#include "motor_func.h"
#include "ultrasonic_sensor_func.h"
#include "line_follow_func.h"
#include "navigate_obstacle.h"

void setup() {
  Serial.begin(9600);
  delay(200);

  Serial.println("\n=== OBSTACLE CHALLENGE STARTED ===");

  // Initialize color sensor
  pinMode(PIN_S0, OUTPUT);
  pinMode(PIN_S1, OUTPUT);
  pinMode(PIN_S2, OUTPUT);
  pinMode(PIN_S3, OUTPUT);
  pinMode(PIN_OUT, INPUT);
  digitalWrite(PIN_S0, HIGH);
  digitalWrite(PIN_S1, LOW);

  Serial.print("Color sensor initialized. Black threshold: ");
  Serial.println(BLACK_THRESHOLD);

  // Initialize motors
  motorSetup();

  // Initialize ultrasonic sensor
  ultrasonicSetup();

  // Initialize IR sensors for line following
  pinMode(IR_LEFT_PIN, INPUT);
  pinMode(IR_RIGHT_PIN, INPUT);
  Serial.println("IR sensors initialized");

  // Initialize obstacle course FSM
  obstacleSetup();

  Serial.println("=== STARTING OBSTACLE COURSE ===\n");
  delay(500);
}

void loop() {
  navigateObstacleFSM();
}
