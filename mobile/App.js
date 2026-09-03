import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_500Medium_Italic,
} from '@expo-google-fonts/playfair-display';
import {
  Quicksand_500Medium,
  Quicksand_600SemiBold,
  Quicksand_700Bold,
} from '@expo-google-fonts/quicksand';

import { THEME } from './src/constants/theme';
import BowIcon from './src/components/BowIcon';
import ClockO from './src/components/ClockO';
import HeroClock from './src/components/HeroClock';
import ProgressRing from './src/components/ProgressRing';
import CalendarIcon from './src/components/CalendarIcon';
import ModernCalendarModal from './src/components/ModernCalendarModal';
import HourglassVisual from './src/components/HourglassVisual';
import WeeklyStrip from './src/components/WeeklyStrip';
import RoutineCard from './src/components/RoutineCard';
import BottomDock from './src/components/BottomDock';
import WeightLogModal from './src/components/modals/WeightLogModal';
import SkincareRoutineModal from './src/components/modals/SkincareRoutineModal';
import BodyCareModal from './src/components/modals/BodyCareModal';
import CalendarHistoryView from './src/components/CalendarHistoryView';
import ProfileSettingsView from './src/components/ProfileSettingsView';
import {
  createUser,
  fetchDashboard,
  updateTodayLog,
  fetchUserDailyLogs,
  updateLogForDate,
  checkBackendHealth,
} from './src/services/api';
import {
  saveActiveUser,
  getActiveUser,
  clearActiveUser,
  saveCachedDashboard,
  getCachedDashboard,
  saveDailyLog,
  saveAllDailyLogs,
  getAllDailyLogs,
} from './src/services/storage';

SplashScreen.preventAutoHideAsync().catch(() => {});

const skincareGirlImg = require('./assets/skincare_girl.png');
const weightScaleImg = require('./assets/weight_scale.png');
const aiTrainerImg = require('./assets/ai_trainer.png');
const bodyCareTrayImg = require('./assets/body_care_tray.png');

function AppContent({ initialSession }) {
  const hasSavedUser = Boolean(initialSession?.savedUser);
  const [step, setStep] = useState(hasSavedUser ? 'countdown' : 'splash'); // 'splash' | 'setup' | 'countdown'
  const [loading, setLoading] = useState(false);
  const [backendHealthy, setBackendHealthy] = useState(false);
  const [activeTab, setActiveTab] = useState('today');
  const splashFadeAnim = useRef(new Animated.Value(0)).current;

  // Form State (Views 1 & 2) — completely unselected initial state
  const [name, setName] = useState(initialSession?.savedUser?.name || '');
  const [milestoneType, setMilestoneType] = useState(initialSession?.savedUser?.milestoneType || null);
  const [milestoneDate, setMilestoneDate] = useState(initialSession?.savedUser?.milestoneDate || null);
  const [goal, setGoal] = useState(initialSession?.savedUser?.goal || null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showSkincareModal, setShowSkincareModal] = useState(false);
  const [showBodyCareModal, setShowBodyCareModal] = useState(false);
  const [loggedWeight, setLoggedWeight] = useState(
    initialSession?.cachedDashboard?.todayGlow?.weightCard?.weightAm ?? null
  );
  const [weightUnit, setWeightUnit] = useState('kg');

  const formatDisplayDate = (dStr) => {
    if (!dStr) return 'Select date';
    const parts = dStr.split('-');
    if (parts.length !== 3) return dStr;
    const [y, m, d] = parts.map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Server / Local Persistence State (View 3)
  const [userData, setUserData] = useState(initialSession?.savedUser || null);

  // Dynamic Dashboard State for View 3
  const [dashboard, setDashboard] = useState(initialSession?.cachedDashboard || null);
  const [dailyLogsHistory, setDailyLogsHistory] = useState(initialSession?.cachedLogs || {});

  useEffect(() => {
    splashFadeAnim.setValue(0);
    Animated.timing(splashFadeAnim, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [step]);

  useEffect(() => {
    // Inject Google Fonts stylesheet on Web for crisp typography
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const linkId = 'clockit-google-fonts-link';
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,500;1,600&family=Quicksand:wght@500;600;700&display=swap';
        document.head.appendChild(link);
      }
    }

    checkBackendHealth().then((healthy) => {
      setBackendHealthy(healthy);
    });

    const activeUid = initialSession?.savedUser?.id;
    if (activeUid) {
      loadDashboardData(activeUid);
    }
  }, []);

  const normalizeDashboard = (data) => {
    if (!data) return data;
    const todayGlow = data.todayGlow || {};
    const isHairBodyDone = Boolean(
      todayGlow.bodyCareCard?.completed ||
      todayGlow.bodyCareCard?.bodyDone ||
      todayGlow.bodyCareCard?.hairDone ||
      todayGlow.nutritionCard?.logged
    );

    const bodyCareCard = {
      bodyDone: todayGlow.bodyCareCard?.bodyDone ?? isHairBodyDone,
      hairDone: todayGlow.bodyCareCard?.hairDone ?? isHairBodyDone,
      completed: isHairBodyDone,
      badge: isHairBodyDone ? 'Done ✓' : 'Log',
      detail: isHairBodyDone ? 'Glow & Nourished · Done' : 'Scalp Oil, Scrub & Butter',
    };

    return {
      ...data,
      todayGlow: {
        ...todayGlow,
        bodyCareCard,
      },
    };
  };

  const loadDashboardData = async (uid = 1) => {
    if (!uid) return;
    try {
      const rawData = await fetchDashboard(uid);
      const data = normalizeDashboard(rawData);
      setDashboard(data);
      await saveCachedDashboard(data);

      if (data.user) {
        setName(data.user.name || name);
        if (data.user.milestoneDate) setMilestoneDate(data.user.milestoneDate);
        if (data.user.milestoneType) setMilestoneType(data.user.milestoneType);
        if (data.user.goal) setGoal(data.user.goal);
        setUserData(data.user);
        await saveActiveUser(data.user);
      }
      if (data.todayGlow?.weightCard?.logged && data.todayGlow?.weightCard?.weightAm != null) {
        setLoggedWeight(data.todayGlow.weightCard.weightAm);
      } else {
        setLoggedWeight(null);
      }
      try {
        const historyList = await fetchUserDailyLogs(uid);
        if (Array.isArray(historyList)) {
          const map = {};
          historyList.forEach((item) => {
            if (item && item.logDate) {
              map[item.logDate] = item;
            }
          });
          setDailyLogsHistory((prev) => {
            const merged = { ...prev, ...map };
            saveAllDailyLogs(merged);
            return merged;
          });
        }
      } catch (logErr) {
        console.warn('History logs fetch fallback:', logErr);
      }
    } catch (err) {
      console.warn('Dashboard fetch fallback to local state:', err);
    }
  };

  const calculatePreviewDays = () => {
    if (!milestoneDate) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(milestoneDate);
    target.setHours(0, 0, 0, 0);
    const diff = Math.round((target - today) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? diff : 0;
  };

  const handleSubmit = async () => {
    setLoading(true);
    const resolvedName = name.trim() || 'Glow Prepper';
    const days = calculatePreviewDays();
    let phase = 'FOUNDATION';
    let phaseTitle = 'Foundation Phase';
    let phaseDescription = 'Building your routine, steadily';

    if (days < 0) {
      phase = 'MAINTENANCE';
      phaseTitle = 'Maintenance & Glow';
      phaseDescription = 'Evergreen habit mode & steady progress';
    } else if (days <= 6) {
      phase = 'ARRIVAL';
      phaseTitle = 'Arrival Phase';
      phaseDescription = 'Rest prioritized & final glow prep';
    } else if (days <= 29) {
      phase = 'REFINE';
      phaseTitle = 'Refine Phase';
      phaseDescription = 'Tapering strain & protecting your energy';
    } else if (days <= 89) {
      phase = 'BUILD';
      phaseTitle = 'Build Phase';
      phaseDescription = 'Progressive overload & targeted definition';
    }

    const clientUserData = {
      id: userData?.id || Date.now(),
      name: resolvedName,
      email: `${resolvedName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'user'}@clockit.app`,
      milestoneDate,
      milestoneType,
      goal,
      daysRemaining: days,
      phase,
      phaseTitle,
      phaseDescription,
      progressPercentage: Math.max(0, Math.min(100, Math.round(((180 - days) / 180) * 100))),
      height: '163 cm',
    };

    const initialDashboard = {
      user: clientUserData,
      countdown: {
        daysRemaining: days,
        phase,
        phaseTitle,
        phaseDescription,
        progressPercentage: clientUserData.progressPercentage,
        subtitle: `${days} days to your ${milestoneType}`,
      },
      streak: { currentStreak: 0, streakText: '0d', activeToday: false },
      weeklyStrip: generateClientWeeklyStrip(),
      todayGlow: {
        completedCount: 0,
        totalCount: 4,
        weightCard: { logged: false, badge: 'Log', detail: 'Tap to record' },
        skincareCard: { amDone: false, badge: 'Log', detail: 'SPF & Vitamin C' },
        bodyCareCard: { bodyDone: false, hairDone: false, completed: false, badge: 'Log', detail: 'Scalp Oil, Scrub & Butter' },
        workoutCard: { completed: false, badge: 'Start', detail: 'Glutes & Core · 40m' },
      },
    };

    // Save locally immediately so no data is ever lost
    await saveActiveUser(clientUserData);
    await saveCachedDashboard(initialDashboard);
    setUserData(clientUserData);
    setDashboard(initialDashboard);
    setStep('countdown');

    try {
      const payload = {
        name: resolvedName,
        email: clientUserData.email,
        milestoneDate,
        milestoneType,
        goal,
        trackingPreferences: ['Energy & mood', 'Measurements'],
        height: '163 cm',
      };
      const serverUser = await createUser(payload);
      if (serverUser && serverUser.id) {
        setUserData(serverUser);
        await saveActiveUser(serverUser);
        await loadDashboardData(serverUser.id);
      }
    } catch (err) {
      console.warn('Backend offline or slow, local user created successfully:', err);
    } finally {
      setLoading(false);
    }
  };

  const syncTodayHistoryLog = (updatedGlow) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const isWeightLogged = Boolean(updatedGlow.weightCard?.logged && (updatedGlow.weightCard?.weightAm != null || loggedWeight != null));
    const activeWeightAm = isWeightLogged ? (updatedGlow.weightCard?.weightAm ?? loggedWeight) : null;

    const logEntry = {
      logDate: todayStr,
      isDayActive: (updatedGlow.completedCount || 0) > 0,
      dayActive: (updatedGlow.completedCount || 0) > 0,
      weightAm: activeWeightAm,
      skincareAmDone: Boolean(updatedGlow.skincareCard?.amDone),
      skincarePmDone: Boolean(updatedGlow.skincareCard?.pmDone),
      workoutCompleted: Boolean(updatedGlow.workoutCard?.completed),
      workoutName: updatedGlow.workoutCard?.completed ? 'Glutes & Core' : null,
      workoutDurationMinutes: updatedGlow.workoutCard?.completed ? 40 : null,
      nutritionLogged: Boolean(updatedGlow.bodyCareCard?.completed || updatedGlow.bodyCareCard?.bodyDone),
      completedCount: updatedGlow.completedCount || 0,
    };

    setDailyLogsHistory((prev) => {
      const updated = {
        ...prev,
        [todayStr]: logEntry,
      };
      saveDailyLog(todayStr, logEntry);
      return updated;
    });
  };

  const handleRoutineToggle = async (moduleType) => {
    if (moduleType === 'weight') {
      setShowWeightModal(true);
      return;
    }

    const currentGlow = dashboard?.todayGlow || {
      completedCount: 0,
      totalCount: 4,
      weightCard: { logged: false, badge: 'Log', detail: 'Tap to record', weightAm: null },
      skincareCard: { amDone: false, badge: 'Log', detail: 'SPF & Vitamin C' },
      bodyCareCard: { bodyDone: false, hairDone: false, completed: false, badge: 'Log', detail: 'Scalp Oil, Scrub & Butter' },
      workoutCard: { completed: false, badge: 'Start', detail: 'Glutes & Core · 40m' },
    };

    let updatePayload = { module: moduleType };
    let newGlow = { ...currentGlow };

    if (moduleType === 'skincare_am') {
      const nextDone = !(currentGlow.skincareCard?.amDone);
      updatePayload.skincareAmDone = nextDone;
      newGlow.skincareCard = {
        ...newGlow.skincareCard,
        amDone: nextDone,
        badge: nextDone ? 'Done ✓' : 'Log',
        detail: nextDone ? 'SPF & Glow Protected' : 'SPF & Vitamin C',
      };
    } else if (moduleType === 'body_care' || moduleType === 'nutrition') {
      const nextDone = !(currentGlow.bodyCareCard?.completed || currentGlow.bodyCareCard?.bodyDone);
      updatePayload.nutritionLogged = nextDone;
      newGlow.bodyCareCard = {
        ...newGlow.bodyCareCard,
        bodyDone: nextDone,
        hairDone: nextDone,
        completed: nextDone,
        badge: nextDone ? 'Done ✓' : 'Log',
        detail: nextDone ? 'Glow & Nourished · Done' : 'Scalp Oil, Scrub & Butter',
      };
    } else if (moduleType === 'workout') {
      const nextDone = !(currentGlow.workoutCard?.completed);
      updatePayload.workoutCompleted = nextDone;
      updatePayload.workoutName = nextDone ? 'Glutes & Core' : null;
      updatePayload.workoutDurationMinutes = nextDone ? 40 : null;
      newGlow.workoutCard = {
        ...newGlow.workoutCard,
        completed: nextDone,
        badge: nextDone ? 'Done ✓' : 'Start',
        detail: 'Glutes & Core · 40m',
      };
    }

    let completed = 0;
    if (newGlow.weightCard?.logged) completed++;
    if (newGlow.skincareCard?.amDone) completed++;
    if (newGlow.bodyCareCard?.completed || newGlow.bodyCareCard?.bodyDone) completed++;
    if (newGlow.workoutCard?.completed) completed++;
    newGlow.completedCount = completed;

    const isAnyActive = completed > 0;
    const prevStreak = dashboard?.streak?.currentStreak || 0;
    const newStreakVal = isAnyActive ? Math.max(1, prevStreak) : prevStreak;

    syncTodayHistoryLog(newGlow);

    setDashboard((prev) => {
      const updated = {
        ...prev,
        todayGlow: newGlow,
        streak: {
          currentStreak: newStreakVal,
          streakText: `${newStreakVal}d`,
          activeToday: isAnyActive,
        },
      };
      saveCachedDashboard(updated);
      return updated;
    });

    try {
      const updatedData = await updateTodayLog(userData?.id || 1, updatePayload);
      if (updatedData) {
        const normalized = normalizeDashboard(updatedData);
        setDashboard(normalized);
        saveCachedDashboard(normalized);
      }
    } catch (err) {
      console.warn('Backend sync failed, saved locally:', err);
    }
  };

  const handleSaveWeight = async (weightVal, unitVal) => {
    setLoggedWeight(weightVal);
    setWeightUnit(unitVal);

    const currentGlow = dashboard?.todayGlow || {
      completedCount: 0,
      totalCount: 4,
      weightCard: { logged: false, badge: 'Log', detail: 'Tap to record', weightAm: null },
      skincareCard: { amDone: false, badge: 'Log', detail: 'SPF & Vitamin C' },
      bodyCareCard: { bodyDone: false, hairDone: false, completed: false, badge: 'Log', detail: 'Scalp Oil, Scrub & Butter' },
      workoutCard: { completed: false, badge: 'Start', detail: 'Glutes & Core · 40m' },
    };
    const newGlow = { ...currentGlow };
    newGlow.weightCard = {
      ...newGlow.weightCard,
      logged: true,
      weightAm: weightVal,
      badge: 'Logged ✓',
      detail: `${weightVal} ${unitVal} · Recorded`,
    };

    let completed = 0;
    if (newGlow.weightCard?.logged) completed++;
    if (newGlow.skincareCard?.amDone) completed++;
    if (newGlow.bodyCareCard?.completed || newGlow.bodyCareCard?.bodyDone) completed++;
    if (newGlow.workoutCard?.completed) completed++;
    newGlow.completedCount = completed;

    const isAnyActive = completed > 0;
    const prevStreak = dashboard?.streak?.currentStreak || 0;
    const newStreakVal = isAnyActive ? Math.max(1, prevStreak) : prevStreak;

    syncTodayHistoryLog(newGlow);

    setDashboard((prev) => {
      const updated = {
        ...prev,
        todayGlow: newGlow,
        streak: {
          currentStreak: newStreakVal,
          streakText: `${newStreakVal}d`,
          activeToday: isAnyActive,
        },
      };
      saveCachedDashboard(updated);
      return updated;
    });

    try {
      const updatedData = await updateTodayLog(userData?.id || 1, {
        weightAm: weightVal,
      });
      if (updatedData) {
        const normalized = normalizeDashboard(updatedData);
        setDashboard(normalized);
        saveCachedDashboard(normalized);
        if (normalized.todayGlow?.weightCard?.logged && normalized.todayGlow?.weightCard?.weightAm != null) {
          setLoggedWeight(normalized.todayGlow.weightCard.weightAm);
        }
      }
    } catch (err) {
      console.warn('Backend weight sync failed, saved locally:', err);
    }
  };

  const handleSaveSkincare = async (skincarePayload) => {
    const currentGlow = dashboard?.todayGlow || {
      completedCount: 0,
      totalCount: 4,
      weightCard: { logged: false, badge: 'Log', detail: 'Tap to record', weightAm: null },
      skincareCard: { amDone: false, badge: 'Log', detail: 'SPF & Vitamin C' },
      bodyCareCard: { bodyDone: false, hairDone: false, completed: false, badge: 'Log', detail: 'Scalp Oil, Scrub & Butter' },
      workoutCard: { completed: false, badge: 'Start', detail: 'Glutes & Core · 40m' },
    };
    const newGlow = { ...currentGlow };
    newGlow.skincareCard = {
      ...newGlow.skincareCard,
      amDone: skincarePayload.amDone,
      pmDone: skincarePayload.pmDone,
      badge: skincarePayload.amDone ? 'Done ✓' : 'Log',
      detail: skincarePayload.amDone ? 'SPF & Glow Protected' : 'SPF & Vitamin C',
    };

    let completed = 0;
    if (newGlow.weightCard?.logged) completed++;
    if (newGlow.skincareCard?.amDone) completed++;
    if (newGlow.bodyCareCard?.completed || newGlow.bodyCareCard?.bodyDone) completed++;
    if (newGlow.workoutCard?.completed) completed++;
    newGlow.completedCount = completed;

    const isAnyActive = completed > 0;
    const prevStreak = dashboard?.streak?.currentStreak || 0;
    const newStreakVal = isAnyActive ? Math.max(1, prevStreak) : prevStreak;

    syncTodayHistoryLog(newGlow);

    setDashboard((prev) => {
      const updated = {
        ...prev,
        todayGlow: newGlow,
        streak: {
          currentStreak: newStreakVal,
          streakText: `${newStreakVal}d`,
          activeToday: isAnyActive,
        },
      };
      saveCachedDashboard(updated);
      return updated;
    });

    try {
      const updatedData = await updateTodayLog(userData?.id || 1, {
        skincareAmDone: skincarePayload.amDone,
        skincarePmDone: skincarePayload.pmDone,
      });
      if (updatedData) {
        const normalized = normalizeDashboard(updatedData);
        setDashboard(normalized);
        saveCachedDashboard(normalized);
      }
    } catch (err) {
      console.warn('Backend skincare sync failed, saved locally:', err);
    }
  };

  const handleSaveBodyCare = async (bodyCarePayload) => {
    const isAnyDone = Boolean(
      bodyCarePayload.bodyDone ||
      bodyCarePayload.hairDone ||
      bodyCarePayload.weeklyDone ||
      bodyCarePayload.completed ||
      (bodyCarePayload.totalDone && bodyCarePayload.totalDone > 0)
    );

    const currentGlow = dashboard?.todayGlow || {
      completedCount: 0,
      totalCount: 4,
      weightCard: { logged: false, badge: 'Log', detail: 'Tap to record', weightAm: null },
      skincareCard: { amDone: false, badge: 'Log', detail: 'SPF & Vitamin C' },
      bodyCareCard: { bodyDone: false, hairDone: false, completed: false, badge: 'Log', detail: 'Scalp Oil, Scrub & Butter' },
      workoutCard: { completed: false, badge: 'Start', detail: 'Glutes & Core · 40m' },
    };
    const newGlow = { ...currentGlow };
    newGlow.bodyCareCard = {
      ...newGlow.bodyCareCard,
      bodyDone: isAnyDone,
      hairDone: isAnyDone,
      completed: isAnyDone,
      badge: isAnyDone ? 'Done ✓' : 'Log',
      detail: isAnyDone ? 'Glow & Nourished · Done' : 'Scalp Oil, Scrub & Butter',
    };
    if (newGlow.nutritionCard) {
      newGlow.nutritionCard = {
        ...newGlow.nutritionCard,
        logged: isAnyDone,
        badge: isAnyDone ? 'Done ✓' : 'Log',
        detail: isAnyDone ? 'Glow & Nourished · Done' : 'Scalp Oil, Scrub & Butter',
      };
    }

    let completed = 0;
    if (newGlow.weightCard?.logged) completed++;
    if (newGlow.skincareCard?.amDone) completed++;
    if (newGlow.bodyCareCard?.completed || newGlow.bodyCareCard?.bodyDone) completed++;
    if (newGlow.workoutCard?.completed) completed++;
    newGlow.completedCount = completed;

    const isAnyActive = completed > 0;
    const prevStreak = dashboard?.streak?.currentStreak || 0;
    const newStreakVal = isAnyActive ? Math.max(1, prevStreak) : prevStreak;

    syncTodayHistoryLog(newGlow);

    setDashboard((prev) => {
      const updated = {
        ...prev,
        todayGlow: newGlow,
        streak: {
          currentStreak: newStreakVal,
          streakText: `${newStreakVal}d`,
          activeToday: isAnyActive,
        },
      };
      saveCachedDashboard(updated);
      return updated;
    });

    try {
      const updatedData = await updateTodayLog(userData?.id || 1, {
        nutritionLogged: isAnyDone,
        bodyCareDone: isAnyDone,
      });
      if (updatedData) {
        const normalized = normalizeDashboard(updatedData);
        setDashboard(normalized);
        saveCachedDashboard(normalized);
      }
    } catch (err) {
      console.warn('Backend body care sync failed, saved locally:', err);
    }
  };

  const handleCompleteAllToday = async () => {
    const currentGlow = dashboard?.todayGlow || {
      completedCount: 0,
      totalCount: 4,
      weightCard: { logged: false, badge: 'Log', detail: 'Tap to record', weightAm: null },
      skincareCard: { amDone: false, badge: 'Log', detail: 'SPF & Vitamin C' },
      bodyCareCard: { bodyDone: false, hairDone: false, completed: false, badge: 'Log', detail: 'Scalp Oil, Scrub & Butter' },
      workoutCard: { completed: false, badge: 'Start', detail: 'Glutes & Core · 40m' },
    };

    // Collect ONLY the data that the user has ACTUALLY logged
    const isWeightLogged = Boolean(currentGlow.weightCard?.logged && (currentGlow.weightCard?.weightAm != null || loggedWeight != null));
    const finalWeightAm = isWeightLogged ? (currentGlow.weightCard?.weightAm ?? loggedWeight) : null;

    const isSkincareAmDone = Boolean(currentGlow.skincareCard?.amDone);
    const isSkincarePmDone = Boolean(currentGlow.skincareCard?.pmDone);

    const isBodyCareDone = Boolean(
      currentGlow.bodyCareCard?.completed ||
      currentGlow.bodyCareCard?.bodyDone ||
      currentGlow.bodyCareCard?.hairDone ||
      currentGlow.nutritionCard?.logged
    );

    const isWorkoutDone = Boolean(currentGlow.workoutCard?.completed);
    const workoutName = isWorkoutDone ? (currentGlow.workoutCard?.name || 'Glutes & Core') : null;
    const workoutDuration = isWorkoutDone ? (currentGlow.workoutCard?.durationMinutes || 40) : null;

    // Real count (NO fake/fabricated completions)
    let realCompletedCount = 0;
    if (isWeightLogged) realCompletedCount++;
    if (isSkincareAmDone) realCompletedCount++;
    if (isBodyCareDone) realCompletedCount++;
    if (isWorkoutDone) realCompletedCount++;

    const isAnyActive = realCompletedCount > 0;
    const prevStreak = dashboard?.streak?.currentStreak || 0;
    const newStreakVal = isAnyActive ? Math.max(1, prevStreak) : prevStreak;

    const committedGlow = {
      completedCount: realCompletedCount,
      totalCount: 4,
      weightCard: {
        logged: isWeightLogged,
        weightAm: finalWeightAm,
        badge: isWeightLogged ? 'Logged ✓' : 'Log',
        detail: isWeightLogged ? `${finalWeightAm} ${weightUnit || 'kg'} · Recorded` : 'Tap to record',
      },
      skincareCard: {
        amDone: isSkincareAmDone,
        pmDone: isSkincarePmDone,
        badge: isSkincareAmDone ? 'Done ✓' : 'Log',
        detail: isSkincareAmDone ? 'SPF & Glow Protected' : 'SPF & Vitamin C',
      },
      bodyCareCard: {
        completed: isBodyCareDone,
        bodyDone: isBodyCareDone,
        hairDone: isBodyCareDone,
        badge: isBodyCareDone ? 'Done ✓' : 'Log',
        detail: isBodyCareDone ? 'Glow & Nourished · Done' : 'Scalp Oil, Scrub & Butter',
      },
      workoutCard: {
        completed: isWorkoutDone,
        badge: isWorkoutDone ? 'Done ✓' : 'Start',
        detail: 'Glutes & Core · 40m',
      },
    };

    syncTodayHistoryLog(committedGlow);

    setDashboard((prev) => ({
      ...prev,
      todayGlow: committedGlow,
      streak: {
        currentStreak: newStreakVal,
        streakText: `${newStreakVal}d`,
        activeToday: isAnyActive,
      },
    }));

    try {
      const payload = {
        weightAm: finalWeightAm,
        skincareAmDone: isSkincareAmDone,
        skincarePmDone: isSkincarePmDone,
        nutritionLogged: isBodyCareDone,
        bodyCareDone: isBodyCareDone,
        workoutCompleted: isWorkoutDone,
        workoutName: workoutName,
        workoutDurationMinutes: workoutDuration,
      };

      const updatedData = await updateTodayLog(userData?.id || 1, payload);
      if (updatedData) {
        const normalized = normalizeDashboard(updatedData);
        setDashboard(normalized);
        saveCachedDashboard(normalized);
        if (normalized.todayGlow?.weightCard?.logged && normalized.todayGlow?.weightCard?.weightAm != null) {
          setLoggedWeight(normalized.todayGlow.weightCard.weightAm);
        }
      }
    } catch (err) {
      console.warn('Complete/commit backend sync failed, saved locally:', err);
    }
  };

  const handleResetMilestone = async () => {
    await clearActiveUser();
    setUserData(null);
    setDashboard(null);
    setName('');
    setStep('setup');
  };

  const generateClientWeeklyStrip = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);

    const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const strip = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const isToday = d.toDateString() === today.toDateString();
      strip.push({
        dayOfWeek: labels[i],
        dayOfMonth: d.getDate(),
        isToday,
        isCompleted: false,
        status: isToday ? 'TODAY' : d < today ? 'MISSED' : 'FUTURE',
      });
    }
    return strip;
  };

  const renderScreenContent = () => {
    const activeUserName = dashboard?.user?.name || userData?.name || name || 'Glow Prepper';
    const activeGoal = dashboard?.user?.goal || userData?.goal || goal || 'Tone & Sculpt';
    const getWorkoutDetail = (userGoal) => {
      if (userGoal === 'Glow & Energy') return 'Low-Impact Cardio & Radiance · 30m';
      if (userGoal === 'Event Ready') return 'Full-Body Circuit & Posture · 45m';
      return 'Glutes & Core Sculpt · 40m';
    };
    const activeWorkoutDetail = getWorkoutDetail(activeGoal);

    const activeDaysRemaining = dashboard?.countdown?.daysRemaining ?? userData?.daysRemaining ?? calculatePreviewDays();
    const activePhaseTitle = dashboard?.countdown?.phaseTitle || userData?.phaseTitle || 'Foundation Phase';
    const activeProgress = dashboard?.countdown?.progressPercentage ?? userData?.progressPercentage ?? 25;
    const activeStreakText = dashboard?.streak?.streakText || '0d';
    const activeSubtitle = (userData?.milestoneType || milestoneType)
      ? `${activeDaysRemaining} days to your ${userData?.milestoneType || milestoneType}`
      : 'Your Personal Self-Care Countdown';
    const weeklyDays = dashboard?.weeklyStrip || generateClientWeeklyStrip();
    const todayGlow = dashboard?.todayGlow || {
      completedCount: 0,
      totalCount: 4,
      weightCard: { logged: false, badge: 'Log', detail: 'Tap to record' },
      skincareCard: { amDone: false, badge: 'Log', detail: 'SPF & Vitamin C' },
      bodyCareCard: { bodyDone: false, hairDone: false, completed: false, badge: 'Log', detail: 'Scalp Oil, Scrub & Butter' },
      workoutCard: { completed: false, badge: 'Start', detail: activeWorkoutDetail },
    };

    return (
      <LinearGradient
        colors={['#FFFEFC', '#FFF6EF', '#FFEEF2']}
        style={styles.screenGradient}
      >
        {/* Decorative Ambient Blobs & Floating 3D Pearls */}
        <View style={styles.peachBlob} />
        <View style={styles.pinkBlob} />
        {step === 'splash' && (
          <>
            <View style={[styles.pearl, { width: 12, height: 12, top: 48, left: 24 }]} />
            <View style={[styles.pearl, { width: 7, height: 7, top: 88, left: 52 }]} />
          </>
        )}
        <View style={[styles.pearl, { width: 10, height: 10, bottom: 85, right: 28 }]} />
        <View style={[styles.pearl, { width: 6, height: 6, bottom: 125, right: 54 }]} />

        {/* ──────── 1. SPLASH SCREEN (ATOMIC FADE-IN BARRIER) ──────── */}
        {step === 'splash' && (
          <Animated.View style={[styles.splashContent, { opacity: splashFadeAnim }]}>
            <View style={styles.splashCenter}>
              <BowIcon size={46} style={{ marginBottom: 14 }} />

              <View style={styles.wordmarkRow}>
                <Text style={styles.wordmarkText}>CL</Text>
                <ClockO size={30} style={{ marginHorizontal: 2 }} />
                <Text style={styles.wordmarkText}>CK-IT</Text>
              </View>

              <Text style={styles.taglineText}>Your glow, on the clock.</Text>

              {/* Aesthetic Vintage Alarm Clock Visual */}
              <View style={styles.vintageClockContainer}>
                <HeroClock size={168} />
              </View>

              <TouchableOpacity
                activeOpacity={0.88}
                onPress={() => setStep('setup')}
                style={styles.ctaButtonWrapper}
              >
                <LinearGradient
                  colors={[THEME.peachDeep, THEME.pinkDeep]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.ctaButton}
                >
                  <Text style={styles.ctaButtonText}>Get started</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={async () => {
                  const saved = await getActiveUser();
                  if (saved && saved.id) {
                    await loadDashboardData(saved.id);
                    setStep('countdown');
                  } else {
                    setStep('setup');
                  }
                }}
              >
                <Text style={styles.secondaryText}>
                  Already prepping? <Text style={styles.loginUnderline}>Log in</Text>
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dotsRow}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </Animated.View>
        )}

        {/* ──────── 2. MILESTONE SETUP SCREEN (100% ORIGINAL & UNTOUCHED) ──────── */}
        {step === 'setup' && (
          <View style={styles.innerContainer}>
            <View style={styles.navHeader}>
              <TouchableOpacity
                onPress={() => setStep('splash')}
                style={styles.backButton}
                activeOpacity={0.7}
              >
                <Text style={styles.backButtonText}>‹</Text>
              </TouchableOpacity>
              <Text style={styles.navTitle}>Set Your Milestone</Text>
              <Text style={styles.navStep}>Step 1 of 2</Text>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* 1. Name Input */}
              <View style={styles.formGroup}>
                <Text style={styles.fieldLabel}>What should we call you?</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Your Name"
                  placeholderTextColor={THEME.inkLight}
                  value={name}
                  onChangeText={setName}
                />
              </View>

              {/* 2. Milestone Type Selection */}
              <View style={styles.formGroup}>
                <Text style={styles.fieldLabel}>What are you preparing for?</Text>
                <View style={styles.pillsRow}>
                  {['Wedding', 'Photoshoot', 'Vacation', 'Birthday'].map((item) => {
                    const isSelected = milestoneType === item;
                    return (
                      <TouchableOpacity
                        key={item}
                        onPress={() => setMilestoneType(item)}
                        activeOpacity={0.7}
                      >
                        {isSelected ? (
                          <LinearGradient
                            colors={[THEME.peachDeep, THEME.pinkDeep]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.pillActive}
                          >
                            <Text style={styles.pillTextActive}>{item}</Text>
                          </LinearGradient>
                        ) : (
                          <View style={styles.pillInactive}>
                            <Text style={styles.pillTextInactive}>{item}</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* 3. Milestone Date Trigger (Opens Modern Calendar Modal) */}
              <View style={styles.formGroup}>
                <Text style={styles.fieldLabel}>When is your milestone?</Text>
                <TouchableOpacity
                  onPress={() => setShowCalendar(true)}
                  activeOpacity={0.8}
                  style={styles.dateCard}
                >
                  <View style={styles.calendarIconBubble}>
                    <CalendarIcon size={20} color={THEME.pinkDeep} />
                  </View>

                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.dateDisplayText, !milestoneDate && { color: THEME.inkSoft }]}>
                      {formatDisplayDate(milestoneDate)}
                    </Text>
                    <Text style={styles.daysPreviewText}>
                      {milestoneDate ? `~${calculatePreviewDays()} days from today` : 'Tap to pick your milestone date'}
                    </Text>
                  </View>

                  <View style={styles.pickDateBadge}>
                    <Text style={styles.pickDateBadgeText}>{milestoneDate ? 'Change' : 'Pick Date'}</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* 4. Goal Selection Radio Cards */}
              <View style={styles.formGroup}>
                <Text style={styles.fieldLabel}>Primary focus for this countdown:</Text>
                {[
                  ['Tone & Sculpt', 'Fitness, definition & posture'],
                  ['Glow & Energy', 'Skincare, vitality & radiance'],
                  ['Event Ready', 'Complete head-to-toe prep'],
                ].map(([title, subtitle]) => {
                  const isSelected = goal === title;
                  return (
                    <TouchableOpacity
                      key={title}
                      onPress={() => setGoal(title)}
                      activeOpacity={0.7}
                      style={[
                        styles.goalCard,
                        isSelected && styles.goalCardSelected,
                      ]}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={styles.goalTitle}>{title}</Text>
                        <Text style={styles.goalSub}>{subtitle}</Text>
                      </View>
                      <View
                        style={[
                          styles.goalRadio,
                          isSelected && styles.goalRadioSelected,
                        ]}
                      >
                        {isSelected && <View style={styles.goalRadioInner} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            <View style={styles.footerAction}>
              {(() => {
                const isFormValid = Boolean(name.trim() && milestoneType && milestoneDate && goal);
                return (
                  <TouchableOpacity
                    activeOpacity={0.88}
                    onPress={handleSubmit}
                    disabled={loading || !isFormValid}
                    style={[styles.submitButtonWrapper, !isFormValid && { opacity: 0.45 }]}
                  >
                    <LinearGradient
                      colors={[THEME.peachDeep, THEME.pinkDeep]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.ctaButton}
                    >
                      {loading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={styles.ctaButtonText}>
                          {isFormValid ? 'Create My Countdown' : 'Fill all details to begin'}
                        </Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })()}
            </View>
          </View>
        )}

        {/* ──────── 3. HYBRID VIEW 3 (THEME-HARMONIZED MASTER DASHBOARD) ──────── */}
        {step === 'countdown' && (
          <View style={styles.dashboardContainer}>
            {/* Header Cluster */}
            <View style={styles.headerCluster}>
              <View>
                <Text style={styles.greetingTitle}>Hi, {activeUserName}</Text>
              </View>

              <View style={styles.headerRightCluster}>
                <View style={styles.streakPill}>
                  <Text style={styles.streakEmoji}>🔥</Text>
                  <Text style={styles.streakText}>{activeStreakText}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => setActiveTab('profile')}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#FFE7D6', '#F5A8A0']}
                    style={styles.avatarCircle}
                  >
                    <Text style={styles.avatarLetter}>
                      {activeUserName.charAt(0).toUpperCase()}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>

            {/* TAB 1: TODAY'S GLOW DASHBOARD */}
            {activeTab === 'today' && (
              <View style={styles.dashboardBodyContent}>
                {/* Hero Milestone Card with Magical Crystal Hourglass */}
                <LinearGradient
                  colors={['#FFFFFF', '#FFF8F4']}
                  style={styles.countdownHeroCard}
                >
                  <View style={styles.heroCardHeader}>
                    <View style={styles.phaseBadgeContainer}>
                      <Text style={styles.phaseBadgeText}>
                        {activePhaseTitle.toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.eventTargetText}>
                      {formatDisplayDate(dashboard?.user?.milestoneDate || userData?.milestoneDate || milestoneDate)}
                    </Text>
                  </View>

                  <View style={styles.heroCardBody}>
                    <View style={{ flex: 1, paddingRight: 6 }}>
                      <Text style={styles.heroDaysNumber}>{activeDaysRemaining} Days</Text>
                      <Text style={styles.heroGoalText}>
                        Goal: {dashboard?.user?.goal || userData?.goal || goal}
                      </Text>
                      <Text style={styles.heroStatusSub}>
                        Target: {dashboard?.user?.milestoneType || userData?.milestoneType || milestoneType}
                      </Text>
                    </View>

                    {/* Pastel Pink Crystal Hourglass Visual */}
                    <View style={styles.hourglassWrapper}>
                      <HourglassVisual
                        progress={activeProgress}
                        size={80}
                      />
                    </View>
                  </View>
                </LinearGradient>

                {/* Weekly Adherence Strip */}
                <WeeklyStrip days={weeklyDays} />

                {/* Today's Glow Routine Grid */}
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
                      title="Weight"
                      badge={todayGlow.weightCard?.logged ? 'Logged ✓' : 'Log'}
                      completed={!!todayGlow.weightCard?.logged}
                      onPress={() => setShowWeightModal(true)}
                    />
                    <View style={{ width: 8 }} />
                    <RoutineCard
                      imageSource={skincareGirlImg}
                      title="Skincare"
                      badge={todayGlow.skincareCard?.amDone ? 'Done ✓' : 'Log'}
                      completed={!!todayGlow.skincareCard?.amDone}
                      onPress={() => setShowSkincareModal(true)}
                    />
                  </View>

                  <View style={[styles.routineRow, { marginTop: 8 }]}>
                    <RoutineCard
                      icon="🧴"
                      title="Hair & body"
                      badge={
                        todayGlow.bodyCareCard?.completed || todayGlow.bodyCareCard?.bodyDone || todayGlow.nutritionCard?.logged
                          ? 'Done ✓'
                          : 'Log'
                      }
                      completed={
                        Boolean(
                          todayGlow.bodyCareCard?.completed ||
                          todayGlow.bodyCareCard?.bodyDone ||
                          todayGlow.nutritionCard?.logged
                        )
                      }
                      onPress={() => setShowBodyCareModal(true)}
                    />
                    <View style={{ width: 8 }} />
                    <RoutineCard
                      icon="🏋️‍♀️"
                      title="Workout"
                      badge={todayGlow.workoutCard?.completed ? 'Done ✓' : 'Start'}
                      completed={!!todayGlow.workoutCard?.completed}
                      onPress={() => handleRoutineToggle('workout')}
                    />
                  </View>
                </View>

                {/* Primary Action CTA */}
                <TouchableOpacity
                  onPress={handleCompleteAllToday}
                  activeOpacity={0.88}
                  style={styles.completeAllBtnWrapper}
                >
                  <LinearGradient
                    colors={[THEME.peachDeep, THEME.pinkDeep]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.completeAllBtn}
                  >
                    <Text style={styles.completeAllBtnText}>Complete</Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Return Link */}
                <TouchableOpacity
                  onPress={() => setStep('setup')}
                  style={styles.changeMilestoneBtn}
                  activeOpacity={0.7}
                >
                  <Text style={styles.changeMilestoneText}>← Set another milestone</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* TAB 2: CALENDAR & HISTORY SCREEN */}
            {activeTab === 'calendar' && (
              <CalendarHistoryView
                milestoneDate={dashboard?.user?.milestoneDate || userData?.milestoneDate || milestoneDate}
                milestoneType={dashboard?.user?.milestoneType || userData?.milestoneType || milestoneType}
                dashboard={dashboard}
                userData={userData}
                dailyLogsHistory={dailyLogsHistory}
                onOpenWeightModal={() => setShowWeightModal(true)}
                onOpenSkincareModal={() => setShowSkincareModal(true)}
                onOpenBodyCareModal={() => setShowBodyCareModal(true)}
              />
            )}

            {/* TAB 3: WORKOUT SPLIT OVERVIEW */}
            {activeTab === 'split' && (
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 10, paddingBottom: 24 }}
                showsVerticalScrollIndicator={false}
              >
                <View style={{ marginBottom: 14 }}>
                  <Text style={styles.sectionHeaderOverline}>DAILY MOVEMENT</Text>
                  <Text style={styles.sectionHeaderTitle}>AI Workout Split</Text>
                </View>
                <View style={styles.splitHeroCard}>
                  <View style={styles.splitHeroHeader}>
                    <View style={styles.splitBadge}>
                      <Text style={styles.splitBadgeText}>✦ {activePhaseTitle.toUpperCase()}</Text>
                    </View>
                    <Text style={styles.splitDurationText}>40 Min · High Energy</Text>
                  </View>
                  <Text style={styles.splitTitle}>Glutes & Core Sculpt</Text>
                  <Text style={styles.splitDescription}>
                    Targeted activation designed for your {dashboard?.user?.milestoneType || milestoneType} countdown phase.
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleRoutineToggle('workout')}
                    style={[styles.splitCtaBtn, todayGlow.workoutCard?.completed && styles.splitCtaBtnDone]}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.splitCtaText, todayGlow.workoutCard?.completed && styles.splitCtaTextDone]}>
                      {todayGlow.workoutCard?.completed ? 'Workout Completed ✓' : 'Mark Workout Complete'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}

            {/* TAB 4: PROFILE & SETTINGS SCREEN */}
            {activeTab === 'profile' && (
              <ProfileSettingsView
                name={activeUserName}
                milestoneType={dashboard?.user?.milestoneType || userData?.milestoneType || milestoneType}
                milestoneDate={formatDisplayDate(dashboard?.user?.milestoneDate || userData?.milestoneDate || milestoneDate)}
                goal={dashboard?.user?.goal || userData?.goal || goal}
                daysRemaining={activeDaysRemaining}
                phaseTitle={activePhaseTitle}
                onEditMilestone={() => setShowCalendar(true)}
                onResetMilestone={handleResetMilestone}
              />
            )}

            {/* Persistent Bottom Dock */}
            <BottomDock activeTab={activeTab} onTabChange={setActiveTab} />
          </View>
        )}

        {/* Modern Luxury Calendar Modal */}
        <ModernCalendarModal
          visible={showCalendar}
          selectedDate={milestoneDate}
          onSelectDate={setMilestoneDate}
          onClose={() => setShowCalendar(false)}
        />

        {/* Modern Trendy Digital Stepper Weight Log Modal */}
        <WeightLogModal
          visible={showWeightModal}
          currentWeight={loggedWeight}
          initialUnit={weightUnit}
          onSave={handleSaveWeight}
          onClose={() => setShowWeightModal(false)}
        />

        {/* Luxury Skincare Routine Modal */}
        <SkincareRoutineModal
          visible={showSkincareModal}
          initialAmDone={todayGlow.skincareCard?.amDone}
          initialPmDone={todayGlow.skincareCard?.pmDone}
          onSave={handleSaveSkincare}
          onClose={() => setShowSkincareModal(false)}
        />

        {/* Luxury Body & Hair Care Modal */}
        <BodyCareModal
          visible={showBodyCareModal}
          initialBodyDone={Boolean(todayGlow.bodyCareCard?.bodyDone || todayGlow.bodyCareCard?.completed || todayGlow.nutritionCard?.logged)}
          initialHairDone={Boolean(todayGlow.bodyCareCard?.hairDone || todayGlow.bodyCareCard?.completed || todayGlow.nutritionCard?.logged)}
          onSave={handleSaveBodyCare}
          onClose={() => setShowBodyCareModal(false)}
        />
      </LinearGradient>
    );
  };

  // Responsive Layout: Centered luxury phone chassis for Web, Full screen for Native Mobile
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webOuterCanvas}>
        <StatusBar style="dark" />
        <View style={styles.webPhoneChassis}>
          <View style={styles.webPhoneScreen}>
            {renderScreenContent()}
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.nativeContainer}>
      <StatusBar style="dark" />
      {renderScreenContent()}
    </SafeAreaView>
  );
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    PlayfairDisplay_700Bold,
    PlayfairDisplay_500Medium_Italic,
    Quicksand_500Medium,
    Quicksand_600SemiBold,
    Quicksand_700Bold,
  });

  const [appIsReady, setAppIsReady] = useState(false);
  const [initialSession, setInitialSession] = useState(null);

  useEffect(() => {
    async function prepare() {
      try {
        const [savedUser, cachedDashboard, cachedLogs] = await Promise.all([
          getActiveUser(),
          getCachedDashboard(),
          getAllDailyLogs(),
        ]);
        setInitialSession({ savedUser, cachedDashboard, cachedLogs });
      } catch (e) {
        console.warn('Error reading initial storage:', e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if ((fontsLoaded || fontError) && appIsReady) {
      try {
        await SplashScreen.hideAsync();
      } catch (e) {
        // ignore
      }
    }
  }, [fontsLoaded, fontError, appIsReady]);

  if ((!fontsLoaded && !fontError) || !appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider style={{ flex: 1, width: '100%', height: '100%' }}>
      <View style={{ flex: 1, width: '100%', height: '100%' }} onLayout={onLayoutRootView}>
        <AppContent initialSession={initialSession} />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  nativeContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFDFB',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFDFB',
  },
  webOuterCanvas: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFDFB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  webPhoneChassis: {
    width: 390,
    height: 800,
    maxWidth: '100%',
    maxHeight: '100%',
    borderRadius: 48,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FFDCC2',
    shadowColor: '#C4788C',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.25,
    shadowRadius: 32,
    elevation: 8,
  },
  webPhoneScreen: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 38,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#FFFDFB',
  },
  screenGradient: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  peachBlob: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#FFB98F',
    opacity: 0.35,
    top: -50,
    left: -50,
  },
  pinkBlob: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: '#FFCBD8',
    opacity: 0.45,
    bottom: -60,
    right: -60,
  },
  pearl: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: '#FFFDFB',
    borderWidth: 1,
    borderColor: '#F195AC',
    shadowColor: '#F195AC',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3,
  },

  /* ──────── VIEW 1 (SPLASH) ORIGINAL STYLES ──────── */
  splashContent: {
    flex: 1,
    paddingHorizontal: 26,
    justifyContent: 'space-between',
    paddingTop: 48,
    paddingBottom: 20,
  },
  splashCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmarkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'nowrap',
    minHeight: 52,
  },
  wordmarkText: {
    fontFamily: THEME.fonts.displayBold,
    fontSize: 38,
    color: THEME.ink,
    letterSpacing: 0.5,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  taglineText: {
    fontFamily: THEME.fonts.displayItalic,
    fontSize: 15,
    color: THEME.roseGold,
    marginTop: 6,
    marginBottom: 6,
    includeFontPadding: false,
    textAlign: 'center',
  },
  vintageClockContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  ctaButtonWrapper: {
    width: '100%',
    maxWidth: 280,
    borderRadius: 100,
    marginTop: 14,
    shadowColor: '#F195AC',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 6,
  },
  ctaButton: {
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  ctaButtonText: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 15,
    color: '#fff',
    letterSpacing: 0.4,
    includeFontPadding: false,
    textAlign: 'center',
  },
  secondaryText: {
    marginTop: 18,
    fontFamily: THEME.fonts.bodySemiBold,
    fontSize: 13,
    color: THEME.inkSoft,
    includeFontPadding: false,
    textAlign: 'center',
  },
  loginUnderline: {
    color: THEME.roseGold,
    textDecorationLine: 'underline',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 7,
    justifyContent: 'center',
    paddingBottom: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.pink,
  },
  dotActive: {
    width: 20,
    borderRadius: 10,
    backgroundColor: THEME.pinkDeep,
  },

  /* ──────── VIEW 2 (SETUP) ORIGINAL STYLES ──────── */
  innerContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 36,
    justifyContent: 'space-between',
  },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: THEME.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: THEME.ink,
    lineHeight: 22,
  },
  navTitle: {
    fontFamily: THEME.fonts.displayBold,
    fontSize: 18,
    color: THEME.ink,
  },
  navStep: {
    fontFamily: THEME.fonts.bodySemiBold,
    fontSize: 11.5,
    color: THEME.inkSoft,
  },
  scrollContent: {
    paddingVertical: 6,
    gap: 14,
  },
  formGroup: {
    gap: 5,
  },
  fieldLabel: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 12.5,
    color: THEME.ink,
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: THEME.line,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontFamily: THEME.fonts.bodySemiBold,
    fontSize: 13.5,
    color: THEME.ink,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  pillActive: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
    shadowColor: '#F195AC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 2,
  },
  pillTextActive: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 12,
    color: '#fff',
  },
  pillInactive: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: THEME.line,
  },
  pillTextInactive: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 12,
    color: THEME.ink,
  },
  dateCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: THEME.line,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarIconBubble: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFF4EE',
    borderWidth: 1,
    borderColor: '#FFDCC2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateDisplayText: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 14,
    color: THEME.ink,
  },
  daysPreviewText: {
    fontFamily: THEME.fonts.bodySemiBold,
    fontSize: 11.5,
    color: THEME.roseGold,
    marginTop: 2,
  },
  pickDateBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
    backgroundColor: '#FFF4EE',
    borderWidth: 1,
    borderColor: '#FFDCC2',
  },
  pickDateBadgeText: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 11,
    color: THEME.roseGold,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: THEME.line,
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  goalCardSelected: {
    backgroundColor: '#FFF3EE',
    borderColor: THEME.pinkDeep,
    borderWidth: 1.5,
  },
  goalTitle: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 13,
    color: THEME.ink,
  },
  goalSub: {
    fontFamily: THEME.fonts.bodyRegular,
    fontSize: 11,
    color: THEME.inkSoft,
    marginTop: 1,
  },
  goalRadio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: THEME.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalRadioSelected: {
    borderColor: THEME.pinkDeep,
  },
  goalRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: THEME.pinkDeep,
  },
  footerAction: {
    paddingVertical: 10,
  },
  submitButtonWrapper: {
    width: '100%',
    borderRadius: 100,
    shadowColor: '#F195AC',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 4,
  },

  /* ──────── VIEW 3 (HYBRID MASTER DASHBOARD) THEME-MATCHED STYLES ──────── */
  dashboardContainer: {
    flex: 1,
    paddingTop: 36,
  },
  headerCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  greetingTitle: {
    fontFamily: THEME.fonts.displayBold,
    fontSize: 19,
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
  dashboardContainer: {
    flex: 1,
    paddingTop: 12,
    paddingBottom: 4,
    justifyContent: 'space-between',
  },
  headerCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  greetingTitle: {
    fontFamily: THEME.fonts.displayBold,
    fontSize: 19,
    color: THEME.ink,
  },
  greetingSubtitle: {
    fontFamily: THEME.fonts.bodySemiBold,
    fontSize: 11.5,
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
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#FFDCC2',
    gap: 3,
  },
  streakEmoji: {
    fontSize: 11.5,
  },
  streakText: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 11,
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
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 2,
  },
  avatarLetter: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 12.5,
    color: THEME.ink,
  },
  dashboardBodyContent: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    paddingBottom: 6,
  },
  countdownHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 18,
    minHeight: 154,
    borderWidth: 1,
    borderColor: THEME.line,
    shadowColor: '#4A2C33',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 8,
  },
  heroCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  phaseBadgeContainer: {
    backgroundColor: '#FFF0F3',
    paddingHorizontal: 7.5,
    paddingVertical: 2.5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#FFDCC2',
  },
  phaseBadgeText: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 9,
    letterSpacing: 0.6,
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
    fontSize: 24,
    color: THEME.ink,
    lineHeight: 28,
  },
  heroGoalText: {
    fontFamily: THEME.fonts.bodyMedium,
    fontSize: 11,
    color: THEME.inkSoft,
    marginTop: 2,
  },
  heroStatusSub: {
    fontFamily: THEME.fonts.bodySemiBold,
    fontSize: 10.5,
    color: THEME.roseGold,
    marginTop: 1,
  },
  hourglassWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 14.5,
    color: THEME.ink,
  },
  sectionCounter: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 11,
    color: THEME.roseGold,
  },
  routineGrid: {
    marginBottom: 8,
  },
  routineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  completeAllBtnWrapper: {
    borderRadius: 100,
    shadowColor: '#F195AC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 3,
    marginTop: 6,
    marginBottom: 4,
  },
  completeAllBtn: {
    paddingVertical: 13,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeAllBtnText: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  changeMilestoneBtn: {
    alignItems: 'center',
    paddingVertical: 4,
    marginBottom: 2,
  },
  changeMilestoneText: {
    fontFamily: THEME.fonts.bodySemiBold,
    fontSize: 11,
    color: THEME.roseGold,
  },
  sectionHeaderOverline: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 10.5,
    letterSpacing: 1.4,
    color: THEME.inkSoft,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  sectionHeaderTitle: {
    fontFamily: THEME.fonts.displayBold,
    fontSize: 26,
    color: THEME.ink,
    letterSpacing: 0.2,
  },
  splitHeroCard: {
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
  splitHeroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  splitBadge: {
    backgroundColor: '#FFF4EE',
    borderWidth: 1,
    borderColor: '#FBDBC8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 100,
  },
  splitBadgeText: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 10,
    color: '#D98853',
  },
  splitDurationText: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 11,
    color: '#9C7F77',
  },
  splitTitle: {
    fontFamily: THEME.fonts.displayBold,
    fontSize: 18,
    color: THEME.ink,
    marginBottom: 4,
  },
  splitDescription: {
    fontFamily: THEME.fonts.bodyRegular,
    fontSize: 12.5,
    color: '#9C7F77',
    marginBottom: 14,
    lineHeight: 18,
  },
  splitCtaBtn: {
    backgroundColor: '#FAF3ED',
    borderWidth: 1.2,
    borderColor: '#D98853',
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splitCtaBtnDone: {
    backgroundColor: '#FDECE1',
    borderColor: '#D98853',
  },
  splitCtaText: {
    fontFamily: THEME.fonts.bodyBold,
    fontSize: 13,
    color: '#D98853',
  },
  splitCtaTextDone: {
    color: '#D98853',
  },
});
