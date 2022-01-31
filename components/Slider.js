import { useEffect, useState } from 'react';

const Slider = ({ value, onChange, className, trackColor }) => {
  const [trackPercentage, setTrackPercentage] = useState(0);

  const handleChange = (value) => {
    onChange(value);

    let trackValue = 0;
    if (value < 20) {
      trackValue = Number(value) + 5;
    } else if (value > 80) {
      trackValue = Number(value) - 5;
    } else {
      trackValue = value;
    }

    setTrackPercentage(trackValue);
  };

  useEffect(() => {
    handleChange(value);
  }, [value]);

  return (
    <div className='group relative w-full h-4 -mt-1'>
      <input
        style={{
          background: `linear-gradient(
          90deg,
          ${trackColor} ${trackPercentage}%,
          rgba(241 245 249) ${trackPercentage}%
          )`
        }}
        className={`appearance-none cursor-pointer h-full w-full shadow-inner rounded-full ${className}`}
        type='range'
        min='0'
        max='100'
        value={value}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};

export default Slider;
