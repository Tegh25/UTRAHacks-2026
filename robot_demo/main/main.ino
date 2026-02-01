/* Main: line follow with IR sensors and color check. */
#include <Arduino.h>
#include "color_sensor_func.h"
#include "line_follow_func.h"

void setup() {
  Serial.begin(9600);
  delay(200);

  Serial.println("\n=== ROBOT MAIN PROGRAM STARTED ===");

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

  // Initialize line follow system (IR sensors + motors)
  lineFollowSetup();

  Serial.println("=== STARTING LINE FOLLOW ===\n");
  delay(500);
}

void loop() {
  // Follow the black line
  lineFollowFSM("BLACK");

  delay(CORRECTION_DELAY);
}
