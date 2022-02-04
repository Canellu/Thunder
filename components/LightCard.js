import React, { useState, useEffect } from 'react';
import PowerIcon from '../public/svgs/power.svg';
import Slider from '../components/Slider';

const LightCard = ({ device }) => {
  const [ownDevice, setOwnDevice] = useState(null);
  const [brightness, setBrightness] = useState(0);
  const [onOff, setOnOff] = useState(false);

  useEffect(() => {
    setOwnDevice(device);
  }, []);

  useEffect(() => {
    setBrightness(ownDevice ? ownDevice.dimmer : 0);
    setOnOff(ownDevice ? ownDevice.onOff : false);
    console.log(ownDevice);
  }, [ownDevice]);

  const handleChange = (value) => {
    setBrightness(value);
  };

  const handleClick = async () => {
    await fetch('/api/devices', {
      method: 'POST',
      body: JSON.stringify({ id: device.id }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const response = await fetch('/api/devices');
    const devices = await response.json();
    console.log(devices);
  };

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
        />
      </div>
    </div>
  );
};

export default LightCard;