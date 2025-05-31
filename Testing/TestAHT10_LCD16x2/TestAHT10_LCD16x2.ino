#define ENABLE_MODULE_LCD_MENU

#define ENABLE_SENSOR_MODULE
#define ENABLE_SENSOR_MODULE_UTILITY
#define ENABLE_SENSOR_AHT

#include "Kinematrix.h"

LcdMenu menu(0x27, 16, 2);
SensorModule sensor;

float temperature;
float humidity;

void setup() {
  Serial.begin(115200);
  menu.initialize(true);
  menu.setLen(16, 2);
  sensor.addModule("aht", new AHTSens);
  sensor.init();
}

void loop() {
  sensor.update([]() {
    sensor.debug();
    temperature = sensor["aht"]["temp"];
    humidity = sensor["aht"]["hum"];
  });

  MenuCursor cursor{
    .up = false,
    .down = false,
    .select = false,
    .back = false,
    .show = true
  };
  menu.onListen(&cursor, []() {
    static auto menuMain = menu.createMenu(menu.begin(2), "Temp: ", "Hum : ");
    menu.formatMenu(menuMain, 0, "Temp: %.2f", temperature);
    menu.formatMenu(menuMain, 1, "Hum : %.2f", humidity);
    menu.showMenu(menuMain);
  });
}
