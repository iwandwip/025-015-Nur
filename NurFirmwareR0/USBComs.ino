void usbCommunicationTask(const String& dataRecv) {
  String dataHeader = usbSerial.getStrData(dataRecv, 0, "#");
  String dataValue = usbSerial.getStrData(dataRecv, 1, "#");
  dataHeader.toUpperCase();

  debug.startPrint(LOG_COMS);
  debug.continuePrint("dataRecv", dataRecv, LOG_COMS);
  debug.endPrint(LOG_COMS, true);

  if (dataHeader == "LOG_INFO") debug.isLogLevelEnabled(LOG_INFO) ? debug.disableLogLevel(LOG_INFO) : debug.enableLogLevel(LOG_INFO);
  if (dataHeader == "LOG_SENSOR") debug.isLogLevelEnabled(LOG_SENSOR) ? debug.disableLogLevel(LOG_SENSOR) : debug.enableLogLevel(LOG_SENSOR);
  if (dataHeader == "LOG_COMS") debug.isLogLevelEnabled(LOG_COMS) ? debug.disableLogLevel(LOG_COMS) : debug.enableLogLevel(LOG_COMS);
  if (dataHeader == "LOG_NOTIF") debug.isLogLevelEnabled(LOG_NOTIF) ? debug.disableLogLevel(LOG_NOTIF) : debug.enableLogLevel(LOG_NOTIF);
  if (dataHeader == "LOG_LOGGER") debug.isLogLevelEnabled(LOG_LOGGER) ? debug.disableLogLevel(LOG_LOGGER) : debug.enableLogLevel(LOG_LOGGER);
  if (dataHeader == "LOG_AC") debug.isLogLevelEnabled(LOG_AC) ? debug.disableLogLevel(LOG_AC) : debug.enableLogLevel(LOG_AC);
  if (dataHeader == "LOG_BLYNK") debug.isLogLevelEnabled(LOG_BLYNK) ? debug.disableLogLevel(LOG_BLYNK) : debug.enableLogLevel(LOG_BLYNK);

  if (dataHeader == "R") ESP.restart();

  if (dataHeader == "TEMP") temperature = dataValue.toFloat();  // TEMP#35, TEMP#15
  if (dataHeader == "ENABLE_BLYNK") {
    enableBlynkSend = !enableBlynkSend;
    Serial.print("| enableBlynkSend: ");
    Serial.print(enableBlynkSend);
    Serial.print("| status: ");
    Serial.print(enableBlynkSend ? "Active" : "Non-Active");
    Serial.println();
  }
  if (dataHeader == "ENABLE_DATA_LOGGER") {
    enableDataLogger = !enableDataLogger;
    Serial.print("| enableDataLogger: ");
    Serial.print(enableDataLogger);
    Serial.print("| status: ");
    Serial.print(enableDataLogger ? "Active" : "Non-Active");
    Serial.println();
  }
  if (dataHeader == "READ_DATA_LOGGER") {
    sdCard.readFile(DATA_LOGGER_FILE_NAME);
  }
  if (dataHeader == "DELETE_DATA_LOGGER") {
    if (sdCard.deleteFile(DATA_LOGGER_FILE_NAME)) {
      Serial.println("Delete Success");
    } else {
      Serial.println("Delete Failed");
    }
  }

  if (dataHeader == "TOGGLE_BACKLIGHT") {
    lcdBacklightState = !lcdBacklightState;
    if (lcdBacklightState) {
      menu.backlight();
    } else {
      menu.noBacklight();
    }
  }

  if (dataHeader == "SHOW_TIMESTAMP") {
    timestamp = dateTime.getDateTimeString();
    Serial.print("| timestamp: ");
    Serial.print(timestamp);
    Serial.println();
  }
}