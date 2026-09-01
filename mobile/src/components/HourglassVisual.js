import React from 'react';
import { View } from 'react-native';
import Svg, {
  Path,
  Rect,
  Circle,
  Ellipse,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  G,
  Line,
} from 'react-native-svg';

export default function HourglassVisual({ size = 150 }) {
  // Height to width ratio is ~1.4
  const width = size;
  const height = (size * 260) / 180;

  return (
    <View style={{ width, height, alignItems: 'center', justifyContent: 'center', marginVertical: 4 }}>
      <Svg width={width} height={height} viewBox="0 0 200 280">
        <Defs>
          {/* Pink Base / Cap Gradient */}
          <LinearGradient id="platePink" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FFF2F6" />
            <Stop offset="40%" stopColor="#FFC8D6" />
            <Stop offset="80%" stopColor="#F49CB3" />
            <Stop offset="100%" stopColor="#E47E97" />
          </LinearGradient>

          {/* Pillar Pink Gradient */}
          <LinearGradient id="pillarGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#FFEAF1" />
            <Stop offset="45%" stopColor="#FFAEC2" />
            <Stop offset="80%" stopColor="#E8829C" />
            <Stop offset="100%" stopColor="#CF6580" />
          </LinearGradient>

          {/* Glass Bulb Iridescent Reflection */}
          <LinearGradient id="glassIridescent" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#E8F4FD" stopOpacity="0.85" />
            <Stop offset="45%" stopColor="#FFF5F8" stopOpacity="0.35" />
            <Stop offset="80%" stopColor="#FFEAF1" stopOpacity="0.75" />
            <Stop offset="100%" stopColor="#E3F0FB" stopOpacity="0.85" />
          </LinearGradient>

          {/* Pink Sand Gradient */}
          <RadialGradient id="sandPink" cx="50%" cy="30%" r="70%">
            <Stop offset="0%" stopColor="#FFF6EE" />
            <Stop offset="40%" stopColor="#FFCCD8" />
            <Stop offset="85%" stopColor="#F593AB" />
            <Stop offset="100%" stopColor="#E2728D" />
          </RadialGradient>

          {/* Glow Star Gradient */}
          <LinearGradient id="starGlow" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="100%" stopColor="#F49CB3" />
          </LinearGradient>
        </Defs>

        {/* 0. Ambient Floating Sparkles & Hearts */}
        {/* Sparkle 4-point stars */}
        <G fill="url(#starGlow)">
          <Path d="M38 38 Q38 48 28 48 Q38 48 38 58 Q38 48 48 48 Q38 48 38 38 Z" />
          <Path d="M22 110 Q22 120 12 120 Q22 120 22 130 Q22 120 32 120 Q22 120 22 110 Z" />
          <Path d="M26 205 Q26 212 19 212 Q26 212 26 219 Q26 212 33 212 Q26 212 26 205 Z" />
          <Path d="M166 85 Q166 95 156 95 Q166 95 166 105 Q166 95 176 95 Q166 95 166 85 Z" />
          <Path d="M172 152 Q172 162 162 162 Q172 162 172 172 Q172 162 182 162 Q172 162 172 152 Z" />
          <Path d="M168 215 Q168 221 162 221 Q168 221 168 227 Q168 221 174 221 Q168 221 168 215 Z" />
        </G>

        {/* Floating Pink Hearts */}
        <Path
          d="M24 185 C24 181 21 178 17 178 C14 178 12 180 12 183 C12 187 17 193 24 197 C31 193 36 187 36 183 C36 180 34 178 31 178 C27 178 24 181 24 185 Z"
          fill="#FFB6C8"
          stroke="#F195AC"
          strokeWidth="0.8"
        />
        <Path
          d="M162 180 C162 177 159 175 156 175 C154 175 152 176 152 178 C152 181 156 185 162 188 C168 185 172 181 172 178 C172 176 170 175 168 175 C165 175 162 177 162 180 Z"
          fill="#FFB6C8"
          stroke="#F195AC"
          strokeWidth="0.8"
        />

        {/* 1. Base Ground Shadow */}
        <Ellipse cx="100" cy="265" rx="72" ry="7" fill="rgba(196,120,140,0.22)" />

        {/* 2. Glass Hourglass Bulbs Outer Body */}
        <Path
          d="M62 68 C62 68 62 115 90 138 C94 141 96 143 96 145 C96 147 94 149 90 152 C62 175 62 222 62 222 L138 222 C138 222 138 175 110 152 C106 149 104 147 104 145 C104 143 106 141 110 138 C138 115 138 68 138 68 Z"
          fill="url(#glassIridescent)"
          stroke="#B4D7EE"
          strokeWidth="1.8"
        />

        {/* 3. Sand Inside Bulbs */}
        {/* Top Bulb Sand */}
        <Path
          d="M68 94 C80 84 120 84 132 94 C132 94 130 120 106 138 C103 140 100 143 100 145 C100 143 97 140 94 138 C70 120 68 94 68 94 Z"
          fill="url(#sandPink)"
          opacity="0.95"
        />
        {/* Top sand shine wave */}
        <Path
          d="M70 94 C82 86 118 86 130 94"
          fill="none"
          stroke="#FFFDFB"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeOpacity="0.9"
        />

        {/* Center Trickling Sand Stream */}
        <Line x1="100" y1="140" x2="100" y2="204" stroke="#FFFDFB" strokeWidth="2.5" strokeLinecap="round" />
        <Line x1="100" y1="140" x2="100" y2="198" stroke="#FFAEC2" strokeWidth="1.4" />

        {/* Bottom Bulb Sand Mound */}
        <Path
          d="M66 220 C66 220 70 196 100 182 C130 196 134 220 134 220 Z"
          fill="url(#sandPink)"
          opacity="0.96"
        />
        {/* Bottom sand shine highlight */}
        <Path
          d="M78 214 C90 194 110 194 122 214"
          fill="none"
          stroke="#FFFDFB"
          strokeWidth="2"
          strokeOpacity="0.85"
          strokeLinecap="round"
        />

        {/* 4. Glass Specular Highlights & Glare */}
        {/* Top Bulb Glass Glare */}
        <Path
          d="M72 74 C66 84 66 100 74 116"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeOpacity="0.75"
        />
        <Circle cx="80" cy="80" r="3" fill="#FFFFFF" fillOpacity="0.85" />

        {/* Bottom Bulb Glass Glare */}
        <Path
          d="M72 174 C66 186 66 204 74 216"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeOpacity="0.75"
        />
        <Circle cx="80" cy="180" r="3" fill="#FFFFFF" fillOpacity="0.85" />

        {/* Sparkle stars inside glass */}
        <Path d="M120 90 Q120 95 115 95 Q120 95 120 100 Q120 95 125 95 Q120 95 120 90 Z" fill="#FFFFFF" fillOpacity="0.9" />
        <Path d="M118 175 Q118 180 113 180 Q118 180 118 185 Q118 180 123 180 Q118 180 118 175 Z" fill="#FFFFFF" fillOpacity="0.9" />

        {/* 5. Turned Side Pillars */}
        {/* Left Pillar */}
        <Rect x="50" y="60" width="8" height="166" rx="4" fill="url(#pillarGrad)" stroke="#C86A82" strokeWidth="0.8" />
        <Circle cx="54" cy="64" r="6" fill="url(#platePink)" stroke="#C86A82" strokeWidth="0.8" />
        <Circle cx="54" cy="135" r="7.5" fill="url(#platePink)" stroke="#C86A82" strokeWidth="0.8" />
        <Circle cx="54" cy="155" r="7.5" fill="url(#platePink)" stroke="#C86A82" strokeWidth="0.8" />
        <Circle cx="54" cy="222" r="6" fill="url(#platePink)" stroke="#C86A82" strokeWidth="0.8" />
        <Circle cx="52" cy="133" r="2.2" fill="#FFFFFF" fillOpacity="0.8" />
        <Circle cx="52" cy="153" r="2.2" fill="#FFFFFF" fillOpacity="0.8" />

        {/* Right Pillar */}
        <Rect x="142" y="60" width="8" height="166" rx="4" fill="url(#pillarGrad)" stroke="#C86A82" strokeWidth="0.8" />
        <Circle cx="146" cy="64" r="6" fill="url(#platePink)" stroke="#C86A82" strokeWidth="0.8" />
        <Circle cx="146" cy="135" r="7.5" fill="url(#platePink)" stroke="#C86A82" strokeWidth="0.8" />
        <Circle cx="146" cy="155" r="7.5" fill="url(#platePink)" stroke="#C86A82" strokeWidth="0.8" />
        <Circle cx="146" cy="222" r="6" fill="url(#platePink)" stroke="#C86A82" strokeWidth="0.8" />
        <Circle cx="144" cy="133" r="2.2" fill="#FFFFFF" fillOpacity="0.8" />
        <Circle cx="144" cy="153" r="2.2" fill="#FFFFFF" fillOpacity="0.8" />

        {/* 6. Top & Bottom Plates */}
        {/* Top Plate */}
        <Rect
          x="36"
          y="42"
          width="128"
          height="22"
          rx="11"
          fill="url(#platePink)"
          stroke="#C86A82"
          strokeWidth="1.2"
        />
        <Path
          d="M48 48 C60 45 130 45 152 48"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeOpacity="0.85"
        />
        <Circle cx="46" cy="53" r="3.2" fill="#FFEAF1" stroke="#C86A82" strokeWidth="0.6" />
        <Circle cx="154" cy="53" r="3.2" fill="#FFEAF1" stroke="#C86A82" strokeWidth="0.6" />

        {/* Bottom Plate */}
        <Rect
          x="36"
          y="222"
          width="128"
          height="24"
          rx="12"
          fill="url(#platePink)"
          stroke="#C86A82"
          strokeWidth="1.2"
        />
        <Path
          d="M48 228 C60 226 130 226 152 228"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeOpacity="0.85"
        />
        <Circle cx="46" cy="234" r="3.2" fill="#FFEAF1" stroke="#C86A82" strokeWidth="0.6" />
        <Circle cx="154" cy="234" r="3.2" fill="#FFEAF1" stroke="#C86A82" strokeWidth="0.6" />
      </Svg>
    </View>
  );
}
