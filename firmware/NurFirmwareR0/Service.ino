bool sendDataAPI() {
  if (WiFi.status() != WL_CONNECTED) return false;
  HTTPClient http;
  http.begin("https://api-tcoyjjfyla-et.a.run.app/register");
  http.addHeader("Content-Type", "application/json");

  JsonDocument jsonDoc;
  jsonDoc["test"] = 28.5;

  String requestBody;
  serializeJson(jsonDoc, requestBody);

  int httpResponseCode = http.POST(requestBody);
  if (httpResponseCode != 201) return false;
  String payload = http.getString();
  Serial.println(payload);
  http.end();
  return true;
}