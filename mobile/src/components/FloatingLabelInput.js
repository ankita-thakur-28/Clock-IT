import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { THEME } from '../constants/theme';

export default function FloatingLabelInput({
  label,
  value = '',
  onChangeText,
  helperText,
  secureTextEntry = false,
  showPasswordToggle = false,
  onTogglePassword,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = false,
  containerStyle,
  inputStyle,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const animatedIsFocused = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: isFocused || (value && value.length > 0) ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelTop = animatedIsFocused.interpolate({
    inputRange: [0, 1],
    outputRange: [18, 7],
  });

  const labelFontSize = animatedIsFocused.interpolate({
    inputRange: [0, 1],
    outputRange: [14.5, 10.5],
  });

  const labelColor = animatedIsFocused.interpolate({
    inputRange: [0, 1],
    outputRange: ['#A0857E', THEME.roseGold],
  });

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
        ]}
      >
        <Animated.Text
          style={[
            styles.floatingLabel,
            {
              top: labelTop,
              fontSize: labelFontSize,
              color: labelColor,
            },
          ]}
          numberOfLines={1}
        >
          {label}
        </Animated.Text>

        <TextInput
          style={[
            styles.textInput,
            showPasswordToggle && { paddingRight: 56 },
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          selectionColor={THEME.roseGold}
        />

        {showPasswordToggle && (
          <TouchableOpacity
            onPress={onTogglePassword}
            style={styles.passwordToggle}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.passwordToggleText}>
              {secureTextEntry ? 'Show' : 'Hide'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {Boolean(helperText && isFocused) && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 18,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#EED7C4',
    borderRadius: 16,
    height: 58,
    position: 'relative',
    justifyContent: 'center',
  },
  inputContainerFocused: {
    borderColor: '#E3B7A4',
    backgroundColor: '#FFFFFF',
    shadowColor: '#C99A6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 1,
  },
  floatingLabel: {
    position: 'absolute',
    left: 16,
    fontFamily: THEME.fonts.bodyBold,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    includeFontPadding: false,
    zIndex: 1,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 4,
    fontFamily: THEME.fonts.bodyMedium,
    fontSize: 16,
    color: '#3B2A26',
    includeFontPadding: false,
  },
  passwordToggle: {
    position: 'absolute',
    right: 14,
    top: 18,
    paddingVertical: 2,
    paddingHorizontal: 6,
    zIndex: 2,
  },
  passwordToggleText: {
    fontFamily: THEME.fonts.bodySemiBold,
    fontSize: 13.5,
    color: '#C99A6B',
    includeFontPadding: false,
  },
  helperText: {
    fontFamily: THEME.fonts.bodyRegular,
    fontSize: 12,
    color: '#7A6A63',
    marginTop: 4,
    marginLeft: 6,
    includeFontPadding: false,
  },
});
