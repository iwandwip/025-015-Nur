#include "Header.h"

void setup() {
  usbSerial.begin(&Serial, 115200);
  Blynk.begin(BLYNK_AUTH_TOKEN, BLYNK_WIFI_SSID, BLYNK_WIFI_PASS);
  preferences.begin("nur", false);
  temperatureSetpoint = preferences.getFloat("tempSp", 25.0);
  powerStatus = preferences.getString("pwtStatus", "HIDUP");
  preferences.end();
  task.initialize(wifiTask);
  menu.initialize(true);
  menu.setLen(16, 2);
  sensor.addModule("aht", new AHTSens);
  sensor.init();
  buzzer.toggleInit(100, 5);
}

void loop() {
  Blynk.run();
  blynkTask();
}

void loopTask() {
  sensor.update([]() {
    // sensor.debug();
    temperature = sensor["aht"]["temp"];
    humidity = sensor["aht"]["hum"];
  });

  MenuCursor cursor{
    .up = false,
    .down = buttonDown.isPressed(),
    .select = buttonOk.isPressed(),
    .back = false,
    .show = true
  };
  menu.onListen(&cursor, menuDisplayCallback);
  usbSerial.receive(usbCommunicationTask);

  DigitalIn::updateAll(&buttonDown, &buttonOk, DigitalIn::stop());
  DigitalOut::updateAll(&buzzer, DigitalOut::stop());
}
