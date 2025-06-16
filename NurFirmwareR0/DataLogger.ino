void initDataLogger() {
  if (!sdCard.begin()) {
    Serial.println("Card Mount Failed");
    return;
  }

  if (!sdCard.exists(DATA_LOGGER_FILE_NAME)) {
    Serial.println("No existing log file. A new one will be created.");
  }
}

void logSensorData() {
  static uint32_t logIntervalTimer;
  if (millis() - logIntervalTimer >= dataLoggerDelay && enableDataLogger) {
    logIntervalTimer = millis();

    String dataString = timestamp + "," + temperature + "," + humidity + "\n";

    if (!sdCard.exists(DATA_LOGGER_FILE_NAME)) {
      String header = "Timestamp,Temperature,Humidity\n";
      if (!sdCard.writeFile(DATA_LOGGER_FILE_NAME, header.c_str())) {
        Serial.println("Error creating log file!");
      }
    }

    if (!sdCard.appendFile(DATA_LOGGER_FILE_NAME, dataString.c_str())) {
      Serial.println("Error appending to log file!");
    }
    sdCard.readFile(DATA_LOGGER_FILE_NAME);
  }
}