import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { TabType } from '../types';
import { MEDICAL_FLASHCARDS, FlashcardQuestion } from '../constants/medicalData';
import { Pill, BookOpen, Sparkles, X, Brain, HelpCircle, ArrowRight, CheckCircle2 } from 'lucide-react-native';

interface FlowerMenuModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectTab: (tab: TabType) => void;
}

export const FlowerMenuModal: React.FC<FlowerMenuModalProps> = ({
  visible,
  onClose,
  onSelectTab,
}) => {
  const animValue = useRef(new Animated.Value(0)).current;
  const [flashcardOpen, setFlashcardOpen] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (visible) {
      Animated.spring(animValue, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animValue, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible && !flashcardOpen) return null;

  // 1-yaprog' (chap-tepaga): Retseptura AI Chat
  const petal1X = animValue.interpolate({ inputRange: [0, 1], outputRange: [0, -88] });
  const petal1Y = animValue.interpolate({ inputRange: [0, 1], outputRange: [0, -92] });

  // 2-yaprog' (markaz-tepaga): Lotin tili AI Chat
  const petal2X = animValue.interpolate({ inputRange: [0, 1], outputRange: [0, 0] });
  const petal2Y = animValue.interpolate({ inputRange: [0, 1], outputRange: [0, -135] });

  // 3-yaprog' (o'ng-tepaga): 🎲 Tibbiy Imtihon Flashcard
  const petal3X = animValue.interpolate({ inputRange: [0, 1], outputRange: [0, 88] });
  const petal3Y = animValue.interpolate({ inputRange: [0, 1], outputRange: [0, -92] });

  const scale = animValue.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.2, 1.1, 1] });
  const opacity = animValue.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  const handleSelect = (tab: TabType) => {
    onSelectTab(tab);
    onClose();
  };

  const handleOpenFlashcard = () => {
    // Tasodifiy savol tanlash
    const randomIdx = Math.floor(Math.random() * MEDICAL_FLASHCARDS.length);
    setCurrentCardIndex(randomIdx);
    setShowAnswer(false);
    setFlashcardOpen(true);
  };

  const handleNextFlashcard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % MEDICAL_FLASHCARDS.length);
    setShowAnswer(false);
  };

  const activeCard: FlashcardQuestion = MEDICAL_FLASHCARDS[currentCardIndex];

  return (
    <>
      <View style={styles.overlayContainer}>
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View style={[styles.backdrop, { opacity }]} />
        </TouchableWithoutFeedback>

        <View style={styles.flowerOrigin}>
          {/* 1-YAPROG': ⚡ Yangi Retseptura AI */}
          <Animated.View
            style={[
              styles.petalWrap,
              { transform: [{ translateX: petal1X }, { translateY: petal1Y }, { scale }], opacity },
            ]}
          >
            <TouchableOpacity
              style={[styles.petalCircle, { backgroundColor: COLORS.widgetMauve }]}
              onPress={() => handleSelect('prescriptions')}
              activeOpacity={0.85}
            >
              <Pill size={22} color={COLORS.textWhite} strokeWidth={2.2} />
            </TouchableOpacity>
            <Text style={styles.petalLabel}>Retseptura</Text>
          </Animated.View>

          {/* 2-YAPROG': 🔍 Tezkor Lotin tili */}
          <Animated.View
            style={[
              styles.petalWrap,
              { transform: [{ translateX: petal2X }, { translateY: petal2Y }, { scale }], opacity },
            ]}
          >
            <TouchableOpacity
              style={[styles.petalCircle, { backgroundColor: COLORS.widgetPeach }]}
              onPress={() => handleSelect('latin')}
              activeOpacity={0.85}
            >
              <BookOpen size={22} color={COLORS.textWhite} strokeWidth={2.2} />
            </TouchableOpacity>
            <Text style={styles.petalLabel}>Lotin tili</Text>
          </Animated.View>

          {/* 3-YAPROG': 🎲 TIBBIY IMTIHON FLASHCARD (Yangi funksiya!) */}
          <Animated.View
            style={[
              styles.petalWrap,
              { transform: [{ translateX: petal3X }, { translateY: petal3Y }, { scale }], opacity },
            ]}
          >
            <TouchableOpacity
              style={[styles.petalCircle, { backgroundColor: COLORS.widgetGreen }]}
              onPress={() => {
                onClose();
                handleOpenFlashcard();
              }}
              activeOpacity={0.85}
            >
              <Brain size={22} color={COLORS.textWhite} strokeWidth={2.2} />
            </TouchableOpacity>
            <Text style={styles.petalLabel}>Flashcard</Text>
          </Animated.View>

          {/* Markaziy Yopish (X) */}
          <TouchableOpacity style={styles.closeCenterBtn} onPress={onClose} activeOpacity={0.8}>
            <X size={22} color={COLORS.textWhite} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>

      {/* TIBBIY IMTIHON FLASHCARD MODALI */}
      <Modal visible={flashcardOpen} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.flashcardBox}>
            {/* Modal Header */}
            <View style={styles.flashcardHeader}>
              <View style={styles.categoryBadge}>
                <Sparkles size={13} color={COLORS.primary} />
                <Text style={styles.categoryText}>{activeCard.category} Imtihon Savoli</Text>
              </View>
              <TouchableOpacity onPress={() => setFlashcardOpen(false)} style={styles.modalCloseBtn}>
                <X size={18} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Savol */}
            <Text style={styles.questionTitle}>Savol:</Text>
            <Text style={styles.questionContent}>{activeCard.question}</Text>

            {/* Javob maydoni */}
            {showAnswer ? (
              <View style={styles.answerBox}>
                <View style={styles.answerHeader}>
                  <CheckCircle2 size={16} color={COLORS.success} />
                  <Text style={styles.answerTitle}>Toʻgʻri javob:</Text>
                </View>
                <Text style={styles.answerText}>{activeCard.answer}</Text>
                <Text style={styles.rationaleText}>💡 Izoh: {activeCard.rationale}</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.revealBtn}
                onPress={() => setShowAnswer(true)}
                activeOpacity={0.8}
              >
                <HelpCircle size={16} color={COLORS.primary} />
                <Text style={styles.revealBtnText}>Javobni koʻrish</Text>
              </TouchableOpacity>
            )}

            {/* Keyingi savol */}
            <TouchableOpacity
              style={styles.nextBtn}
              onPress={handleNextFlashcard}
              activeOpacity={0.8}
            >
              <Text style={styles.nextBtnText}>Keyingi tasodifiy savol</Text>
              <ArrowRight size={16} color={COLORS.textWhite} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFill,
    zIndex: 9999,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(16, 42, 84, 0.45)',
  },
  flowerOrigin: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeCenterBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.fab,
    borderWidth: 3,
    borderColor: COLORS.surface,
  },
  petalWrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 72,
  },
  petalCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.fab,
    borderWidth: 2.5,
    borderColor: COLORS.surface,
  },
  petalLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textWhite,
    marginTop: 4,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  flashcardBox: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 440,
    ...SHADOWS.dock,
  },
  flashcardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.accentSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
  },
  modalCloseBtn: {
    padding: 4,
  },
  questionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  questionContent: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 4,
    lineHeight: 24,
    marginBottom: 16,
  },
  revealBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.background,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    marginBottom: 14,
  },
  revealBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  answerBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: 14,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.success,
  },
  answerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  answerTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.success,
  },
  answerText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  rationaleText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
  },
  nextBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textWhite,
  },
});
