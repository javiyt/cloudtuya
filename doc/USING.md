# Charge your computer automatically

If you own a switch or stripe that is [tuya](https://www.tuya.com/) compatible you can forget about keeping your laptop always charging and charge it when needed automatically.

Thanks to [launchd](https://www.launchd.info/) you can run laptop.js script that would turn your device automatically on when battery level is lower or equal to 20% and turn it off when battery level is equal or higher than 80%.

Also when a second monitor is found it turns in on when your laptop is connected and turns it off when second monitor is not present.

## How to install it

Clone current repository into your computer and copy local.battery.plist file into your ~/Library/LaunchAgents folder and modify location and device id parameters:
```
  <string>/Users/Me/Scripts/laptop.js</string>
  <string>LAPTOP_DEVICE_ID</string>
  <!-- <string>MONITOR_DEVICE_ID</string> -->
```

Run launchctl command:
```
launchctl load ~/Library/LaunchAgents/local.battery.plist
```

Remember after any change to the script or the agent definition you should unload it and load again:
```
launchctl unload ~/Library/LaunchAgents/local.battery.plist
launchctl load ~/Library/LaunchAgents/local.battery.plist
```

## Configuring Tuya

Go to [Cloud Tuya Project](https://github.com/unparagoned/cloudtuya#example-keysjson) in order to check how to configure tuya connection setting up a keys.json file, ie:
```
{
  "userName": "my_smart_life@email.com",
  "password": "my_smart_life_password",
  "bizType": "smart_life",
  "countryCode": "34",
  "region": "eu"
}
```