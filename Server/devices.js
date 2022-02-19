const devices = require('./ikea/devices.js');

const deviceInfo = (device) => {
  // Return the updated device
  switch (device.type) {
    case 0: // remote
      return {
        id: device.instanceId,
        alive: device.alive,
        type: 'remote',
        name: device.name,
        battery: device.deviceInfo.battery
      };

    case 2: // light
      let lightInfo = device.lightList[0];
      return {
        id: device.instanceId,
        alive: device.alive,
        type: 'light',
        name: device.name,
        onOff: lightInfo.onOff,
        color: lightInfo.color,
        colorTemperature: lightInfo.colorTemperature,
        dimmer: lightInfo.dimmer
      };

    default:
      return {
        id: device.instanceId,
        alive: device.alive,
        name: device.name,
        type: 'unknown type',
        description: `device type: ${device.type}`
      };
  }
};

const toggleDevice = (tradfri, id) => {
  let currentDevice = null;
  let accessory = null;
  currentDevice = devices.findDevice(tradfri, id.toString());

  if (currentDevice == null) {
    console.log('\x1b[31m%s\x1b[0m', `Could not find device with ${id}`);
    return { error: `Could not find device with ${id}` };
  }

  accessory = currentDevice.lightList[0];
  accessory.client = tradfri;
  accessory.toggle();
  return { message: `Toggling device with id: ${id}` };
};

const setBrightness = (tradfri, id, brightness) => {
  let currentDevice = null;
  let accessory = null;
  currentDevice = devices.findDevice(tradfri, id.toString());

  if (currentDevice == null) {
    console.log('\x1b[31m%s\x1b[0m', `Could not find device with ${id}`);
    return { error: `Could not find device with ${id}` };
  }
  accessory = currentDevice.lightList[0];
  accessory.client = tradfri;
  accessory.setBrightness(brightness);
  return {
    message: `Set brightness level ${brightness}% to device with id: ${id}`
  };
};

const setColor = () => {};

module.exports = {
  deviceInfo,
  toggleDevice,
  setBrightness,
  setColor
};
