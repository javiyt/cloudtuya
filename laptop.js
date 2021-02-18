const debug = require('debug')('cloudtuya');
const fs = require('fs');
const CloudTuya = require('./cloudtuya');
const BaseDevice = require('./devices/baseDevice');
const name = 'cloudtuya';
const batteryLevel = require('battery-level');
const batteryCharging = require('is-charging');
const si = require('systeminformation');

async function changeStatus(status, deviceId) {
    // Load local files
    let apiKeys = {};
    try {
        apiKeys = require('./keys.json');
    } catch (err) {
        console.error('keys.json is missing.');
    }
    // Load from keys.json
    const api = new CloudTuya({
        userName: apiKeys.userName,
        password: apiKeys.password,
        bizType: apiKeys.bizType,
        countryCode: apiKeys.countryCode,
        region: apiKeys.region,
    });

    // Connect to cloud api and get access token.
    const tokens = await api.login();
    debug(`Token ${JSON.stringify(tokens)}`);

    const device = new BaseDevice({ api: api, deviceId: deviceId })
    const isActive = await device.isOn()

    if (status && !isActive) {
        device.turnOn()
        console.log(`Device ${deviceId} turned on`)
    } else if (!status && isActive) {
        device.turnOff()
        console.log(`Device ${deviceId} turned off`)
    }
}

async function main() {
    const currentLevel = await batteryLevel()
    const isCharging = await batteryCharging()

    if (currentLevel <= 0.2 && !isCharging) {
        changeStatus(true, process.argv[2])
    } else if (currentLevel >= 0.8 && isCharging) {
        changeStatus(false, process.argv[2])
    }

   // si.graphics().then(data => {
   //     let d = data.displays.filter(display => display.pixeldepth > 0).length
   //     if (d > 1 && process.argv[3]) {
   //         changeStatus(true, process.argv[3])
   //     } else if (d == 1 && process.argv[3]) {
   //         changeStatus(false, process.argv[3])
   //     }
   // });
}

main();
