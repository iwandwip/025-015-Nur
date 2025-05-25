void menuDisplayCallback() {
  static auto menuMain = menu.createMenu(menu.begin(5), "Temp: ", "Hum : ", "Blynk Enable", "Log Enable", "Delete Log");
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
  menu.showMenu(menuMain);
}