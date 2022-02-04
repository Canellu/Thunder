import { useState, useEffect } from 'react';
import LightCard from '../components/LightCard';

export default function Home() {
  const [devices, setDevices] = useState([]);
  useEffect(async () => {
    const response = await fetch('/api/devices');
    const devices = await response.json();
    setDevices(devices);
  }, []);

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-20 gap-y-20'>
        {devices.map((device) => {
          if (device.type == 'light') {
            return <LightCard key={device.id} device={device} />;
          }
        })}
      </div>
    </div>
  );
}
