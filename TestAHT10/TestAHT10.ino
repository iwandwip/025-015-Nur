#define ENABLE_SENSOR_MODULE
#define ENABLE_SENSOR_MODULE_UTILITY
#define ENABLE_SENSOR_AHT

#include "Kinematrix.h"

SensorModule sensor;

void setup() {
  Serial.begin(115200);
  sensor.addModule("aht", new AHTSens);
  sensor.init();
}

void loop() {
  sensor.update([]() {
    sensor.debug();
  });
}
