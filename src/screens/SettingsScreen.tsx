import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { AppSettings } from '../types';
import { StorageService } from '../services/storageService';
import { SupabaseService } from '../services/supabaseService';
import {
  Settings as SettingsIcon,
  Sparkles,
  Key,
  Database,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Eye,
  EyeOff,
  ChevronLeft,
} from 'lucide-react-native';

interface SettingsScreenProps {
  onBack?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const [settings, setSettings] = useState<AppSettings>({
    geminiApiKey: '',
    supabaseUrl: '',
    supabaseAnonKey: '',
    fontSize: 'normal',
    autoSaveHistory: true,
  });

  const [showKey, setShowKey] = useState(false);
  const [testingGemini, setTestingGemini] = useState(false);
  const [geminiStatus, setGeminiStatus] = useState<string | null>(null);

  const [testingSupabase, setTestingSupabase] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const s = await StorageService.getSettings();
    setSettings(s);
  };

  const handleSaveGeminiKey = async () => {
    if (!settings.geminiApiKey.trim()) {
      await StorageService.saveSettings({ geminiApiKey: '' });
      setGeminiStatus('API kalit tozalandi (Standart baza rejimi ishlaydi)');
      return;
    }

    setTestingGemini(true);
    setGeminiStatus(null);
    try {
      // Test Gemini API with modern model (gemini-3.5-flash / gemini-2.5-flash)
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${settings.geminiApiKey.trim()}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Salom' }] }]
        })
      });

      if (res.ok) {
        await StorageService.saveSettings({ geminiApiKey: settings.geminiApiKey.trim() });
        setGeminiStatus('✅ Google Gemini API kalit muvaffaqiyatli tekshirildi va saqlandi!');
      } else {
        const data = await res.json();
        const msg = data?.error?.message || '';
        if (res.status === 429 || msg.includes('credits are depleted') || msg.includes('RESOURCE_EXHAUSTED')) {
          setGeminiStatus('⚠️ 429 Quota Xatosi: Ushbu API kalitda Google AI krediti tugagan. Yangi Google akkount orqali aistudio.google.com dan bepul AIzaSy... kalit oling.');
        } else {
          setGeminiStatus(`❌ Xatolik: ${msg || 'Noto\'g\'ri API kalit'}`);
        }
      }
    } catch (e: any) {
      setGeminiStatus('❌ Ulanish xatosi. Internet aloqasini tekshiring.');
    } finally {
      setTestingGemini(false);
    }
  };

  const handleSaveSupabase = async () => {
    setTestingSupabase(true);
    setSupabaseStatus(null);
    try {
      await StorageService.saveSettings({
        supabaseUrl: settings.supabaseUrl.trim(),
        supabaseAnonKey: settings.supabaseAnonKey.trim(),
      });
      SupabaseService.resetClient();

      const ok = await SupabaseService.isConnected();
      if (ok) {
        setSupabaseStatus('✅ Supabase ulanishi muvaffaqiyatli!');
      } else {
        setSupabaseStatus('⚠️ Sozlamalar saqlandi, lekin bazaga ulanib boʻlmadi (URL/Anon Key tekshiring).');
      }
    } catch {
      setSupabaseStatus('❌ Supabase sozlamasini saqlashda xatolik');
    } finally {
      setTestingSupabase(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerTopRow}>
          {onBack && (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={onBack}
              activeOpacity={0.7}
            >
              <ChevronLeft size={20} color={COLORS.primary} />
            </TouchableOpacity>
          )}
          <View style={styles.iconBox}>
            <SettingsIcon size={22} color={COLORS.primary} strokeWidth={2.5} />
          </View>
        </View>
        <View style={styles.bannerInfo}>
          <Text style={styles.bannerTitle}>Sozlamalar va API Kalitlari</Text>
          <Text style={styles.bannerDesc}>
            Google Gemini sunʼiy intellekti va Supabase bulutli maʼlumotlar bazasi integratsiyasi.
          </Text>
        </View>
      </View>

      {/* 1. Google Gemini API Sozlamasi */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIconWrap}>
            <Sparkles size={18} color={COLORS.primary} strokeWidth={2.5} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>Google AI Studio (Gemini API)</Text>
            <Text style={styles.sectionSubtitle}>
              Retseptura va lotin tilini generatsiya qilish uchun bepul API kalit
            </Text>
          </View>
        </View>

        <Text style={styles.fieldLabel}>Gemini API Kalitingiz:</Text>
        <View style={styles.inputWrapper}>
          <Key size={16} color={COLORS.primary} />
          <TextInput
            style={styles.textInput}
            placeholder="AIzaSy..."
            placeholderTextColor={COLORS.textMuted}
            value={settings.geminiApiKey}
            onChangeText={(val) => setSettings({ ...settings, geminiApiKey: val })}
            secureTextEntry={!showKey}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowKey(!showKey)} style={styles.eyeBtn}>
            {showKey ? <EyeOff size={18} color={COLORS.textMuted} /> : <Eye size={18} color={COLORS.textMuted} />}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.actionBtn, testingGemini && styles.btnDisabled]}
          onPress={handleSaveGeminiKey}
          disabled={testingGemini}
          activeOpacity={0.8}
        >
          {testingGemini ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Text style={styles.actionBtnText}>Kalitni tekshirish va saqlash</Text>
          )}
        </TouchableOpacity>

        {geminiStatus ? (
          <View style={styles.statusBox}>
            <Text style={styles.statusText}>{geminiStatus}</Text>
          </View>
        ) : null}

        <View style={styles.infoTip}>
          <Text style={styles.infoTipText}>
            💡 <Text style={{ fontWeight: '700' }}>Bepul kalit olish:</Text> aistudio.google.com saytiga Google akkountingiz bilan kiring va "Get API key" tugmasi orqali bepul oling.
          </Text>
        </View>
      </View>

      {/* 2. Supabase Sozlamasi */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIconWrap, { backgroundColor: COLORS.accentSoft }]}>
            <Database size={18} color={COLORS.primary} strokeWidth={2.5} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>Supabase Maʼlumotlar Bazasi</Text>
            <Text style={styles.sectionSubtitle}>
              Ixtiyoriy: Sevimlilar va qaydlarni bulutga sinxronlash uchun
            </Text>
          </View>
        </View>

        <Text style={styles.fieldLabel}>Project URL:</Text>
        <TextInput
          style={styles.fieldInput}
          placeholder="https://xyzcompany.supabase.co"
          placeholderTextColor={COLORS.textMuted}
          value={settings.supabaseUrl}
          onChangeText={(val) => setSettings({ ...settings, supabaseUrl: val })}
          autoCapitalize="none"
        />

        <Text style={[styles.fieldLabel, { marginTop: 10 }]}>Anon Public Key:</Text>
        <TextInput
          style={styles.fieldInput}
          placeholder="eyJhbGciOiJIUzI1NiIsIn..."
          placeholderTextColor={COLORS.textMuted}
          value={settings.supabaseAnonKey}
          onChangeText={(val) => setSettings({ ...settings, supabaseAnonKey: val })}
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[styles.secondaryActionBtn, testingSupabase && styles.btnDisabled]}
          onPress={handleSaveSupabase}
          disabled={testingSupabase}
          activeOpacity={0.8}
        >
          {testingSupabase ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Text style={styles.secondaryActionBtnText}>Supabase sozlamalarini saqlash</Text>
          )}
        </TouchableOpacity>

        {supabaseStatus ? (
          <View style={styles.statusBox}>
            <Text style={styles.statusText}>{supabaseStatus}</Text>
          </View>
        ) : null}
      </View>

      {/* 3. Tibbiyot Talabalari uchun Mas'uliyat Eslatmasi (Disclaimer) */}
      <View style={styles.disclaimerCard}>
        <View style={styles.disclaimerHeader}>
          <ShieldCheck size={18} color={COLORS.primary} strokeWidth={2.2} />
          <Text style={styles.disclaimerTitle}>Tibbiy Masʼuliyat Eslatmasi (Disclaimer)</Text>
        </View>
        <Text style={styles.disclaimerText}>
          Ushbu dastur faqat tibbiyot oliygohlari talabalari, rezidentlar va shifokorlar uchun taʼlim,
          retseptura oʻrganish va lotin tili boʻyicha maʼlumot beruvchi yordamchi vosita hisoblanadi.
          Haqiqiy klinik amaliyotda har doim rasmiy klinik protokollar, dori yoʻriqnomalari va
          bemorning individual holatiga asoslaning.
        </Text>
      </View>

      {/* Versiya va Mualliflik */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Tibbiyot v1.0.0 — Web, Android & iOS</Text>
        <View style={styles.colorPalettePreview}>
          <View style={[styles.colorDot, { backgroundColor: COLORS.primary }]} />
          <View style={[styles.colorDot, { backgroundColor: COLORS.background }]} />
          <View style={[styles.colorDot, { backgroundColor: COLORS.accent }]} />
          <Text style={styles.paletteText}>#10367D • #EBEBEB • #A5CE00</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
    maxWidth: 860,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: 40,
  },
  banner: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    ...SHADOWS.card,
  },
  bannerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(16, 54, 125, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(16, 54, 125, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerInfo: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
  },
  bannerDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    paddingBottom: 10,
  },
  sectionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(16, 54, 125, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primary,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    height: 46,
    gap: 8,
  },
  fieldInput: {
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    height: '100%',
  },
  eyeBtn: {
    padding: 4,
  },
  actionBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: '#8DB000',
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
  },
  secondaryActionBtn: {
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryActionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  statusBox: {
    backgroundColor: 'rgba(16, 54, 125, 0.06)',
    borderRadius: RADIUS.sm,
    padding: 10,
    marginTop: 10,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  statusText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    lineHeight: 18,
  },
  infoTip: {
    backgroundColor: 'rgba(165, 206, 0, 0.12)',
    padding: 10,
    borderRadius: RADIUS.sm,
    marginTop: 12,
  },
  infoTipText: {
    fontSize: 11,
    color: '#2E3D00',
    lineHeight: 16,
  },
  disclaimerCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  disclaimerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
  },
  disclaimerText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 17,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  colorPalettePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  paletteText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});
