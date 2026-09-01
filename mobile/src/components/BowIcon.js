import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

export default function BowIcon({ size = 46, style }) {
  const height = (size * 30) / 46;
  return (
    <Svg width={size} height={height} viewBox="0 0 46 30" fill="none" style={style}>
      <Path
        d="M23 15 C23 15 15 4 6 6 C0 7.4 1 17 8 17.5 C15 18 23 15 23 15 Z"
        fill="#FFD9E0"
        stroke="#F195AC"
        strokeWidth="1.4"
      />
      <Path
        d="M23 15 C23 15 31 4 40 6 C46 7.4 45 17 38 17.5 C31 18 23 15 23 15 Z"
        fill="#FFD9E0"
        stroke="#F195AC"
        strokeWidth="1.4"
      />
      <Circle cx="23" cy="15" r="3.6" fill="#F195AC" />
    </Svg>
  );
}
