/* HC-SR04: distance in cm. Trigger/echo timing. */
#include "ultrasonic_sensor_func.h"

// ============ SETUP ============

/**
 * Initialize ultrasonic sensor pins
 */
void ultrasonicSetup() {
  pinMode(US_TRIGGER_PIN, OUTPUT);
  pinMode(US_ECHO_PIN, INPUT);
  digitalWrite(US_TRIGGER_PIN, LOW);

  Serial.println("[US] Ultrasonic sensor initialized");
  Serial.print("[US] Trigger pin: A0, Echo pin: A1");
  Serial.print(" | Range: ");
  Serial.print(US_MIN_RANGE, 1);
  Serial.print("-");
  Serial.print(US_MAX_RANGE, 1);
  Serial.println(" cm");
}

// ============ DISTANCE MEASUREMENT ============

/**
 * Measure distance from HC-SR04 sensor
 * Sends a 10us trigger pulse and measures echo return time
 *
 * @return Distance in centimeters, or 0.0 if measurement failed
 */
float ultrasonicGetDistance() {
  // Send 10 microsecond pulse to trigger
  digitalWrite(US_TRIGGER_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(US_TRIGGER_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(US_TRIGGER_PIN, LOW);

  // Measure echo pulse duration
  long duration = pulseIn(US_ECHO_PIN, HIGH, US_TIMEOUT);

  // Convert to distance in cm
  // Sound travels at ~343 m/s -> 29.1 us per cm
  // Divide by 2 because signal travels to object and back
  float distanceCm = (duration / 2.0) / 29.1;

  return distanceCm;
}

/**
 * Check if a distance measurement is within valid sensor range
 *
 * @param distanceCm Distance value to check
 * @return true if measurement is valid (within min/max range)
 */
bool ultrasonicIsValid(float distanceCm) {
  return (distanceCm >= US_MIN_RANGE && distanceCm <= US_MAX_RANGE);
}

/**
 * Check if an object is detected within a given threshold distance
 *
 * @param thresholdCm Distance threshold in centimeters
 * @return true if a valid object is detected closer than threshold
 */
bool ultrasonicObjectWithin(float thresholdCm) {
  float distance = ultrasonicGetDistance();
  return (ultrasonicIsValid(distance) && distance <= thresholdCm);
}
