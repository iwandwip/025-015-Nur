#define ENABLE_MODULE_LOGIC_CONDITION_MANAGER
#define ENABLE_MODULE_EASY_LOGIC
#include "Kinematrix.h"

EasyLogic logic;

float temperature = 22.0;

void highTempAlert() {
  Serial.print("🔥 Temperature too HIGH: ");
  Serial.println(temperature);
}

void lowTempAlert() {
  Serial.print("❄️ Temperature too LOW: ");
  Serial.println(temperature);
}

void temperatureChanged(float oldVal, float newVal) {
  Serial.print("🌡️ Temperature changed from ");
  Serial.print(oldVal);
  Serial.print(" to ");
  Serial.println(newVal);
}

void setup() {
  Serial.begin(115200);
  Serial.println("🚀 EasyLogic Temperature Monitor Started!");

  int upperID = logic.create("upperThreshold")
                  .when(&temperature)
                  .whenExceeds(27.0)
                  .then(highTempAlert)
                  .repeat(3)
                  .every(1000)
                  .build();

  int lowerID = logic.create("lowerThreshold")
                  .when(&temperature)
                  .whenDropsBelow(17.0)
                  .then(lowTempAlert)
                  .repeat(3)
                  .every(1000)
                  .build();

  int changeID = logic.onValueChange("temp", &temperature, temperatureChanged)
                   .withEpsilon(0.1)
                   .build();

  Serial.print("✅ Conditions registered - Upper: ");
  Serial.print(upperID);
  Serial.print(", Lower: ");
  Serial.print(lowerID);
  Serial.print(", Change: ");
  Serial.println(changeID);

  if (upperID >= 0 && lowerID >= 0 && changeID >= 0) {
    Serial.println("🎉 All systems GO!");
  } else {
    Serial.println("❌ Registration failed!");
  }

  printDynamicRegistryStatus();
  delay(1000);
}

void loop() {
  logic.run();

  if (Serial.available()) {
    String input = Serial.readStringUntil('\n');
    input.trim();

    if (input == "r" || input == "R") {
      Serial.println("🔄 Restarting...");
      delay(1000);
      ESP.restart();
    }

    if (input == "s" || input == "S") {
      Serial.println("📊 System Status:");
      logic.status();
      printDynamicRegistryStatus();
      Serial.print("🌡️ Current temperature: ");
      Serial.println(temperature);
      Serial.print("💾 Free heap: ");
      Serial.println(ESP.getFreeHeap());
      return;
    }

    if (input == "test" || input == "TEST") {
      Serial.println("🧪 Running safe temperature test...");

      float testTemps[] = { 15.0, 20.0, 25.0, 30.0, 35.0, 25.0, 15.0, 22.0 };
      int testCount = sizeof(testTemps) / sizeof(testTemps[0]);

      for (int i = 0; i < testCount; i++) {
        Serial.print("🔄 Setting temperature to: ");
        Serial.println(testTemps[i]);

        temperature = testTemps[i];

        logic.run();
        delay(2000);

        Serial.print("💾 Free heap: ");
        Serial.println(ESP.getFreeHeap());
      }

      Serial.println("✅ Test sequence complete!");
      return;
    }

    if (input.length() > 0) {
      float newTemp = input.toFloat();
      if (newTemp != 0.0 || input == "0" || input == "0.0") {
        Serial.print("🌡️ Setting temperature from ");
        Serial.print(temperature);
        Serial.print(" to ");
        Serial.println(newTemp);

        temperature = newTemp;

        Serial.print("💾 Free heap: ");
        Serial.println(ESP.getFreeHeap());
      } else {
        Serial.println("❌ Invalid input!");
        Serial.println("📋 Commands:");
        Serial.println("  [number] - Set temperature");
        Serial.println("  's' - Show status");
        Serial.println("  'test' - Safe test sequence");
        Serial.println("  'r' - Restart");
      }
    }
  }

  delay(10);
}