#define ENABLE_MODULE_LOGIC_CONDITION_MANAGER
#define ENABLE_MODULE_EASY_LOGIC
#include "Kinematrix.h"

// Global variables
EasyLogic logic;
bool onCommandReceived = false;
bool ledState = false;
unsigned long ledStartTime = 0;

void setup() {
  Serial.begin(115200);
  Serial.println("🚀 EasyLogic Simple Demo");
  Serial.println("LED akan menyala otomatis saat startup");
  Serial.println("Ketik 'on' untuk nyalakan LED lagi");
  Serial.println("Auto off setelah 5 detik\n");

  // Setup LED ON condition
  logic.create("led_on")
    .when([]() {
      return onCommandReceived;  // Trigger dari command "on"
    })
    .onRising()   // Trigger saat berubah dari false ke true
    .then([]() {  // Lambda action - apa yang dilakukan saat trigger
      ledState = true;
      ledStartTime = millis();  // Record waktu LED dinyalakan
      Serial.println("💡 LED ON");
      Serial.println("⏱️ Auto off dalam 5 detik...");

      // Reset flags setelah diproses
      onCommandReceived = false;
    })
    .build();

  // Setup LED OFF condition - check setiap saat apakah sudah 5 detik
  logic.create("led_off")
    .when([]() {
      return ledState && (millis() - ledStartTime >= 5000);  // LED ON dan sudah 5 detik
    })
    .onRising()   // Trigger saat kondisi berubah dari false ke true
    .then([]() {  // Lambda action - matikan LED
      ledState = false;
      Serial.println("💡 LED OFF");
      Serial.println("Siap terima perintah lagi!\n");
    })
    .build();

  Serial.println("✅ Sistem siap! LED akan menyala otomatis...\n");

  // Trigger LED ON otomatis saat startup
  onCommandReceived = true;
}

void loop() {
  logic.run();

  // Print status LED terus-menerus
  if (ledState) {
    unsigned long elapsed = millis() - ledStartTime;
    unsigned long remaining = 5000 - elapsed;
    if (remaining > 5000) remaining = 0;  // Prevent underflow
    Serial.println("🔴 LED Status: ON (sisa: " + String(remaining / 1000.0, 1) + "s)");
  } else {
    Serial.println("⚫ LED Status: OFF");
  }

  // Cek serial input
  if (Serial.available()) {
    String serialInput = Serial.readStringUntil('\n');
    serialInput.trim();
    serialInput.toLowerCase();

    if (serialInput == "on") {
      Serial.println("📝 Perintah diterima: " + serialInput);

      if (ledState) {
        // LED sudah nyala, restart timer
        Serial.println("🔄 LED sudah menyala, restart timer 5 detik...");
        ledStartTime = millis();  // Reset timestamp = restart timer
      } else {
        // LED OFF, nyalakan
        onCommandReceived = true;  // Set flag untuk trigger condition
      }
    } else {
      Serial.println("❌ Perintah tidak dikenal: " + serialInput);
      Serial.println("Ketik 'on' saja");
    }
  }

  delay(500);  // Delay agar print tidak terlalu cepat
}