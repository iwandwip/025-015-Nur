#include "Header.h"

void setup() {
  debug.begin();
  debug.useUserDefinedLogLevels();
  LOG_INFO = debug.createLogLevel("LOG_INFO");
  LOG_SENSOR = debug.createLogLevel("LOG_SENSOR");
  LOG_COMS = debug.createLogLevel("LOG_COMS");
  LOG_NOTIF = debug.createLogLevel("LOG_NOTIF");
  LOG_LOGGER = debug.createLogLevel("LOG_LOGGER");
  LOG_AC = debug.createLogLevel("LOG_AC");
  LOG_BLYNK = debug.createLogLevel("LOG_BLYNK");
  debug.enableLogLevel(LOG_COMS);
  debug.enableLogLevel(LOG_NOTIF);
  debug.enableLogLevel(LOG_AC);
  debug.enableLogLevel(LOG_BLYNK);
  usbSerial.begin(&Serial, 115200);

  ac.begin();
  Blynk.begin(BLYNK_AUTH_TOKEN, BLYNK_WIFI_SSID, BLYNK_WIFI_PASS);
  initSpreadSheet();
  initDataLogger();

  preferences.begin("nur", false);
  temperatureSetpoint = preferences.getFloat("setpoint", 25.0);
  powerStatus = preferences.getString("status", "HIDUP");
  modeButton = preferences.getInt("mode", 0);
  enableGoogleSheetsUpdate = preferences.getBool("glogEnable", false);
  blynkDelay = preferences.getUInt("blynkDelay", 10000);
  dataLoggerDelay = preferences.getUInt("logDelay", 5000);
  gsheetDelay = preferences.getUInt("glogDelayMs", 60000);
  preferences.end();

  menu.initialize(true);
  menu.setLen(16, 2);

  sensor.addModule("aht", new AHTSens);
  sensor.init();

  task.initialize(wifiTask);
  buzzer.toggleInit(100, 3);

  // logic.create("exceedCondition").when(&temperature).whenExceeds(autoTemperatureSetpointUpper).then(exceedCondition).repeat(3).every(1000).build();
  // logic.create("bellowCondition").when(&temperature).whenDropsBelow(autoTemperatureSetpointLower).then(bellowCondition).repeat(3).every(1000).build();

  logic.create("exceedNotification")
    .when(&temperature)
    .whenExceeds(autoTemperatureSetpointUpper)
    .then(exceedNotification)
    .build();
  logic.create("bellowNotification")
    .when(&temperature)
    .whenDropsBelow(autoTemperatureSetpointLower)
    .then(bellowNotification)
    .build();

  logic.create("onTemperatureSpChange")
    .when(&temperatureSetpoint)
    .onChange()
    .then(onTemperatureSpChange)
    .build();

  logic.create("backlightOn")
    .when([]() {
      return lcdBacklightButtonState;
    })
    .onRising()
    .then([]() {
      lcdBacklightState = true;
      lcdBacklightStartTimer = millis();
      lcdBacklightButtonState = false;
    })
    .build();

  logic.create("backlightOff")
    .when([]() {
      return lcdBacklightState && (millis() - lcdBacklightStartTimer >= 60000);
    })
    .onRising()
    .then([]() {
      lcdBacklightState = false;
    })
    .build();

  lcdBacklightButtonState = true;
}

void loop() {
  logic.run();
  Blynk.run();
  blynkTask();
  sendToSpreadsheet();
}

void loopTask() {
  if (!enableTestingMode) {
    sensor.update();
    temperature = sensor["aht"]["temp"];
    humidity = sensor["aht"]["hum"];
  }

  // static uint32_t sensorTimer;
  // if (millis() - sensorTimer >= 1000) {
  //   temperature = temperatureRef + (temperatureRef * 0.018 * ((float)random(-100, 100) / 100.0));
  //   sensorTimer = millis();
  // }

  if (lcdBacklightState) {
    menu.backlight();
  } else {
    menu.noBacklight();
  }

  debug.startPrint(LOG_SENSOR);
  debug.continuePrint("temperature", temperature, LOG_SENSOR);
  debug.continuePrint("humidity", humidity, LOG_SENSOR);
  debug.endPrint(LOG_SENSOR, true);
  logSensorData();

  debug.startPrint(LOG_INFO);
  debug.continuePrint("temp", temperature, LOG_INFO);
  debug.continuePrint("hum", humidity, LOG_INFO);
  debug.continuePrint("sp", temperatureSetpoint, LOG_INFO);
  debug.continuePrint("power", powerButton ? "ON" : "OFF", LOG_INFO);
  debug.continuePrint("status", powerStatus, LOG_INFO);
  debug.continuePrint("mode", modeButton ? "AUTO" : "MANUAL", LOG_INFO);
  debug.endPrint(LOG_INFO, true);

  if (buttonDown.isPressed() || buttonOk.isPressed()) {
    if (lcdBacklightState) {
      lcdBacklightStartTimer = millis();
    } else {
      lcdBacklightButtonState = true;
    }
  }

  MenuCursor cursor{
    .up = false,
    .down = buttonDown.isPressed() && lcdBacklightState,
    .select = buttonOk.isPressed() && lcdBacklightState,
    .back = false,
    .show = true
  };
  menu.onListen(&cursor, menuDisplayCallback);
  usbSerial.receive(usbCommunicationTask);

  DigitalIn::updateAll(&buttonDown, &buttonOk, DigitalIn::stop());
  DigitalOut::updateAll(&buzzer, &ledRed, &ledGreen, &ledBlue, DigitalOut::stop());
}