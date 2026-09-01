import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../constants/theme';

export default function CalendarHistoryView({
  milestoneDate,
  milestoneType = 'Wedding',
  dashboard,
  userData,
  dailyLogsHistory = {},
  onOpenWeightModal,
  onOpenSkincareModal,
  onOpenBodyCareModal,
  onQuickTogglePastRoutine,
}) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(today);

  // Month navigation
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  // Calendar matrix computation
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarDays = [];
  // Trailing days from prev month
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarDays.push({
      date: new Date(year, month - 1, daysInPrevMonth - i),
      isCurrentMonth: false,
    });
  }
  // Days of current month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
    });
  }
  // Leading days of next month to fill grid
  const remaining = (7 - (calendarDays.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    calendarDays.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
    });
  }

  // Helpers
  const formatDateKey = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const parseMilestoneDate = () => {
    if (!milestoneDate) return null;
    const parts = milestoneDate.split('-');
    if (parts.length === 3) {
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    }
    return new Date(milestoneDate);
  };
  const targetDateObj = parseMilestoneDate();

  // Genuine per-day completion check backed by real dailyLogsHistory & todayGlow
  const isDateCompleted = (date) => {
    const dateKey = formatDateKey(date);
    if (isSameDay(date, today)) {
      const todayGlow = dashboard?.todayGlow;
      const todayLog = dailyLogsHistory[dateKey];
      return (todayGlow?.completedCount || 0) > 0 || (todayLog?.isDayActive || todayLog?.dayActive);
    }
    const log = dailyLogsHistory[dateKey];
    if (!log) return false;
    return Boolean(
      log.isDayActive ||
      log.dayActive ||
      log.weightAm != null ||
      log.skincareAmDone ||
      log.skincarePmDone ||
      log.workoutCompleted ||
      log.nutritionLogged ||
      (log.completedCount && log.completedCount > 0)
    );
  };

  // Compute real monthly adherence
  let elapsedDaysInMonth = 0;
  let activeDaysInMonth = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const checkDate = new Date(year, month, d);
    if (checkDate <= today) {
      elapsedDaysInMonth++;
      if (isDateCompleted(checkDate)) {
        activeDaysInMonth++;
      }
    }
  }
  const monthlyAdherencePercent = elapsedDaysInMonth > 0
    ? Math.round((activeDaysInMonth / elapsedDaysInMonth) * 100)
    : 0;

  const isSelectedToday = isSameDay(selectedDate, today);
  const selectedKey = formatDateKey(selectedDate);
  const selectedLog = dailyLogsHistory[selectedKey];
  const todayGlow = dashboard?.todayGlow || {};
  const isSelectedCompleted = isDateCompleted(selectedDate);

  // Formatted date title for inspector
  const formattedSelectedDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Extract real state per routine for selected date
  const isWeightDone = isSelectedToday
    ? Boolean(todayGlow.weightCard?.logged)
    : Boolean(selectedLog && selectedLog.weightAm != null);
  const weightValueText = isSelectedToday
    ? todayGlow.weightCard?.logged
      ? `${todayGlow.weightCard?.weightAm} kg recorded`
      : 'Tap to record'
    : selectedLog && selectedLog.weightAm != null
    ? `${selectedLog.weightAm} kg recorded`
    : 'Not logged';

  const isSkincareDone = isSelectedToday
    ? Boolean(todayGlow.skincareCard?.amDone)
    : Boolean(selectedLog && (selectedLog.skincareAmDone || selectedLog.skincarePmDone));
  const skincareValueText = isSelectedToday
    ? todayGlow.skincareCard?.amDone
      ? 'Morning routine completed'
      : 'SPF & Vitamin C pending'
    : selectedLog && (selectedLog.skincareAmDone || selectedLog.skincarePmDone)
    ? 'Morning routine completed'
    : 'Not logged';

  const isHairBodyDone = isSelectedToday
    ? Boolean(todayGlow.bodyCareCard?.completed || todayGlow.bodyCareCard?.bodyDone || todayGlow.nutritionCard?.logged)
    : Boolean(selectedLog && selectedLog.nutritionLogged);
  const hairBodyValueText = isSelectedToday
    ? (isHairBodyDone ? 'Glow & nourish completed' : 'Scalp oil & body care pending')
    : (isHairBodyDone ? 'Care routine completed' : 'Not logged');

  const isWorkoutDone = isSelectedToday
    ? Boolean(todayGlow.workoutCard?.completed)
    : Boolean(selectedLog && selectedLog.workoutCompleted);
  const workoutValueText = isSelectedToday
    ? todayGlow.workoutCard?.completed
      ? 'Glutes & Core · 40m'
      : 'Daily split pending'
    : selectedLog && selectedLog.workoutCompleted
    ? `${selectedLog.workoutName || 'Workout'} · ${selectedLog.workoutDurationMinutes || 40}m`
    : 'Not logged';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Screen Header */}
      <View style={styles.header}>
        <Text style={styles.headerOverline}>YOUR GLOW TIMELINE</Text>
        <Text style={styles.headerTitle}>Calendar & History</Text>
      </View>

      {/* Month Navigation Card */}
      <View style={styles.calendarCard}>
        <View style={styles.monthHeaderRow}>
          <TouchableOpacity onPress={prevMonth} style={styles.monthNavBtn} activeOpacity={0.7}>
            <Text style={styles.monthNavText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.monthTitleText}>
            {monthNames[month]} {year}
          </Text>
          <TouchableOpacity onPress={nextMonth} style={styles.monthNavBtn} activeOpacity={0.7}>
            <Text style={styles.monthNavText}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Weekday Label Row */}
        <View style={styles.weekdayRow}>
          {dayNames.map((d, index) => (
            <Text key={index} style={styles.weekdayText}>
              {d}
            </Text>
          ))}
        </View>

        {/* Days Grid */}
        <View style={styles.gridContainer}>
          {calendarDays.map((item, index) => {
            const isToday = isSameDay(item.date, today);
            const isSelected = isSameDay(item.date, selectedDate);
            const isMilestone = targetDateObj && isSameDay(item.date, targetDateObj);
            const completed = isDateCompleted(item.date);

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCell,
                  !item.isCurrentMonth && styles.dayCellOutside,
                  isToday && styles.dayCellToday,
                  isSelected && styles.dayCellSelected,
                ]}
                onPress={() => setSelectedDate(item.date)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dayText,
                    !item.isCurrentMonth && styles.dayTextOutside,
                    isToday && styles.dayTextToday,
                    isSelected && styles.dayTextSelected,
                  ]}
                >
                  {item.date.getDate()}
                </Text>

                {/* Status Dot / Milestone Marker */}
                {isMilestone ? (
                  <Text style={styles.milestoneIcon}>💍</Text>
                ) : completed ? (
                  <View
                    style={[
                      styles.completedDot,
                      isSelected && styles.completedDotSelected,
                    ]}
                  />
                ) : (
                  <View style={styles.emptyDot} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Selected Day Log Inspector */}
      <View style={styles.inspectorCard}>
        <View style={styles.inspectorHeaderRow}>
          <View>
            <Text style={styles.inspectorOverline}>
              {isSelectedToday
                ? "TODAY'S RECORD"
                : isSelectedCompleted
                ? 'COMPLETED DAY LOG'
                : 'UNLOGGED DAY'}
            </Text>
            <Text style={styles.inspectorTitle}>{formattedSelectedDate}</Text>
          </View>
          {isSelectedToday ? (
            <View style={styles.todayPill}>
              <Text style={styles.todayPillText}>Today</Text>
            </View>
          ) : isSelectedCompleted ? (
            <View style={styles.activeDayPill}>
              <Text style={styles.activeDayPillText}>Active ✓</Text>
            </View>
          ) : (
            <View style={styles.skippedPill}>
              <Text style={styles.skippedPillText}>Skipped</Text>
            </View>
          )}
        </View>

        {/* 4 Ritual Breakdown Rows */}
        <View style={styles.logList}>
          {/* Weight */}
          <TouchableOpacity
            style={styles.logRow}
            onPress={isSelectedToday ? onOpenWeightModal : undefined}
            activeOpacity={isSelectedToday ? 0.7 : 1}
          >
            <View style={styles.logLeft}>
              <Text style={styles.logEmoji}>⚖️</Text>
              <View>
                <Text style={styles.logName}>Weight</Text>
                <Text style={styles.logSubtext}>{weightValueText}</Text>
              </View>
            </View>
            <View
              style={[
                styles.statusBadge,
                isWeightDone && styles.statusBadgeDone,
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  isWeightDone && styles.statusBadgeTextDone,
                ]}
              >
                {isWeightDone ? 'Logged ✓' : isSelectedToday ? 'Log' : '—'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Skincare */}
          <TouchableOpacity
            style={styles.logRow}
            onPress={isSelectedToday ? onOpenSkincareModal : undefined}
            activeOpacity={isSelectedToday ? 0.7 : 1}
          >
            <View style={styles.logLeft}>
              <Text style={styles.logEmoji}>🧖‍♀️</Text>
              <View>
                <Text style={styles.logName}>Skincare Ritual</Text>
                <Text style={styles.logSubtext}>{skincareValueText}</Text>
              </View>
            </View>
            <View
              style={[
                styles.statusBadge,
                isSkincareDone && styles.statusBadgeDone,
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  isSkincareDone && styles.statusBadgeTextDone,
                ]}
              >
                {isSkincareDone ? 'Done ✓' : isSelectedToday ? 'Log' : '—'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Hair & Body */}
          <TouchableOpacity
            style={styles.logRow}
            onPress={isSelectedToday ? onOpenBodyCareModal : undefined}
            activeOpacity={isSelectedToday ? 0.7 : 1}
          >
            <View style={styles.logLeft}>
              <Text style={styles.logEmoji}>🧴</Text>
              <View>
                <Text style={styles.logName}>Hair & Body Care</Text>
                <Text style={styles.logSubtext}>{hairBodyValueText}</Text>
              </View>
            </View>
            <View
              style={[
                styles.statusBadge,
                isHairBodyDone && styles.statusBadgeDone,
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  isHairBodyDone && styles.statusBadgeTextDone,
                ]}
              >
                {isHairBodyDone ? 'Done ✓' : isSelectedToday ? 'Log' : '—'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Workout */}
          <View style={styles.logRow}>
            <View style={styles.logLeft}>
              <Text style={styles.logEmoji}>🏋️‍♀️</Text>
              <View>
                <Text style={styles.logName}>Workout & Split</Text>
                <Text style={styles.logSubtext}>{workoutValueText}</Text>
              </View>
            </View>
            <View
              style={[
                styles.statusBadge,
                isWorkoutDone && styles.statusBadgeDone,
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  isWorkoutDone && styles.statusBadgeTextDone,
                ]}
              >
                {isWorkoutDone ? 'Done ✓' : isSelectedToday ? 'Start' : '—'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Monthly Consistency Summary */}
      <View style={styles.statsCard}>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{monthlyAdherencePercent}%</Text>
            <Text style={styles.statLabel}>Month Adherence</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {dashboard?.streak?.currentStreak || 0}d
            </Text>
            <Text style={styles.statLabel}>Active Streak</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {dashboard?.countdown?.daysRemaining ?? 137}d
            </Text>
            <Text style={styles.statLabel}>To {milestoneType}</Text>
          </View>
        </View>
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
  calendarCard: {
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
    marginBottom: 16,
  },
  monthHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  monthTitleText: {
    fontFamily: THEME.fonts.displayBold,
    fontSize: 17,
    color: THEME.ink,
  },
  monthNavBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FAF3ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthNavText: {
    fontSize: 18,
    color: THEME.ink,
    lineHeight: 20,
    fontWeight: '700',
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F7EDE6',
  },
  weekdayText: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 11,
    color: '#9C7F77',
    width: 36,
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  dayCell: {
    width: '14.28%',
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
    borderRadius: 12,
  },
  dayCellOutside: {
    opacity: 0.3,
  },
  dayCellToday: {
    backgroundColor: '#FFF4EE',
    borderWidth: 1.2,
    borderColor: '#FBDBC8',
  },
  dayCellSelected: {
    backgroundColor: '#D98853',
  },
  dayText: {
    fontFamily: THEME.fonts.bodySemiBold,
    fontSize: 13,
    color: THEME.ink,
  },
  dayTextOutside: {
    color: '#C4B0A9',
  },
  dayTextToday: {
    fontFamily: THEME.fonts.bodyBold,
    color: '#D98853',
  },
  dayTextSelected: {
    color: '#FFFFFF',
    fontFamily: THEME.fonts.bodyBold,
  },
  completedDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#EF7391',
    marginTop: 2,
  },
  completedDotSelected: {
    backgroundColor: '#FFFFFF',
  },
  emptyDot: {
    width: 4,
    height: 4,
    marginTop: 2,
  },
  milestoneIcon: {
    fontSize: 9,
    marginTop: 1,
  },
  inspectorCard: {
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
    marginBottom: 16,
  },
  inspectorHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F7EDE6',
    marginBottom: 10,
  },
  inspectorOverline: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.2,
    color: THEME.inkSoft,
    textTransform: 'uppercase',
  },
  inspectorTitle: {
    fontFamily: THEME.fonts.displayBold,
    fontSize: 16,
    color: THEME.ink,
    marginTop: 2,
  },
  todayPill: {
    backgroundColor: '#FDECE1',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 100,
  },
  todayPillText: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 11,
    color: '#D98853',
  },
  activeDayPill: {
    backgroundColor: '#FDECEF',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 100,
  },
  activeDayPillText: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 11,
    color: '#EF7391',
  },
  skippedPill: {
    backgroundColor: '#F5ECE6',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 100,
  },
  skippedPillText: {
    fontFamily: THEME.fonts.bodySemiBold,
    fontSize: 11,
    color: '#9C7F77',
  },
  logList: {
    gap: 8,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#FAF3EE',
  },
  logLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  logEmoji: {
    fontSize: 20,
  },
  logName: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 13,
    color: THEME.ink,
  },
  logSubtext: {
    fontFamily: THEME.fonts.bodyRegular,
    fontSize: 11,
    color: '#9C7F77',
    marginTop: 1,
  },
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#F8F2ED',
  },
  statusBadgeDone: {
    backgroundColor: '#FDECEF',
  },
  statusBadgeText: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 10.5,
    color: '#A08072',
  },
  statusBadgeTextDone: {
    color: '#D85A7F',
  },
  statsCard: {
    backgroundColor: '#FFF8F3',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F8DFD0',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: THEME.fonts.displayBold,
    fontSize: 18,
    color: THEME.ink,
  },
  statLabel: {
    fontFamily: THEME.fonts.bodySemiBold,
    fontSize: 10,
    color: '#9C7F77',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#F1DECF',
  },
});
