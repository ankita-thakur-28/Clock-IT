import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { THEME } from '../constants/theme';

export const AUTH_THEME = {
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
  error: '#D9666B',
};

function UserIcon() {
  return (
    <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
      <Circle
        cx="12"
        cy="8"
        r="4"
        stroke={AUTH_THEME.terracotta}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4 21c0-4 3.5-6 8-6s8 2 8 6"
        stroke={AUTH_THEME.terracotta}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function MailIcon() {
  return (
    <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
      <Rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke={AUTH_THEME.terracotta}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 7l9 6 9-6"
        stroke={AUTH_THEME.terracotta}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function LockIcon() {
  return (
    <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
      <Rect
        x="5"
        y="11"
        width="14"
        height="9"
        rx="2"
        stroke={AUTH_THEME.terracotta}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 11V8a4 4 0 0 1 8 0v3"
        stroke={AUTH_THEME.terracotta}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function EyeToggle({ visible, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.eyeBtn}
      activeOpacity={0.7}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
        {visible ? (
          <Path
            d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.1A9.4 9.4 0 0 1 12 5c5 0 9 4 10 7-.4 1.2-1.3 2.6-2.5 3.8M6.5 6.5C4.6 7.8 3.2 9.6 2 12c1 3 5 7 10 7 1.3 0 2.6-.3 3.7-.8"
            stroke={AUTH_THEME.muted}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <>
            <Path
              d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"
              stroke={AUTH_THEME.muted}
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle
              cx="12"
              cy="12"
              r="3"
              stroke={AUTH_THEME.muted}
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}
      </Svg>
    </TouchableOpacity>
  );
}

function Field({
  icon,
  placeholder,
  value,
  onChangeText,
  onBlur,
  onFocus,
  error,
  secureTextEntry = false,
  rightAdornment,
  autoCapitalize = 'none',
  keyboardType = 'default',
  autoCorrect = false,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={{ marginBottom: error ? 4 : 14 }}>
      <View
        style={[
          styles.fieldContainer,
          {
            borderColor: error
              ? AUTH_THEME.error
              : focused
              ? AUTH_THEME.terracotta
              : AUTH_THEME.line,
          },
          focused && styles.fieldFocusedGlow,
        ]}
      >
        <View style={styles.fieldIconWrapper}>
          {icon === 'user' && <UserIcon />}
          {icon === 'mail' && <MailIcon />}
          {icon === 'lock' && <LockIcon />}
        </View>

        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={(e) => {
            setFocused(true);
            if (onFocus) onFocus(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            if (onBlur) onBlur(e);
          }}
          placeholder={placeholder}
          placeholderTextColor={AUTH_THEME.muted}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          autoCorrect={autoCorrect}
          style={styles.fieldInput}
        />

        {rightAdornment}
      </View>
      {Boolean(error) && <Text style={styles.fieldErrorText}>{error}</Text>}
    </View>
  );
}

function PasswordStrength({ password }) {
  if (!password) return null;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const labels = ['Too short', 'Weak', 'Okay', 'Good', 'Strong'];
  const colors = [
    AUTH_THEME.error,
    AUTH_THEME.error,
    '#E0A85C',
    AUTH_THEME.terracotta,
    '#7CA982',
  ];

  return (
    <View style={styles.passwordStrengthContainer}>
      <View style={styles.strengthBarsRow}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.strengthBar,
              {
                backgroundColor:
                  i < score ? colors[score] : AUTH_THEME.line,
              },
            ]}
          />
        ))}
      </View>
      <Text style={[styles.strengthLabel, { color: colors[score] }]}>
        {labels[score]}
      </Text>
    </View>
  );
}

function SocialButton({ children, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.socialBtn}
      activeOpacity={0.8}
    >
      {children}
    </TouchableOpacity>
  );
}

function Divider() {
  return (
    <View style={styles.dividerRow}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerText}>or</Text>
      <View style={styles.dividerLine} />
    </View>
  );
}

export default function AuthVisionCard({
  mode = 'signup', // 'signup' | 'login'
  name = '',
  setName,
  email = '',
  setEmail,
  password = '',
  setPassword,
  loading = false,
  authError = null,
  setAuthError,
  onBack,
  onSubmit,
  onGoogleLogin,
  onForgotPassword,
  onResetPassword,
  onSwitchMode,
}) {
  const isSignup = mode === 'signup';
  const [showPassword, setShowPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  // Forgot Password Modal State (2-step OTP)
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetStep, setResetStep] = useState('request'); // 'request' | 'verify'
  const [resetEmail, setResetEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [resetPasswordVal, setResetPasswordVal] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState(null);

  // Google Sign-In Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState(null);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const emailError =
    emailTouched && email.length > 0 && !emailValid
      ? 'Enter a valid email address'
      : null;

  const canSubmit = isSignup
    ? Boolean(name?.trim()) && emailValid && password.length >= 6
    : emailValid && password.length > 0;

  // Open Forgot Password Dialog
  const handleOpenForgotPassword = () => {
    setResetEmail(email || '');
    setResetOtp('');
    setResetPasswordVal('');
    setResetStep('request');
    setResetError(null);
    setShowResetModal(true);
  };

  // Step 1: Request 6-digit OTP
  const handleRequestResetOtp = async () => {
    if (!resetEmail.trim() || !resetEmail.includes('@')) {
      setResetError('Please enter a valid email address');
      return;
    }

    setResetLoading(true);
    setResetError(null);
    try {
      if (onForgotPassword) {
        await onForgotPassword({ email: resetEmail.trim() });
      }
      setResetStep('verify');
    } catch (err) {
      setResetError(err.message || 'Failed to send verification code');
    } finally {
      setResetLoading(false);
    }
  };

  // Step 2: Verify OTP and Set New Password
  const handlePerformResetPassword = async () => {
    if (!resetOtp.trim() || resetOtp.trim().length !== 6) {
      setResetError('Please enter the 6-digit verification code');
      return;
    }
    if (!resetPasswordVal || resetPasswordVal.length < 6) {
      setResetError('Password must be at least 6 characters');
      return;
    }

    setResetLoading(true);
    setResetError(null);
    try {
      if (onResetPassword) {
        await onResetPassword({
          email: resetEmail.trim(),
          otp: resetOtp.trim(),
          newPassword: resetPasswordVal,
        });
      }
      setEmail(resetEmail.trim());
      setPassword(resetPasswordVal);
      setShowResetModal(false);
      Alert.alert(
        'Password Reset Successful',
        'Your password has been updated! You can now log in with your new password.'
      );
    } catch (err) {
      setResetError(err.message || 'Failed to reset password');
    } finally {
      setResetLoading(false);
    }
  };

  // Open Google Sign-In Dialog
  const handleOpenGoogleModal = () => {
    setGoogleEmail(email || '');
    setGoogleName(name || '');
    setGoogleError(null);
    setShowGoogleModal(true);
  };

  // Submit Google Login
  const handlePerformGoogleLogin = async () => {
    const targetEmail = googleEmail.trim();
    const targetName = googleName.trim() || (targetEmail ? targetEmail.split('@')[0] : 'User');

    if (!targetEmail || !targetEmail.includes('@')) {
      setGoogleError('Please enter a valid Google email address');
      return;
    }

    setGoogleLoading(true);
    setGoogleError(null);
    try {
      if (onGoogleLogin) {
        await onGoogleLogin({
          email: targetEmail,
          name: targetName,
          googleId: 'g-' + Date.now(),
        });
      }
      setShowGoogleModal(false);
    } catch (err) {
      setGoogleError(err.message || 'Google Sign-In failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <View style={styles.cardWrapper}>
      {/* Luxury Elevated Card */}
      <View style={styles.card}>
        {/* Ambient Pastel Background Glows */}
        <View style={styles.ambientCircleTop} pointerEvents="none" />
        <View style={styles.ambientCircleBottom} pointerEvents="none" />

        {/* Card Content */}
        <View style={styles.cardContent}>
          {/* Circular Back Button (No top mode switcher) */}
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>

          {/* Screen Headline */}
          <Text style={styles.headline}>
            {isSignup ? 'Join CLOCK-IT' : 'Welcome back'}
          </Text>

          {/* General Server / Auth Error */}
          {Boolean(authError) && (
            <View style={styles.authErrorBox}>
              <Text style={styles.authErrorText}>{authError}</Text>
            </View>
          )}

          {/* Form Fields */}
          {isSignup && (
            <Field
              icon="user"
              placeholder="NAME"
              value={name}
              onChangeText={(val) => {
                setName(val);
                if (authError && setAuthError) setAuthError(null);
              }}
              autoCapitalize="words"
            />
          )}

          <Field
            icon="mail"
            placeholder="EMAIL"
            value={email}
            onChangeText={(val) => {
              setEmail(val);
              if (authError && setAuthError) setAuthError(null);
            }}
            onBlur={() => setEmailTouched(true)}
            error={emailError}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Field
            icon="lock"
            placeholder="PASSWORD"
            value={password}
            onChangeText={(val) => {
              setPassword(val);
              if (authError && setAuthError) setAuthError(null);
            }}
            secureTextEntry={!showPassword}
            rightAdornment={
              <EyeToggle
                visible={showPassword}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            autoCapitalize="none"
          />

          {isSignup && <PasswordStrength password={password} />}

          {!isSignup && (
            <TouchableOpacity
              onPress={handleOpenForgotPassword}
              activeOpacity={0.7}
              style={styles.forgotBtn}
            >
              <Text style={styles.forgotBtnText}>Forgot password?</Text>
            </TouchableOpacity>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            onPress={onSubmit}
            disabled={!canSubmit || loading}
            activeOpacity={0.88}
            style={[
              styles.ctaBtnWrapper,
              canSubmit && styles.ctaBtnActiveShadow,
            ]}
          >
            {canSubmit ? (
              <LinearGradient
                colors={[AUTH_THEME.ctaFrom, AUTH_THEME.ctaTo]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ctaBtn}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.ctaBtnText}>
                    {isSignup ? 'Continue' : 'Log In'}
                  </Text>
                )}
              </LinearGradient>
            ) : (
              <View style={[styles.ctaBtn, styles.ctaBtnDisabled]}>
                {loading ? (
                  <ActivityIndicator size="small" color={AUTH_THEME.muted} />
                ) : (
                  <Text style={styles.ctaBtnTextDisabled}>
                    {isSignup ? 'Continue' : 'Log In'}
                  </Text>
                )}
              </View>
            )}
          </TouchableOpacity>

          {/* Terms & Privacy (Sign Up only) */}
          {isSignup && (
            <Text style={styles.termsText}>
              By continuing, you agree to our{' '}
              <Text style={styles.termsHighlight}>Terms</Text> &amp;{' '}
              <Text style={styles.termsHighlight}>Privacy Policy</Text>
            </Text>
          )}

          {/* Divider */}
          <Divider />

          {/* Social Google Button */}
          <SocialButton onPress={handleOpenGoogleModal}>
            <Text style={styles.googleBadge}>G</Text>
            <Text style={styles.socialBtnText}>Continue with Google</Text>
          </SocialButton>

          {/* Bottom Switcher */}
          <View style={styles.footerRow}>
            <Text style={styles.footerLabel}>
              {isSignup ? 'Already prepping? ' : 'New here? '}
            </Text>
            <TouchableOpacity onPress={onSwitchMode} activeOpacity={0.7}>
              <Text style={styles.footerAction}>
                {isSignup ? 'Log in' : 'Create account'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ──────── MODAL 1: FORGOT / RESET PASSWORD ──────── */}
      <Modal
        visible={showResetModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowResetModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>
                {resetStep === 'request' ? 'Reset Password' : 'Verify Code'}
              </Text>
              <TouchableOpacity
                onPress={() => setShowResetModal(false)}
                style={styles.modalCloseBtn}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              {resetStep === 'request'
                ? 'Enter your account email to receive a 6-digit verification code.'
                : `Enter the 6-digit code sent to ${resetEmail} and your new password.`}
            </Text>

            {Boolean(resetError) && (
              <View style={styles.modalErrorBox}>
                <Text style={styles.modalErrorText}>{resetError}</Text>
              </View>
            )}

            {resetStep === 'request' ? (
              <>
                <Field
                  icon="mail"
                  placeholder="EMAIL ADDRESS"
                  value={resetEmail}
                  onChangeText={(val) => {
                    setResetEmail(val);
                    if (resetError) setResetError(null);
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <TouchableOpacity
                  onPress={handleRequestResetOtp}
                  disabled={resetLoading || !resetEmail.trim() || !resetEmail.includes('@')}
                  activeOpacity={0.88}
                  style={[
                    styles.ctaBtnWrapper,
                    resetEmail.includes('@') && styles.ctaBtnActiveShadow,
                    { marginTop: 10 },
                  ]}
                >
                  <LinearGradient
                    colors={[AUTH_THEME.ctaFrom, AUTH_THEME.ctaTo]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.ctaBtn}
                  >
                    {resetLoading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.ctaBtnText}>Send Verification Code</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Field
                  icon="lock"
                  placeholder="6-DIGIT VERIFICATION CODE"
                  value={resetOtp}
                  onChangeText={(val) => {
                    setResetOtp(val);
                    if (resetError) setResetError(null);
                  }}
                  keyboardType="number-pad"
                  autoCapitalize="none"
                />

                <Field
                  icon="lock"
                  placeholder="NEW PASSWORD (MIN. 6 CHARS)"
                  value={resetPasswordVal}
                  onChangeText={(val) => {
                    setResetPasswordVal(val);
                    if (resetError) setResetError(null);
                  }}
                  secureTextEntry={!showResetPassword}
                  rightAdornment={
                    <EyeToggle
                      visible={showResetPassword}
                      onPress={() => setShowResetPassword(!showResetPassword)}
                    />
                  }
                  autoCapitalize="none"
                />

                <TouchableOpacity
                  onPress={handlePerformResetPassword}
                  disabled={resetLoading || resetOtp.trim().length !== 6 || resetPasswordVal.length < 6}
                  activeOpacity={0.88}
                  style={[
                    styles.ctaBtnWrapper,
                    resetOtp.trim().length === 6 && resetPasswordVal.length >= 6 && styles.ctaBtnActiveShadow,
                    { marginTop: 10 },
                  ]}
                >
                  <LinearGradient
                    colors={[AUTH_THEME.ctaFrom, AUTH_THEME.ctaTo]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.ctaBtn}
                  >
                    {resetLoading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.ctaBtnText}>Update Password</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setResetStep('request');
                    setResetError(null);
                  }}
                  style={{ marginTop: 14, alignSelf: 'center' }}
                  activeOpacity={0.7}
                >
                  <Text style={{ fontSize: 13, color: AUTH_THEME.terracotta, fontWeight: '600' }}>
                    ← Change email or resend code
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* ──────── MODAL 2: GOOGLE SIGN-IN ──────── */}
      <Modal
        visible={showGoogleModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGoogleModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <View style={styles.googleBrandRow}>
                <Text style={styles.googleBrandG}>G</Text>
                <Text style={styles.modalTitle}>Sign in with Google</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowGoogleModal(false)}
                style={styles.modalCloseBtn}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Enter your Google account details to continue to Clock-IT
            </Text>

            {Boolean(googleError) && (
              <View style={styles.modalErrorBox}>
                <Text style={styles.modalErrorText}>{googleError}</Text>
              </View>
            )}

            {/* Google Account Entry */}
            <Field
              icon="user"
              placeholder="NAME (OPTIONAL)"
              value={googleName}
              onChangeText={(val) => {
                setGoogleName(val);
                if (googleError) setGoogleError(null);
              }}
              autoCapitalize="words"
            />

            <Field
              icon="mail"
              placeholder="GOOGLE EMAIL"
              value={googleEmail}
              onChangeText={(val) => {
                setGoogleEmail(val);
                if (googleError) setGoogleError(null);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TouchableOpacity
              onPress={handlePerformGoogleLogin}
              disabled={googleLoading || !googleEmail.trim() || !googleEmail.includes('@')}
              activeOpacity={0.88}
              style={[styles.ctaBtnWrapper, styles.ctaBtnActiveShadow, { marginTop: 10 }]}
            >
              <LinearGradient
                colors={['#4285F4', '#2B66C5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ctaBtn}
              >
                {googleLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.ctaBtnText}>Sign In with Google</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  card: {
    width: '100%',
    maxWidth: 350,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    position: 'relative',
    overflow: 'hidden',
    paddingVertical: 12,
    paddingHorizontal: 4,
    ...Platform.select({
      web: {
        boxShadow: '0 40px 80px -30px rgba(59,38,32,0.35)',
      },
      default: {
        shadowColor: '#3B2620',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.16,
        shadowRadius: 28,
        elevation: 8,
      },
    }),
  },
  ambientCircleTop: {
    position: 'absolute',
    top: -30,
    left: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: AUTH_THEME.badgeBg,
    opacity: 0.7,
  },
  ambientCircleBottom: {
    position: 'absolute',
    bottom: -50,
    right: -50,
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#FBD5DE',
    opacity: 0.8,
  },
  cardContent: {
    position: 'relative',
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 22,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: AUTH_THEME.line,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  backButtonText: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 18,
    color: AUTH_THEME.ink,
    marginTop: -2,
    includeFontPadding: false,
  },
  headline: {
    fontFamily: THEME.fonts.displayBold,
    fontSize: 25,
    color: AUTH_THEME.ink,
    textAlign: 'center',
    marginBottom: 22,
    includeFontPadding: false,
  },
  authErrorBox: {
    backgroundColor: '#FFF0F3',
    borderWidth: 1,
    borderColor: '#FFCCD6',
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  authErrorText: {
    fontFamily: THEME.fonts.bodyMedium,
    fontSize: 12,
    color: AUTH_THEME.error,
    textAlign: 'center',
    includeFontPadding: false,
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
  },
  fieldFocusedGlow: {
    borderColor: AUTH_THEME.terracotta,
    ...Platform.select({
      web: {
        boxShadow: `0 0 0 3px ${AUTH_THEME.badgeBg}`,
      },
    }),
  },
  fieldIconWrapper: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldInput: {
    flex: 1,
    fontFamily: THEME.fonts.bodyRegular,
    fontSize: 14,
    color: AUTH_THEME.ink,
    letterSpacing: 0.3,
    padding: 0,
    outlineStyle: 'none',
    includeFontPadding: false,
  },
  fieldErrorText: {
    fontFamily: THEME.fonts.bodyRegular,
    fontSize: 11,
    color: AUTH_THEME.error,
    marginTop: 5,
    marginLeft: 4,
    includeFontPadding: false,
  },
  eyeBtn: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passwordStrengthContainer: {
    marginBottom: 14,
    marginTop: -6,
  },
  strengthBarsRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 5,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthLabel: {
    fontFamily: THEME.fonts.bodySemiBold,
    fontSize: 10.5,
    includeFontPadding: false,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 16,
    marginTop: -8,
  },
  forgotBtnText: {
    fontFamily: THEME.fonts.bodySemiBold,
    fontSize: 11.5,
    color: AUTH_THEME.terracotta,
    includeFontPadding: false,
  },
  ctaBtnWrapper: {
    width: '100%',
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 2,
  },
  ctaBtnActiveShadow: {
    ...Platform.select({
      web: {
        boxShadow: '0 12px 24px -10px rgba(239,115,145,.5)',
      },
      default: {
        shadowColor: '#EF7391',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 4,
      },
    }),
  },
  ctaBtn: {
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
  ctaBtnDisabled: {
    backgroundColor: AUTH_THEME.line,
  },
  ctaBtnText: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 14.5,
    color: '#FFFFFF',
    includeFontPadding: false,
  },
  ctaBtnTextDisabled: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 14.5,
    color: AUTH_THEME.muted,
    includeFontPadding: false,
  },
  termsText: {
    fontFamily: THEME.fonts.bodyRegular,
    fontSize: 10.5,
    color: AUTH_THEME.muted,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 15,
    includeFontPadding: false,
  },
  termsHighlight: {
    color: AUTH_THEME.terracotta,
    fontFamily: THEME.fonts.bodySemiBold,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: AUTH_THEME.line,
  },
  dividerText: {
    fontFamily: THEME.fonts.bodyRegular,
    fontSize: 11,
    color: AUTH_THEME.muted,
    includeFontPadding: false,
  },
  socialBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: AUTH_THEME.line,
    borderRadius: 999,
    paddingVertical: 12,
  },
  googleBadge: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 15,
    color: AUTH_THEME.inkSoft,
    includeFontPadding: false,
  },
  socialBtnText: {
    fontFamily: THEME.fonts.bodySemiBold,
    fontSize: 13.5,
    color: AUTH_THEME.inkSoft,
    includeFontPadding: false,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  footerLabel: {
    fontFamily: THEME.fonts.bodyRegular,
    fontSize: 12.5,
    color: AUTH_THEME.inkSoft,
    includeFontPadding: false,
  },
  footerAction: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 12.5,
    color: AUTH_THEME.terracotta,
    textDecorationLine: 'underline',
    includeFontPadding: false,
  },

  // ──────── Modal Styles ────────
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(59, 38, 32, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    ...Platform.select({
      web: {
        boxShadow: '0 25px 50px -12px rgba(59, 38, 32, 0.35)',
      },
      default: {
        shadowColor: '#3B2620',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
      },
    }),
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  modalTitle: {
    fontFamily: THEME.fonts.displayBold,
    fontSize: 20,
    color: AUTH_THEME.ink,
    includeFontPadding: false,
  },
  modalCloseBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F7EDE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 14,
    color: AUTH_THEME.inkSoft,
    includeFontPadding: false,
  },
  modalSubtitle: {
    fontFamily: THEME.fonts.bodyRegular,
    fontSize: 12,
    color: AUTH_THEME.inkSoft,
    marginBottom: 16,
    lineHeight: 16,
    includeFontPadding: false,
  },
  modalErrorBox: {
    backgroundColor: '#FFF0F3',
    borderWidth: 1,
    borderColor: '#FFCCD6',
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  modalErrorText: {
    fontFamily: THEME.fonts.bodyMedium,
    fontSize: 11.5,
    color: AUTH_THEME.error,
    textAlign: 'center',
    includeFontPadding: false,
  },

  // Google Modal specific styles
  googleBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  googleBrandG: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 20,
    color: '#4285F4',
    includeFontPadding: false,
  },
  googleAccountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF7F2',
    borderWidth: 1.2,
    borderColor: AUTH_THEME.line,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  googleAvatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D98853',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  googleAvatarText: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 15,
    color: '#FFFFFF',
    includeFontPadding: false,
  },
  googleAccountInfo: {
    flex: 1,
  },
  googleAccountName: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 13,
    color: AUTH_THEME.ink,
    includeFontPadding: false,
  },
  googleAccountEmail: {
    fontFamily: THEME.fonts.bodyRegular,
    fontSize: 11.5,
    color: AUTH_THEME.muted,
    includeFontPadding: false,
  },
  googleAccountChevron: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 20,
    color: AUTH_THEME.terracotta,
    marginLeft: 8,
    includeFontPadding: false,
  },
  googleSwitchLink: {
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 4,
  },
  googleSwitchText: {
    fontFamily: THEME.fonts.bodySemiBold,
    fontSize: 12,
    color: AUTH_THEME.terracotta,
    textDecorationLine: 'underline',
    includeFontPadding: false,
  },
});
