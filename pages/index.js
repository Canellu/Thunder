import { useState, useEffect } from 'react';
import Slider from './components/Slider';
import PowerIcon from '../public/svgs/power.svg';
export default function Home() {
  const [value, setValue] = useState(50);
  const glowColor = 'rgb(249 168 212 / 0.5)';
  useEffect(() => {
    handleChange(50);
  }, []);

  const handleChange = (value) => {
    setValue(value);
  };

  const handleClick = () => {
    value > 0 ? setValue(0) : setValue(50);
  };

  return (
    <div className='relative select-none'>
      <div
        id='glow'
        style={{
          boxShadow: `0 0 ${value / 4}px ${value / 5}px ${glowColor}`
        }}
        className='absolute -inset-0 rounded-md'
      />
      <div
        className={`relative shadow-md text-slate-600 tracking-wide bg-white/90 rounded-md p-6 w-80 flex flex-col items-center space-y-10`}
      >
        <div className='flex items-center justify-between w-full'>
          <span className='font-medium text-lg'>Hobbybord</span>
          <div
            onClick={handleClick}
            className='shadow-md hover:scale-110 cursor-pointer p-2 rounded-full transition-transform border duration-200 active:bg-slate-200'
          >
            {value > 0 ? (
              <PowerIcon className='text-2xl text-pink-600' />
            ) : (
              <PowerIcon className='text-2xl text-slate-400' />
            )}
          </div>
        </div>
        <div
          className={`font-bold text-2xl ${value > 0 ? '' : 'text-slate-400'}`}
        >
          {value}%
        </div>
        <Slider
          trackColor={'rgb(247, 149, 200)'}
          value={value}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
