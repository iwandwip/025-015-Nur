#define BLYNK_TEMPLATE_ID "TMPL6I0QFC2cF"
#define BLYNK_TEMPLATE_NAME "Skripsi"
#define BLYNK_AUTH_TOKEN "D0VFaAEmbfzMLr9nu_meoA0oWFruUpdW"

void wifiTask() {
  task.setInitCoreID(1);
  task.createTask(10000, [](void* pvParameter) {
    Blynk.begin(BLYNK_AUTH_TOKEN, BLYNK_WIFI_SSID, BLYNK_WIFI_PASS);
    client.setInsecure();

    if (!dateTime.begin()) {
      Serial.println("Gagal memulai NTP Client!");
    }

    disableCore1WDT();
    buzzer.toggleInit(100, 2);

    for (;;) {
      Blynk.run();
      static uint32_t dateTimeNTPTimer;
      if (millis() - dateTimeNTPTimer >= 1000 && dateTime.update()) {
        dateTimeNTPTimer = millis();
        // Serial.println(dateTime.getDateTimeString());
      }

      static uint32_t blynkSendTimer;
      if (millis() - blynkSendTimer >= 1000 && enableBlynkSend) {
        blynkSendTimer = millis();
        Blynk.virtualWrite(V0, random(0, 1000));
      }
    }
  });
}

BLYNK_WRITE(V1) {
  int parameter = param.asInt();
}