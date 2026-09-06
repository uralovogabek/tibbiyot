import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { FavoriteItem, LatinTerm, PrescriptionResult } from '../types';
import { PrescriptionCard } from '../components/PrescriptionCard';
import { LatinTermCard } from '../components/LatinTermCard';
import { SupabaseService } from '../services/supabaseService';
import { Bookmark, Cloud, SlidersHorizontal } from 'lucide-react-native';

interface FavoritesScreenProps {
  favorites: FavoriteItem[];
  onRemoveFavorite: (id: string) => void;
  onRefreshFavorites: () => void;
  onNavigateSettings?: () => void;
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  favorites,
  onRemoveFavorite,
  onRefreshFavorites,
  onNavigateSettings,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'prescription' | 'latin'>('all');
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const filteredList = useMemo(() => {
    if (filterType === 'all') return favorites;
    return favorites.filter((item) => item.type === filterType);
  }, [favorites, filterType]);

  const handleCloudSync = async () => {
    setSyncing(true);
    setSyncStatus(null);
    try {
      const isConn = await SupabaseService.isConnected();
      if (!isConn) {
        setSyncStatus('Supabase ulanmagan. Sozlamalarga oʻtib Project URL va Anon Key kiriting.');
        setTimeout(() => setSyncStatus(null), 5000);
        return;
      }

      let count = 0;
      for (const item of favorites) {
        const ok = await SupabaseService.syncFavoriteToCloud(item);
        if (ok) count++;
      }
      setSyncStatus(`${count} ta element Supabase bulutiga yuklandi!`);
      setTimeout(() => setSyncStatus(null), 4000);
    } catch {
      setSyncStatus('Sinxronlashda xatolik yuz berdi');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* KAPSULA FILTRLAR VA BULUT TUGMASI */}
      <View style={styles.topControls}>
        <View style={styles.pillGroup}>
          <TouchableOpacity
            style={[styles.pill, filterType === 'all' && styles.pillActive]}
            onPress={() => setFilterType('all')}
          >
            <Text style={[styles.pillText, filterType === 'all' && styles.pillTextActive]}>
              Barchasi ({favorites.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pill, filterType === 'prescription' && styles.pillActive]}
            onPress={() => setFilterType('prescription')}
          >
            <Text style={[styles.pillText, filterType === 'prescription' && styles.pillTextActive]}>
              Retseptlar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pill, filterType === 'latin' && styles.pillActive]}
            onPress={() => setFilterType('latin')}
          >
            <Text style={[styles.pillText, filterType === 'latin' && styles.pillTextActive]}>
              Lotin tili
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.syncBtn}
          onPress={handleCloudSync}
          disabled={syncing}
          activeOpacity={0.7}
        >
          {syncing ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Cloud size={16} color={COLORS.primary} />
          )}
          <Text style={styles.syncText}>Supabase Sync</Text>
        </TouchableOpacity>
      </View>

      {syncStatus ? (
        <View style={styles.alertBox}>
          <Text style={styles.alertText}>{syncStatus}</Text>
          {onNavigateSettings && syncStatus.includes('Sozlamalarga') && (
            <TouchableOpacity
              style={styles.settingsQuickBtn}
              onPress={onNavigateSettings}
              activeOpacity={0.8}
            >
              <SlidersHorizontal size={14} color="#10367D" />
              <Text style={styles.settingsQuickText}>Sozlamalarni ochish</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : null}

      {/* BO'SH HOLAT */}
      {filteredList.length === 0 ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconCircle}>
            <Bookmark size={28} color={COLORS.primary} strokeWidth={1.8} />
          </View>
          <Text style={styles.emptyTitle}>Hozircha saqlanganlar yoʻq</Text>
          <Text style={styles.emptyDesc}>
            Oʻzingizga kerakli boʻlgan retsept va lotin terminlaridagi xatchoʻp belgisini bossangiz,
            ular bu yerda doimiy saqlanib turadi.
          </Text>
        </View>
      ) : (
        filteredList.map((item) => {
          if (item.type === 'prescription') {
            return (
              <PrescriptionCard
                key={item.id}
                prescription={item.data as PrescriptionResult}
                isFavorite={true}
                onToggleFavorite={() => onRemoveFavorite(item.id)}
              />
            );
          } else {
            return (
              <LatinTermCard
                key={item.id}
                term={item.data as LatinTerm}
                isFavorite={true}
                onToggleFavorite={() => onRemoveFavorite(item.id)}
              />
            );
          }
        })
      )}
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
    paddingTop: SPACING.sm,
    paddingBottom: 110,
    maxWidth: 960,
    width: '100%',
    alignSelf: 'center',
  },
  topControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: SPACING.md,
  },
  pillGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    ...SHADOWS.card,
  },
  pillActive: {
    backgroundColor: COLORS.widgetMauve,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  pillTextActive: {
    color: COLORS.textWhite,
    fontWeight: '700',
  },
  syncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    ...SHADOWS.card,
  },
  syncText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  alertBox: {
    backgroundColor: COLORS.surface,
    padding: 10,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  alertText: {
    fontSize: 12,
    color: COLORS.primary,
    textAlign: 'center',
    fontWeight: '600',
  },
  settingsQuickBtn: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: COLORS.accentSoft,
    borderRadius: RADIUS.full,
    alignSelf: 'center',
  },
  settingsQuickText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: SPACING.xxl,
    alignItems: 'center',
    marginVertical: 20,
    ...SHADOWS.card,
  },
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    maxWidth: 380,
  },
});
