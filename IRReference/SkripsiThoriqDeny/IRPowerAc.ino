BLYNK_WRITE(V0) {
  if (remote.mode) return;
  remote.state.buttonPower = 0;
  remote.state.buttonPower = param.asInt();
  if (remote.state.buttonPower) {
    remote.state.buttonState = 1;
    remote.state.buttonPower = 0;
    acPowerOn();
  }
}

BLYNK_WRITE(V3) {
  if (remote.mode) return;
  remote.state.buttonState = 0;
  remote.state.buttonPowerOff = param.asInt();
  if (remote.state.buttonPowerOff) {
    remote.state.buttonState = 0;
    remote.state.buttonPowerOff = 0;
    acPowerOff();
  }
}

BLYNK_WRITE(V5) {
  remote.mode = param.asInt();
  preferences.begin("thoriqdeny", false);
  preferences.putInt("mode", remote.mode);
  preferences.end();
  Serial.print("| remote.mode: ");
  Serial.print(remote.mode);
  Serial.println();
}

void acPowerOn() {
//////////////////////////////////////////////////////////////////////////////////////// AC_MODEL_PANASONIC
#ifdef AC_MODEL_PANASONIC
  Serial.println("acOn AC_MODEL_PANASONIC");
  ac.setModel(kPanasonicRkr);
  ac.on();
  ac.setFan(kPanasonicAcFanAuto);
  ac.setMode(kPanasonicAcCool);
  ac.setTemp(remote.temperature);
  ac.setSwingVertical(kPanasonicAcSwingVAuto);
  ac.setSwingHorizontal(kPanasonicAcSwingHAuto);
#if SEND_PANASONIC_AC
  Serial.println(ac.toString());
  ac.send(remote.repeat);
#endif
#endif  // AC_MODEL_PANASONIC
//////////////////////////////////////////////////////////////////////////////////////// AC_MODEL_PANASONIC_RAW
#ifdef AC_MODEL_PANASONIC_RAW
  Serial.println("acOn AC_MODEL_PANASONIC_RAW");
#if SEND_RAW
  // acRaw.sendRaw(rawPanasonicOn, 319, 38);  // Send a raw data capture at 38kHz.
#endif
  ac.setRaw(rawStatePanasonicOn);
#if SEND_PANASONIC_AC
  Serial.println(ac.toString());
  ac.send(remote.repeat);
#endif
#endif  // AC_MODEL_PANASONIC_RAW
//////////////////////////////////////////////////////////////////////////////////////// AC_MODEL_DAIKIN
#ifdef AC_MODEL_DAIKIN
  Serial.println("acOn AC_MODEL_DAIKIN");
  ac.on();
  ac.setFan(5);
  ac.setMode(kDaikinCool);
  ac.setTemp(remote.temperature);
  ac.setSwingVertical(false);
  ac.setSwingHorizontal(false);
#if SEND_DAIKIN
  Serial.println(ac.toString());
  ac.send(remote.repeat);
#endif
#endif
//////////////////////////////////////////////////////////////////////////////////////// AC_MODEL_DAIKIN_RAW
#ifdef AC_MODEL_DAIKIN_RAW
  Serial.println("acOn AC_MODEL_DAIKIN_RAW");
#if SEND_RAW
  // acRaw.sendRaw(rawDaikinOn, 319, 38);  // Send a raw data capture at 38kHz.
#endif
  ac.setRaw(rawStateDaikinOn);
#if SEND_DAIKIN
  Serial.println(ac.toString());
  ac.send(remote.repeat);
#endif
#endif  // AC_MODEL_DAIKIN_RAW
}

void acPowerOff() {
  //////////////////////////////////////////////////////////////////////////////////////// AC_MODEL_PANASONIC
#ifdef AC_MODEL_PANASONIC
  Serial.println("acOff AC_MODEL_PANASONIC");
  ac.off();
#if SEND_PANASONIC_AC
  Serial.println(ac.toString());
  ac.send(remote.repeat);
#endif
#endif  // AC_MODEL_PANASONIC
//////////////////////////////////////////////////////////////////////////////////////// AC_MODEL_PANASONIC_RAW
#ifdef AC_MODEL_PANASONIC_RAW
  Serial.println("acOff AC_MODEL_PANASONIC_RAW");
#if SEND_RAW
  // acRaw.sendRaw(rawPanasonicOff, 319, 38);  // Send a raw data capture at 38kHz.
#endif
  ac.setRaw(rawStatePanasonicOff);
#if SEND_PANASONIC_AC
  Serial.println(ac.toString());
  ac.send(remote.repeat);
#endif
#endif  // AC_MODEL_PANASONIC_RAW
//////////////////////////////////////////////////////////////////////////////////////// AC_MODEL_DAIKIN
#ifdef AC_MODEL_DAIKIN
  Serial.println("acOff AC_MODEL_DAIKIN");
  ac.off();
#if SEND_DAIKIN
  Serial.println(ac.toString());
  ac.send(remote.repeat);
#endif
#endif
//////////////////////////////////////////////////////////////////////////////////////// AC_MODEL_DAIKIN_RAW
#ifdef AC_MODEL_DAIKIN_RAW
  Serial.println("acOff AC_MODEL_DAIKIN_RAW");
#if SEND_RAW
  // acRaw.sendRaw(rawDaikinOff, 319, 38);  // Send a raw data capture at 38kHz. 38
#endif
  ac.setRaw(rawStateDaikinOff);
#if SEND_DAIKIN
  Serial.println(ac.toString());
  ac.send(remote.repeat);
#endif
#endif  // AC_MODEL_DAIKIN_RAW
}