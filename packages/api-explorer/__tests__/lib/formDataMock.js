const formDataFile = "data:application/json;base64,WwogIHsKICAgICJuYW1lIjogIl9pZCIsCiAgICAidHlwZSI6ICJPYmplY3RJZCIsCiAgICAicmVxdWlyZWQiOiB0cnVlLAogICAgIm51bGxhYmxlIjogZmFsc2UsCiAgICAiY3J5cHRlZCI6IGZhbHNlLAogICAgImRlc2NyaXB0aW9uIjogIl9pZCIKICB9LAogIHsKICAgICJuYW1lIjogImNyZWF0b3JJZCIsCiAgICAidHlwZSI6ICJzdHJpbmciLAogICAgInJlcXVpcmVkIjogdHJ1ZSwKICAgICJudWxsYWJsZSI6IGZhbHNlLAogICAgImNyeXB0ZWQiOiBmYWxzZSwKICAgICJkZXNjcmlwdGlvbiI6ICJjcmVhdG9ySWQiCiAgfSwKICB7CiAgICAibmFtZSI6ICJjcmVhdGVkQXQiLAogICAgInR5cGUiOiAiRGF0ZSIsCiAgICAicmVxdWlyZWQiOiB0cnVlLAogICAgIm51bGxhYmxlIjogZmFsc2UsCiAgICAiY3J5cHRlZCI6IGZhbHNlLAogICAgImRlc2NyaXB0aW9uIjogImNyZWF0ZWRBdCIKICB9LAogIHsKICAgICJuYW1lIjogInVwZGF0ZXJJZCIsCiAgICAidHlwZSI6ICJzdHJpbmciLAogICAgInJlcXVpcmVkIjogdHJ1ZSwKICAgICJudWxsYWJsZSI6IGZhbHNlLAogICAgImNyeXB0ZWQiOiBmYWxzZSwKICAgICJkZXNjcmlwdGlvbiI6ICJ1cGRhdGVySWQiCiAgfSwKICB7CiAgICAibmFtZSI6ICJ1cGRhdGVkQXQiLAogICAgInR5cGUiOiAiRGF0ZSIsCiAgICAicmVxdWlyZWQiOiB0cnVlLAogICAgIm51bGxhYmxlIjogZmFsc2UsCiAgICAiY3J5cHRlZCI6IGZhbHNlLAogICAgImRlc2NyaXB0aW9uIjogInVwZGF0ZWRBdCIKICB9LAogIHsKICAgICJuYW1lIjogIl9fU1RBVEVfXyIsCiAgICAidHlwZSI6ICJzdHJpbmciLAogICAgInJlcXVpcmVkIjogdHJ1ZSwKICAgICJudWxsYWJsZSI6IGZhbHNlLAogICAgImNyeXB0ZWQiOiBmYWxzZSwKICAgICJkZXNjcmlwdGlvbiI6ICJfX1NUQVRFX18iCiAgfSwKICB7CiAgICAibmFtZSI6ICJleHBlZGl0YTAiLAogICAgInR5cGUiOiAiYm9vbGVhbiIsCiAgICAiZGVzY3JpcHRpb24iOiAiVXQgc2ludCBjb25zZXF1dW50dXIgcXVpIG5paGlsIHNhZXBlIGJsYW5kaXRpaXMgZW5pbSBkaXN0aW5jdGlvLiIsCiAgICAicmVxdWlyZWQiOiBmYWxzZSwKICAgICJudWxsYWJsZSI6IHRydWUsCiAgICAiY3J5cHRlZCI6IGZhbHNlCiAgfQpdCg=="

function getHarWithValues(testString, testNumber) {
  return {
    "log": {
      "entries": [
        {
          "request": {
            "headers": [
              {
                "name": "Content-Type",
                "value": "multipart/form-data; boundary=1592486245005"
              },
              {
                "name": "secret",
                "value": "123"
              }
            ],
            "queryString": [],
            "postData": {
              "text": `--1592486245005\r\nContent-Disposition: form-data; name="file"\r\n\r\nWwogIHsKICAgICJuYW1lIjogIl9pZCIsCiAgICAidHlwZSI6ICJPYmplY3RJZCIsCiAgICAicmVxdWlyZWQiOiB0cnVlLAogICAgIm51bGxhYmxlIjogZmFsc2UsCiAgICAiY3J5cHRlZCI6IGZhbHNlLAogICAgImRlc2NyaXB0aW9uIjogIl9pZCIKICB9LAogIHsKICAgICJuYW1lIjogImNyZWF0b3JJZCIsCiAgICAidHlwZSI6ICJzdHJpbmciLAogICAgInJlcXVpcmVkIjogdHJ1ZSwKICAgICJudWxsYWJsZSI6IGZhbHNlLAogICAgImNyeXB0ZWQiOiBmYWxzZSwKICAgICJkZXNjcmlwdGlvbiI6ICJjcmVhdG9ySWQiCiAgfSwKICB7CiAgICAibmFtZSI6ICJjcmVhdGVkQXQiLAogICAgInR5cGUiOiAiRGF0ZSIsCiAgICAicmVxdWlyZWQiOiB0cnVlLAogICAgIm51bGxhYmxlIjogZmFsc2UsCiAgICAiY3J5cHRlZCI6IGZhbHNlLAogICAgImRlc2NyaXB0aW9uIjogImNyZWF0ZWRBdCIKICB9LAogIHsKICAgICJuYW1lIjogInVwZGF0ZXJJZCIsCiAgICAidHlwZSI6ICJzdHJpbmciLAogICAgInJlcXVpcmVkIjogdHJ1ZSwKICAgICJudWxsYWJsZSI6IGZhbHNlLAogICAgImNyeXB0ZWQiOiBmYWxzZSwKICAgICJkZXNjcmlwdGlvbiI6ICJ1cGRhdGVySWQiCiAgfSwKICB7CiAgICAibmFtZSI6ICJ1cGRhdGVkQXQiLAogICAgInR5cGUiOiAiRGF0ZSIsCiAgICAicmVxdWlyZWQiOiB0cnVlLAogICAgIm51bGxhYmxlIjogZmFsc2UsCiAgICAiY3J5cHRlZCI6IGZhbHNlLAogICAgImRlc2NyaXB0aW9uIjogInVwZGF0ZWRBdCIKICB9LAogIHsKICAgICJuYW1lIjogIl9fU1RBVEVfXyIsCiAgICAidHlwZSI6ICJzdHJpbmciLAogICAgInJlcXVpcmVkIjogdHJ1ZSwKICAgICJudWxsYWJsZSI6IGZhbHNlLAogICAgImNyeXB0ZWQiOiBmYWxzZSwKICAgICJkZXNjcmlwdGlvbiI6ICJfX1NUQVRFX18iCiAgfSwKICB7CiAgICAibmFtZSI6ICJleHBlZGl0YTAiLAogICAgInR5cGUiOiAiYm9vbGVhbiIsCiAgICAiZGVzY3JpcHRpb24iOiAiVXQgc2ludCBjb25zZXF1dW50dXIgcXVpIG5paGlsIHNhZXBlIGJsYW5kaXRpaXMgZW5pbSBkaXN0aW5jdGlvLiIsCiAgICAicmVxdWlyZWQiOiBmYWxzZSwKICAgICJudWxsYWJsZSI6IHRydWUsCiAgICAiY3J5cHRlZCI6IGZhbHNlCiAgfQpdCg==\r\n--1592486245005\r\nContent-Disposition: form-data; name="testString"\r\n\r\n${testString}\r\n--1592486245005\r\nContent-Disposition: form-data; name="testNumber"\r\n\r\n${testNumber}\r\n--1592486245005--\r\n`
            },
            "method": "POST",
            "url": "http://localhost:9966/files/"
          }
        }
      ]
    }
  }
}

export {getHarWithValues, formDataFile}