import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { THEME } from '../constants/theme';

export default function BottomDock({ activeTab = 'today', onTabChange }) {
  const tabs = [
    { id: 'today', label: 'Today', icon: '⌂' },
    { id: 'calendar', label: 'Calendar', icon: '⊞' },
    { id: 'split', label: 'Split', icon: '🏋️‍♀️' },
    { id: 'profile', label: 'Me', icon: '👤' },
  ];

  return (
    <View style={styles.dockContainer}>
      <View style={styles.dockCard}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabButton}
              onPress={() => onTabChange && onTabChange(tab.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>
                {tab.icon}
              </Text>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
              {isActive && <View style={styles.activeDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dockContainer: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 14 : 10,
    paddingTop: 4,
    width: '100%',
  },
  dockCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderRadius: 100,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#EFE5DD',
    shadowColor: '#4A2C33',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 3,
    paddingHorizontal: 9,
    position: 'relative',
  },
  tabIcon: {
    fontSize: 15,
    color: '#8A6D77',
    marginBottom: 2,
  },
  tabIconActive: {
    color: THEME.pinkDeep,
    fontWeight: 'bold',
  },
  tabLabel: {
    fontFamily: THEME.fonts.bodySemiBold,
    fontSize: 10,
    color: THEME.inkSoft,
  },
  tabLabelActive: {
    fontFamily: THEME.fonts.bodyBold,
    color: THEME.ink,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: THEME.pinkDeep,
    position: 'absolute',
    bottom: -2,
  },
});
