import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../../constants/theme';

const skincareGirlImg = require('../../../assets/skincare_girl.png');

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

const ROUTINES = {
  am: {
    label: 'Morning',
    icon: '☀️',
    steps: [
      { key: 'cleanse', title: 'Gentle Cleanser', tag: 'Cleanse' },
      { key: 'vitc', title: 'Serum', tag: 'Brighten' },
      { key: 'moisturize', title: 'Ceramide Moisturizer', tag: 'Hydrate' },
      { key: 'spf', title: 'SPF 50+ Sunscreen', tag: 'Protect' },
    ],
  },
  pm: {
    label: 'Night',
    icon: '🌙',
    steps: [
      { key: 'double-cleanse', title: 'Double Cleanse', tag: 'Purify' },
      { key: 'ha', title: 'Night Serum', tag: 'Repair' },
      { key: 'night-cream', title: 'Night Cream', tag: 'Nourish' },
      { key: 'eye', title: 'Eye Elixir', tag: 'Revive' },
    ],
  },
};

export default function SkincareRoutineModal({
  visible,
  initialAmDone = false,
  initialPmDone = false,
  onSave,
  onClose,
}) {
  const [tab, setTab] = useState('am');
  const [checked, setChecked] = useState({
    cleanse: false,
    vitc: false,
    moisturize: false,
    spf: false,
    'double-cleanse': false,
    ha: false,
    'night-cream': false,
    eye: false,
  });

  useEffect(() => {
    if (visible) {
      setChecked({
        cleanse: !!initialAmDone,
        vitc: !!initialAmDone,
        moisturize: !!initialAmDone,
        spf: !!initialAmDone,
        'double-cleanse': !!initialPmDone,
        ha: !!initialPmDone,
        'night-cream': !!initialPmDone,
        eye: !!initialPmDone,
      });
      setTab('am');
    }
  }, [visible, initialAmDone, initialPmDone]);

  const toggle = (key) => setChecked((c) => ({ ...c, [key]: !c[key] }));

  const active = ROUTINES[tab];

  const amDone = ROUTINES.am.steps.filter((s) => checked[s.key]).length;
  const pmDone = ROUTINES.pm.steps.filter((s) => checked[s.key]).length;
  const totalDone = amDone + pmDone;

  const handleConfirm = () => {
    if (onSave) {
      onSave({
        amDone: amDone > 0,
        pmDone: pmDone > 0,
        amCount: amDone,
        pmCount: pmDone,
        totalDone,
        isAmComplete: amDone === 4,
        isPmComplete: pmDone === 4,
      });
    }
    if (onClose) {
      onClose();
    }
  };

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
              <Text style={styles.badgeText}>SKINCARE GLOW</Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Hero Large Avatar */}
          <View style={styles.centeredAvatarContainer}>
            <View style={styles.avatarContainer}>
              <Image
                source={skincareGirlImg}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            </View>
          </View>

          {/* Compact Tabs */}
          <View style={styles.tabContainer}>
            {['am', 'pm'].map((key) => {
              const r = ROUTINES[key];
              const isActive = tab === key;
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => setTab(key)}
                  activeOpacity={0.8}
                  style={[
                    styles.tabBtn,
                    isActive && styles.tabBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabBtnText,
                      isActive && styles.tabBtnTextActive,
                    ]}
                  >
                    {r.icon} {r.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Compact Minimalist Checklist with Concentric Double-Ring Selector */}
          <View style={styles.checklistContainer}>
            {active.steps.map((s) => {
              const done = checked[s.key];
              return (
                <TouchableOpacity
                  key={s.key}
                  onPress={() => toggle(s.key)}
                  activeOpacity={0.8}
                  style={styles.stepCard}
                >
                  {/* Minimalist Bisque Squircle Checkbox with Terracotta Checkmark */}
                  <View
                    style={[
                      styles.checkboxBox,
                      done && styles.checkboxBoxActive,
                    ]}
                  >
                    {done && (
                      <Text style={styles.checkmarkText}>✓</Text>
                    )}
                  </View>

                  <Text style={styles.stepTitle} numberOfLines={1} ellipsizeMode="tail">
                    {s.title}
                  </Text>

                  <View style={styles.stepTagPill}>
                    <Text style={styles.stepTagText}>{s.tag}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Save Action CTA */}
          <TouchableOpacity
            onPress={handleConfirm}
            activeOpacity={0.88}
            style={styles.saveBtnWrapper}
          >
            <LinearGradient
              colors={[T.ctaFrom, T.ctaTo]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.saveBtn}
            >
              <Text style={styles.saveBtnText}>Save</Text>
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
    width: 360,
    maxWidth: '100%',
    minHeight: 505,
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    paddingTop: 18,
    paddingBottom: 20,
    paddingHorizontal: 20,
    shadowColor: 'rgba(59, 38, 32, 0.35)',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.35,
    shadowRadius: 40,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#FADDD0',
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
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
  centeredAvatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: T.badgeBg,
    borderWidth: 3,
    borderColor: '#FADDD0',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(217, 136, 83, 0.25)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8F1EA',
    borderRadius: 999,
    padding: 3,
    marginBottom: 12,
    alignSelf: 'center',
    width: 220,
    maxWidth: '85%',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 5.5,
    paddingHorizontal: 8,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    borderColor: T.terracotta,
    shadowColor: 'rgba(217, 136, 83, 0.35)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  tabBtnText: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 11.5,
    fontWeight: '600',
    color: T.muted,
  },
  tabBtnTextActive: {
    color: T.terracotta,
  },
  checklistContainer: {
    height: 204,
    gap: 8,
    marginBottom: 14,
  },
  stepCard: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: T.line,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#E6D7CC',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF5F0',
  },
  checkboxBoxActive: {
    borderColor: T.terracotta,
    backgroundColor: T.badgeBg,
  },
  checkmarkText: {
    color: T.terracotta,
    fontSize: 13.5,
    fontWeight: '800',
    lineHeight: 15,
  },
  stepTitle: {
    flex: 1,
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 12.5,
    fontWeight: '600',
    color: T.ink,
  },
  stepTagPill: {
    backgroundColor: T.badgeBg,
    paddingVertical: 2.5,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  stepTagText: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 9.5,
    fontWeight: '600',
    color: T.terracotta,
  },
  saveBtnWrapper: {
    borderRadius: 999,
    shadowColor: 'rgba(239, 115, 145, 0.55)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 4,
  },
  saveBtn: {
    height: 48,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
});
