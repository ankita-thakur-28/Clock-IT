import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../constants/theme';
import CalendarIcon from './CalendarIcon';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function ModernCalendarModal({
  visible,
  selectedDate,
  onSelectDate,
  onClose,
}) {
  const parseDate = (dStr) => {
    const d = new Date(dStr || Date.now());
    return isNaN(d.getTime()) ? new Date() : d;
  };

  const initial = parseDate(selectedDate);
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());
  const [tempSelected, setTempSelected] = useState(selectedDate);

  useEffect(() => {
    if (visible) {
      const d = parseDate(selectedDate);
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
      setTempSelected(selectedDate);
    }
  }, [visible, selectedDate]);

  // Calendar math
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleDayPress = (y, mIdx, day) => {
    const m = String(mIdx + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;
    setTempSelected(dateStr);
  };

  const handleConfirm = () => {
    onSelectDate(tempSelected);
    onClose();
  };

  const handlePreset = (daysAhead) => {
    const target = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);
    const y = target.getFullYear();
    const m = String(target.getMonth() + 1).padStart(2, '0');
    const d = String(target.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;
    setTempSelected(dateStr);
    setViewYear(y);
    setViewMonth(target.getMonth());
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Generate locked 42-cell matrix (exactly 6 rows x 7 days)
  const cells = [];

  // 1. Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const mIdx = viewMonth === 0 ? 11 : viewMonth - 1;
    const y = viewMonth === 0 ? viewYear - 1 : viewYear;
    const dateStr = `${y}-${String(mIdx + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push({
      key: `prev-${d}`,
      day: d,
      monthIdx: mIdx,
      year: y,
      dateStr,
      isOtherMonth: true,
      isPast: true,
      isToday: false,
      isSelected: tempSelected === dateStr,
    });
  }

  // 2. Current month active days
  for (let d = 1; d <= daysInMonth; d++) {
    const cellDate = new Date(viewYear, viewMonth, d);
    cellDate.setHours(0, 0, 0, 0);
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isPast = cellDate < today;
    const isToday = cellDate.getTime() === today.getTime();
    const isSelected = tempSelected === dateStr;

    cells.push({
      key: `curr-${d}`,
      day: d,
      monthIdx: viewMonth,
      year: viewYear,
      dateStr,
      isOtherMonth: false,
      isPast,
      isToday,
      isSelected,
    });
  }

  // 3. Next month leading days to complete exactly 42 cells
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    const mIdx = viewMonth === 11 ? 0 : viewMonth + 1;
    const y = viewMonth === 11 ? viewYear + 1 : viewYear;
    const dateStr = `${y}-${String(mIdx + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push({
      key: `next-${d}`,
      day: d,
      monthIdx: mIdx,
      year: y,
      dateStr,
      isOtherMonth: true,
      isPast: false,
      isToday: false,
      isSelected: tempSelected === dateStr,
    });
  }

  // Calculate days preview
  const targetDateObj = new Date(tempSelected);
  targetDateObj.setHours(0, 0, 0, 0);
  const diffDays = Math.max(0, Math.round((targetDateObj - today) / (1000 * 60 * 60 * 24)));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.backdropTouch}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.calendarCard}>
          {/* Card Header */}
          <View style={styles.headerRow}>
            <View style={styles.titleWithIcon}>
              <CalendarIcon size={17} color={THEME.pinkDeep} />
              <Text style={styles.modalTitle}>Choose Milestone Date</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Month / Year Navigator */}
          <View style={styles.monthNavRow}>
            <TouchableOpacity
              onPress={handlePrevMonth}
              style={styles.navArrowBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.navArrowText}>‹</Text>
            </TouchableOpacity>

            <Text style={styles.monthYearText}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </Text>

            <TouchableOpacity
              onPress={handleNextMonth}
              style={styles.navArrowBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.navArrowText}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Days of Week Header */}
          <View style={styles.weekHeaderRow}>
            {DAYS_OF_WEEK.map((w, idx) => (
              <Text key={idx} style={styles.weekHeaderText}>{w}</Text>
            ))}
          </View>

          {/* Days Grid: Fixed 42 slots (Zero Height Jumps) */}
          <View style={styles.gridContainer}>
            {cells.map((c) => {
              if (c.isSelected) {
                return (
                  <TouchableOpacity
                    key={c.key}
                    style={styles.dayCell}
                    activeOpacity={0.9}
                  >
                    <LinearGradient
                      colors={[THEME.peachDeep, THEME.pinkDeep]}
                      style={styles.selectedBubble}
                    >
                      <Text style={styles.selectedDayText}>{c.day}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                );
              }

              return (
                <TouchableOpacity
                  key={c.key}
                  onPress={() => !c.isPast && handleDayPress(c.year, c.monthIdx, c.day)}
                  disabled={c.isPast}
                  style={styles.dayCell}
                  activeOpacity={0.6}
                >
                  <View style={[styles.dayBubble, c.isToday && styles.todayBubble]}>
                    <Text
                      style={[
                        styles.dayText,
                        c.isOtherMonth && styles.otherMonthText,
                        c.isPast && !c.isOtherMonth && styles.pastDayText,
                        c.isToday && styles.todayDayText,
                      ]}
                    >
                      {c.day}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Quick Presets */}
          <Text style={styles.presetLabel}>Quick Select:</Text>
          <View style={styles.presetsRow}>
            {[
              ['30d', 30],
              ['90d', 90],
              ['140d', 140],
              ['6m', 180],
              ['1y', 365],
            ].map(([label, days]) => (
              <TouchableOpacity
                key={label}
                onPress={() => handlePreset(days)}
                style={styles.presetChip}
                activeOpacity={0.7}
              >
                <Text style={styles.presetChipText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Live Days Footer & Confirm */}
          <View style={styles.footerRow}>
            <View>
              <Text style={styles.footerDateText}>{tempSelected}</Text>
              <Text style={styles.footerDaysText}>~{diffDays} days away</Text>
            </View>

            <TouchableOpacity
              onPress={handleConfirm}
              activeOpacity={0.88}
              style={styles.confirmBtnWrapper}
            >
              <LinearGradient
                colors={[THEME.peachDeep, THEME.pinkDeep]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.confirmBtn}
              >
                <Text style={styles.confirmBtnText}>Confirm Date ✦</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(74, 44, 51, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  backdropTouch: {
    ...StyleSheet.absoluteFillObject,
  },
  calendarCard: {
    width: 300,
    backgroundColor: '#FFFDFB',
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#FFDCC2',
    shadowColor: '#4A2C33',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modalTitle: {
    fontFamily: THEME.fonts.displayBold,
    fontSize: 14,
    color: THEME.ink,
  },
  closeBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFF4EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 11,
    color: THEME.inkSoft,
    fontWeight: 'bold',
  },
  monthNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF9F4',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginBottom: 6,
  },
  monthYearText: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 13,
    color: THEME.ink,
  },
  navArrowBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: THEME.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navArrowText: {
    fontSize: 15,
    color: THEME.ink,
    lineHeight: 17,
    fontWeight: 'bold',
  },
  weekHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
    paddingHorizontal: 2,
  },
  weekHeaderText: {
    width: 36,
    textAlign: 'center',
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 9.5,
    color: THEME.roseGold,
    textTransform: 'uppercase',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    height: 174, // Fixed height for 6 rows: 6 * 29px = 174px (Zero Height Jitter)
  },
  dayCell: {
    width: 36,
    height: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 1,
  },
  dayBubble: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayBubble: {
    borderWidth: 1.2,
    borderColor: THEME.roseGold,
  },
  selectedBubble: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F195AC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 4,
    elevation: 2,
  },
  dayText: {
    fontFamily: THEME.fonts.bodySemiBold,
    fontSize: 11.5,
    color: THEME.ink,
  },
  pastDayText: {
    color: '#D8C2C8',
  },
  otherMonthText: {
    color: '#E8D5DA',
    fontSize: 10.5,
  },
  todayDayText: {
    color: THEME.roseGold,
    fontWeight: 'bold',
  },
  selectedDayText: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 11.5,
    color: '#FFFFFF',
  },
  presetLabel: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 9.5,
    color: THEME.inkSoft,
    marginTop: 6,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  presetChip: {
    paddingHorizontal: 7,
    paddingVertical: 3.5,
    borderRadius: 100,
    backgroundColor: '#FFF4EE',
    borderWidth: 1,
    borderColor: '#FFDCC2',
  },
  presetChipText: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 9.5,
    color: THEME.roseGold,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: THEME.line,
    paddingTop: 8,
    marginTop: 2,
  },
  footerDateText: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 12,
    color: THEME.ink,
  },
  footerDaysText: {
    fontFamily: THEME.fonts.bodySemiBold,
    fontSize: 10.5,
    color: THEME.roseGold,
  },
  confirmBtnWrapper: {
    borderRadius: 100,
    shadowColor: '#F195AC',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 2,
  },
  confirmBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 100,
  },
  confirmBtnText: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 11.5,
    color: '#fff',
  },
});
