import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Modal,
} from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { POPULAR_MEDICINE_PROMPTS, INITIAL_PRESCRIPTIONS } from '../constants/medicalData';
import { PrescriptionResult, FavoriteItem, PatientType } from '../types';
import { GeminiService } from '../services/geminiService';
import { StorageService } from '../services/storageService';
import { PrescriptionCard } from '../components/PrescriptionCard';
import {
  Send,
  Pill,
  Bot,
  Trash2,
  AlertCircle,
  KeyRound,
  Baby,
  User as UserIcon,
  X,
  Check,
  ChevronLeft,
} from 'lucide-react-native';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text?: string;
  prescription?: PrescriptionResult;
  isQuotaExhausted?: boolean;
  timestamp: number;
}

interface PrescriptionScreenProps {
  favorites: FavoriteItem[];
  onToggleFavorite: (item: FavoriteItem) => void;
  onNavigateHome?: () => void;
}

const DOSAGE_FORMS = [
  { id: 'tab', label: 'Tab.' },
  { id: 'amp', label: 'Sol. amp.' },
  { id: 'ung', label: 'Ung.' },
  { id: 'caps', label: 'Caps.' },
  { id: 'gutt', label: 'Gutt.' },
];

export const PrescriptionScreen: React.FC<PrescriptionScreenProps> = ({
  favorites,
  onToggleFavorite,
  onNavigateHome,
}) => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [patientType, setPatientType] = useState<PatientType>('adult');
  const [selectedForm, setSelectedForm] = useState<string>('tab');
  const [quotaExhausted, setQuotaExhausted] = useState(false);
  const [keyModalVisible, setKeyModalVisible] = useState(false);
  const [customKeyInput, setCustomKeyInput] = useState('');
  const [keySavedToast, setKeySavedToast] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: 'Assalomu alaykum! Dori nomini kiriting (masalan: Amoksitsillin, Paratsetamol, Seftriakson) — rasmiy lotincha retseptura (Rp.:, D.t.d., S.) va klinik koʻrsatmalarni tayyorlab beraman 💊',
      timestamp: Date.now(),
    },
  ]);

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const saved = await StorageService.getRxChatHistory();
      if (saved && saved.length > 0) {
        setMessages(saved);
      }
    } catch (e) {
      console.error('Rx chat tarixini yuklash xatosi:', e);
    }
  };

  const handleClearHistory = async () => {
    await StorageService.clearRxChatHistory();
    setMessages([
      {
        id: 'msg-welcome-' + Date.now(),
        sender: 'ai',
        text: 'Chat tarixi tozalandi. Menga dori nomini yozing, retsept tayyorlab beraman 💊',
        timestamp: Date.now(),
      },
    ]);
  };

  const handleSaveApiKey = async () => {
    if (!customKeyInput.trim()) return;
    await StorageService.saveSettings({ geminiApiKey: customKeyInput.trim() });
    setKeySavedToast(true);
    setQuotaExhausted(false);
    setTimeout(() => {
      setKeySavedToast(false);
      setKeyModalVisible(false);
    }, 1200);
  };

  const handleSend = async (targetDrug?: string) => {
    const query = (targetDrug || inputText).trim();
    if (!query || loading) return;

    setInputText('');

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: query + (patientType === 'pediatric' ? ' (Bolalar uchun)' : ''),
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    await StorageService.saveRxChatHistory(updatedMessages);

    setLoading(true);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const result = await GeminiService.generatePrescription(
        query,
        patientType,
        selectedForm
      );

      if (result.isQuotaExhausted) {
        setQuotaExhausted(true);
      }

      await StorageService.addHistory(query);

      const aiMsg: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        prescription: result,
        isQuotaExhausted: result.isQuotaExhausted,
        timestamp: Date.now(),
      };

      const finalMessages = [...updatedMessages, aiMsg];
      setMessages(finalMessages);
      await StorageService.saveRxChatHistory(finalMessages);
    } catch (e) {
      console.error('Chat xatosi:', e);
    } finally {
      setLoading(false);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleToggleCardFav = (rx: PrescriptionResult) => {
    const favItem: FavoriteItem = {
      id: rx.id,
      type: 'prescription',
      title: rx.drugName,
      subtitle: rx.latinName + ' • ' + rx.dosageForm,
      category: 'Retseptura',
      savedAt: Date.now(),
      data: rx,
    };
    onToggleFavorite(favItem);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      {/* YUQORI STRIP: QAYTISH, DOZALASH REJIMI VA TOZALASH */}
      <View style={styles.topControlStrip}>
        <View style={styles.stripLeft}>
          {onNavigateHome && (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={onNavigateHome}
              activeOpacity={0.7}
            >
              <ChevronLeft size={18} color={COLORS.primary} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.patientChip,
              patientType === 'adult' && styles.patientChipActive,
            ]}
            onPress={() => setPatientType('adult')}
            activeOpacity={0.7}
          >
            <UserIcon
              size={13}
              color={patientType === 'adult' ? COLORS.primary : COLORS.textMuted}
            />
            <Text
              style={[
                styles.patientChipText,
                patientType === 'adult' && styles.patientChipTextActive,
              ]}
            >
              Kattalar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.patientChip,
              patientType === 'pediatric' && styles.patientChipActive,
            ]}
            onPress={() => setPatientType('pediatric')}
            activeOpacity={0.7}
          >
            <Baby
              size={13}
              color={patientType === 'pediatric' ? COLORS.primary : COLORS.textMuted}
            />
            <Text
              style={[
                styles.patientChipText,
                patientType === 'pediatric' && styles.patientChipTextActive,
              ]}
            >
              Bolalar (mg/kg)
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.clearBtn}
          onPress={handleClearHistory}
          activeOpacity={0.7}
        >
          <Trash2 size={14} color={COLORS.textMuted} />
          <Text style={styles.clearBtnText}>Tozalash</Text>
        </TouchableOpacity>
      </View>

      {/* 429 BANNER */}
      {quotaExhausted && (
        <View style={styles.quotaBanner}>
          <View style={styles.quotaBannerLeft}>
            <AlertCircle size={15} color="#B45309" />
            <Text style={styles.quotaBannerText}>
              Gemini 429: Standart klinik retsept namunalari ko&apos;rsatilmoqda.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.quotaBannerBtn}
            onPress={() => setKeyModalVisible(true)}
            activeOpacity={0.8}
          >
            <KeyRound size={12} color={COLORS.textWhite} />
            <Text style={styles.quotaBannerBtnText}>API Kalit</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* XABARLAR OQIMI */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatScroll}
        contentContainerStyle={styles.chatContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => {
          if (msg.sender === 'user') {
            return (
              <View key={msg.id} style={styles.userMsgRow}>
                <View style={styles.userBubble}>
                  <Text style={styles.userMsgText}>{msg.text}</Text>
                </View>
              </View>
            );
          }

          return (
            <View key={msg.id} style={styles.aiMsgRow}>
              <View style={styles.aiAvatar}>
                <Bot size={16} color={COLORS.primary} />
              </View>

              <View style={styles.aiMsgCol}>
                {msg.text && (
                  <View style={styles.aiBubble}>
                    <Text style={styles.aiMsgText}>{msg.text}</Text>
                  </View>
                )}

                {msg.prescription && (
                  <View style={styles.cardContainer}>
                    <PrescriptionCard
                      prescription={msg.prescription}
                      isFavorite={favorites.some((f) => f.id === msg.prescription?.id)}
                      onToggleFavorite={handleToggleCardFav}
                    />
                  </View>
                )}
              </View>
            </View>
          );
        })}

        {loading && (
          <View style={styles.aiMsgRow}>
            <View style={styles.aiAvatar}>
              <Bot size={16} color={COLORS.primary} />
            </View>
            <View style={[styles.aiBubble, styles.loadingBubble]}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.loadingText}>
                Gemini 3.5 Flash retseptura tahlil qilmoqda...
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* SHAKL TANLOVCHILAR */}
      <View style={styles.formsBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {DOSAGE_FORMS.map((form) => {
            const isSel = selectedForm === form.id;
            return (
              <TouchableOpacity
                key={form.id}
                style={[styles.formChip, isSel && styles.formChipActive]}
                onPress={() => setSelectedForm(form.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.formChipText, isSel && styles.formChipTextActive]}
                >
                  {form.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* TEZKOR TAKLIFLAR QATORI */}
      <View style={styles.quickBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {POPULAR_MEDICINE_PROMPTS.slice(0, 6).map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.quickChip}
              onPress={() => handleSend(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.quickChipText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* INPUT MAYDONI */}
      <View style={styles.inputAreaWrapper}>
        <View style={styles.inputBar}>
          <Pill size={18} color={COLORS.primary} style={{ marginLeft: 4 }} />
          <TextInput
            style={styles.textInput}
            placeholder={
              patientType === 'pediatric'
                ? "Dori nomi (Bolalar dozasi hisoblanadi)..."
                : "Dori nomini yozing (masalan: Paratsetamol)..."
            }
            placeholderTextColor={COLORS.textMuted}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => handleSend()}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
            onPress={() => handleSend()}
            disabled={!inputText.trim() || loading}
            activeOpacity={0.8}
          >
            <Send size={16} color={COLORS.textWhite} />
          </TouchableOpacity>
        </View>
      </View>

      {/* API KALIT MODALI */}
      <Modal
        visible={keyModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setKeyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <KeyRound size={18} color={COLORS.primary} />
                <Text style={styles.modalTitle}>Gemini API Kaliti</Text>
              </View>
              <TouchableOpacity
                onPress={() => setKeyModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <X size={18} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>
              Google AI Studio (aistudio.google.com) orqali bepul kalit olib shu yerga qo&apos;yishingiz mumkin.
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="AIzaSy... kalitingizni kiriting"
              placeholderTextColor={COLORS.textMuted}
              value={customKeyInput}
              onChangeText={setCustomKeyInput}
              autoCapitalize="none"
              autoCorrect={false}
            />

            {keySavedToast && (
              <View style={styles.toast}>
                <Check size={14} color="#15803D" />
                <Text style={styles.toastText}>Kalit muvaffaqiyatli saqlandi!</Text>
              </View>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setKeyModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Bekor qilish</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleSaveApiKey}
              >
                <Text style={styles.modalSaveText}>Saqlash</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topControlStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.04)',
    backgroundColor: COLORS.background,
  },
  stripLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  stripTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  clearBtnText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: 20,
    maxWidth: 860,
    width: '100%',
    alignSelf: 'center',
  },
  userMsgRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADIUS.lg,
    borderBottomRightRadius: RADIUS.xs,
    maxWidth: '80%',
    ...SHADOWS.card,
  },
  userMsgText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textWhite,
  },
  aiMsgRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 14,
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    ...SHADOWS.card,
  },
  aiMsgCol: {
    flex: 1,
  },
  aiBubble: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: RADIUS.lg,
    borderBottomLeftRadius: RADIUS.xs,
    alignSelf: 'flex-start',
    maxWidth: '92%',
    ...SHADOWS.card,
    marginBottom: 6,
  },
  aiMsgText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  loadingText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },
  cardContainer: {
    marginTop: 4,
  },
  quickBar: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: 6,
    backgroundColor: COLORS.background,
  },
  quickChip: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    marginRight: 6,
    ...SHADOWS.card,
  },
  quickChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  inputAreaWrapper: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 4,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    backgroundColor: COLORS.background,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
    ...SHADOWS.dock,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    maxWidth: 860,
    width: '100%',
    alignSelf: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    height: '100%',
  },
  sendBtn: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  patientChipActive: {
    backgroundColor: '#EEF2FF',
    borderColor: COLORS.primary,
  },
  patientChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  patientChipTextActive: {
    color: COLORS.primary,
  },
  quotaBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
  },
  quotaBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  quotaBannerText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '600',
    flex: 1,
  },
  quotaBannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#B45309',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
  },
  quotaBannerBtnText: {
    color: COLORS.textWhite,
    fontSize: 11,
    fontWeight: '700',
  },
  formsBar: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 6,
    paddingBottom: 2,
    backgroundColor: COLORS.background,
  },
  formChip: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    marginRight: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  formChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  formChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  formChipTextActive: {
    color: COLORS.textWhite,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: 20,
    ...SHADOWS.modal,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 14,
  },
  modalInput: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    marginBottom: 12,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
    marginBottom: 12,
  },
  toastText: {
    fontSize: 12,
    color: '#15803D',
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 4,
  },
  modalCancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
  },
  modalCancelText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  modalSaveBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
  },
  modalSaveText: {
    fontSize: 14,
    color: COLORS.textWhite,
    fontWeight: '700',
  },
  sendBtnDisabled: {
    backgroundColor: COLORS.textMuted,
    opacity: 0.5,
  },
});
