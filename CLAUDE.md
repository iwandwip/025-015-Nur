# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a hybrid project containing both a Next.js web application and ESP32-based firmware for a laboratory temperature control system at PT Hervitama Indonesia. The system monitors and controls air conditioning units via IR to maintain precise temperature conditions.

## Build Commands

### Next.js Web Application

```bash
# Install dependencies
npm install

# Run development server (with Turbopack)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

### ESP32 Firmware

The main firmware is located in `/firmware/NurFirmwareR0/`. Build using either:

**Arduino IDE:**
- Open `NurFirmwareR0.ino` in Arduino IDE
- Select Board: ESP32 Dev Module
- Upload Speed: 115200
- Compile: Ctrl+R
- Upload: Ctrl+U

**PlatformIO (if platformio.ini is created):**
```bash
# Build
pio run

# Upload to ESP32
pio run -t upload

# Monitor serial output
pio device monitor

# Clean build
pio run -t clean
```

## Architecture

### Web Application Structure
- `/app/` - Next.js App Router pages
- `/components/` - React components including shadcn/ui components
- `/lib/` - Utility functions
- Uses Tailwind CSS v4 with PostCSS

### Firmware Architecture
The firmware uses a modular architecture with feature flags in `Header.h`:

**Core Modules:**
- `ACControl.h/ino` - IR control for Daikin/Panasonic AC units
- `BlynkWiFi.h/ino` - IoT platform integration
- `DataLogger.ino` - SD card CSV logging (5-second intervals)
- `Menu.ino` - LCD 16x2 menu interface
- `Spreadsheet.ino` - Google Sheets integration
- `USBComs.ino` - Serial command protocol

**Key Features:**
- Temperature/humidity monitoring (AHT10 sensor)
- Automatic temperature control (18-28°C range)
- Remote monitoring via Blynk
- Data logging to SD card and Google Sheets
- USB serial protocol for computer control

**Communication Protocol:**
- `*IDN?` - Device identification
- `MEAS:TEMP?` - Read temperature
- `MEAS:HUM?` - Read humidity
- `AC:POWER ON/OFF` - Control AC power
- `AC:TEMP <value>` - Set AC temperature
- `CONF:SSID <value>` - Configure WiFi SSID
- `CONF:PASS <value>` - Configure WiFi password

## Important Configuration

### AC Type Selection
Edit `/firmware/NurFirmwareR0/ACControl.h`:
```cpp
#define AC_CONTROL_TYPE DAIKIN    // or PANASONIC
```

### Key Global Variables (in Header.h)
- `temperatureSetpoint` - Target temperature (default 25°C)
- `autoTemperatureSetpointUpper/Lower` - Control limits
- `enableBlynkSend` - Toggle Blynk transmission
- `enableDataLogger` - Toggle SD logging