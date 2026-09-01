import React from 'react';
import Svg, { Circle, Line, Defs, RadialGradient, Stop } from 'react-native-svg';

export default function ClockO({ size = 32, style }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
      <Defs>
        <RadialGradient id="cg" cx="35%" cy="30%" r="75%">
          <Stop offset="0%" stopColor="#FFE7D6" />
          <Stop offset="100%" stopColor="#F5A8A0" />
        </RadialGradient>
      </Defs>
      <Circle cx="50" cy="50" r="46" fill="url(#cg)" stroke="#C98C6B" strokeWidth="4" />
      <Line x1="50" y1="50" x2="50" y2="24" stroke="#4A2C33" strokeWidth="6" strokeLinecap="round" />
      <Line x1="50" y1="50" x2="70" y2="60" stroke="#4A2C33" strokeWidth="6" strokeLinecap="round" />
      <Circle cx="50" cy="50" r="6" fill="#4A2C33" />
    </Svg>
  );
}
