import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings, FavoriteItem } from '../types';

const STORAGE_KEYS = {
  FAVORITES: '@tibbiyot_favorites_v2',
  SETTINGS: '@tibbiyot_settings_v2',
  HISTORY: '@tibbiyot_history_v2',
  RX_CHAT: '@tibbiyot_rx_chat_v2',
  LATIN_CHAT: '@tibbiyot_latin_chat_v2',
};

const DEFAULT_SETTINGS: AppSettings = {
  geminiApiKey: '',
  supabaseUrl: '',
  supabaseAnonKey: '',
  fontSize: 'normal',
  autoSaveHistory: true,
};

export const StorageService = {
  // 1. Sevimlilar (Favorites)
  async getFavorites(): Promise<FavoriteItem[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Sevimlilarni yuklashda xatolik:', e);
      return [];
    }
  },

  async toggleFavorite(item: FavoriteItem): Promise<boolean> {
    try {
      const current = await this.getFavorites();
      const exists = current.some((f) => f.id === item.id);
      let updated: FavoriteItem[];

      if (exists) {
        updated = current.filter((f) => f.id !== item.id);
      } else {
        updated = [item, ...current];
      }

      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
      return !exists;
    } catch (e) {
      console.error('Sevimliga saqlashda xatolik:', e);
      return false;
    }
  },

  async isFavorite(id: string): Promise<boolean> {
    try {
      const current = await this.getFavorites();
      return current.some((f) => f.id === id);
    } catch {
      return false;
    }
  },

  async removeFavorite(id: string): Promise<void> {
    try {
      const current = await this.getFavorites();
      const updated = current.filter((f) => f.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
    } catch (e) {
      console.error('O\'chirishda xatolik:', e);
    }
  },

  // 2. Retseptura AI Chat Tarixi (Persistent Chat History)
  async getRxChatHistory(): Promise<any[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.RX_CHAT);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async saveRxChatHistory(messages: any[]): Promise<void> {
    try {
      // Oxirgi 50 ta xabarni saqlash
      const trimmed = messages.slice(-50);
      await AsyncStorage.setItem(STORAGE_KEYS.RX_CHAT, JSON.stringify(trimmed));
    } catch (e) {
      console.error('Rx chat tarixini saqlashda xatolik:', e);
    }
  },

  async clearRxChatHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.RX_CHAT);
    } catch (e) {
      console.error('Rx chatni tozalashda xatolik:', e);
    }
  },

  // 3. Lotin tili Chat Tarixi
  async getLatinChatHistory(): Promise<any[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.LATIN_CHAT);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async saveLatinChatHistory(messages: any[]): Promise<void> {
    try {
      const trimmed = messages.slice(-50);
      await AsyncStorage.setItem(STORAGE_KEYS.LATIN_CHAT, JSON.stringify(trimmed));
    } catch (e) {
      console.error('Lotin chat tarixini saqlashda xatolik:', e);
    }
  },

  async clearLatinChatHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.LATIN_CHAT);
    } catch (e) {
      console.error('Lotin chatni tozalashda xatolik:', e);
    }
  },

  // 4. Sozlamalar (Settings)
  async getSettings(): Promise<AppSettings> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  async saveSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
    try {
      const current = await this.getSettings();
      const updated = { ...current, ...settings };
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      return updated;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  // 5. Tarix (Search Queries)
  async getHistory(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async addHistory(query: string): Promise<void> {
    if (!query.trim()) return;
    try {
      const list = await this.getHistory();
      const filtered = list.filter((item) => item.toLowerCase() !== query.toLowerCase());
      const updated = [query.trim(), ...filtered].slice(0, 15);
      await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    } catch (e) {
      console.error('Tarixga saqlashda xatolik:', e);
    }
  },
};
