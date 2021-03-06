import React, { useState, useEffect } from 'react';
import PowerIcon from '../public/svgs/power.svg';
import Slider from '../components/Slider';

const LightCard = ({ device, socket }) => {
  const [brightness, setBrightness] = useState(0);
  const [onOff, setOnOff] = useState(false);

  useEffect(() => {
    device.onOff ? setBrightness(Math.round(device.dimmer)) : setBrightness(0);
    setOnOff(device.onOff);
  }, [device]);

  // useEffect(() => {
  //   if (device.id === 65559)
  //     console.log(
  //       `Brightness: %c${brightness}`,
  //       'color: red; font-size: 16px; font-weight: bold;'
  //     );
  // }, [brightness]);

  //TODO: handle Brightness
  const handleChange = (value) => {
    setBrightness(value);
  };

  const handleRelease = (value) => {
    socket.emit(
      'setBrightness',
      { id: device.id, brightness: value },
      (message) => {
        console.log(message);
      }
    );
  };

  const handleClick = async () => {
    socket.emit('toggleDevice', { id: device.id }, (message) => {
      console.log(message);
    });
  };

  //TODO: make brightness not trigger all 3 times when changed from ThunderApp

  const handleDeviceUpdate = (updatedDevice) => {
    if (updatedDevice.id === device.id) {
      setOnOff(updatedDevice.onOff);
      updatedDevice.onOff
        ? setBrightness(Math.round(updatedDevice.dimmer).toString())
        : setBrightness(0);
    }
  };

  useEffect(() => {
    socket.on('updatedDevice', (device) => {
      handleDeviceUpdate(device);
    });

    return () => {
      socket.off('updatedDevice');
    };
  }, []);

  return (
    <div className='relative select-none'>
      <div
        style={{
          boxShadow: `0 0 ${brightness / 4}px ${brightness / 5}px #${
            device?.color
          }`
        }}
        className='absolute -inset-0 rounded-md'
      />
      <div
        className={`relative shadow-md text-slate-600 tracking-wide bg-white/90 rounded-md p-6 w-80 flex flex-col items-center space-y-10`}
      >
        <div className='flex items-center justify-between w-full'>
          <span className='font-medium text-lg'>{device?.name}</span>
          <div
            onClick={handleClick}
            className={`shadow-md hover:scale-110 cursor-pointer p-2 rounded-full transition-transform border duration-200 active:bg-slate-200`}
          >
            {onOff ? (
              <PowerIcon
                style={{ color: `#${device?.color}` }}
                className='text-2xl'
              />
            ) : (
              <PowerIcon className='text-2xl text-slate-400' />
            )}
          </div>
        </div>
        <div
          className={`font-bold text-2xl ${
            brightness > 0 ? '' : 'text-slate-400'
          }`}
        >
          {Math.round(brightness)}%
        </div>
        <Slider
          trackColor={`#${device?.color}`}
          value={brightness}
          onChange={handleChange}
          onRelease={handleRelease}
        />
      </div>
    </div>
  );
};

export default LightCard;
