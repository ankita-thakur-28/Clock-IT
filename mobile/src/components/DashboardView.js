import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../constants/theme';
import ProgressRing from './ProgressRing';
import WeeklyStrip from './WeeklyStrip';
import RoutineCard from './RoutineCard';
import BottomDock from './BottomDock';

export default function DashboardView({
  dashboardData,
  onUpdateRoutine,
  onBackToCountdown,
}) {
  const [activeTab, setActiveTab] = useState('today');

  const user = dashboardData?.user || { name: 'Ankita', goal: 'Tone & Sculpt' };
  const countdown = dashboardData?.countdown || {
    daysRemaining: 140,
    phaseTitle: 'Foundation Phase',
    progressPercentage: 12,
    subtitle: '140 days to your Big Day',
  };
  const streak = dashboardData?.streak || { streakText: '0d' };
  const weeklyStrip = dashboardData?.weeklyStrip || [];
  const todayGlow = dashboardData?.todayGlow || {
    completedCount: 0,
    totalCount: 4,
    weightCard: { logged: false, badge: 'Log AM', detail: 'Tap to record' },
    skincareCard: { amDone: false, badge: 'Start AM', detail: 'SPF & Vitamin C' },
    nutritionCard: { logged: false, badge: 'Log Meal', detail: '1,450 kcal · High Pro' },
    workoutCard: { completed: false, badge: 'Open →', detail: 'Glutes & Core · 40m' },
  };

  return (
    <View style={styles.container}>
      {/* Header Cluster */}
      <View style={styles.headerCluster}>
        <View>
          <Text style={styles.greetingTitle}>Hi, {user.name}</Text>
          <Text style={styles.greetingSubtitle}>{countdown.subtitle}</Text>
        </View>

        <View style={styles.headerRightCluster}>
          <View style={styles.streakPill}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={styles.streakText}>{streak.streakText}</Text>
          </View>
          <LinearGradient
            colors={['#FFE7D6', '#F5A8A0']}
            style={styles.avatarCircle}
          >
            <Text style={styles.avatarLetter}>
              {(user.name || 'A').charAt(0).toUpperCase()}
            </Text>
          </LinearGradient>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Countdown Hero Card */}
        <LinearGradient
          colors={['#FFFFFF', '#FFF8F4']}
          style={styles.countdownHeroCard}
        >
          <View style={styles.heroCardHeader}>
            <View style={styles.phaseBadgeContainer}>
              <Text style={styles.phaseBadgeText}>
                {(countdown.phaseTitle || 'FOUNDATION PHASE').toUpperCase()}
              </Text>
            </View>
            <Text style={styles.eventTargetText}>
              {user.milestoneDate || 'Jan 12, 2027'}
            </Text>
          </View>

          <View style={styles.heroCardBody}>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroDaysNumber}>{countdown.daysRemaining} Days</Text>
              <Text style={styles.heroGoalText}>
                Goal: {user.goal}{todayGlow.weightCard?.logged && todayGlow.weightCard?.weightAm != null ? ` · ${todayGlow.weightCard.weightAm} kg` : ''}
              </Text>
            </View>
            <ProgressRing percent={countdown.progressPercentage || 12} size={58} />
          </View>
        </LinearGradient>

        {/* Weekly Adherence Strip */}
        <WeeklyStrip days={weeklyStrip} />

        {/* Today's Glow Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Today's Glow</Text>
          <Text style={styles.sectionCounter}>
            {todayGlow.completedCount} of {todayGlow.totalCount} Complete
          </Text>
        </View>

        <View style={styles.routineGrid}>
          <View style={styles.routineRow}>
            <RoutineCard
              icon="⚖️"
              title="Weight Log"
              detail={todayGlow.weightCard?.detail || 'Tap to record'}
              badge={todayGlow.weightCard?.badge || 'Log AM'}
              completed={todayGlow.weightCard?.logged}
              onPress={() => onUpdateRoutine && onUpdateRoutine('weight')}
            />
            <View style={{ width: 10 }} />
            <RoutineCard
              icon="✨"
              title="Skincare Routine"
              detail={todayGlow.skincareCard?.detail || 'SPF & Vitamin C'}
              badge={todayGlow.skincareCard?.badge || 'Start AM'}
              completed={todayGlow.skincareCard?.amDone}
              onPress={() => onUpdateRoutine && onUpdateRoutine('skincare_am')}
            />
          </View>

          <View style={[styles.routineRow, { marginTop: 10 }]}>
            <RoutineCard
              icon="🥗"
              title="AI Nutrition"
              detail={todayGlow.nutritionCard?.detail || '1,450 kcal · High Pro'}
              badge={todayGlow.nutritionCard?.badge || 'Log Meal'}
              completed={todayGlow.nutritionCard?.logged}
              onPress={() => onUpdateRoutine && onUpdateRoutine('nutrition')}
            />
            <View style={{ width: 10 }} />
            <RoutineCard
              icon="🏋️‍♀️"
              title="AI Trainer Split"
              detail={todayGlow.workoutCard?.detail || 'Glutes & Core · 40m'}
              badge={todayGlow.workoutCard?.badge || 'Open →'}
              completed={todayGlow.workoutCard?.completed}
              onPress={() => onUpdateRoutine && onUpdateRoutine('workout')}
            />
          </View>
        </View>

        {onBackToCountdown && (
          <TouchableOpacity
            onPress={onBackToCountdown}
            style={styles.backLink}
            activeOpacity={0.7}
          >
            <Text style={styles.backLinkText}>← Back to Countdown</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <BottomDock activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  headerCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  greetingTitle: {
    fontFamily: THEME.fonts.displayBold,
    fontSize: 20,
    color: THEME.ink,
  },
  greetingSubtitle: {
    fontFamily: THEME.fonts.bodyMedium,
    fontSize: 12,
    color: THEME.roseGold,
    marginTop: 1,
  },
  headerRightCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE8ED',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#F8CAD5',
    gap: 3,
  },
  streakEmoji: {
    fontSize: 12,
  },
  streakText: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 11.5,
    color: THEME.pinkDeep,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    shadowColor: '#F195AC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarLetter: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 13,
    color: THEME.ink,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  countdownHeroCard: {
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F0E6DE',
    shadowColor: '#4A2C33',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
    marginBottom: 6,
  },
  heroCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  phaseBadgeContainer: {
    backgroundColor: '#FFF0F3',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#F8CAD5',
  },
  phaseBadgeText: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 9.5,
    letterSpacing: 0.8,
    color: THEME.pinkDeep,
  },
  eventTargetText: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 11.5,
    color: THEME.roseGold,
  },
  heroCardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroDaysNumber: {
    fontFamily: THEME.fonts.displayBold,
    fontSize: 26,
    color: THEME.ink,
    lineHeight: 30,
  },
  heroGoalText: {
    fontFamily: THEME.fonts.bodyMedium,
    fontSize: 11.5,
    color: THEME.inkSoft,
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontFamily: THEME.fonts.displayBold,
    fontSize: 15,
    color: THEME.ink,
  },
  sectionCounter: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 11,
    color: THEME.roseGold,
  },
  routineGrid: {
    marginBottom: 10,
  },
  routineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backLink: {
    alignItems: 'center',
    paddingVertical: 6,
    marginBottom: 6,
  },
  backLinkText: {
    fontFamily: THEME.fonts.bodySemiBold,
    fontSize: 12,
    color: THEME.roseGold,
  },
});
