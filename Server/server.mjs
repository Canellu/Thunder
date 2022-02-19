import connection from './ikea/connection.js';
import { Server } from 'socket.io';
import {
  deviceInfo,
  toggleDevice,
  setBrightness,
  setColor
} from './devices.js';

const io = new Server(3001, {
  cors: {
    origin: ['http://localhost:3000']
  }
});

io.on('connection', async (socket) => {
  let idList = [];

  console.log('A Client connected');
  const tradfri = await connection.getConnection();

  tradfri
    .on('device updated', (device) => emitUpdatedDevice(device, socket, idList))
    .observeDevices();

  socket.on('toggleDevice', ({ id }, callback) => {
    const { error, message } = toggleDevice(tradfri, id);

    if (error) return callback(error);
    callback(message);
    console.log('%s\x1b[36m%s\x1b[0m', 'Toggling device with id: ', id);
  });

  socket.on('setBrightness', ({ id, brightness }, callback) => {
    const { error, message } = setBrightness(tradfri, id, brightness);

    if (error) return callback(error);
    callback(message);
    console.log('%s\x1b[36m%s\x1b[0m', 'Toggling device with id: ', id);
  });

  socket.on('disconnect', () => {
    console.log('A client has disconnected');
    tradfri.destroy();
  });
});

const emitUpdatedDevice = (device, socket, idList) => {
  console.log(
    '%s\x1b[35m%s\x1b[0m%s',
    'Device with ',
    device.instanceId,
    ' updated.'
  );

  const updatedDevice = deviceInfo(device);
  if (idList.length == 0 && updatedDevice.alive) {
    idList.push(updatedDevice.id);
    socket.emit('newDevice', updatedDevice);
  } else {
    const exist = idList.find((id) => id == updatedDevice.id);
    if (!exist && updatedDevice.alive) {
      idList.push(updatedDevice.id);
      socket.emit('newDevice', updatedDevice);
    } else {
      socket.emit('updatedDevice', updatedDevice);
    }
  }
};
