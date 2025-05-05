#define ENABLE_MODULE_DIGITAL_INPUT
#define ENABLE_MODULE_DIGITAL_OUTPUT
#define ENABLE_MODULE_TASK_HANDLER
#define ENABLE_MODULE_TIMER_DURATION
#define ENABLE_MODULE_TIMER_TASK
#define ENABLE_MODULE_SERIAL_HARD
#define ENABLE_MODULE_DATETIME_NTP_V2
#define ENABLE_MODULE_LCD_MENU
#define ENABLE_MODULE_SD_CARD_MODULE_ESP32

#define ENABLE_SENSOR_MODULE
#define ENABLE_SENSOR_MODULE_UTILITY
#define ENABLE_SENSOR_ANALOG
#define ENABLE_SENSOR_AHT

#include "Kinematrix.h"
#include "Preferences.h"
#include "WiFi.h"
#include "WiFiClientSecure.h"
#include "BlynkWiFi.h"
#include "BlynkSimpleEsp32.h"

////////// Utility //////////
const char *ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 7 * 3600;  // Offset for WIB (UTC+7)
const int daylightOffset_sec = 0;

DateTimeNTPV2 dateTime(ntpServer, gmtOffset_sec, daylightOffset_sec);
TaskHandle task;
Preferences preferences;
WiFiClientSecure client;
SDCardModuleESP32 sd;

////////// Sensor //////////
SensorModule sensor;

////////// Communication //////////
HardSerial usbSerial;

////////// Input Module //////////
DigitalIn buttonDown(-1);
DigitalIn buttonOk(-1);

////////// Output Module //////////
LcdMenu menu(0x27, 16, 2);
DigitalOut buzzer(LED_BUILTIN);

////////// Global Variable //////////
bool enableBlynkSend = true;

float temperature = 0.0;
float humidity = 0.0;
float temperatureSetpoint = 25.0;
int upButton = 0;
int downButton = 0;
int powerButton = 0;
String powerStatus = "HIDUP";
int modeButton = 0;