# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a hybrid IoT project combining a React web application frontend with ESP32/ESP8266 firmware for laboratory temperature control and data logging. The project is titled "Pengaturan Suhu Laboratorium Kalibrasi Dengan Sistem Perekaman Data Pada Pt Hervitama Indonesia" (Laboratory Temperature Control with Data Recording System at PT Hervitama Indonesia).

## Architecture

### Frontend (Web Application)
- **Framework**: React + TypeScript + Vite
- **UI Library**: Shadcn/ui components with Radix UI primitives
- **Styling**: TailwindCSS v4 with utility classes
- **Build Tool**: Vite with ESLint for code quality
- **Location**: Root directory (`/src`, `/components`, etc.)

### Firmware (Embedded Systems)
- **Platform**: ESP32/ESP8266 microcontrollers using Arduino framework
- **Build System**: PlatformIO with multiple project configurations
- **Main Firmware**: `firmware/NurFirmwareR0/` - Core temperature control system
- **Test Projects**: `firmware/IRRemoteTest/` and `firmware/Testing/` - IR remote and sensor testing
- **Key Features**:
  - Temperature/humidity monitoring (AHT sensor)
  - AC control via IR (Daikin/Panasonic support)
  - Data logging to SD card and Google Sheets
  - Blynk IoT integration
  - LCD menu interface with button controls

### Key Dependencies
- **Firmware**: Kinematrix framework (custom embedded library), IRremoteESP8266, Blynk, WiFi libraries
- **Frontend**: React 19, Lucide icons, class-variance-authority for component variants

## Common Development Commands

### Frontend Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Preview production build
npm run preview
```

### Firmware Development
```bash
# Build firmware (from any platformio.ini directory)
pio run

# Build for specific board
pio run -e esp32dev      # ESP32
pio run -e nodemcuv2     # ESP8266

# Upload to device
pio run -t upload
pio run -e esp32dev -t upload

# Monitor serial output
pio device monitor

# Build with specific locale (for IR projects)
pio run -e en-AU         # English (Australian)
pio run -e de-DE         # German (other locales: en-US, fr-FR, es-ES, pt-BR, ru-RU, zh-CN, it-IT, sv-SE)
```

## Project Structure

### Main Firmware Components (`firmware/NurFirmwareR0/`)
- `NurFirmwareR0.ino` - Main program with setup/loop and task coordination
- `Header.h` - Global includes, pin definitions, and variable declarations
- `ACControl.h/.ino` - Air conditioning control logic
- `BlynkWiFi.h/.ino` - IoT connectivity and remote monitoring
- `DataLogger.ino` - SD card data logging functionality
- `Spreadsheet.ino` - Google Sheets integration
- `Service.ino` - Core system services and sensor management
- `Menu.ino` - LCD interface and user interaction
- `USBComs.ino` - Serial communication protocols

### Test and Development Projects
- `firmware/IRRemoteTest/` - IR remote control testing for different AC brands
- `firmware/Testing/` - Hardware component testing (sensors, LCD, SD card)

### Hardware Configuration
- **Main Board**: ESP32 development board
- **Sensors**: AHT10 temperature/humidity sensor
- **Display**: 16x2 LCD with I2C interface (address 0x27)
- **Controls**: Two buttons (GPIO 36, 39) for menu navigation
- **Outputs**: RGB LED indicators (GPIO 4, 16, 17), buzzer (GPIO 14)
- **IR Transmitter**: GPIO 33 for AC control
- **Storage**: SD card module (CS on GPIO 5)

## Development Notes

### PlatformIO Configuration
- All firmware projects use shared library directories (`lib_extra_dirs = ../../`)
- Deep dependency resolution enabled (`lib_ldf_mode = deep+`)
- Standard monitor speed: 115200 baud
- Framework: Arduino with ESP32/ESP8266 platform support

### Firmware Architecture Patterns
- Uses EasyLogic system for condition-based automation
- Modular sensor management with SensorModule framework
- Task-based architecture with WiFi and background processing
- Preference storage for persistent configuration
- Custom debug logging with multiple log levels (SENSOR, COMS, NOTIF, LOGGER, AC, BLYNK)

### AC Control System
- Supports both Daikin and Panasonic AC units via IR
- Conditional compilation based on `AC_CONTROL_TYPE` definition
- Temperature setpoint management with automatic control logic
- Manual and automatic operation modes

### Data Integration
- Real-time data logging to SD card in CSV format
- Google Sheets integration for cloud data storage
- Blynk platform integration for remote monitoring
- Configurable delays for different data transmission methods