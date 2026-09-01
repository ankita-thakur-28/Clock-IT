import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  PanResponder,
  Platform,
} from 'react-native';
import Svg, { Line, Polygon, Text as SvgText } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../../constants/theme';

/* Pulled directly from CLOCK-IT-DESIGN-SYSTEM.md */
const T = {
  bgTop: '#FCE7D4',
  bgBottom: '#F9D6DE',
  ink: '#3B2620',
  inkSoft: '#6B5750',
  muted: '#A6928A',
  line: '#F1DECF',
  terracotta: '#D98853',
  badgeBg: '#FDECE1',
  ctaFrom: '#F5A671',
  ctaTo: '#EF7391',
};

export default function WeightLogModal({
  visible,
  currentWeight = 54.5,
  initialUnit = 'kg',
  onSave,
  onClose,
}) {
  const initialSafeWeight = currentWeight != null ? currentWeight : 54.5;
  const [weight, setWeight] = useState(initialSafeWeight);
  const [unit, setUnit] = useState(initialUnit || 'kg');

  const effectiveWeight = weight != null ? weight : (currentWeight != null ? currentWeight : 54.5);

  const weightRef = useRef(effectiveWeight);
  const startWeightRef = useRef(effectiveWeight);

  useEffect(() => {
    weightRef.current = effectiveWeight;
  }, [effectiveWeight]);

  useEffect(() => {
    if (visible) {
      const start = currentWeight != null ? currentWeight : 54.5;
      setWeight(start);
      setUnit(initialUnit || 'kg');
      weightRef.current = start;
    }
  }, [visible, currentWeight, initialUnit]);

  // Interactive Timeline PanResponder (Video-timeline style draggable ruler)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        startWeightRef.current = weightRef.current;
      },
      onPanResponderMove: (evt, gestureState) => {
        // Dragging right pulls higher numbers into place (dx > 0 increases weight)
        // 16px per 0.1 weight (160px = 1.0 unit)
        const delta = gestureState.dx / 160;
        const newWeight = Math.max(
          20,
          Math.min(300, Math.round(((startWeightRef.current || 54.5) + delta) * 10) / 10)
        );
        setWeight(newWeight);
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  const handleUnitToggle = (newUnit) => {
    if (newUnit === unit) return;
    const cur = effectiveWeight;
    if (newUnit === 'lbs') {
      const converted = Math.round(cur * 2.20462 * 10) / 10;
      setWeight(converted);
    } else {
      const converted = Math.round((cur / 2.20462) * 10) / 10;
      setWeight(converted);
    }
    setUnit(newUnit);
  };

  const adjustWeight = (delta) => {
    const cur = effectiveWeight;
    const updated = Math.max(
      20,
      Math.min(300, Math.round((cur + delta) * 10) / 10)
    );
    setWeight(updated);
  };

  const handleConfirm = () => {
    if (onSave) {
      onSave(effectiveWeight, unit);
    }
    if (onClose) {
      onClose();
    }
  };

  // Generate dynamic ticks around current weight
  const RULER_WIDTH = 280;
  const CENTER_X = RULER_WIDTH / 2; // 140
  const TICK_SPACING_PER_POINT = 160; // 16px per 0.1

  const centerK = Math.round(effectiveWeight * 10);
  const ticks = [];
  for (let k = centerK - 10; k <= centerK + 10; k++) {
    const val = k / 10;
    const x = CENTER_X + (val - effectiveWeight) * TICK_SPACING_PER_POINT;
    if (x >= -12 && x <= RULER_WIDTH + 12) {
      const isMajor = k % 10 === 0;
      const isHalf = k % 5 === 0;
      ticks.push({
        k,
        val,
        x,
        isMajor,
        isHalf,
        height: isMajor ? 20 : isHalf ? 14 : 8,
        strokeColor: isMajor ? T.terracotta : isHalf ? '#E8BF9E' : T.line,
        strokeWidth: isMajor ? 1.8 : isHalf ? 1.3 : 1,
      });
    }
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.backdropTouch}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.modalCard}>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <View style={styles.badgePill}>
              <Text style={styles.badgeText}>WEIGHT TRACKER</Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Title */}
          <Text style={styles.titleText}>Log Your Weight</Text>

          {/* Unit Switcher */}
          <View style={styles.unitToggleContainer}>
            <TouchableOpacity
              style={[styles.unitBtn, unit === 'kg' && styles.unitBtnActive]}
              onPress={() => handleUnitToggle('kg')}
              activeOpacity={0.8}
            >
              <Text style={[styles.unitBtnText, unit === 'kg' && styles.unitBtnTextActive]}>
                KG
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.unitBtn, unit === 'lbs' && styles.unitBtnActive]}
              onPress={() => handleUnitToggle('lbs')}
              activeOpacity={0.8}
            >
              <Text style={[styles.unitBtnText, unit === 'lbs' && styles.unitBtnTextActive]}>
                LBS
              </Text>
            </TouchableOpacity>
          </View>

          {/* Hero Digital Stepper Display */}
          <View style={styles.stepperContainer}>
            {/* Minus Button */}
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => adjustWeight(-0.1)}
              activeOpacity={0.7}
            >
              <Text style={styles.stepBtnText}>–</Text>
            </TouchableOpacity>

            {/* Central Number Display */}
            <View style={styles.numberDisplay}>
              <Text style={styles.weightNumber}>
                {effectiveWeight.toFixed(1)}
              </Text>
              <Text style={styles.weightUnit}>{unit}</Text>
            </View>

            {/* Plus Button */}
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => adjustWeight(0.1)}
              activeOpacity={0.7}
            >
              <Text style={styles.stepBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Interactive Draggable Timeline Ruler */}
          <View style={styles.interactiveRulerWrapper} {...panResponder.panHandlers}>
            <Svg width={RULER_WIDTH} height="42" viewBox={`0 0 ${RULER_WIDTH} 42`}>
              {/* Moving Ruler Ticks & Number Labels */}
              {ticks.map((t) => (
                <React.Fragment key={t.k}>
                  <Line
                    x1={t.x}
                    y1={0}
                    x2={t.x}
                    y2={t.height}
                    stroke={t.strokeColor}
                    strokeWidth={t.strokeWidth}
                    strokeLinecap="round"
                  />
                  {t.isMajor && (
                    <SvgText
                      x={t.x}
                      y={36}
                      fontSize="10"
                      fontFamily={THEME.fonts.bodyBold}
                      fill={T.muted}
                      textAnchor="middle"
                    >
                      {Math.round(t.val)}
                    </SvgText>
                  )}
                </React.Fragment>
              ))}

              {/* Fixed Center Playhead (Pointer & Needle) */}
              <Line
                x1={CENTER_X}
                y1={0}
                x2={CENTER_X}
                y2={25}
                stroke={T.ctaTo}
                strokeWidth={2.5}
                strokeLinecap="round"
              />
              <Polygon
                points={`${CENTER_X - 4},0 ${CENTER_X + 4},0 ${CENTER_X},6`}
                fill={T.ctaTo}
              />
            </Svg>

            {/* Left & Right Gradient Fades for Smooth Vignette */}
            <LinearGradient
              colors={['#FFFFFF', 'rgba(255,255,255,0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.fadeOverlayLeft}
              pointerEvents="none"
            />
            <LinearGradient
              colors={['rgba(255,255,255,0)', '#FFFFFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.fadeOverlayRight}
              pointerEvents="none"
            />
          </View>

          {/* Quick Adjustment Delta Chips */}
          <View style={styles.chipsRow}>
            {[-0.5, -0.1, 0.1, 0.5].map((delta, i) => (
              <TouchableOpacity
                key={i}
                style={styles.chipBtn}
                onPress={() => adjustWeight(delta)}
                activeOpacity={0.75}
              >
                <Text style={styles.chipText}>
                  {delta > 0 ? `+${delta}` : delta}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Save Action Button */}
          <TouchableOpacity
            onPress={handleConfirm}
            activeOpacity={0.88}
            style={styles.confirmBtnWrapper}
          >
            <LinearGradient
              colors={[T.ctaFrom, T.ctaTo]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.confirmBtn}
            >
              <Text style={styles.confirmBtnText}>Save</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(59, 38, 32, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  backdropTouch: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    width: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#FADDD0',
    shadowColor: 'rgba(59, 38, 32, 0.35)',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.35,
    shadowRadius: 40,
    elevation: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  badgePill: {
    backgroundColor: T.badgeBg,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeText: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: T.terracotta,
  },
  closeBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F5EEE9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 13,
    color: T.muted,
    fontWeight: 'bold',
  },
  titleText: {
    fontFamily: THEME.fonts.displayBold,
    fontSize: 18,
    color: T.ink,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 12,
  },
  unitToggleContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#F8F1EA',
    borderRadius: 999,
    padding: 3,
    marginBottom: 14,
  },
  unitBtn: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  unitBtnActive: {
    backgroundColor: '#FFFFFF',
    borderColor: T.terracotta,
    shadowColor: 'rgba(217, 136, 83, 0.35)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  unitBtnText: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 11,
    fontWeight: '600',
    color: T.muted,
  },
  unitBtnTextActive: {
    color: T.terracotta,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 8,
  },
  stepBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: T.badgeBg,
    borderWidth: 1.5,
    borderColor: T.line,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(217, 136, 83, 0.25)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  stepBtnText: {
    fontSize: 22,
    color: T.terracotta,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  numberDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  weightNumber: {
    fontFamily: THEME.fonts.displayBold,
    fontSize: 42,
    color: T.ink,
    lineHeight: 46,
  },
  weightUnit: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 12,
    color: T.terracotta,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: -2,
  },
  interactiveRulerWrapper: {
    width: 280,
    height: 44,
    alignSelf: 'center',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    ...(Platform.OS === 'web' ? { cursor: 'ew-resize', userSelect: 'none' } : {}),
  },
  fadeOverlayLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 32,
  },
  fadeOverlayRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 32,
  },
  chipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  chipBtn: {
    backgroundColor: T.badgeBg,
    borderWidth: 1,
    borderColor: T.line,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  chipText: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 10.5,
    color: T.terracotta,
    fontWeight: '600',
  },
  confirmBtnWrapper: {
    borderRadius: 999,
    shadowColor: 'rgba(239, 115, 145, 0.55)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 4,
  },
  confirmBtn: {
    height: 48,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
});
