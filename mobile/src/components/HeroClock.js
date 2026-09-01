import React from 'react';
import { View, Platform } from 'react-native';
import Svg, {
  Circle,
  Path,
  Rect,
  Line,
  Text as SvgText,
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
  G,
  Ellipse,
} from 'react-native-svg';

export default function HeroClock({ phase = 'FOUNDATION', size = 220 }) {
  // Phase-adaptive hand angles (degrees)
  let hourAngle = 125;   // ~4:10
  let minuteAngle = 25;

  if (phase === 'BUILD') {
    hourAngle = 160;  // ~5:20
    minuteAngle = 120;
  } else if (phase === 'REFINE') {
    hourAngle = 210;  // ~7:40
    minuteAngle = 240;
  } else if (phase === 'ARRIVAL') {
    hourAngle = 270;  // ~9:00
    minuteAngle = 0;
  } else if (phase === 'MAINTENANCE') {
    hourAngle = 60;   // ~2:00
    minuteAngle = 0;
  }

  // Calculate numeral positions around radius 48
  const numerals = [
    { num: '12', x: 130, y: 104 },
    { num: '1',  x: 154, y: 110 },
    { num: '2',  x: 171, y: 128 },
    { num: '3',  x: 177, y: 153 },
    { num: '4',  x: 171, y: 177 },
    { num: '5',  x: 154, y: 195 },
    { num: '6',  x: 130, y: 201 },
    { num: '7',  x: 106, y: 195 },
    { num: '8',  x: 89,  y: 177 },
    { num: '9',  x: 83,  y: 153 },
    { num: '10', x: 89,  y: 128 },
    { num: '11', x: 106, y: 110 },
  ];

  const serifFont = Platform.OS === 'web' ? "'Playfair Display', Georgia, serif" : 'PlayfairDisplay_700Bold';

  return (
    <View style={{ width: size, height: (size * 260) / 240, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={(size * 260) / 240} viewBox="0 0 260 270">
        <Defs>
          {/* Gold Metallic Gradients */}
          <LinearGradient id="goldArch" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#F6DFB8" />
            <Stop offset="40%" stopColor="#D8A977" />
            <Stop offset="80%" stopColor="#B6804B" />
            <Stop offset="100%" stopColor="#F9E6C7" />
          </LinearGradient>

          <LinearGradient id="goldLeg" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#F4DDB5" />
            <Stop offset="50%" stopColor="#C9945F" />
            <Stop offset="100%" stopColor="#8C5C2E" />
          </LinearGradient>

          {/* Pink Bell Gradient */}
          <RadialGradient id="pinkBellGrad" cx="35%" cy="30%" r="75%">
            <Stop offset="0%" stopColor="#FFEAF1" />
            <Stop offset="45%" stopColor="#FFAEC2" />
            <Stop offset="90%" stopColor="#E67B96" />
            <Stop offset="100%" stopColor="#D46884" />
          </RadialGradient>

          {/* Main Clock Outer Body Gradient */}
          <RadialGradient id="clockBodyPink" cx="38%" cy="32%" r="75%">
            <Stop offset="0%" stopColor="#FFF2F6" />
            <Stop offset="50%" stopColor="#FFB3C7" />
            <Stop offset="92%" stopColor="#EE829D" />
            <Stop offset="100%" stopColor="#DB6D8A" />
          </RadialGradient>

          {/* Warm Ivory Dial Face */}
          <RadialGradient id="dialCream" cx="45%" cy="40%" r="70%">
            <Stop offset="0%" stopColor="#FFFEFC" />
            <Stop offset="60%" stopColor="#FFF9F1" />
            <Stop offset="95%" stopColor="#F8EAD8" />
            <Stop offset="100%" stopColor="#EAD6C0" />
          </RadialGradient>

          {/* Inner Bezel Gold Ring */}
          <LinearGradient id="goldBezel" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#F8E8CD" />
            <Stop offset="30%" stopColor="#DCAE7D" />
            <Stop offset="70%" stopColor="#AB7440" />
            <Stop offset="100%" stopColor="#F4DEC0" />
          </LinearGradient>
        </Defs>

        {/* 0. Soft Ground Shadow */}
        <Ellipse cx="130" cy="254" rx="76" ry="8" fill="rgba(196,120,140,0.22)" />

        {/* 1. Angled Gold Peg Feet */}
        {/* Left Foot */}
        <G>
          <Path
            d="M86 212 L66 244 L72 248 L92 216 Z"
            fill="url(#goldLeg)"
            stroke="#9E6838"
            strokeWidth="0.8"
          />
          <Circle cx="66" cy="246" r="4.8" fill="url(#goldArch)" stroke="#8C5C2E" strokeWidth="1" />
          <Rect x="83" y="209" width="10" height="4" rx="2" fill="#DCAE7D" stroke="#8C5C2E" strokeWidth="0.8" />
        </G>

        {/* Right Foot */}
        <G>
          <Path
            d="M174 212 L194 244 L188 248 L168 216 Z"
            fill="url(#goldLeg)"
            stroke="#9E6838"
            strokeWidth="0.8"
          />
          <Circle cx="194" cy="246" r="4.8" fill="url(#goldArch)" stroke="#8C5C2E" strokeWidth="1" />
          <Rect x="167" y="209" width="10" height="4" rx="2" fill="#DCAE7D" stroke="#8C5C2E" strokeWidth="0.8" />
        </G>

        {/* 2. Top Gold Arch Handle & Central Hammer */}
        {/* Arched Handle */}
        <Path
          d="M82 66 C82 22, 178 22, 178 66"
          fill="none"
          stroke="url(#goldArch)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <Path
          d="M83 66 C83 23.5, 177 23.5, 177 66"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeOpacity="0.6"
          strokeLinecap="round"
        />

        {/* Center Hammer */}
        <Rect x="127" y="60" width="6" height="18" rx="1.5" fill="url(#goldLeg)" stroke="#8C5C2E" strokeWidth="0.6" />
        <Rect x="120" y="55" width="20" height="6" rx="2.5" fill="url(#goldArch)" stroke="#8C5C2E" strokeWidth="0.8" />

        {/* 3. Twin Pink Bells */}
        {/* Left Bell Mount & Bell */}
        <G transform="translate(68, 76) rotate(-34)">
          <Rect x="-4" y="0" width="8" height="14" rx="2" fill="url(#goldLeg)" stroke="#8C5C2E" strokeWidth="0.6" />
          <Path
            d="M-28 -4 C-28 -28, 28 -28, 28 -4 C28 2, -28 2, -28 -4 Z"
            fill="url(#pinkBellGrad)"
            stroke="#C45874"
            strokeWidth="1.6"
          />
          {/* Bell gloss highlight */}
          <Path
            d="M-18 -10 C-18 -22, 14 -22, 18 -12"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeOpacity="0.75"
          />
          {/* Top Gold Cap Screw */}
          <Circle cx="0" cy="-18" r="3.6" fill="url(#goldArch)" stroke="#8C5C2E" strokeWidth="0.8" />
        </G>

        {/* Right Bell Mount & Bell */}
        <G transform="translate(192, 76) rotate(34)">
          <Rect x="-4" y="0" width="8" height="14" rx="2" fill="url(#goldLeg)" stroke="#8C5C2E" strokeWidth="0.6" />
          <Path
            d="M-28 -4 C-28 -28, 28 -28, 28 -4 C28 2, -28 2, -28 -4 Z"
            fill="url(#pinkBellGrad)"
            stroke="#C45874"
            strokeWidth="1.6"
          />
          {/* Bell gloss highlight */}
          <Path
            d="M-18 -12 C-14 -22, 18 -22, 18 -10"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeOpacity="0.75"
          />
          {/* Top Gold Cap Screw */}
          <Circle cx="0" cy="-18" r="3.6" fill="url(#goldArch)" stroke="#8C5C2E" strokeWidth="0.8" />
        </G>

        {/* 4. Main Clock Body & Layered Rims */}
        {/* Outer Soft Drop Shadow */}
        <Circle cx="130" cy="151" r="76" fill="#C9758B" opacity="0.3" />

        {/* Outer Pink Casing */}
        <Circle
          cx="130"
          cy="150"
          r="75"
          fill="url(#clockBodyPink)"
          stroke="#C45874"
          strokeWidth="2.2"
        />

        {/* Pink Gloss Shine Arc */}
        <Path
          d="M72 120 C85 86, 175 86, 188 120"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeOpacity="0.5"
          strokeLinecap="round"
        />

        {/* Inner Soft Pink Chamfer */}
        <Circle cx="130" cy="150" r="69" fill="#FFF0F4" stroke="#F195AC" strokeWidth="1.2" />

        {/* Metallic Gold Bezel */}
        <Circle
          cx="130"
          cy="150"
          r="65.5"
          fill="none"
          stroke="url(#goldBezel)"
          strokeWidth="2.8"
        />

        {/* Cream Watercolor Dial Face */}
        <Circle
          cx="130"
          cy="150"
          r="63.5"
          fill="url(#dialCream)"
          stroke="#D4A882"
          strokeWidth="0.8"
        />

        {/* Dial Perimeter Minute Track Dots */}
        <Circle cx="130" cy="150" r="59" fill="none" stroke="#D8B290" strokeWidth="0.6" strokeDasharray="1.5, 3.5" />

        {/* 5. Vintage Serif Numerals (1 to 12) */}
        {numerals.map(({ num, x, y }) => (
          <SvgText
            key={num}
            x={x}
            y={y}
            fill="#4A2C33"
            fontSize="12.5"
            fontFamily={serifFont}
            fontWeight="bold"
            textAnchor="middle"
          >
            {num}
          </SvgText>
        ))}

        {/* 6. Ornate Vintage Hands */}
        {/* Hour Hand (Ornate teardrop filigree) */}
        <G transform={`translate(130, 150) rotate(${hourAngle})`}>
          <Path
            d="M0 0 L-2.5 -14 C-5.5 -22, -1 -28, 0 -34 C1 -28, 5.5 -22, 2.5 -14 Z"
            fill="#4A2C33"
            stroke="#C98C6B"
            strokeWidth="0.8"
          />
          <Circle cx="0" cy="-22" r="2" fill="#FFEFE2" />
        </G>

        {/* Minute Hand (Slender spade filigree) */}
        <G transform={`translate(130, 150) rotate(${minuteAngle})`}>
          <Path
            d="M0 0 L-2 -18 C-4 -30, -0.8 -40, 0 -48 C0.8 -40, 4 -30, 2 -18 Z"
            fill="#4A2C33"
            stroke="#C98C6B"
            strokeWidth="0.8"
          />
          <Circle cx="0" cy="-32" r="1.6" fill="#FFEFE2" />
        </G>

        {/* Center Cap Pivot */}
        <Circle cx="130" cy="150" r="5.5" fill="url(#goldArch)" stroke="#8C5C2E" strokeWidth="0.8" />
        <Circle cx="130" cy="150" r="2.4" fill="#4A2C33" />
        <Circle cx="129" cy="149" r="0.8" fill="#FFFFFF" />
      </Svg>
    </View>
  );
}
