void menuDisplayCallback() {
  static auto menuMain = menu.createMenu(menu.begin(6), "Temp: ", "Hum : ", "Blynk Enable", "Log Enable", "Delete Log", "Testing Mode");
  menu.formatMenu(menuMain, 0, "Temp : %5.2f", temperature);
  menu.formatMenu(menuMain, 1, "Hum  : %5.2f", humidity);
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
  menu.onSelect(menuMain, "Testing Mode", []() {
    static auto menuTestingEnable = menu.createMenu(menu.begin(5), "Sta : Enable", "Toggle", "Set Temp 35", "Set Temp 15", "Back");
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
    });
    menu.onSelect(menuTestingEnable, "Set Temp 35", []() {
      auto menuSetTemp35 = menu.createMenu(menu.begin(2), "Set Temperature", "To 35");
      menu.showMenu(menuSetTemp35, true);
      menu.freeMenu(menuSetTemp35);
      menu.wait(2000);
      menu.clearMenu(menuMain, menuTestingEnable, menu.end());
      temperature = 35;
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
  menu.showMenu(menuMain);
}