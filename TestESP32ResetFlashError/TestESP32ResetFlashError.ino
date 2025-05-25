void setup() {
  Serial.begin(115200);
}

void loop() {
  if (Serial.available()) {
    String input = Serial.readStringUntil('\n');
    input.trim();
    if (input == "r" || input == "R") {
      ESP.restart();
    }
  }

  delay(10);
}