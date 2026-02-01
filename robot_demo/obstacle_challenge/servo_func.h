/* Servo pin and angle config. */
#ifndef SERVO_FUNC_H
#define SERVO_FUNC_H

#include "Arduino.h"
#include <Servo.h>

// ============ SERVO CONFIGURATION ============
#define SERVO_PIN 18        // PWM pin connected to servo signal
#define SERVO_MIN_ANGLE 0   // Minimum servo angle (degrees)
#define SERVO_MAX_ANGLE 180 // Maximum servo angle (degrees)
#define SERVO_CENTER 90     // Center position (degrees)
#define SERVO_SWEEP_DELAY 15 // Default delay between sweep steps (ms)

// ============ FUNCTION PROTOTYPES ============

// Setup
void servoSetup();

// Position control
void servoSetAngle(int angle);
int  servoGetAngle();
void servoCenter();

// Sweep (blocking - moves gradually between two angles)
void servoSweep(int startAngle, int endAngle, int stepDelay = SERVO_SWEEP_DELAY);

#endif  // SERVO_FUNC_H
