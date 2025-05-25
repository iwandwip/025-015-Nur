void blynkDataHandler() {
  static uint32_t blynkSendDataTimer;
  if (millis() - blynkSendDataTimer >= 500) {
    Blynk.virtualWrite(V6, remote.state.buttonState);
    Blynk.virtualWrite(V7, remote.sensorTemperature);
    if (remote.mode) {
      Blynk.virtualWrite(V4, remote.temperature);
    }
    blynkSendDataTimer = millis();
  }
}