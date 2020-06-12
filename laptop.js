/**
* Example script using cloudtuya to connect, get states an change them
*/

const debug = require('debug')('cloudtuya');
const fs = require('fs');
const CloudTuya = require('./cloudtuya');
const BaseDevice = require('./devices/baseDevice');
const name = 'cloudtuya';
const batteryLevel = require('battery-level');

async function changeStatus(status) {
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

    const deviceId = process.argv[2]
    const device = new BaseDevice({ api: api, deviceId: deviceId })

    if (status) {
        device.turnOn()
        console.log(`Device ${deviceId} turned on`)
    } else {
        device.turnOff()
        console.log(`Device ${deviceId} turned off`)
    }
}

async function main() {
    const currentLevel = await batteryLevel()

    if (currentLevel <= 0.2) {
        changeStatus(true)
    } else if (currentLevel >= 0.8) {
        changeStatus(false)
    }
}

main();
