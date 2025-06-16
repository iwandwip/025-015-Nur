# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an ESP32-based temperature control and monitoring system for a calibration laboratory at PT Hervitama Indonesia. The system controls air conditioning units via IR, monitors temperature/humidity, logs data to SD card and Google Sheets, and provides remote monitoring through Blynk IoT platform.

## Build Commands

The project can be built using either Arduino IDE or PlatformIO:

### Arduino IDE
```bash
# Open NurFirmwareR0/NurFirmwareR0.ino in Arduino IDE
# Select Board: ESP32 Dev Module
# Set Upload Speed: 115200
# Install required libraries through Library Manager
# Compile: Ctrl+R (Verify)
# Upload: Ctrl+U
```

### PlatformIO (Recommended)
```bash
# Build the project
pio run

# Upload to ESP32
pio run -t upload

# Monitor serial output (115200 baud)
pio device monitor

# Clean build files
pio run -t clean
```

Note: The main project lacks a platformio.ini file. You may need to create one with:
```ini
[platformio]
src_dir = .

[env:esp32dev]
platform = espressif32
board = esp32dev
framework = arduino
monitor_speed = 115200
lib_deps = 
    IRremoteESP8266
    blynkkk/Blynk
```

## Architecture & Key Components

### Module System
The project uses the Kinematrix library framework with modular architecture controlled by feature flags in `Header.h`:

- **Digital I/O**: Button inputs (pins 36, 39) and LED outputs (pins 2, 4, 16, 17)
- **LCD Menu System**: 16x2 I2C LCD with menu navigation
- **SD Card Logging**: Data logging to CSV files every 5 seconds
- **Google Sheets Integration**: Remote data logging with service account authentication
- **Blynk IoT**: Remote monitoring and control interface
- **IR Control**: Supports Daikin and Panasonic AC units (configurable in ACControl.h)

### Main Files Structure
```
NurFirmwareR0/
├── NurFirmwareR0.ino    # Main entry point, setup() and loop()
├── Header.h             # Central configuration and global variables
├── ACControl.h/ino      # Air conditioning control logic
├── BlynkWiFi.h/ino      # Blynk IoT integration
├── DataLogger.ino       # SD card data logging
├── Menu.ino            # LCD menu interface
├── Spreadsheet.ino     # Google Sheets integration
└── USBComs.ino         # USB serial communication protocol
```

### Communication Protocol
The system uses a custom USB serial protocol with commands:
- `*IDN?` - Device identification
- `SYST:*RST` - System reset
- `CONF:SSID` - Configure WiFi SSID
- `CONF:PASS` - Configure WiFi password
- `CONF:AUTH` - Configure Blynk auth token
- `MEAS:TEMP?` - Read temperature
- `MEAS:HUM?` - Read humidity
- `AC:POWER` - Control AC power
- `AC:TEMP` - Set AC temperature

### Temperature Control Logic
- Automatic control maintains temperature between 18-28°C
- Uses EasyLogic conditions for exceed/below notifications
- Temperature setpoint stored in ESP32 Preferences
- Manual control via LCD menu or Blynk app

### Key Global Variables
- `temperatureSetpoint`: Target temperature (default 25°C)
- `autoTemperatureSetpointUpper/Lower`: Control limits (28°C/18°C)
- `enableBlynkSend`: Toggle Blynk data transmission
- `enableDataLogger`: Toggle SD card logging
- `enableTestingMode`: Testing mode flag

### AC Control Configuration
Edit `ACControl.h` to select AC type:
```cpp
#define AC_CONTROL_TYPE DAIKIN    // or PANASONIC
```