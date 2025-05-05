#define BLYNK_TEMPLATE_ID "TMPL6I0QFC2cF"
#define BLYNK_TEMPLATE_NAME "Skripsi"
#define BLYNK_AUTH_TOKEN "D0VFaAEmbfzMLr9nu_meoA0oWFruUpdW"

void wifiTask() {
  task.setInitCoreID(1);
  task.createTask(10000, [](void* pvParameter) {
    if (!dateTime.begin()) {
      Serial.println("Gagal memulai NTP Client!");
    }
    disableCore1WDT();
    buzzer.toggleInit(100, 2);
    for (;;) {
      loopTask();
    }
  });
}

void blynkTask() {
  static uint32_t dateTimeNTPTimer;
  if (millis() - dateTimeNTPTimer >= 1000 && dateTime.update()) {
    dateTimeNTPTimer = millis();
    // Serial.println(dateTime.getDateTimeString());
  }

  static uint32_t blynkSendTimer;
  if (millis() - blynkSendTimer >= 1000 && enableBlynkSend) {
    blynkSendTimer = millis();
    Blynk.virtualWrite(VIRTUAL_PIN_TEMPERATURE, temperature);
    Blynk.virtualWrite(VIRTUAL_PIN_HUMIDITY, humidity);
    Blynk.virtualWrite(VIRTUAL_PIN_TEMPERATURE_SETPOINT, temperatureSetpoint);
    Blynk.virtualWrite(VIRTUAL_PIN_POWER_STATUS, powerStatus);
  }
}

BLYNK_WRITE(VIRTUAL_PIN_UP_BUTTON) {
  buzzer.onToOffDelay(55);
  upButton = param.asInt();
  if (upButton) temperatureSetpoint += 1;
  preferences.begin("nur", false);
  preferences.putFloat("tempSp", temperatureSetpoint);
  preferences.end();
}

BLYNK_WRITE(VIRTUAL_PIN_DOWN_BUTTON) {
  buzzer.onToOffDelay(55);
  downButton = param.asInt();
  if (downButton) temperatureSetpoint -= 1;
  preferences.begin("nur", false);
  preferences.putFloat("tempSp", temperatureSetpoint);
  preferences.end();
}

BLYNK_WRITE(VIRTUAL_PIN_POWER_BUTTON) {
  buzzer.onToOffDelay(55);
  powerButton = param.asInt();
  if (powerButton) powerStatus = "HIDUP";
  else powerStatus = "MATI";
  preferences.begin("nur", false);
  preferences.putString("pwrStatus", powerStatus);
  preferences.end();
}

BLYNK_WRITE(VIRTUAL_PIN_MODE_BUTTON) {
  buzzer.onToOffDelay(55);
  modeButton = param.asInt();
}