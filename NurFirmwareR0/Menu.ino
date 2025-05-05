void menuDisplayCallback() {
  static auto menuMain = menu.createMenu(menu.begin(2), "Temp: ", "Hum : ");
  menu.formatMenu(menuMain, 0, "Temp: %.2f", temperature);
  menu.formatMenu(menuMain, 1, "Hum : %.2f", humidity);
  menu.showMenu(menuMain);
}