// Simple servo test (1–2 ms PWM @ 50 Hz)
#include <Servo.h>

const int SERVO_PIN = 13;  // PWM pin connected to servo signal

Servo servo1;

void setup() {
  Serial.begin(9600);
  servo1.attach(SERVO_PIN);
}

void loop() {
  servo1.write(0);
  delay(1000);
  servo1.write(90);
  delay(1000);
  servo1.write(180);
  delay(1000);
}