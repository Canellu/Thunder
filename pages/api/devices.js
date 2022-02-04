const connection = require('../../scripts/connection');
const devices = require('../../scripts/devices');
const delay = require('delay');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const tradfri = await connection.getConnection();
    tradfri.observeDevices();
    await delay(200);
    const id = req.body.id;
    let currentDevice = null;
    let accessory = null;
    currentDevice = devices.findDevice(tradfri, id.toString());

    if (currentDevice == null) {
      tradfri.destroy();
      res.status(404).send({ message: `Unable to find device...` });
    } else {
      accessory = currentDevice.lightList[0];
      accessory.client = tradfri;
      accessory.toggle();
      await delay(200);
      tradfri.destroy();

      res.status(200).send({
        id: currentDevice.instanceId,
        type: 'light',
        name: currentDevice.name,
        onOff: accessory.onOff,
        color: accessory.color,
        colorTemperature: accessory.colorTemperature,
        dimmer: accessory.dimmer
      });
    }
  }

  if (req.method === 'GET') {
    const tradfri = await connection.getConnection();

    // Retrieve relevant information from device
    const getDevice = (device) => {
      switch (device.type) {
        case 0: // remote
          if (device.alive === false) break;
          deviceList.push({
            id: device.instanceId,
            type: 'remote',
            name: device.name,
            battery: device.deviceInfo.battery
          });
          break;

        case 2: // light
          if (device.alive === false) break;
          let lightInfo = device.lightList[0];
          deviceList.push({
            id: device.instanceId,
            type: 'light',
            name: device.name,
            onOff: lightInfo.onOff,
            color: lightInfo.color,
            colorTemperature: lightInfo.colorTemperature,
            dimmer: lightInfo.dimmer
          });
          break;

        default:
          deviceList.push({
            id: device.instanceId,
            name: device.name,
            type: 'unknown type',
            description: `device type: ${device.type}`
          });
      }
    };

    // Get updated devices
    let deviceList = [];
    tradfri.on('device updated', getDevice).observeDevices();
    // Wait some time to observe for devices
    await delay(400);

    // Clean up
    tradfri.destroy();

    res.status(200).json(
      deviceList.sort((first, second) => {
        if (first.type < second.type) {
          return -1;
        }
        if (first.type > second.type) {
          return 1;
        }
        return 0;
      })
    );
  }
}
