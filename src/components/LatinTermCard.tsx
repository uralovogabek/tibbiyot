import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { LatinTerm } from '../types';
import { Bookmark, Sparkles, Volume2, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react-native';
import { GeminiService } from '../services/geminiService';

interface LatinTermCardProps {
  term: LatinTerm;
  isFavorite?: boolean;
  onToggleFavorite?: (term: LatinTerm) => void;
  onTermUpdated?: (updated: LatinTerm) => void;
}

export const LatinTermCard: React.FC<LatinTermCardProps> = ({
  term,
  isFavorite = false,
  onToggleFavorite,
  onTermUpdated,
}) => {
  const [copied, setCopied] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiText, setAiText] = useState(term.aiExplanation || '');
  const [showAi, setShowAi] = useState(!!term.aiExplanation);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'anatomiya':
        return { bg: 'rgba(16, 54, 125, 0.08)', text: COLORS.primary };
      case 'farmakologiya':
        return { bg: COLORS.accentSoft, text: COLORS.accentDark };
      case 'klinika':
        return { bg: 'rgba(147, 120, 158, 0.15)', text: COLORS.widgetMauve };
      case 'patologiya':
        return { bg: 'rgba(229, 109, 103, 0.15)', text: COLORS.widgetCoral };
      default:
        return { bg: 'rgba(110, 120, 139, 0.1)', text: COLORS.textSecondary };
    }
  };

  const catColor = getCategoryColor(term.category);

  const handleCopy = async () => {
    const text = `${term.term} (${term.phonetic})\nGrammatika: ${term.grammar}\nO'zbekcha: ${term.uzbekMeaning}\nRuscha: ${term.russianMeaning}`;
    await Clipboard.setStringAsync(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFetchAi = async () => {
    if (aiText) {
      setShowAi(!showAi);
      return;
    }

    setAiLoading(true);
    try {
      const full = await GeminiService.translateLatinTerm(term.term);
      if (full.aiExplanation) {
        setAiText(full.aiExplanation);
        setShowAi(true);
        if (onTermUpdated) {
          onTermUpdated({ ...term, aiExplanation: full.aiExplanation });
        }
      }
    } catch (e) {
      console.error('AI xatosi:', e);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      {/* Yuqori toifa va harakatlar */}
      <View style={styles.topRow}>
        <View style={styles.metaRow}>
          <View style={[styles.catBadge, { backgroundColor: catColor.bg }]}>
            <Text style={[styles.catBadgeText, { color: catColor.text }]}>
              {term.category.toUpperCase()}
            </Text>
          </View>
          {term.phonetic ? (
            <View style={styles.phoneticWrap}>
              <Volume2 size={11} color={COLORS.textMuted} />
              <Text style={styles.phoneticText}>[{term.phonetic}]</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.iconBtn, isFavorite && styles.favActive]}
            onPress={() => onToggleFavorite && onToggleFavorite(term)}
            activeOpacity={0.7}
          >
            <Bookmark
              size={16}
              color={isFavorite ? COLORS.accentDark : COLORS.textMuted}
              fill={isFavorite ? COLORS.accent : 'transparent'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconBtn, copied && styles.copiedActive]}
            onPress={handleCopy}
            activeOpacity={0.7}
          >
            {copied ? (
              <Check size={16} color={COLORS.success} strokeWidth={2.5} />
            ) : (
              <Copy size={16} color={COLORS.textMuted} strokeWidth={2} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Lotincha termin */}
      <Text style={styles.latinTerm}>{term.term}</Text>
      <Text style={styles.grammarText}>{term.grammar}</Text>

      {/* O'zbekcha va Ruscha tarjimalari */}
      <View style={styles.translationBox}>
        <View style={styles.uzbekRow}>
          <Text style={styles.uzbekText}>{term.uzbekMeaning}</Text>
        </View>
        <Text style={styles.russianText}>RU: {term.russianMeaning}</Text>
      </View>

      {/* Misol gap */}
      {term.exampleSentence ? (
        <View style={styles.exampleBox}>
          <Text style={styles.exampleText}>„{term.exampleSentence}“</Text>
          {term.clinicalContext ? (
            <Text style={styles.contextText}>{term.clinicalContext}</Text>
          ) : null}
        </View>
      ) : null}

      {/* AI etimologiya */}
      {showAi && aiText ? (
        <View style={styles.aiBox}>
          <View style={styles.aiHead}>
            <Sparkles size={13} color={COLORS.primary} strokeWidth={2.5} />
            <Text style={styles.aiTitle}>Gemini AI Etimologiya:</Text>
          </View>
          <Text style={styles.aiText}>{aiText}</Text>
        </View>
      ) : null}

      {/* AI tahlili tugmasi */}
      <TouchableOpacity
        style={styles.aiButton}
        onPress={handleFetchAi}
        disabled={aiLoading}
        activeOpacity={0.8}
      >
        {aiLoading ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <>
            <Sparkles size={13} color={COLORS.primary} strokeWidth={2.5} />
            <Text style={styles.aiButtonText}>
              {showAi && aiText ? 'AI izohini yopish' : 'Gemini AI tahlili'}
            </Text>
            {showAi && aiText ? (
              <ChevronUp size={14} color={COLORS.primary} />
            ) : (
              <ChevronDown size={14} color={COLORS.primary} />
            )}
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  catBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  catBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  phoneticWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  phoneticText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    gap: 6,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favActive: {
    backgroundColor: COLORS.accentSoft,
  },
  copiedActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  latinTerm: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  grammarText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
    marginBottom: 8,
  },
  translationBox: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: 8,
  },
  uzbekRow: {
    marginBottom: 2,
  },
  uzbekText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  russianText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  exampleBox: {
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: COLORS.primary,
    fontWeight: '600',
  },
  contextText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  aiBox: {
    backgroundColor: COLORS.accentSoft,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: 8,
  },
  aiHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  aiTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
  },
  aiText: {
    fontSize: 12,
    color: '#243200',
    lineHeight: 18,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.surfaceMuted,
    paddingVertical: 7,
    borderRadius: RADIUS.sm,
  },
  aiButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
