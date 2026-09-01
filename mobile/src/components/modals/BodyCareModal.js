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

const hairGirlImg = require('../../../assets/hair_girl_cropped.png');
const bathTubImg = require('../../../assets/bath_tub_fitted.png');
const weeklySpaImg = require('../../../assets/weekly_spa.png');

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
  body: {
    label: 'Body',
    steps: [
      { key: 'brushing', title: 'Dry Brushing', tag: 'Circulate' },
      { key: 'scrub', title: 'Body Scrub', tag: 'Smooth' },
      { key: 'butter', title: 'Nourishing Butter', tag: 'Hydrate' },
      { key: 'toneoil', title: 'Firming Tone Oil', tag: 'Firm & Glow' },
    ],
  },
  hair: {
    label: 'Hair',
    steps: [
      { key: 'scalp-massage', title: 'Rosemary Scalp Oil', tag: 'Stimulate' },
      { key: 'wash', title: 'Gentle Scalp Wash', tag: 'Cleanse' },
      { key: 'hairmask', title: 'Deep Hair Mask', tag: 'Repair' },
      { key: 'serum', title: 'Argan Gloss Serum', tag: 'Gloss' },
    ],
  },
  weekly: {
    label: 'Weekly',
    steps: [
      { key: 'detan', title: 'Weekly De-Tan', tag: 'De-Tan' },
      { key: 'homemask', title: 'Homemade Mask', tag: 'Nourish' },
      { key: 'shaving', title: 'Shaving & Prep', tag: 'Smooth' },
      { key: 'nailcare', title: 'Nail & Cuticle Oil', tag: 'Nails' },
    ],
  },
};

export default function BodyCareModal({
  visible,
  initialBodyDone = false,
  initialHairDone = false,
  onSave,
  onClose,
}) {
  const [tab, setTab] = useState('body'); // 'body' | 'hair' | 'weekly'
  const [checked, setChecked] = useState({
    brushing: false,
    scrub: false,
    butter: false,
    toneoil: false,
    'scalp-massage': false,
    wash: false,
    hairmask: false,
    serum: false,
    detan: false,
    homemask: false,
    shaving: false,
    nailcare: false,
  });

  useEffect(() => {
    if (visible) {
      setChecked({
        brushing: !!initialBodyDone,
        scrub: !!initialBodyDone,
        butter: !!initialBodyDone,
        toneoil: !!initialBodyDone,
        'scalp-massage': !!initialHairDone,
        wash: !!initialHairDone,
        hairmask: !!initialHairDone,
        serum: !!initialHairDone,
        detan: false,
        homemask: false,
        shaving: false,
        nailcare: false,
      });
      setTab('body');
    }
  }, [visible, initialBodyDone, initialHairDone]);

  const toggle = (key) => setChecked((c) => ({ ...c, [key]: !c[key] }));

  const active = ROUTINES[tab];

  const bodyDone = ROUTINES.body.steps.filter((s) => checked[s.key]).length;
  const hairDone = ROUTINES.hair.steps.filter((s) => checked[s.key]).length;
  const weeklyDone = ROUTINES.weekly.steps.filter((s) => checked[s.key]).length;
  const totalDone = bodyDone + hairDone + weeklyDone;

  const handleConfirm = () => {
    if (onSave) {
      onSave({
        bodyDone: bodyDone > 0,
        hairDone: hairDone > 0,
        weeklyDone: weeklyDone > 0,
        completed: totalDone > 0,
        bodyCount: bodyDone,
        hairCount: hairDone,
        weeklyCount: weeklyDone,
        totalDone,
        isBodyComplete: bodyDone === 4,
        isHairComplete: hairDone === 4,
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
              <Text style={styles.badgeText}>BODY & HAIR GLOW</Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Centered Large Ritual Avatar / Icon Badge */}
          <View style={styles.centeredAvatarContainer}>
            <View style={styles.avatarContainer}>
              {tab === 'body' ? (
                <Image
                  source={bathTubImg}
                  style={styles.bathAvatarImage}
                  resizeMode="cover"
                />
              ) : tab === 'hair' ? (
                <Image
                  source={hairGirlImg}
                  style={styles.hairAvatarImage}
                  resizeMode="cover"
                />
              ) : (
                <Image
                  source={weeklySpaImg}
                  style={styles.weeklyAvatarImage}
                  resizeMode="cover"
                />
              )}
            </View>
          </View>

          {/* Compact 3-Tab Selector (Text Only) */}
          <View style={styles.tabContainer}>
            {['body', 'hair', 'weekly'].map((key) => {
              const r = ROUTINES[key];
              const isActive = tab === key;
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => setTab(key)}
                  activeOpacity={0.8}
                  style={[styles.tabBtn, isActive && styles.tabBtnActive]}
                >
                  <Text style={[styles.tabBtnText, isActive && styles.tabBtnTextActive]}>
                    {r.label}
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

          {/* Save Action Button */}
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
  bathAvatarImage: {
    width: 85,
    height: 85,
    borderRadius: 40,
  },
  hairAvatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  weeklyAvatarImage: {
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
    width: 260,
    maxWidth: '90%',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 5.5,
    paddingHorizontal: 6,
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
    fontSize: 12,
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
