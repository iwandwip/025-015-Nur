void menuDisplayCallback() {
  static auto menuMain = menu.createMenu(menu.begin(8), "Temp: ", "Hum : ", "AC Control", "Testing Mode", "Blynk Enable", "Log Enable", "GLog Enable", "Delete Log");
  menu.formatMenu(menuMain, 0, "Temp : %5.2f", temperature);
  menu.formatMenu(menuMain, 1, "Hum  : %5.2f", humidity);
  menu.onSelect(menuMain, "AC Control", []() {
    static auto menuACControl = menu.createMenu(menu.begin(3), "Mode: AUTO", "Toggle", "Back");
    menu.formatMenu(menuACControl, 0, "Mode: %s", modeButton ? "AUTO" : "MANUAL");
    menu.onSelect(menuACControl, "Toggle", []() {
      modeButton = !modeButton;
      Blynk.virtualWrite(VIRTUAL_PIN_MODE_BUTTON, modeButton);
      if (modeButton) {
        Blynk.virtualWrite(VIRTUAL_PIN_POWER_BUTTON, 0);
        powerButton = 0;
      }
      preferences.begin("nur", false);
      preferences.putInt("mode", modeButton);
      preferences.end();
      auto menuACStatus = menu.createMenu(menu.begin(2), "AC Control Set To", "AUTO");
      menu.formatMenu(menuACStatus, 1, "%s", modeButton ? "AUTO" : "MANUAL");
      menu.showMenu(menuACStatus, true);
      menu.freeMenu(menuACStatus);
      menu.wait(2000);
      menu.clearMenu(menuMain, menuACControl, menu.end());
    });
    menu.onSelect(menuACControl, "Back", []() {
      menu.clearMenu(menuMain, menuACControl, menu.end());
    });
    menu.showMenu(menuACControl);
  });
  menu.onSelect(menuMain, "Testing Mode", []() {
    static auto menuTestingEnable = menu.createMenu(menu.begin(6), "Sta : Enable", "Toggle", "Set Temp 35", "Set Temp 25", "Set Temp 15", "Back");
    menu.formatMenu(menuTestingEnable, 0, "Sta : %s", enableTestingMode ? "Enable" : "Disable");
    menu.onSelect(menuTestingEnable, "Toggle", []() {
      enableTestingMode = !enableTestingMode;
      auto menuTestingStatus = menu.createMenu(menu.begin(2), "Testing Mode", "Set To Enable");
      menu.formatMenu(menuTestingStatus, 1, "%s", enableTestingMode ? "Enable" : "Disable");
      menu.showMenu(menuTestingStatus, true);
      menu.freeMenu(menuTestingStatus);
      menu.wait(2000);
      menu.clearMenu(menuMain, menuTestingEnable, menu.end());
      if (enableTestingMode) {
        temperature = 0.0;
        humidity = 0.0;
        menu.formatMenu(menuMain, 0, "Temp : %5.2f", temperature);
        menu.formatMenu(menuMain, 1, "Hum  : %5.2f", humidity);
        menu.showMenu(menuMain, true);
      }
      return;
    });
    menu.onSelect(menuTestingEnable, "Set Temp 35", []() {
      auto menuSetTemp35 = menu.createMenu(menu.begin(2), "Set Temperature", "To 35");
      menu.showMenu(menuSetTemp35, true);
      menu.freeMenu(menuSetTemp35);
      menu.wait(2000);
      menu.clearMenu(menuMain, menuTestingEnable, menu.end());
      temperature = 35;
    });
    menu.onSelect(menuTestingEnable, "Set Temp 25", []() {
      auto menuSetTemp25 = menu.createMenu(menu.begin(2), "Set Temperature", "To 25");
      menu.showMenu(menuSetTemp25, true);
      menu.freeMenu(menuSetTemp25);
      menu.wait(2000);
      menu.clearMenu(menuMain, menuTestingEnable, menu.end());
      temperature = 25;
    });
    menu.onSelect(menuTestingEnable, "Set Temp 15", []() {
      auto menuSetTemp15 = menu.createMenu(menu.begin(2), "Set Temperature", "To 15");
      menu.showMenu(menuSetTemp15, true);
      menu.freeMenu(menuSetTemp15);
      menu.wait(2000);
      menu.clearMenu(menuMain, menuTestingEnable, menu.end());
      temperature = 15;
    });
    menu.onSelect(menuTestingEnable, "Back", []() {
      menu.clearMenu(menuMain, menuTestingEnable, menu.end());
    });
    menu.showMenu(menuTestingEnable);
  });
  menu.onSelect(menuMain, "Blynk Enable", []() {
    static auto menuBlynkEnable = menu.createMenu(menu.begin(3), "Sta : Enable", "Toggle", "Back");
    menu.formatMenu(menuBlynkEnable, 0, "Sta : %s", enableBlynkSend ? "Enable" : "Disable");
    menu.onSelect(menuBlynkEnable, "Toggle", []() {
      enableBlynkSend = !enableBlynkSend;
      auto menuBlynkStatus = menu.createMenu(menu.begin(2), "Blynk Set To", "Enable");
      menu.formatMenu(menuBlynkStatus, 1, "%s", enableBlynkSend ? "Enable" : "Disable");
      menu.showMenu(menuBlynkStatus, true);
      menu.freeMenu(menuBlynkStatus);
      menu.wait(2000);
      menu.clearMenu(menuMain, menuBlynkEnable, menu.end());
    });
    menu.onSelect(menuBlynkEnable, "Back", []() {
      menu.clearMenu(menuMain, menuBlynkEnable, menu.end());
    });
    menu.showMenu(menuBlynkEnable);
  });
  menu.onSelect(menuMain, "Log Enable", []() {
    static auto menuLoggerEnable = menu.createMenu(menu.begin(3), "Sta : Enable", "Toggle", "Back");
    menu.formatMenu(menuLoggerEnable, 0, "Sta : %s", enableDataLogger ? "Enable" : "Disable");
    menu.onSelect(menuLoggerEnable, "Toggle", []() {
      enableDataLogger = !enableDataLogger;
      auto menuLoggerStatus = menu.createMenu(menu.begin(2), "Logger Set To", "Enable");
      menu.formatMenu(menuLoggerStatus, 1, "%s", enableDataLogger ? "Enable" : "Disable");
      menu.showMenu(menuLoggerStatus, true);
      menu.freeMenu(menuLoggerStatus);
      menu.wait(2000);
      menu.clearMenu(menuMain, menuLoggerEnable, menu.end());
    });
    menu.onSelect(menuLoggerEnable, "Back", []() {
      menu.clearMenu(menuMain, menuLoggerEnable, menu.end());
    });
    menu.showMenu(menuLoggerEnable);
  });
  menu.onSelect(menuMain, "GLog Enable", []() {
    static auto menuGLogEnable = menu.createMenu(menu.begin(3), "Sta : Enable", "Toggle", "Back");
    menu.formatMenu(menuGLogEnable, 0, "Sta : %s", enableGoogleSheetsUpdate ? "Enable" : "Disable");
    menu.onSelect(menuGLogEnable, "Toggle", []() {
      enableGoogleSheetsUpdate = !enableGoogleSheetsUpdate;
      preferences.begin("nur", false);
      preferences.putBool("glogEnable", enableGoogleSheetsUpdate);
      preferences.end();
      auto menuGLogStatus = menu.createMenu(menu.begin(2), "GLog Set To", "Enable");
      menu.formatMenu(menuGLogStatus, 1, "%s", enableGoogleSheetsUpdate ? "Enable" : "Disable");
      menu.showMenu(menuGLogStatus, true);
      menu.freeMenu(menuGLogStatus);
      menu.wait(2000);
      menu.clearMenu(menuMain, menuGLogEnable, menu.end());
    });
    menu.onSelect(menuGLogEnable, "Back", []() {
      menu.clearMenu(menuMain, menuGLogEnable, menu.end());
    });
    menu.showMenu(menuGLogEnable);
  });
  menu.onSelect(menuMain, "Delete Log", []() {
    if (sdCard.deleteFile(DATA_LOGGER_FILE_NAME)) {
      Serial.println("Delete Success");
    } else {
      Serial.println("Delete Failed");
    }
    auto menuLoggerDelete = menu.createMenu(menu.begin(2), "Logger Delete", "Success");
    menu.showMenu(menuLoggerDelete, true);
    menu.freeMenu(menuLoggerDelete);
    menu.wait(2000);
    menu.clearMenu(menuMain, menuLoggerDelete, menu.end());
  });
  menu.showMenu(menuMain);
}