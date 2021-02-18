const debug = require('debug')('cloudtuya');
const fs = require('fs');
const CloudTuya = require('./cloudtuya');
const prompt = require('prompt');

const name = 'cloudtuya';

debug('booting %s', name);
// Load local files
let apiKeys = {};
let deviceData = {};
try{
  apiKeys = require('./keys.json');
} catch(err) {
  console.error('keys.json is missing.');
}
try{
  deviceData = require('./devices.json');
} catch(err) {
  console.warn('devices.json is missing. creating temporary');
  deviceData = [{}];
}
/**
* Save Data Such a Devices to file
* @param {Object} data to save
* @param {String} [file="./devices.json"] to save to
*/
function saveDataToFile(data, file = './devices.json') {
  debug(`Data ${JSON.stringify(data)}`);
  fs.writeFile(file, JSON.stringify(data), (err) => {
    if(err) {
      return debug(err);
    }
    debug(`The file ${file} was saved!`);
    return(file);
  });
}


async function main() {
  // Load from keys.json
  const api = new CloudTuya({
    userName: apiKeys.userName,
    password: apiKeys.password,
    bizType: apiKeys.bizType,
    countryCode: apiKeys.countryCode,
    region: apiKeys.region,
  });

  // Test device read from devics.json saved at the end.
  var testId = deviceData[0].id || '10000000000';
  debug(`device data ${deviceData} and ${deviceData[0].id} id or all ${deviceData[0].name}`);

  // Connect to cloud api and get access token.
  const tokens = await api.login();
  debug(`Token ${JSON.stringify(tokens)}`);

  // Get all devices registered on the Tuya app
  let devices = await api.find();
  debug(`devices ${JSON.stringify(devices)}`);

  // Save device to device.json
  saveDataToFile(devices);


  prompt.start();

  devices.array.forEach(element => {
      console.log(element.name)
  });

}
main();