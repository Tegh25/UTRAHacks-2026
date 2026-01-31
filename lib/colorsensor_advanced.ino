/*
  UNO R4 Minima + TCS3200/TCS230 Color Sensor quick test

  What you should see:
  - Serial output with pulse periods (us) and frequencies (Hz) for CLEAR, RED, GREEN, BLUE
  - A "dominant color" guess that changes when you move the sensor over colored paper
  - If you always see "NO PULSE", your OUT/OE/VCC/GND wiring is wrong.

  Wiring (recommended):
    TCS VCC  -> UNO 5V
    TCS GND  -> UNO GND
    TCS OE   -> UNO GND (always enable output)
    TCS OUT  -> UNO D2
    TCS S0   -> UNO D7
    TCS S1   -> UNO D8
    TCS S2   -> UNO D9
    TCS S3   -> UNO D10
*/

const int PIN_S0  = 7;
const int PIN_S1  = 8;
const int PIN_S2  = 9;
const int PIN_S3  = 10;
const int PIN_OUT = 2;   // sensor OUT

// Filter select (common TCS3200 mapping):
// S2 S3 = 00 RED, 01 BLUE, 10 CLEAR, 11 GREEN
void setFilterRed()   { digitalWrite(PIN_S2, LOW);  digitalWrite(PIN_S3, LOW);  }
void setFilterBlue()  { digitalWrite(PIN_S2, LOW);  digitalWrite(PIN_S3, HIGH); }
void setFilterClear() { digitalWrite(PIN_S2, HIGH); digitalWrite(PIN_S3, LOW);  }
void setFilterGreen() { digitalWrite(PIN_S2, HIGH); digitalWrite(PIN_S3, HIGH); }

// Read one pulse period in microseconds.
// Smaller period => higher frequency => "more" of that color.
// timeoutUs prevents hanging if sensor OUT isn't toggling.
unsigned long readPeriodUs(unsigned long timeoutUs = 25000UL) {
  // pulseIn returns the duration of a pulse (HIGH or LOW). We'll use LOW like most examples.
  // If you get zeros but sensor is wired, try pulseIn(PIN_OUT, HIGH, timeoutUs).
  return pulseIn(PIN_OUT, LOW, timeoutUs);
}

// Convert period (us) to frequency (Hz)
float periodToHz(unsigned long periodUs) {
  if (periodUs == 0) return 0.0f;
  return 1000000.0f / (float)periodUs;
}

// Take a stable reading for one filter by averaging a few samples
unsigned long readPeriodUsAvg(void (*setFilterFn)(), int samples = 5) {
  setFilterFn();
  delay(5); // let filter settle

  unsigned long sum = 0;
  int good = 0;

  for (int i = 0; i < samples; i++) {
    unsigned long p = readPeriodUs();
    if (p > 0) { sum += p; good++; }
    delay(3);
  }

  if (good == 0) return 0;
  return sum / (unsigned long)good;
}

void setup() {
  Serial.begin(115200);
  delay(200);

  pinMode(PIN_S0, OUTPUT);
  pinMode(PIN_S1, OUTPUT);
  pinMode(PIN_S2, OUTPUT);
  pinMode(PIN_S3, OUTPUT);
  pinMode(PIN_OUT, INPUT);

  // Set frequency scaling to 20%:
  // S0=HIGH, S1=LOW (common and recommended for stability)
  digitalWrite(PIN_S0, HIGH);
  digitalWrite(PIN_S1, LOW);

  Serial.println("\nTCS3200/TCS230 Color Sensor Test (UNO R4 Minima)");
  Serial.println("Move the sensor over RED / GREEN / BLUE paper and watch values change.");
  Serial.println("If you see NO PULSE, check: VCC=5V, GND, OE->GND, OUT->D2.\n");
}

void loop() {
  // Read averaged periods for stability
  unsigned long pC = readPeriodUsAvg(setFilterClear);
  unsigned long pR = readPeriodUsAvg(setFilterRed);
  unsigned long pG = readPeriodUsAvg(setFilterGreen);
  unsigned long pB = readPeriodUsAvg(setFilterBlue);

  // If OUT is not producing pulses, pC/pR/pG/pB will be 0
  if (pC == 0 && pR == 0 && pG == 0 && pB == 0) {
    Serial.println("NO PULSE detected on OUT. Check wiring: OUT pin, OE->GND, VCC=5V, GND.");
    delay(500);
    return;
  }

  // Convert to Hz for easier interpretation (higher Hz = stronger intensity)
  float fC = periodToHz(pC);
  float fR = periodToHz(pR);
  float fG = periodToHz(pG);
  float fB = periodToHz(pB);

  // Rough dominant color guess:
  // Since period smaller => stronger, we pick the smallest period among R/G/B
  const char* dom = "UNKNOWN";
  if (pR > 0 && pG > 0 && pB > 0) {
    unsigned long minP = min(pR, min(pG, pB));
    if (minP == pR) dom = "RED";
    else if (minP == pG) dom = "GREEN";
    else dom = "BLUE";
  }

  Serial.print("PERIOD(us): C=");
  Serial.print(pC);
  Serial.print(" R=");
  Serial.print(pR);
  Serial.print(" G=");
  Serial.print(pG);
  Serial.print(" B=");
  Serial.print(pB);

  Serial.print(" | HZ: C=");
  Serial.print(fC, 1);
  Serial.print(" R=");
  Serial.print(fR, 1);
  Serial.print(" G=");
  Serial.print(fG, 1);
  Serial.print(" B=");
  Serial.print(fB, 1);

  Serial.print(" | Dominant=");
  Serial.println(dom);

  delay(200);
}