#include "BlynkCredentials.h"
#include "Kinematrix.h"
#include "index/all.h"

#include "SPI.h"
#include "Wire.h"
#include "Adafruit_GFX.h"
#include "Adafruit_SSD1306.h"

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
#define SCREEN_ADDRESS 0x3C

#define NUMFLAKES 10
#define LOGO_HEIGHT 16
#define LOGO_WIDTH 16

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

#if defined(AC_MODEL_PANASONIC) || defined(AC_MODEL_PANASONIC_RAW)
#include "ir_Panasonic.h"
IRPanasonicAc ac(4);
IRsend acRaw(4);
#endif  // AC_MODEL_PANASONIC

#if defined(AC_MODEL_DAIKIN) || defined(AC_MODEL_DAIKIN_RAW)
#include "ir_Daikin.h"
IRDaikinESP ac(4);
IRsend acRaw(4);
#endif  // AC_MODEL_DAIKIN_RAW

Preferences preferences;
HardSerial usbSerial;
SensorModule sensor;
TimerDuration acOffTimer(5000);
TimerDuration acOffTemperatureTimer(15000);

struct ButtonState {
  int buttonState;
  int buttonPower;
  int buttonPowerOff;
  int buttonPlus;
  int buttonMinus;
};

struct SystemData {
  ButtonState state;
  float sensorTemperature;
  float sensorHumidity;
  int sensorPir;

  float temperature;
  float humidity;

  int debugLevel = 0;
  int repeat = 0;
  int mode = 0;
  int acState = 0;
  int acStateBefore = 0;

  int posX = 0;
  int posY = 0;
  String text = "Test";
};

SystemData remote;