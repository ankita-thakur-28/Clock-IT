import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../constants/theme';

export default function ProfileSettingsView({
  name = 'Glow Prepper',
  milestoneType = 'Milestone',
  milestoneDate,
  goal = 'Tone & Sculpt',
  daysRemaining = 0,
  phaseTitle = 'Foundation Phase',
  onEditMilestone,
  onResetMilestone,
}) {
  const [weightUnit, setWeightUnit] = useState('kg');
  const [activePreferences, setActivePreferences] = useState({
    weight: true,
    skincare: true,
    bodyCare: true,
    workout: true,
  });

  const togglePreference = (key) => {
    setActivePreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleResetPress = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to change your milestone?')) {
        onResetMilestone && onResetMilestone();
      }
    } else {
      Alert.alert(
        'Reset Milestone',
        'Are you sure you want to change your milestone and setup a new goal?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Reset', style: 'destructive', onPress: onResetMilestone },
        ]
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Screen Header */}
      <View style={styles.header}>
        <Text style={styles.headerOverline}>YOUR PROFILE & PREFERENCES</Text>
        <Text style={styles.headerTitle}>Account & Goals</Text>
      </View>

      {/* User Monogram Header Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarRing}>
          <LinearGradient
            colors={['#F5A671', '#EF7391']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarGradient}
          >
            <Text style={styles.avatarInitial}>{name.charAt(0).toUpperCase()}</Text>
          </LinearGradient>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{name}</Text>
          <Text style={styles.profileSubtext}>Countdown to your {milestoneType}</Text>
          <View style={styles.phaseBadge}>
            <Text style={styles.phaseBadgeText}>✦ {phaseTitle}</Text>
          </View>
        </View>
      </View>

      {/* Active Milestone Card */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Active Milestone</Text>
          <TouchableOpacity onPress={onEditMilestone} style={styles.editBtn} activeOpacity={0.7}>
            <Text style={styles.editBtnText}>Edit Date</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.milestoneBox}>
          <View style={styles.milestoneRow}>
            <Text style={styles.milestoneLabel}>Event Type</Text>
            <Text style={styles.milestoneValue}>{milestoneType}</Text>
          </View>
          <View style={styles.milestoneRow}>
            <Text style={styles.milestoneLabel}>Target Date</Text>
            <Text style={styles.milestoneValue}>{milestoneDate || 'January 15, 2027'}</Text>
          </View>
          <View style={styles.milestoneRow}>
            <Text style={styles.milestoneLabel}>Time Left</Text>
            <Text style={[styles.milestoneValue, styles.milestoneHighlight]}>
              {daysRemaining} Days Remaining
            </Text>
          </View>
        </View>
      </View>

      {/* Preferences & Units Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tracking Preferences</Text>
        <Text style={styles.cardSubtext}>Customize the routines shown on your dashboard</Text>

        <View style={styles.preferenceList}>
          {/* Weight */}
          <TouchableOpacity
            style={styles.preferenceRow}
            onPress={() => togglePreference('weight')}
            activeOpacity={0.8}
          >
            <View style={styles.preferenceLeft}>
              <Text style={styles.preferenceEmoji}>⚖️</Text>
              <Text style={styles.preferenceName}>Weight Tracker</Text>
            </View>
            <View style={[styles.checkboxBox, activePreferences.weight && styles.checkboxBoxActive]}>
              {activePreferences.weight && <Text style={styles.checkmarkText}>✓</Text>}
            </View>
          </TouchableOpacity>

          {/* Skincare */}
          <TouchableOpacity
            style={styles.preferenceRow}
            onPress={() => togglePreference('skincare')}
            activeOpacity={0.8}
          >
            <View style={styles.preferenceLeft}>
              <Text style={styles.preferenceEmoji}>🧖‍♀️</Text>
              <Text style={styles.preferenceName}>Skincare Rituals (AM/PM)</Text>
            </View>
            <View style={[styles.checkboxBox, activePreferences.skincare && styles.checkboxBoxActive]}>
              {activePreferences.skincare && <Text style={styles.checkmarkText}>✓</Text>}
            </View>
          </TouchableOpacity>

          {/* Hair & Body */}
          <TouchableOpacity
            style={styles.preferenceRow}
            onPress={() => togglePreference('bodyCare')}
            activeOpacity={0.8}
          >
            <View style={styles.preferenceLeft}>
              <Text style={styles.preferenceEmoji}>🧴</Text>
              <Text style={styles.preferenceName}>Body, Hair & Weekly Spa</Text>
            </View>
            <View style={[styles.checkboxBox, activePreferences.bodyCare && styles.checkboxBoxActive]}>
              {activePreferences.bodyCare && <Text style={styles.checkmarkText}>✓</Text>}
            </View>
          </TouchableOpacity>

          {/* Workout */}
          <TouchableOpacity
            style={styles.preferenceRow}
            onPress={() => togglePreference('workout')}
            activeOpacity={0.8}
          >
            <View style={styles.preferenceLeft}>
              <Text style={styles.preferenceEmoji}>🏋️‍♀️</Text>
              <Text style={styles.preferenceName}>AI Fitness & Workout Split</Text>
            </View>
            <View style={[styles.checkboxBox, activePreferences.workout && styles.checkboxBoxActive]}>
              {activePreferences.workout && <Text style={styles.checkmarkText}>✓</Text>}
            </View>
          </TouchableOpacity>
        </View>

        {/* Unit Preference Toggle */}
        <View style={styles.unitContainer}>
          <Text style={styles.unitLabel}>Preferred Weight Unit</Text>
          <View style={styles.unitToggleRow}>
            <TouchableOpacity
              style={[styles.unitBtn, weightUnit === 'kg' && styles.unitBtnActive]}
              onPress={() => setWeightUnit('kg')}
              activeOpacity={0.8}
            >
              <Text style={[styles.unitBtnText, weightUnit === 'kg' && styles.unitBtnTextActive]}>
                Kilograms (kg)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.unitBtn, weightUnit === 'lbs' && styles.unitBtnActive]}
              onPress={() => setWeightUnit('lbs')}
              activeOpacity={0.8}
            >
              <Text style={[styles.unitBtnText, weightUnit === 'lbs' && styles.unitBtnTextActive]}>
                Pounds (lbs)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Danger Zone / Reset */}
      <View style={[styles.card, styles.dangerCard]}>
        <Text style={styles.dangerTitle}>Milestone Journey</Text>
        <Text style={styles.dangerSubtext}>
          Start a new countdown or change your target celebration date.
        </Text>
        <TouchableOpacity
          onPress={handleResetPress}
          style={styles.resetBtn}
          activeOpacity={0.8}
        >
          <Text style={styles.resetBtnText}>Set Another Milestone</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 14,
  },
  headerOverline: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 10.5,
    letterSpacing: 1.4,
    color: THEME.inkSoft,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  headerTitle: {
    fontFamily: THEME.fonts.displayBold,
    fontSize: 26,
    color: THEME.ink,
    letterSpacing: 0.2,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.2,
    borderColor: '#F3E5DA',
    shadowColor: '#4A2C33',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 14,
    gap: 14,
  },
  avatarRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    padding: 2,
    backgroundColor: '#FDECE1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontFamily: THEME.fonts.displayBold,
    fontSize: 24,
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: THEME.fonts.displayBold,
    fontSize: 18,
    color: THEME.ink,
  },
  profileSubtext: {
    fontFamily: THEME.fonts.bodyRegular,
    fontSize: 12,
    color: '#9C7F77',
    marginTop: 2,
  },
  phaseBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF4EE',
    borderWidth: 1,
    borderColor: '#FBDBC8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 100,
    marginTop: 6,
  },
  phaseBadgeText: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 10,
    color: '#D98853',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.2,
    borderColor: '#F3E5DA',
    shadowColor: '#4A2C33',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardTitle: {
    fontFamily: THEME.fonts.displayBold,
    fontSize: 16,
    color: THEME.ink,
  },
  cardSubtext: {
    fontFamily: THEME.fonts.bodyRegular,
    fontSize: 11.5,
    color: '#9C7F77',
    marginTop: 2,
    marginBottom: 10,
  },
  editBtn: {
    backgroundColor: '#FAF3ED',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  editBtnText: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 11,
    color: '#D98853',
  },
  milestoneBox: {
    backgroundColor: '#FFF9F4',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F6E4D6',
    gap: 8,
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  milestoneLabel: {
    fontFamily: THEME.fonts.bodyRegular,
    fontSize: 12,
    color: '#9C7F77',
  },
  milestoneValue: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 13,
    color: THEME.ink,
  },
  milestoneHighlight: {
    color: '#D98853',
  },
  preferenceList: {
    gap: 8,
    marginBottom: 14,
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#FAF3EE',
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  preferenceEmoji: {
    fontSize: 18,
  },
  preferenceName: {
    fontFamily: THEME.fonts.bodySemiBold,
    fontSize: 13,
    color: THEME.ink,
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
    borderColor: '#D98853',
    backgroundColor: '#FDECE1',
  },
  checkmarkText: {
    color: '#D98853',
    fontSize: 13.5,
    fontWeight: '800',
    lineHeight: 15,
  },
  unitContainer: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F7EDE6',
  },
  unitLabel: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 12,
    color: THEME.ink,
    marginBottom: 8,
  },
  unitToggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  unitBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#FAF3ED',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1DECF',
  },
  unitBtnActive: {
    backgroundColor: '#FDECE1',
    borderColor: '#D98853',
  },
  unitBtnText: {
    fontFamily: THEME.fonts.bodySemiBold,
    fontSize: 12,
    color: '#9C7F77',
  },
  unitBtnTextActive: {
    fontFamily: THEME.fonts.bodyBold,
    color: '#D98853',
  },
  dangerCard: {
    backgroundColor: '#FFFAFA',
    borderColor: '#F8D8DC',
  },
  dangerTitle: {
    fontFamily: THEME.fonts.displayBold,
    fontSize: 15,
    color: THEME.ink,
  },
  dangerSubtext: {
    fontFamily: THEME.fonts.bodyRegular,
    fontSize: 11.5,
    color: '#A88085',
    marginTop: 2,
    marginBottom: 10,
  },
  resetBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#EF7391',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtnText: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 12.5,
    color: '#EF7391',
  },
});
