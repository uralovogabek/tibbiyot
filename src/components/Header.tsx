import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { Calendar, Search, SlidersHorizontal, Settings, ChevronLeft } from 'lucide-react-native';

interface HeaderProps {
  dateText?: string;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  onSearchPress?: () => void;
  onSettingsPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  dateText = '6-Sentabr, 2026',
  title = 'Bugun',
  showBack,
  onBack,
  onSearchPress,
  onSettingsPress,
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.inner}>
        {/* Yuqori qator: Sana va ikonkalar */}
        <View style={styles.topRow}>
          <View style={styles.dateBadge}>
            <Text style={styles.dateText}>{dateText}</Text>
            <Calendar size={15} color={COLORS.textSecondary} strokeWidth={2} />
          </View>

          <View style={styles.actionGroup}>
            {onSearchPress && (
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={onSearchPress}
                activeOpacity={0.7}
              >
                <Search size={18} color={COLORS.textPrimary} strokeWidth={2} />
              </TouchableOpacity>
            )}
            {onSettingsPress && (
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={onSettingsPress}
                activeOpacity={0.7}
              >
                <SlidersHorizontal size={18} color={COLORS.textPrimary} strokeWidth={2} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Asosiy Sarlavha va orqaga qaytish */}
        <View style={styles.titleRow}>
          {showBack && onBack && (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={onBack}
              activeOpacity={0.7}
            >
              <ChevronLeft size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          )}
          <Text style={styles.mainTitle}>{title}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'ios' ? 12 : 16,
    paddingBottom: 8,
    paddingHorizontal: SPACING.lg,
  },
  inner: {
    maxWidth: 960,
    width: '100%',
    alignSelf: 'center',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
});
