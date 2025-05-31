#include "Header.h"

void setup() {
  usbSerial.begin(&Serial, 115200);
  pinMode(LED_BUILTIN, OUTPUT);
  // Blynk.begin(BLYNK_AUTH_TOKEN, "5EE0", "emangboleh");
  Blynk.begin(BLYNK_AUTH_TOKEN, "TIMEOSPACE", "1234Saja");

  sensor.addModule("aht", new AHTSens);
  sensor.addModule("pir", new DigitalSens(19));
  sensor.init();

  ac.begin();
  acRaw.begin();
  preferences.begin("thoriqdeny", false);
  remote.temperature = preferences.getFloat("temperature", 0);
  remote.mode = preferences.getInt("mode", 0);
  preferences.end();

  if (!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println(F("SSD1306 allocation failed"));
    for (;;)
      ;  // Don't proceed, loop forever
  }

  display.clearDisplay();
  display.setTextColor(WHITE);

  display.display();
  acOffTimer.start();
  acOffTemperatureTimer.start();
  delay(2000);
}

void loop() {
  Blynk.run();

  sensor.update([]() {
    if (remote.debugLevel == 1) {
      sensor.debug(50, false);
    } else if (remote.debugLevel == 2) {
      Serial.print("| sT: ");
      Serial.print(remote.sensorTemperature);
      Serial.print("| sH: ");
      Serial.print(remote.sensorHumidity);
      Serial.print("| pir: ");
      Serial.print(remote.sensorPir);
      Serial.print("| T: ");
      Serial.print(remote.temperature);
      Serial.print("| H: ");
      Serial.print(remote.humidity);
      Serial.print("| mode: ");
      Serial.print(remote.mode);
      Serial.print("| off: ");
      Serial.print(acOffTimer.getSeconds());
      Serial.print("| offD: ");
      Serial.print(acOffTemperatureTimer.getSeconds());
      Serial.print("| state: ");
      Serial.print(remote.acState);
      Serial.print("| buttonState: ");
      Serial.print(remote.state.buttonState);
      Serial.println();
    }
    remote.sensorTemperature = sensor["aht"]["temp"];
    remote.sensorHumidity = sensor["aht"]["hum"];
    remote.sensorPir = sensor["pir"]["raw"];

    if (remote.mode) {
      ////////////////////////// AC CONTROL /////////////////////////////////
      if (remote.acState != remote.acStateBefore) {
        remote.acStateBefore = remote.acState;
        if (remote.acState == 1) 
          remote.temperature = 20;
          acOffTimer.reset();
          acOffTimer.start();
          acPowerOn();
        } else if (remote.acState == 2) {
          acOffTemperatureTimer.start();
        } else if (remote.acState == 0) {
        }
      }

      if (remote.acState == 1) {
        remote.state.buttonState = 1;
        acOffTemperatureTimer.reset();
      } else if (remote.acState == 2) {
        if (acOffTemperatureTimer.isExpired()) {
          acOffTemperatureTimer.stop();
          remote.acState = 0;
          acPowerOff();
        } else {
          if (acOffTemperatureTimer.getSeconds() == 1) {
            acSetTemperature(22);
          } else if (acOffTemperatureTimer.getSeconds() == 5) {
            acSetTemperature(24);
          } else if (acOffTemperatureTimer.getSeconds() == 10) {
            acSetTemperature(26);
          }
        }
      } else if (remote.acState == 0) {
        acOffTemperatureTimer.reset();
        remote.state.buttonState = 0;
      }

      if (remote.sensorPir) {
        remote.acState = 1;
        acOffTimer.reset();
        acOffTimer.start();
        acOffTemperatureTimer.reset();
        acOffTemperatureTimer.start();
      } else {
        if (acOffTimer.isExpired()) {
          acOffTimer.stop();
          if (remote.acState != 0) {
            remote.acState = 2;
          }
        }
      }
    } else {
      acOffTimer.reset();
      acOffTimer.start();
      acOffTemperatureTimer.reset();
      acOffTemperatureTimer.start();
    }
    ////////////////////////// AC CONTROL /////////////////////////////////
  });

  showDisplay();
  blynkDataHandler();

  if (remote.state.buttonState) digitalWrite(LED_BUILTIN, HIGH);
  else digitalWrite(LED_BUILTIN, LOW);

  usbSerial.receive(usbCommunicationTask);
}