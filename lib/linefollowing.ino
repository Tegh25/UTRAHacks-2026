#define LS 10      // Left sensor
#define RS 11      // Right sensor

#define LM1 5       // left motor
#define LM2 4
#define RM1 3       // right motor
#define RM2 2

void setup() {
  Serial.begin(9600);
  pinMode(LS, INPUT);
  pinMode(RS, INPUT);
  pinMode(LM1, OUTPUT);
  pinMode(LM2, OUTPUT);
  pinMode(RM1, OUTPUT);
  pinMode(RM2, OUTPUT);
}

void loop() {
  if(digitalRead(LS) && digitalRead(RS)) { //LS and RS not on line
    // move forward
    digitalWrite(LM1, LOW);
    digitalWrite(LM2, HIGH);
    digitalWrite(RM1, LOW);
    digitalWrite(RM2, HIGH);
  }
  else if(digitalRead(LS) && !digitalRead(RS)) { //Sharp right
    // sharp right
    digitalWrite(LM1, LOW);
    digitalWrite(LM2, HIGH);
    digitalWrite(RM1, HIGH); 
    digitalWrite(RM2, LOW);
  }
  else if(!digitalRead(LS) && digitalRead(RS)) { //Sharp left
    // sharp left
    digitalWrite(LM1, HIGH);
    digitalWrite(LM2, LOW);
    digitalWrite(RM1, LOW);
    digitalWrite(RM2, HIGH);
  }


  // if(digitalRead(LS) && !digitalRead(RS)) {// Turn left
  //   digitalWrite(LM1, LOW);
  //   digitalWrite(LM2, HIGH);
  //   digitalWrite(RM1, LOW); 
  //   digitalWrite(RM2, LOW);
  // }
  // else if(!digitalRead(LS) && digitalRead(RS)) {     // turn right
  //   digitalWrite(LM1, LOW); 
  //   digitalWrite(LM2, LOW);
  //   digitalWrite(RM1, LOW);
  //   digitalWrite(RM2, HIGH);
  // } 
  // else if(!digitalRead(LS) && !digitalRead(RS)) {     // turn right
  //   digitalWrite(LM1, LOW);
  //   digitalWrite(LM2, LOW);
  //   digitalWrite(RM1, LOW);
  //   digitalWrite(RM2, LOW);
  // }

  delay(5);
}