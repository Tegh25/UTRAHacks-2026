/*
  Color Sensor Test Program
  Tests TCS3200/TCS230 color sensor functionality

  This test program:
  - Initializes the color sensor
  - Continuously reads color values
  - Displays RGB pulse periods and detected color
  - Provides diagnostic information for debugging

  Hardware Setup:
  - Connect TCS3200/TCS230 color sensor to Arduino
  - S0 -> Pin 7
  - S1 -> Pin 8
  - S2 -> Pin 9
  - S3 -> Pin 10
  - OUT -> Pin 2
  - VCC -> 5V
  - GND -> GND

  Usage:
  1. Upload to Arduino
  2. Open Serial Monitor (9600 baud)
  3. Place sensor over different colored surfaces
  4. Verify correct color detection in Serial Monitor
*/

#include "color_sensor_func.h"

// Test configuration
#define TEST_INTERVAL 1000    // Milliseconds between readings
#define SHOW_STATISTICS true  // Show count of each color detected

// Statistics counters
unsigned long readingCount = 0;
unsigned long blackCount = 0;
unsigned long redCount = 0;
unsigned long greenCount = 0;
unsigned long blueCount = 0;
unsigned long unknownCount = 0;

void setup() {
  // Initialize serial communication
  Serial.begin(9600);
  delay(500);

  Serial.println("\n========================================");
  Serial.println("   COLOR SENSOR TEST PROGRAM");
  Serial.println("   TCS3200/TCS230 Testing");
  Serial.println("========================================\n");

  // Configure color sensor pins
  pinMode(PIN_S0, OUTPUT);
  pinMode(PIN_S1, OUTPUT);
  pinMode(PIN_S2, OUTPUT);
  pinMode(PIN_S3, OUTPUT);
  pinMode(PIN_OUT, INPUT);

  // Set frequency scaling to 20%
  // S0=HIGH, S1=LOW gives 20% frequency scaling
  digitalWrite(PIN_S0, HIGH);
  digitalWrite(PIN_S1, LOW);

  Serial.println("Pin Configuration:");
  Serial.print("  S0 (Freq Scale) -> Pin ");
  Serial.println(PIN_S0);
  Serial.print("  S1 (Freq Scale) -> Pin ");
  Serial.println(PIN_S1);
  Serial.print("  S2 (Filter Sel) -> Pin ");
  Serial.println(PIN_S2);
  Serial.print("  S3 (Filter Sel) -> Pin ");
  Serial.println(PIN_S3);
  Serial.print("  OUT (Signal)    -> Pin ");
  Serial.println(PIN_OUT);

  Serial.println("\nSensor Configuration:");
  Serial.println("  Frequency Scaling: 20% (S0=HIGH, S1=LOW)");
  Serial.print("  Black Threshold: ");
  Serial.print(BLACK_THRESHOLD);
  Serial.println(" us");
  Serial.print("  Pulse Timeout: ");
  Serial.print(PULSE_TIMEOUT);
  Serial.println(" us");

  Serial.println("\n========================================");
  Serial.println("Sensor initialized successfully!");
  Serial.println("Starting color readings...");
  Serial.println("========================================\n");

  Serial.println("Reading Format:");
  Serial.println("  [#] Periods (us): R=xxx G=xxx B=xxx | Dominant: COLOR");
  Serial.println("  - Smaller period = stronger color detection");
  Serial.println("  - All values > threshold = BLACK\n");

  delay(1000);
}

void loop() {
  // Reading number
  readingCount++;

  // Display reading number
  Serial.print("[");
  Serial.print(readingCount);
  Serial.print("] ");

  // Read color from sensor
  // The readDominantColor() function already prints detailed info
  const char* detectedColor = readDominantColor();

  // Update statistics
  if (strcmp(detectedColor, "BLACK") == 0) {
    blackCount++;
  } else if (strcmp(detectedColor, "RED") == 0) {
    redCount++;
  } else if (strcmp(detectedColor, "GREEN") == 0) {
    greenCount++;
  } else if (strcmp(detectedColor, "BLUE") == 0) {
    blueCount++;
  } else {
    unknownCount++;
  }

  // Show statistics every 10 readings
  if (SHOW_STATISTICS && readingCount % 10 == 0) {
    showStatistics();
  }

  // Wait before next reading
  delay(TEST_INTERVAL);
}

/**
 * Display statistics summary
 */
void showStatistics() {
  Serial.println("\n--- Statistics Summary ---");
  Serial.print("Total Readings: ");
  Serial.println(readingCount);
  Serial.print("  BLACK:   ");
  Serial.print(blackCount);
  Serial.print(" (");
  Serial.print((blackCount * 100) / readingCount);
  Serial.println("%)");
  Serial.print("  RED:     ");
  Serial.print(redCount);
  Serial.print(" (");
  Serial.print((redCount * 100) / readingCount);
  Serial.println("%)");
  Serial.print("  GREEN:   ");
  Serial.print(greenCount);
  Serial.print(" (");
  Serial.print((greenCount * 100) / readingCount);
  Serial.println("%)");
  Serial.print("  BLUE:    ");
  Serial.print(blueCount);
  Serial.print(" (");
  Serial.print((blueCount * 100) / readingCount);
  Serial.println("%)");
  Serial.print("  UNKNOWN: ");
  Serial.print(unknownCount);
  Serial.print(" (");
  Serial.print((unknownCount * 100) / readingCount);
  Serial.println("%)");
  Serial.println("--------------------------\n");
}
