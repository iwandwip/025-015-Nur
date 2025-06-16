#define ENABLE_MODULE_DIGITAL_INPUT
#define ENABLE_MODULE_DIGITAL_OUTPUT
#define ENABLE_MODULE_TASK_HANDLER
#define ENABLE_MODULE_TIMER_DURATION
#define ENABLE_MODULE_TIMER_TASK
#define ENABLE_MODULE_SERIAL_HARD
#define ENABLE_MODULE_DATETIME_NTP_V2
#define ENABLE_MODULE_LCD_MENU
#define ENABLE_MODULE_SD_CARD_MODULE_ESP32
#define ENABLE_MODULE_SERIAL_DEBUGGER_V2
#define ENABLE_MODULE_LOGIC_CONDITION_MANAGER
#define ENABLE_MODULE_EASY_LOGIC
#define ENABLE_MODULE_GOOGLE_SHEETS

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
#include "IRremoteESP8266.h"
#include "IRsend.h"
#include "ACControl.h"

////////// Utility //////////
const char *ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 7 * 3600;  // Offset for WIB (UTC+7)
const int daylightOffset_sec = 0;

#define DATA_LOGGER_FILE_NAME "/sensor_log.csv"

DateTimeNTPV2 dateTime(ntpServer, gmtOffset_sec, daylightOffset_sec);
SDCardModuleESP32 sdCard(5);
GoogleSheetClient gsheet;
TaskHandle task;
Preferences preferences;
WiFiClientSecure client;
EasyLogic logic;

////////// Sensor //////////
SensorModule sensor;

////////// Communication //////////
CustomLogLevel LOG_INFO;
CustomLogLevel LOG_SENSOR;
CustomLogLevel LOG_COMS;
CustomLogLevel LOG_NOTIF;
CustomLogLevel LOG_LOGGER;
CustomLogLevel LOG_AC;
CustomLogLevel LOG_BLYNK;
SerialDebuggerV2 debug(115200);
HardSerial usbSerial;

////////// Input Module //////////
DigitalIn buttonDown(36);
DigitalIn buttonOk(39);

////////// Output Module //////////
LcdMenu menu(0x27, 16, 2);
DigitalOut buzzer(2);  // LED_BUILTIN
DigitalOut ledRed(4);
DigitalOut ledGreen(16);
DigitalOut ledBlue(17);

#if AC_CONTROL_TYPE == DAIKIN
#include "ir_Daikin.h"
IRDaikinESP ac(33);
#elif AC_CONTROL_TYPE == PANASONIC
#include "ir_Panasonic.h"
IRPanasonicAc ac(33);
#endif

////////// Global Variable //////////
bool enableBlynkSend = false;
bool enableDataLogger = false;
bool enableGoogleSheetsUpdate = false;

bool enableTestingMode = false;

uint32_t blynkDelay = 10000;      // Default 10 seconds
uint32_t dataLoggerDelay = 5000;  // Default 5 seconds  
uint32_t gsheetDelay = 60000;     // Default 60 seconds

float autoTemperatureSetpointUpper = 28.0;
float autoTemperatureSetpointLower = 18.0;
float temperature = 0.0;
float temperatureRef = 0.0;
float humidity = 0.0;
float temperatureSetpoint = 25.0;
int upButton = 0;
int downButton = 0;
int powerButton = 0;
String powerStatus = "HIDUP";
int modeButton = 0;

String timestamp = "";
String temperatureStatus = "Normal";

uint32_t lcdBacklightStartTimer = 0;
bool lcdBacklightState = false;
bool lcdBacklightButtonState = false;