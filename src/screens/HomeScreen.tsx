import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { TabType } from '../types';
import {
  Pill,
  BookOpen,
  Sparkles,
  Bookmark,
  Lock,
  ChevronRight,
  Info,
} from 'lucide-react-native';

interface HomeScreenProps {
  onNavigateTab: (tab: TabType) => void;
  favoritesCount: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateTab,
  favoritesCount,
}) => {
  const [lockedNotice, setLockedNotice] = useState(false);

  const handleLockedPress = () => {
    setLockedNotice(true);
    setTimeout(() => setLockedNotice(false), 3000);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* 2x2 ORGANIK VIDJETLAR SETKASI */}
      <View style={styles.widgetGrid}>
        {/* 1. Vidjet: 💊 Retseptura AI Chat */}
        <TouchableOpacity
          style={[styles.widgetCard, { backgroundColor: COLORS.widgetMauve }]}
          onPress={() => onNavigateTab('prescriptions')}
          activeOpacity={0.88}
        >
          <View style={styles.widgetDecorationCircle} />
          <View style={styles.widgetTopRow}>
            <View style={styles.widgetIconWrap}>
              <Pill size={17} color={COLORS.textWhite} />
            </View>
          </View>
          <View style={styles.widgetBottom}>
            <Text style={styles.widgetTitle}>Retseptura</Text>
            <Text style={styles.widgetSub}>AI Chat orqali</Text>
          </View>
        </TouchableOpacity>

        {/* 2. Vidjet: 🏛️ Lotin tili AI Chat */}
        <TouchableOpacity
          style={[styles.widgetCard, { backgroundColor: COLORS.widgetPeach }]}
          onPress={() => onNavigateTab('latin')}
          activeOpacity={0.88}
        >
          <View style={styles.widgetDecorationCircle} />
          <View style={styles.widgetTopRow}>
            <View style={styles.widgetIconWrap}>
              <BookOpen size={17} color={COLORS.textWhite} />
            </View>
          </View>
          <View style={styles.widgetBottom}>
            <Text style={styles.widgetTitle}>Lotin tili</Text>
            <Text style={styles.widgetSub}>Terminlar tahlili</Text>
          </View>
        </TouchableOpacity>

        {/* 3. Vidjet: 🔒 Dozalash (Qulflangan) */}
        <TouchableOpacity
          style={[styles.widgetCard, styles.widgetLocked]}
          onPress={handleLockedPress}
          activeOpacity={0.7}
        >
          <View style={styles.widgetTopRow}>
            <View style={styles.lockedBadge}>
              <Lock size={12} color={COLORS.textWhite} />
              <Text style={styles.lockedBadgeText}>Tez kunda</Text>
            </View>
          </View>
          <View style={styles.widgetBottom}>
            <Text style={[styles.widgetTitle, { color: COLORS.textMuted }]}>Dozalash</Text>
            <Text style={[styles.widgetSub, { color: COLORS.textMuted }]}>Kalkulyator (Yopiq)</Text>
          </View>
        </TouchableOpacity>

        {/* 4. Vidjet: ⭐ Saqlanganlar / Konspekt */}
        <TouchableOpacity
          style={[styles.widgetCard, { backgroundColor: COLORS.widgetCoral }]}
          onPress={() => onNavigateTab('favorites')}
          activeOpacity={0.88}
        >
          <View style={styles.widgetDecorationCircle} />
          <View style={styles.widgetTopRow}>
            <View style={styles.widgetIconWrap}>
              <Bookmark size={17} color={COLORS.textWhite} />
            </View>
          </View>
          <View style={styles.widgetBottom}>
            <Text style={styles.widgetTitle}>Konspekt</Text>
            <Text style={styles.widgetSub}>{favoritesCount} ta saqlangan</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Dozalash qulf xabarnomasi */}
      {lockedNotice && (
        <View style={styles.noticeBox}>
          <Info size={16} color={COLORS.primary} />
          <Text style={styles.noticeText}>
            🔒 Dozalash kalkulyatori tez kunda keyingi yangilanishda ishga tushadi!
          </Text>
        </View>
      )}

      {/* RETSEPTURA CHAT PROMO BANNERI */}
      <TouchableOpacity
        style={styles.chatPromoBanner}
        onPress={() => onNavigateTab('prescriptions')}
        activeOpacity={0.85}
      >
        <View style={styles.promoIconWrap}>
          <Sparkles size={22} color={COLORS.primary} strokeWidth={2.5} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.promoTitle}>Dori retsepti kerakmi?</Text>
          <Text style={styles.promoDesc}>
            AI Chatga kiring va dori nomini yozing — bir zumda tayyor lotincha retsept oling!
          </Text>
        </View>
        <ChevronRight size={18} color={COLORS.primary} />
      </TouchableOpacity>

      {/* LOTIN TILI CHAT PROMO BANNERI */}
      <TouchableOpacity
        style={[styles.chatPromoBanner, { borderColor: 'rgba(236, 160, 116, 0.3)' }]}
        onPress={() => onNavigateTab('latin')}
        activeOpacity={0.85}
      >
        <View style={[styles.promoIconWrap, { backgroundColor: 'rgba(236, 160, 116, 0.15)' }]}>
          <BookOpen size={22} color={COLORS.widgetPeach} strokeWidth={2.5} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.promoTitle}>Lotincha termin bormi?</Text>
          <Text style={styles.promoDesc}>
            Atamani yozing va uning aniq grammatikasi va klinik maʼnosini oling!
          </Text>
        </View>
        <ChevronRight size={18} color={COLORS.widgetPeach} />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: 110,
    maxWidth: 960,
    width: '100%',
    alignSelf: 'center',
  },
  widgetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: SPACING.lg,
  },
  widgetCard: {
    width: '48%',
    flexGrow: 1,
    minHeight: 124,
    borderRadius: RADIUS.card,
    padding: SPACING.lg,
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
    ...SHADOWS.widget,
  },
  widgetDecorationCircle: {
    position: 'absolute',
    top: -20,
    left: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  widgetTopRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  widgetIconWrap: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  widgetBottom: {
    marginTop: 18,
  },
  widgetTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textWhite,
    letterSpacing: -0.2,
  },
  widgetSub: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.82)',
    fontWeight: '500',
    marginTop: 2,
  },
  widgetLocked: {
    backgroundColor: '#E2E6EE',
    opacity: 0.85,
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#9BA3B2',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  lockedBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textWhite,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  noticeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    flex: 1,
  },
  chatPromoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: SPACING.lg,
    marginBottom: 12,
    ...SHADOWS.card,
    borderWidth: 1,
    borderColor: 'rgba(16, 54, 125, 0.08)',
  },
  promoIconWrap: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  promoDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
    marginTop: 2,
  },
});
