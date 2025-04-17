void usbCommunicationTask(const String& dataRecv) {
  String data = dataRecv;
  String dataHeader = usbSerial.getStrData(dataRecv, 0, "#");
  String dataValue = usbSerial.getStrData(dataRecv, 1, "#");

  Serial.print("| dataRecv: ");
  Serial.print(dataRecv);
  Serial.println();

  if (isDigit(data[0]) || isDigit(data[1])) {
    // nums
  } else {
    dataHeader.toUpperCase();
    if (dataHeader == "R") ESP.restart();
  }
}