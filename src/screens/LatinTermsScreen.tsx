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
} from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { INITIAL_LATIN_TERMS } from '../constants/medicalData';
import { LatinTerm, FavoriteItem } from '../types';
import { GeminiService } from '../services/geminiService';
import { StorageService } from '../services/storageService';
import { LatinTermCard } from '../components/LatinTermCard';
import { Send, BookOpen, Bot, Trash2, ChevronLeft } from 'lucide-react-native';

interface LatinChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text?: string;
  term?: LatinTerm;
  timestamp: number;
}

interface LatinTermsScreenProps {
  favorites: FavoriteItem[];
  onToggleFavorite: (item: FavoriteItem) => void;
  onNavigateHome?: () => void;
}

export const LatinTermsScreen: React.FC<LatinTermsScreenProps> = ({
  favorites,
  onToggleFavorite,
  onNavigateHome,
}) => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<LatinChatMessage[]>([
    {
      id: 'lt-welcome',
      sender: 'ai',
      text: 'Salom! Istalgan lotincha yoki oʻzbekcha tibbiy terminni yozing (masalan: Arteria coronaria, yurak, buyrak, meʼda) — grammatikasi va klinik maʼnosini tahlil qilib beraman 🏛️',
      timestamp: Date.now(),
    },
  ]);

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const saved = await StorageService.getLatinChatHistory();
      if (saved && saved.length > 0) {
        setMessages(saved);
      }
    } catch (e) {
      console.error('Lotin chat tarixini yuklash xatosi:', e);
    }
  };

  const handleClearHistory = async () => {
    await StorageService.clearLatinChatHistory();
    setMessages([
      {
        id: 'lt-welcome-' + Date.now(),
        sender: 'ai',
        text: 'Chat tarixi tozalandi. Yangi tibbiy terminni yozishingiz mumkin 🏛️',
        timestamp: Date.now(),
      },
    ]);
  };

  const quickTerms = [
    'Arteria coronaria',
    'Musculus biceps',
    'Infarctus myocardii',
    'Yurak',
    'Buyrak',
    'Fractura claviculae',
  ];

  const handleSend = async (targetTerm?: string) => {
    const query = (targetTerm || inputText).trim();
    if (!query || loading) return;

    setInputText('');

    const userMsg: LatinChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    await StorageService.saveLatinChatHistory(updatedMessages);

    setLoading(true);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const result = await GeminiService.translateLatinTerm(query);
      await StorageService.addHistory(query);

      const aiMsg: LatinChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        term: result,
        timestamp: Date.now(),
      };

      const finalMessages = [...updatedMessages, aiMsg];
      setMessages(finalMessages);
      await StorageService.saveLatinChatHistory(finalMessages);
    } catch (e) {
      console.error('Lotin tili chat xatosi:', e);
    } finally {
      setLoading(false);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleToggleCardFav = (term: LatinTerm) => {
    const favItem: FavoriteItem = {
      id: term.id,
      type: 'latin',
      title: term.term,
      subtitle: term.uzbekMeaning + ' • [' + term.phonetic + ']',
      category: term.category,
      savedAt: Date.now(),
      data: term,
    };
    onToggleFavorite(favItem);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      {/* YUQORI STRIP: QAYTISH VA TOZALASH */}
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
          <Text style={styles.stripTitle}>Lotin tili va Terminologiya</Text>
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

                {msg.term && (
                  <View style={styles.cardContainer}>
                    <LatinTermCard
                      term={msg.term}
                      isFavorite={favorites.some((f) => f.id === msg.term?.id)}
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
              <Text style={styles.loadingText}>Gemini AI lotincha atamani tahlil qilmoqda...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* TEZKOR TERMINLAR QATORI */}
      <View style={styles.quickBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {quickTerms.map((item, idx) => (
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
          <BookOpen size={18} color={COLORS.primary} style={{ marginLeft: 4 }} />
          <TextInput
            style={styles.textInput}
            placeholder="Lotincha yoki o'zbekcha atama yozing..."
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
  sendBtnDisabled: {
    backgroundColor: COLORS.textMuted,
    opacity: 0.5,
  },
});
