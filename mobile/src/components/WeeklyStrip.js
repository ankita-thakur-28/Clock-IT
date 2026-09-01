import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../constants/theme';

export default function WeeklyStrip({ days = [] }) {
  return (
    <View style={styles.container}>
      <View style={styles.stripRow}>
        {days.map((item, index) => {
          const isToday = item.today || item.isToday;
          const isCompleted = item.completed || item.isCompleted;

          return (
            <View key={index} style={styles.dayColumn}>
              <Text style={[styles.dayLabel, isToday && styles.todayLabel]}>
                {item.dayOfWeek}
              </Text>

              {isToday ? (
                <LinearGradient
                  colors={[THEME.peachDeep, THEME.pinkDeep]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.todayBubble}
                >
                  <Text style={styles.todayText}>{item.dayOfMonth}</Text>
                </LinearGradient>
              ) : (
                <View style={styles.dateBubble}>
                  <Text style={styles.dateText}>{item.dayOfMonth}</Text>
                </View>
              )}

              <View style={styles.indicatorContainer}>
                {(isToday || isCompleted) && <View style={styles.glowDot} />}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 4,
  },
  stripRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayColumn: {
    alignItems: 'center',
    width: 36,
  },
  dayLabel: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 12,
    color: THEME.roseGold,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  todayLabel: {
    color: '#D98853',
    fontWeight: 'bold',
  },
  dateBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  todayBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F195AC',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.45,
    shadowRadius: 5,
    elevation: 3,
  },
  dateText: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 15,
    color: '#3B2620',
  },
  todayText: {
    color: '#FFFFFF',
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 15,
  },
  indicatorContainer: {
    height: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 3,
  },
  glowDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#EF7391',
  },
});
