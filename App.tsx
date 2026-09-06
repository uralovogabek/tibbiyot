import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, Platform, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { COLORS } from './src/constants/theme';
import { TabType, FavoriteItem } from './src/types';
import { StorageService } from './src/services/storageService';
import { Header } from './src/components/Header';
import { NavigationTab } from './src/components/NavigationTab';
import { FlowerMenuModal } from './src/components/FlowerMenuModal';
import { HomeScreen } from './src/screens/HomeScreen';
import { PrescriptionScreen } from './src/screens/PrescriptionScreen';
import { LatinTermsScreen } from './src/screens/LatinTermsScreen';
import { FavoritesScreen } from './src/screens/FavoritesScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [flowerMenuVisible, setFlowerMenuVisible] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const data = await StorageService.getFavorites();
    setFavorites(data);
  };

  const handleToggleFavorite = async (item: FavoriteItem) => {
    await StorageService.toggleFavorite(item);
    await loadFavorites();
  };

  const handleRemoveFavorite = async (id: string) => {
    await StorageService.removeFavorite(id);
    await loadFavorites();
  };

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'home':
        return 'Bugun';
      case 'prescriptions':
        return 'Retseptura AI';
      case 'latin':
        return 'Lotin tili AI';
      case 'favorites':
        return 'Konspekt';
      case 'settings':
        return 'Sozlamalar';
      default:
        return 'Tibbiyot';
    }
  };

  // Chat sahifalarida (prescriptions va latin) pastki suzuvchi dock yashiriladi
  // Shunda chat input butun pastki qismni egallaydi va ekranning vertikal joyi tejab qolinadi
  const isChatScreen = activeTab === 'prescriptions' || activeTab === 'latin';

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

        {/* Minimalist Header */}
        <Header
          title={getHeaderTitle()}
          dateText="6-Sentabr, 2026"
          showBack={activeTab === 'settings'}
          onBack={() => setActiveTab('home')}
          onSearchPress={() => setActiveTab('latin')}
          onSettingsPress={() => setActiveTab(activeTab === 'settings' ? 'home' : 'settings')}
        />

        {/* Asosiy Dinamik Ekran Maydoni */}
        <View style={styles.mainContainer}>
          <View style={styles.contentWrapper}>
            {activeTab === 'home' && (
              <HomeScreen
                onNavigateTab={setActiveTab}
                favoritesCount={favorites.length}
              />
            )}

            {activeTab === 'prescriptions' && (
              <PrescriptionScreen
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onNavigateHome={() => setActiveTab('home')}
              />
            )}

            {activeTab === 'latin' && (
              <LatinTermsScreen
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onNavigateHome={() => setActiveTab('home')}
              />
            )}

            {activeTab === 'favorites' && (
              <FavoritesScreen
                favorites={favorites}
                onRemoveFavorite={handleRemoveFavorite}
                onRefreshFavorites={loadFavorites}
                onNavigateSettings={() => setActiveTab('settings')}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsScreen onBack={() => setActiveTab('home')} />
            )}
          </View>
        </View>

        {/* Suzuvchi Pastki Navigatsiya Dock (Chat ekranlarida vertikal joy bo'shatish uchun yashiriladi) */}
        {!isChatScreen && (
          <NavigationTab
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onCenterActionPress={() => setFlowerMenuVisible(true)}
            favoritesCount={favorites.length}
          />
        )}

        {/* GUL KABI OCHILUVCHI RADIAL MENYU (FLOWER BLOOM MENU) */}
        <FlowerMenuModal
          visible={flowerMenuVisible}
          onClose={() => setFlowerMenuVisible(false)}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setFlowerMenuVisible(false);
          }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    position: 'relative',
  },
  contentWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 960 : '100%',
    alignSelf: 'center',
  },
});
