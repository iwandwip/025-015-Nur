#define SPREADSHEET_PROJECT_ID "nur-461521"
#define SPREADSHEET_CLIENT_EMAIL "id-25-015-nur@nur-461521.iam.gserviceaccount.com"
const char SPREADSHEET_ID[] = "1kUSyFDZSX4iaD-4DBSGYTTGkIqvbDk49Bw-wiVM6asY";
const char SPREADSHEET_PRIVATE_KEY[] PROGMEM = "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCzewjpFKlFNEDM\nskNLdmTGrPDPYtoVfOzSP+U2BAUnK+LNwhzSFzVWgBcOFdLu2+OLWeiz5rnmdUtg\naqQntqarYjUpw/+Bgg/IU7BymNwi2cE/LvdY+Ph6pPzD/S/FkKXI+IH0L8aLsHqR\nuRg61BecYI8kjK9DwSe+mmiwwHeRJX434je9wWEeixI6nBnOiKEhCsW+s4tikskt\nluo98IaXixjaO9Mv1vtTd2buGFwP5mDUvMhBBhrSBebsGdRWCJ1PrH71Z6Iz/ANQ\nKXPQUnoWOwnpdop8Z95j0mRrAT2uVshUyMZvQm/6qAR6F5e3t3aflxJM/QKh5lGj\nUMOFGkKfAgMBAAECggEABagXiE0L5q/2aN0nbM3u8CoMLuUVLX8x8ZBs925aATmL\nXOPEx8ROfIrt7xY1/ywz+DTdtinL6x0AQqopwUyq5RTjywyv1VOVjsFAeuQhcAG/\n6u9egVHbdvYTN1QX+NiNuQ9H/TuyPL3TpxsXzebYVaffaw36Ch8g0wuHyCZQvmTM\nGDPBJ8T0HDzcEhGYGXh8Y0Mrt2fTyGEvHIzyyerIJNDrQKZVH8kUymOujxhC8s4T\nxNVS8cVMRsipKA2dbUwKdcApPoQWbrwFmo3h6NEhyis033ewB/Apm4O0o0kQBPUW\nNuf/8yyYJTWxIq+s3Fp5KoYpVFlxou1it0FNgL7SvQKBgQDdoRcMqR9FD7SokpkN\nrii6jSjvL9UCsO1Z/VCzidJ9/tSxth37BKueAs0QeMLmUoUfYCYncu7J204MKqGk\nL716gM3S36lF1otqHdxVOojYm3hfZaaEWW5WjwJq3OeZJNXF0+jDGxRTjnskXVOb\n1N1MSzvu82IiRolNkcYl7jMcowKBgQDPUJmML3P03nE9G8CYHBaLkwHhJUQkZmsP\nKtA96KjXAg31arC+EH8jn84Z4P+v+9fLyNtRqDJ0F0Ks/rmB5kgxBnE7pggcrnDd\nydIc00HXG9J2n8D3H8pNrloWjvFi2JCqwQzGBLp/GpSSOwfV9Of7euxKg5ZK1o7S\niWPaIO7F1QKBgC63I9qhU1wFQXk+3VAK477evkAcfvPAQ2dyg640YM/6BO8oig09\nIMd/o6XTLpHJ1xGT/LbX/QlDVqIt4kBvZ6sIt1m5lz6HSH+np6e3XNz7eFXzYTQI\nfb91CXdo9NBM+VpnnmpxrMkoAUDbAyKXrcXFHe7yEj9TSuG01mVsXg2tAoGAAosW\nlyWt4n8oHHvOrQ8LJ8Mx7rUqVNf80D7SNzA3ggvAaBZa/LnvFVzMhnzAJkSMrS9V\noXbSx6HRa5XkaLeOgyt1ECpFRzTMpavoK/pbgGwS9OmY0G9PaAyPhl9SjsfhXnbn\n1TYRo6WL1Q9sVS+f+PHVHETo/xoKvoJ4+yAUTdECgYAqeOxXb8T40AsbrGSO+Off\nXd7JdaH0DIirzogyIvCEkiyJo6yJ9cuJ1no5YW9m+AFH4gRyN0Z38nG34g74k0Hu\ntoE5r16wwpGbIWpRwlhN+QP+oyIlm6ni0ETdHGPslDdKgm1HTH+1m+E7utikZ406\nWEOfPp69komrGILIoTDwqQ==\n-----END PRIVATE KEY-----\n";

void initSpreadSheet() {
  gsheet.begin(SPREADSHEET_CLIENT_EMAIL, SPREADSHEET_PROJECT_ID, SPREADSHEET_PRIVATE_KEY);
  gsheet.setTokenCallback([](TokenInfo info) -> void {
    if (info.status == token_status_error) {
      Serial.printf("Token info: type = %s, status = %s\n", gsheet.getTokenType(info).c_str(), gsheet.getTokenStatus(info).c_str());
      Serial.printf("Token error: %s\n", gsheet.getTokenError(info).c_str());
    } else {
      Serial.printf("Token info: type = %s, status = %s\n", gsheet.getTokenType(info).c_str(), gsheet.getTokenStatus(info).c_str());
    }
  });
  gsheet.setPrerefreshSeconds(10 * 60);
}

void sendToSpreadsheet() {
  gsheet.process();

  if (!enableGoogleSheetsUpdate) {
    return;
  }

  static uint32_t spreadsheetSendTimer;
  if (millis() - spreadsheetSendTimer >= 60000) {
    spreadsheetSendTimer = millis();

    if (temperature > autoTemperatureSetpointUpper) {
      temperatureStatus = "Panas";
    } else if (temperature < autoTemperatureSetpointLower) {
      temperatureStatus = "Dingin";
    } else {
      temperatureStatus = "Normal";
    }

    FirebaseJson dataValueJson;
    dataValueJson.add("majorDimension", "COLUMNS");
    dataValueJson.set("values/[0]/[0]", dateTime.getDateTimeString());
    dataValueJson.set("values/[1]/[0]", String(temperature, 2).c_str());
    dataValueJson.set("values/[2]/[0]", String(humidity, 2).c_str());
    dataValueJson.set("values/[3]/[0]", temperatureStatus.c_str());

    bool gsheetSendStatus = gsheet.appendValues(SPREADSHEET_ID, "Sheet1!A1", &dataValueJson);
    if (!gsheetSendStatus) {
      Serial.print("Error: ");
      Serial.println(gsheet.errorReason());
    }
  }
}