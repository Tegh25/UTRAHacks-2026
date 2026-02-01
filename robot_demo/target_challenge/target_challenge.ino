/*
  Main program for target challenge
*/

#include <Arduino.h>
#include "color_sensor_func.h"
#include "navigate_target.h"
#include "motor_func.h"

void setup() {
  Serial.begin(9600);
  delay(200);

  Serial.println("\n=== NAVIGATION TARGET CHALLENGE STARTED ===");

  // Initialize color sensor
  pinMode(PIN_S0, OUTPUT);
  pinMode(PIN_S1, OUTPUT);
  pinMode(PIN_S2, OUTPUT);
  pinMode(PIN_S3, OUTPUT);
  pinMode(PIN_OUT, INPUT);

  // Set frequency scaling to 20% (S0=HIGH, S1=LOW)
  digitalWrite(PIN_S0, HIGH);
  digitalWrite(PIN_S1, LOW);

  Serial.print("Color sensor initialized. Black threshold: ");
  Serial.println(BLACK_THRESHOLD);

  // Initialize motor system
  motorSetup();

  Serial.println("=== STARTING NAVIGATION ===\n");
  delay(500);
}

void loop() {
  // Call navigation state machine every cycle
  navigateTargetFSM();

  // Small delay to prevent sensor overload
  delay(50);
}
