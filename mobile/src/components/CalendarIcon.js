import React from 'react';
import Svg, { Rect, Line, Circle, Path } from 'react-native-svg';

export default function CalendarIcon({ size = 22, color = '#C98C6B', style }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Rect
        x="3"
        y="4"
        width="18"
        height="18"
        rx="4"
        stroke={color}
        strokeWidth="1.8"
        fill="#FFF9F4"
      />
      <Line x1="3" y1="9" x2="21" y2="9" stroke={color} strokeWidth="1.5" />
      <Line x1="8" y1="2" x2="8" y2="5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Line x1="16" y1="2" x2="16" y2="5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Circle cx="8" cy="13" r="1.2" fill={color} />
      <Circle cx="12" cy="13" r="1.2" fill={color} />
      <Circle cx="16" cy="13" r="1.2" fill={color} />
      <Circle cx="8" cy="17" r="1.2" fill={color} />
      <Circle cx="12" cy="17" r="1.2" fill={color} />
      <Circle cx="16" cy="17" r="1.2" fill="#F195AC" />
    </Svg>
  );
}
