import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { StorageService } from './storageService';
import { FavoriteItem } from '../types';

let supabaseInstance: SupabaseClient | null = null;

export const SupabaseService = {
  async getClient(): Promise<SupabaseClient | null> {
    if (supabaseInstance) return supabaseInstance;

    const settings = await StorageService.getSettings();
    if (settings.supabaseUrl && settings.supabaseAnonKey) {
      try {
        supabaseInstance = createClient(settings.supabaseUrl.trim(), settings.supabaseAnonKey.trim());
        return supabaseInstance;
      } catch (e) {
        console.error('Supabase ulanish xatosi:', e);
        return null;
      }
    }
    return null;
  },

  async isConnected(): Promise<boolean> {
    const client = await this.getClient();
    if (!client) return false;
    try {
      const { error } = await client.from('favorites').select('id').limit(1);
      return !error;
    } catch {
      return false;
    }
  },

  async syncFavoriteToCloud(item: FavoriteItem): Promise<boolean> {
    const client = await this.getClient();
    if (!client) return false;
    try {
      const { error } = await client.from('favorites').upsert({
        id: item.id,
        type: item.type,
        title: item.title,
        subtitle: item.subtitle,
        saved_at: new Date(item.savedAt).toISOString(),
        payload: item.data,
      });
      return !error;
    } catch (e) {
      console.warn('Supabase sinxronlashda ogohlantirish:', e);
      return false;
    }
  },

  resetClient(): void {
    supabaseInstance = null;
  }
};
