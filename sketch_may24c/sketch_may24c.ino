#define ENABLE_MODULE_LOGIC_CONDITION_MANAGER
#define ENABLE_MODULE_EASY_LOGIC
#include "Kinematrix.h"

EasyLogic logic;

float temperature = 22.0;

void setup() {
  Serial.begin(115200);

  logic.create("exceedNotif")
    .when(&temperature)
    .whenExceeds(27.0)
    .then([]() {
      Serial.print("🔥 Temperature too HIGH: ");
      Serial.println(temperature);
    })
    .build();

  // logic.create("upperThreshold")
  //   .when(&temperature)
  //   .whenExceeds(27.0)
  //   .then([]() {
  //     Serial.print("🔥 Temperature too HIGH: ");
  //     Serial.println(temperature);
  //   })
  //   .repeat(3)
  //   .every(1000)
  //   .build();

  logic.create("bellowNotif")
    .when(&temperature)
    .whenDropsBelow(17.0)
    .then([]() {
      Serial.print("❄️ Temperature too LOW: ");
      Serial.println(temperature);
    })
    .build();

  // logic.create("lowerThreshold")
  //   .when(&temperature)
  //   .whenDropsBelow(17.0)
  //   .then([]() {
  //     Serial.print("❄️ Temperature too LOW: ");
  //     Serial.println(temperature);
  //   })
  //   .repeat(3)
  //   .every(1000)
  //   .build();

  // logic.create("tempChangeDetector")
  //   .when(&temperature)
  //   .onChange()
  //   .then([]() {
  //     Serial.print("📊 Temperature CHANGED: ");
  //     Serial.print(temperature);
  //     Serial.println("°C");
  //   })
  //   .build();
}

void loop() {
  logic.run();

  if (Serial.available()) {
    String input = Serial.readStringUntil('\n');
    input.trim();
    if (input == "r" || input == "R") {
      ESP.restart();
    }
    if (input.length() > 0) {
      float newTemp = input.toFloat();
      if (newTemp != 0.0 || input == "0" || input == "0.0") {
        temperature = newTemp;
        Serial.print("🌡️ Temperature set to: ");
        Serial.println(temperature);
      } else {
        Serial.println("❌ Invalid input! Please enter a number.");
      }
    }
  }

  delay(10);
}