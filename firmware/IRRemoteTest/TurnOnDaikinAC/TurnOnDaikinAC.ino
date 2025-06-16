#include <Arduino.h>
#include <IRremoteESP8266.h>
#include <IRsend.h>
#include <ir_Daikin.h>

const uint16_t kIrLed = 33;  // ESP8266 GPIO pin to use. Recommended: 4 (D2).
IRDaikinESP ac(kIrLed);      // Set the GPIO to be used to sending the message

void setup() {
  ac.begin();
  Serial.begin(115200);
}

void loop() {
  if (Serial.available()) {
    String msg = Serial.readStringUntil('\n');
    Serial.println("Sending...");

    // Set up what we want to send. See ir_Daikin.cpp for all the options.
    ac.on();
    ac.setFan(1);
    ac.setMode(kDaikinCool);
    ac.setTemp(25);
    ac.setSwingVertical(false);
    ac.setSwingHorizontal(false);

    // Set the current time to 1:33PM (13:33)
    // Time works in minutes past midnight
    ac.setCurrentTime(13 * 60 + 33);
    // Turn off about 1 hour later at 2:30PM (14:30)
    ac.enableOffTimer(14 * 60 + 30);

    // Display what we are going to send.
    Serial.println(ac.toString());

    // Now send the IR signal.
#if SEND_DAIKIN
    ac.send();
#endif  // SEND_DAIKIN
  }
}
