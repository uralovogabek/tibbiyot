import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Text } from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { TabType } from '../types';
import { LayoutGrid, Pill, Sparkles, BookOpen, Bookmark, Settings } from 'lucide-react-native';

interface NavigationTabProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onCenterActionPress?: () => void;
  favoritesCount?: number;
}

export const NavigationTab: React.FC<NavigationTabProps> = ({
  activeTab,
  onTabChange,
  onCenterActionPress,
  favoritesCount = 0,
}) => {
  return (
    <View style={styles.dockWrapper} pointerEvents="box-none">
      <View style={styles.dockContainer}>
        {/* 1. Asosiy Dashboard (Grid) */}
        <TouchableOpacity
          style={styles.dockItem}
          onPress={() => onTabChange('home')}
          activeOpacity={0.7}
        >
          <LayoutGrid
            size={22}
            color={activeTab === 'home' ? COLORS.primary : COLORS.textMuted}
            strokeWidth={activeTab === 'home' ? 2.5 : 1.8}
          />
          {activeTab === 'home' && <View style={styles.activeDot} />}
        </TouchableOpacity>

        {/* 2. Retseptura (Pill) */}
        <TouchableOpacity
          style={styles.dockItem}
          onPress={() => onTabChange('prescriptions')}
          activeOpacity={0.7}
        >
          <Pill
            size={22}
            color={activeTab === 'prescriptions' ? COLORS.primary : COLORS.textMuted}
            strokeWidth={activeTab === 'prescriptions' ? 2.5 : 1.8}
          />
          {activeTab === 'prescriptions' && <View style={styles.activeDot} />}
        </TouchableOpacity>

        {/* 3. Markaziy Suzuvchi Asosiy Harakat Tugmasi (Center FAB) */}
        <TouchableOpacity
          style={styles.centerFab}
          onPress={() => {
            if (onCenterActionPress) onCenterActionPress();
            else onTabChange('prescriptions');
          }}
          activeOpacity={0.85}
        >
          <Sparkles size={22} color={COLORS.accent} strokeWidth={2.5} />
        </TouchableOpacity>

        {/* 4. Lotin tili (BookOpen) */}
        <TouchableOpacity
          style={styles.dockItem}
          onPress={() => onTabChange('latin')}
          activeOpacity={0.7}
        >
          <BookOpen
            size={22}
            color={activeTab === 'latin' ? COLORS.primary : COLORS.textMuted}
            strokeWidth={activeTab === 'latin' ? 2.5 : 1.8}
          />
          {activeTab === 'latin' && <View style={styles.activeDot} />}
        </TouchableOpacity>

        {/* 5. Saqlanganlar (Bookmark) */}
        <TouchableOpacity
          style={styles.dockItem}
          onPress={() => onTabChange('favorites')}
          activeOpacity={0.7}
        >
          <View style={{ position: 'relative' }}>
            <Bookmark
              size={22}
              color={activeTab === 'favorites' ? COLORS.primary : COLORS.textMuted}
              strokeWidth={activeTab === 'favorites' ? 2.5 : 1.8}
            />
            {favoritesCount > 0 && (
              <View style={styles.countBadge}>
                <Text style={styles.countText}>
                  {favoritesCount > 9 ? '9+' : favoritesCount}
                </Text>
              </View>
            )}
          </View>
          {activeTab === 'favorites' && <View style={styles.activeDot} />}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dockWrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.dock,
    paddingHorizontal: 16,
    paddingVertical: 10,
    width: '90%',
    maxWidth: 390,
    ...SHADOWS.dock,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  dockItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    position: 'relative',
  },
  centerFab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -16,
    ...SHADOWS.fab,
    borderWidth: 3,
    borderColor: COLORS.surface,
  },
  activeDot: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
  },
  countBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: COLORS.accentDark,
    borderRadius: RADIUS.full,
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    color: COLORS.textWhite,
    fontSize: 8,
    fontWeight: '800',
  },
});
