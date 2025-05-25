void acPowerOn() {
#if AC_CONTROL_TYPE == DAIKIN
  debug.startPrint(LOG_AC);
  debug.continuePrint("AC Type", "DAIKIN", LOG_AC);
  debug.continuePrint("AC State", "ON", LOG_AC);
  debug.endPrint(LOG_AC, true);
  ac.on();
  ac.setFan(1);
  ac.setMode(kDaikinCool);
  ac.setTemp(22);
  ac.setSwingVertical(false);
  ac.setSwingHorizontal(false);
#if SEND_DAIKIN
  ac.send();
#endif
#elif AC_CONTROL_TYPE == PANASONIC
  debug.startPrint(LOG_AC);
  debug.continuePrint("AC Type", "PANASONIC", LOG_AC);
  debug.continuePrint("AC State", "ON", LOG_AC);
  debug.endPrint(LOG_AC, true);
  ac.setModel(kPanasonicRkr);
  ac.on();
  ac.setFan(kPanasonicAcFanAuto);
  ac.setMode(kPanasonicAcCool);
  ac.setTemp(22);
  ac.setSwingVertical(kPanasonicAcSwingVAuto);
  ac.setSwingHorizontal(kPanasonicAcSwingHAuto);
#if SEND_PANASONIC_AC
  ac.send();
#endif
#endif
}

void acPowerOff() {
#if AC_CONTROL_TYPE == DAIKIN
  debug.startPrint(LOG_AC);
  debug.continuePrint("AC Type", "DAIKIN", LOG_AC);
  debug.continuePrint("AC State", "OFF", LOG_AC);
  debug.endPrint(LOG_AC, true);
  ac.off();
#if SEND_DAIKIN
  ac.send();
#endif
#elif AC_CONTROL_TYPE == PANASONIC
  debug.startPrint(LOG_AC);
  debug.continuePrint("AC Type", "PANASONIC", LOG_AC);
  debug.continuePrint("AC State", "OFF", LOG_AC);
  debug.endPrint(LOG_AC, true);
  ac.off();
#if SEND_PANASONIC_AC
  ac.send();
#endif
#endif
}

void acSetTemperature(float _temperature) {
  ac.setTemp(_temperature);
#if AC_CONTROL_TYPE == DAIKIN
  debug.startPrint(LOG_AC);
  debug.continuePrint("AC Type", "DAIKIN", LOG_AC);
  debug.continuePrint("AC Set Temp", _temperature, LOG_AC);
  debug.endPrint(LOG_AC, true);
#if SEND_DAIKIN
  ac.send();
#endif
#elif AC_CONTROL_TYPE == PANASONIC
  debug.startPrint(LOG_AC);
  debug.continuePrint("AC Type", "PANASONIC", LOG_AC);
  debug.continuePrint("AC Set Temp", _temperature, LOG_AC);
  debug.endPrint(LOG_AC, true);
#if SEND_PANASONIC_AC
  ac.send();
#endif
#endif
}