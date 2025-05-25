#define BLYNK_TEMPLATE_ID "TMPL6I0QFC2cF"
#define BLYNK_TEMPLATE_NAME "Skripsi"
#define BLYNK_AUTH_TOKEN "D0VFaAEmbfzMLr9nu_meoA0oWFruUpdW"

void wifiTask() {
  task.setInitCoreID(1);
  if (!dateTime.begin()) Serial.println("NTP Client init failed!");
  else {
    Serial.print("NTP Client init success: ");
    Serial.println(dateTime.getDateTimeString());
  }
  task.createTask(10000, [](void* pvParameter) {
    disableLoopWDT();
    disableCore0WDT();
    disableCore1WDT();
    buzzer.toggleInit(100, 2);
    for (;;) {
      loopTask();
    }
  });
}

void blynkTask() {
  timestamp = dateTime.getDateTimeString();

  static uint32_t blynkSendTimer;
  if (millis() - blynkSendTimer >= 10000 && enableBlynkSend) {
    blynkSendTimer = millis();
    Blynk.virtualWrite(VIRTUAL_PIN_TEMPERATURE, temperature);
    Blynk.virtualWrite(VIRTUAL_PIN_HUMIDITY, humidity);
    Blynk.virtualWrite(VIRTUAL_PIN_POWER_STATUS, powerStatus);
  }
}

void exceedNotification() {
  if (modeButton) acPowerOn();
  // Blynk.logEvent("temperaturewarning", "Suhu Diatas Ambang Batas");
}

void bellowNotification() {
  if (modeButton) acPowerOff();
  // Blynk.logEvent("temperaturewarning", "Suhu Dibawah Ambang Batas");
}

void onTemperatureChange() {
  Blynk.virtualWrite(VIRTUAL_PIN_TEMPERATURE_SETPOINT, temperatureSetpoint);
}

BLYNK_WRITE(VIRTUAL_PIN_UP_BUTTON) {
  if (!modeButton && powerButton) {
    upButton = param.asInt();
    if (upButton) {
      buzzer.onToOffDelay(55);
      temperatureSetpoint += 1;
      acSetTemperature(temperatureSetpoint);
    }
    preferences.begin("nur", false);
    preferences.putFloat("setpoint", temperatureSetpoint);
    preferences.end();
    debug.startPrint(LOG_BLYNK);
    debug.continuePrint("upButton", temperatureSetpoint, LOG_BLYNK);
    debug.endPrint(LOG_BLYNK, true);
  }
}

BLYNK_WRITE(VIRTUAL_PIN_DOWN_BUTTON) {
  if (!modeButton && powerButton) {
    downButton = param.asInt();
    if (downButton) {
      buzzer.onToOffDelay(55);
      temperatureSetpoint -= 1;
      acSetTemperature(temperatureSetpoint);
    }
    preferences.begin("nur", false);
    preferences.putFloat("setpoint", temperatureSetpoint);
    preferences.end();
    debug.startPrint(LOG_BLYNK);
    debug.continuePrint("downButton", temperatureSetpoint, LOG_BLYNK);
    debug.endPrint(LOG_BLYNK, true);
  }
}

BLYNK_WRITE(VIRTUAL_PIN_POWER_BUTTON) {
  if (!modeButton) {
    powerButton = param.asInt();
    if (powerButton) {
      buzzer.toggleInit(100, 3);
      acPowerOn();
      powerStatus = "HIDUP";
    } else {
      buzzer.toggleInit(100, 2);
      acPowerOff();
      powerStatus = "MATI";
    }
    preferences.begin("nur", false);
    preferences.putString("status", powerStatus);
    preferences.end();
    debug.startPrint(LOG_BLYNK);
    debug.continuePrint("powerButton", powerStatus, LOG_BLYNK);
    debug.endPrint(LOG_BLYNK, true);
  }
}

BLYNK_WRITE(VIRTUAL_PIN_MODE_BUTTON) {
  buzzer.onToOffDelay(55);
  modeButton = param.asInt();
  if (modeButton) {
    Blynk.virtualWrite(VIRTUAL_PIN_POWER_BUTTON, 0);
  }
  preferences.begin("nur", false);
  preferences.putInt("mode", modeButton);
  preferences.end();
  debug.startPrint(LOG_BLYNK);
  debug.continuePrint("modeButton", modeButton, LOG_BLYNK);
  debug.continuePrint("modeStatus", modeButton ? "AUTO" : "MANUAL", LOG_BLYNK);
  debug.endPrint(LOG_BLYNK, true);
}