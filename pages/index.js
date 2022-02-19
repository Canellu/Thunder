import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import LightCard from '../components/LightCard';

export default function Home() {
  const [devices, setDevices] = useState([]);
  const [socket, setSocket] = useState(null);
  useEffect(async () => {
    console.log('Creating socket...');
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);
    newSocket.on('connect', () => {
      console.log(newSocket.id);
    });

    newSocket.on('newDevice', (device) => {
      setDevices((prev) => [...prev, device]);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-20 gap-y-20'>
        {devices.map((device) => {
          if (device?.type == 'light') {
            return (
              <LightCard key={device.id} device={device} socket={socket} />
            );
          }
        })}
      </div>
    </div>
  );
}
