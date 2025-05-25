BLYNK_WRITE(V1) {
  if (remote.mode) return;
  remote.state.buttonPlus = 0;
  remote.state.buttonPlus = param.asInt();
  if (remote.state.buttonPlus) {
    remote.state.buttonPlus = 0;
    remote.temperature++;
    remote.temperature = (remote.temperature >= 30) ? 30 : remote.temperature;
    Blynk.virtualWrite(V4, remote.temperature);
    acSetTemperature(remote.temperature);
  }
}

BLYNK_WRITE(V2) {
  if (remote.mode) return;
  remote.state.buttonMinus = 0;
  remote.state.buttonMinus = param.asInt();
  if (remote.state.buttonMinus) {
    remote.state.buttonMinus = 0;
    remote.temperature--;
    remote.temperature = (remote.temperature <= 16) ? 16 : remote.temperature;
    Blynk.virtualWrite(V4, remote.temperature);
    acSetTemperature(remote.temperature);
  }
}

void acSetTemperature(float temperature) {
  remote.temperature = temperature;
  ac.setTemp(temperature);
  preferences.begin("thoriqdeny", false);
  preferences.putFloat("temperature", temperature);
  preferences.end();
  Serial.println(ac.toString());
#if SEND_PANASONIC_AC
  ac.send(remote.repeat);
#endif
#if SEND_DAIKIN
  ac.send(remote.repeat);
#endif
  Serial.println("temperature: " + String(temperature));
}