import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { THEME } from '../constants/theme';

export default function RoutineCard({
  icon,
  imageSource,
  title,
  badge,
  completed,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={[styles.card, completed && styles.cardCompleted]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.topRow}>
        <View style={styles.iconWrapper}>
          {imageSource ? (
            <Image
              source={imageSource}
              style={styles.cardImage}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.iconText}>{icon}</Text>
          )}
        </View>
        <View style={[styles.badge, completed && styles.badgeCompleted]}>
          <Text style={[styles.badgeText, completed && styles.badgeTextCompleted]}>
            {badge}
          </Text>
        </View>
      </View>

      <Text style={styles.titleText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1.2,
    borderColor: '#F3E5DA',
    shadowColor: '#4A2C33',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    minHeight: 105,
    justifyContent: 'space-between',
  },
  cardCompleted: {
    borderColor: '#F8CAD5',
    backgroundColor: '#FFFDFE',
    shadowColor: 'rgba(239, 115, 145, 0.15)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  iconText: {
    fontSize: 26,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#F8F2ED',
  },
  badgeCompleted: {
    backgroundColor: '#FDECEF',
  },
  badgeText: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 10,
    fontWeight: '600',
    color: '#A08072',
    letterSpacing: 0.1,
  },
  badgeTextCompleted: {
    color: '#D85A7F',
    fontWeight: '700',
  },
  titleText: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 13.5,
    color: THEME.ink,
  },
});
