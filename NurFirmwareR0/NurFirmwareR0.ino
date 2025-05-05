#include "Header.h"

void setup() {
  usbSerial.begin(&Serial, 115200);

  Blynk.begin(BLYNK_AUTH_TOKEN, BLYNK_WIFI_SSID, BLYNK_WIFI_PASS);

  // if (!sd.begin(5)) {
  //   Serial.println("Card Mount Failed");
  //   return;
  // }

  // Serial.println("Card mounted successfully");
  // Serial.print("Card Type: ");
  // Serial.println(sd.cardTypeString());
  // Serial.print("Card Size: ");
  // Serial.print(sd.cardSize() / (1024 * 1024));
  // Serial.println(" MB");

  preferences.begin("nur", false);
  temperatureSetpoint = preferences.getFloat("tempSp", 25.0);
  powerStatus = preferences.getString("pwrStatus", "HIDUP");
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
