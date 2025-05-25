void usbCommunicationTask(const String& dataRecv) {
  String data = dataRecv;
  String dataHeader = usbSerial.getStrData(data, 0, "#");
  String dataValue = usbSerial.getStrData(data, 1, "#");
  Serial.print("| dataRecv: ");
  Serial.print(dataRecv);
  Serial.print("| dataHeader: ");
  Serial.print(dataHeader);
  Serial.print("| dataValue: ");
  Serial.print(dataValue);
  if (isDigit(data[0]) || isDigit(data[1])) {
    // nums
  } else {
    dataHeader.toUpperCase();
    if (dataHeader == "R") ESP.restart();
    if (dataHeader == "X") {  // X#1
      remote.posX = dataValue.toInt();
      Serial.print("| remote.posX: ");
      Serial.print(remote.posX);
      Serial.print("| remote.posY: ");
      Serial.print(remote.posY);
      Serial.print("| remote.text: ");
      Serial.print(remote.text);
    }
    if (dataHeader == "Y") {  // Y#1
      remote.posY = dataValue.toInt();
      Serial.print("| remote.posX: ");
      Serial.print(remote.posX);
      Serial.print("| remote.posY: ");
      Serial.print(remote.posY);
      Serial.print("| remote.text: ");
      Serial.print(remote.text);
    }
    if (dataHeader == "TEXT") {  // TEXT#Mode
      remote.text = dataValue;
      Serial.print("| remote.posX: ");
      Serial.print(remote.posX);
      Serial.print("| remote.posY: ");
      Serial.print(remote.posY);
      Serial.print("| remote.text: ");
      Serial.print(remote.text);
    }
    if (dataHeader == "D") {  // D#1
      remote.debugLevel = dataValue.toInt();
      Serial.print("| remote.debugLevel: ");
      Serial.print(remote.debugLevel);
    }
    if (dataHeader == "T") {  // T#28.5
      remote.temperature = dataValue.toFloat();
      Serial.print("| remote.temperature: ");
      Serial.print(remote.temperature);
    }
    if (dataHeader == "H") {  // H#90
      remote.humidity = dataValue.toFloat();
      Serial.print("| remote.humidity: ");
      Serial.print(remote.humidity);
    }
    if (dataHeader == "SENSORT") {  // SENSORT#28.5
      remote.sensorTemperature = dataValue.toFloat();
      Serial.print("| remote.sensorTemperature: ");
      Serial.print(remote.sensorTemperature);
    }
    if (dataHeader == "SENSORH") {  // SENSORH#90
      remote.sensorHumidity = dataValue.toFloat();
      Serial.print("| remote.sensorHumidity: ");
      Serial.print(remote.sensorHumidity);
    }
    if (dataHeader == "SENSORPIR") {  // SENSORPIR#1
      remote.sensorPir = dataValue.toInt();
      Serial.print("| remote.sensorPir: ");
      Serial.print(remote.sensorPir);
    }
  }
  Serial.println();
}