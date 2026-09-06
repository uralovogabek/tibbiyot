import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { PrescriptionResult } from '../types';
import {
  Copy,
  Check,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldAlert,
  Lightbulb,
  Pill,
} from 'lucide-react-native';

interface PrescriptionCardProps {
  prescription: PrescriptionResult;
  isFavorite?: boolean;
  onToggleFavorite?: (prescription: PrescriptionResult) => void;
}

export const PrescriptionCard: React.FC<PrescriptionCardProps> = ({
  prescription,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCopy = async () => {
    try {
      const fullText = `Tibbiyot ilovasi — Retseptura namunasi:\n\nDori: ${prescription.drugName} (${prescription.latinName})\nShakli: ${prescription.dosageForm}\nDoza: ${prescription.dosage}\n\n${prescription.latinRecipe}\n\nFarmakologik guruhi: ${prescription.pharmacologicalGroup}\nQabul qilish tartibi: ${prescription.dosageInstructions}`;
      await Clipboard.setStringAsync(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Nusxa olishda xatolik:', e);
    }
  };

  return (
    <View style={styles.card}>
      {/* SKRINSHOTDAGI KABI LOYIHA KARTASI HEADER QISMI */}
      <TouchableOpacity
        style={styles.cardHeader}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.8}
      >
        <View style={styles.leftCol}>
          <View style={styles.titleRow}>
            <Text style={styles.drugTitle}>{prescription.drugName}</Text>
            {prescription.isAiGenerated && (
              <View style={styles.aiPill}>
                <Sparkles size={10} color={COLORS.primary} strokeWidth={2.5} />
                <Text style={styles.aiPillText}>AI</Text>
              </View>
            )}
          </View>

          <Text style={styles.latinSubtitle}>{prescription.latinName}</Text>

          <View style={styles.tagsRow}>
            <View style={styles.patientTag}>
              <Text style={styles.patientTagText}>
                {prescription.patientType === 'pediatric' ? 'Pediatriya' : 'Kattalar'}
              </Text>
            </View>
            <View style={styles.dosageTag}>
              <Pill size={11} color={COLORS.textSecondary} />
              <Text style={styles.dosageTagText}>{prescription.dosage}</Text>
            </View>
          </View>
        </View>

        {/* SKRINSHOTDAGI O'NG TOMONDAGI AYLANMA PROGRESS DOIRASI (CIRCULAR RING) */}
        <View style={styles.rightRingCol}>
          <View style={styles.circularRing}>
            <View style={styles.ringArc} />
            <Text style={styles.ringText}>Rp.</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* TUGMALAR QATORI */}
      <View style={styles.actionsBar}>
        <TouchableOpacity
          style={[styles.actionBtn, isFavorite && styles.actionBtnActive]}
          onPress={() => onToggleFavorite && onToggleFavorite(prescription)}
          activeOpacity={0.7}
        >
          <Bookmark
            size={16}
            color={isFavorite ? COLORS.accentDark : COLORS.textSecondary}
            fill={isFavorite ? COLORS.accent : 'transparent'}
          />
          <Text style={[styles.actionBtnText, isFavorite && styles.actionBtnTextActive]}>
            {isFavorite ? 'Saqlangan' : 'Saqlash'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, copied && styles.copiedBtn]}
          onPress={handleCopy}
          activeOpacity={0.7}
        >
          {copied ? (
            <Check size={16} color={COLORS.success} strokeWidth={2.5} />
          ) : (
            <Copy size={16} color={COLORS.primary} strokeWidth={2} />
          )}
          <Text style={[styles.actionBtnText, copied && { color: COLORS.success }]}>
            {copied ? 'Nusxa olindi!' : 'Nusxa olish'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.expandBtn}
          onPress={() => setExpanded(!expanded)}
          activeOpacity={0.7}
        >
          <Text style={styles.expandBtnText}>
            {expanded ? 'Yopish' : 'Tafsilotlar'}
          </Text>
          {expanded ? (
            <ChevronUp size={16} color={COLORS.textSecondary} />
          ) : (
            <ChevronDown size={16} color={COLORS.textSecondary} />
          )}
        </TouchableOpacity>
      </View>

      {/* OCHILUVCHI TAFSILOTLAR VA RETSEPT VARAQASI */}
      {expanded && (
        <View style={styles.expandedContent}>
          {/* Rasmiy Lotincha Retseptura Varaqasi */}
          <View style={styles.rxPaperBox}>
            <Text style={styles.rxContent}>{prescription.latinRecipe}</Text>
          </View>

          {/* Farmakologik guruhi */}
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Farmakologik guruhi:</Text>
            <Text style={styles.detailValue}>{prescription.pharmacologicalGroup}</Text>
          </View>

          {/* Qo'llash tartibi */}
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Dozalash qoidalari:</Text>
            <Text style={styles.detailValue}>{prescription.dosageInstructions}</Text>
          </View>

          {/* Ko'rsatmalar */}
          {prescription.indications?.length > 0 && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Klinik koʻrsatmalar:</Text>
              {prescription.indications.map((ind, i) => (
                <Text key={i} style={styles.bulletItem}>• {ind}</Text>
              ))}
            </View>
          )}

          {/* Kontrendikatsiyalar */}
          {prescription.contraindications?.length > 0 && (
            <View style={styles.warningBox}>
              <View style={styles.warningHead}>
                <ShieldAlert size={14} color={COLORS.danger} />
                <Text style={styles.warningTitle}>Qoʻllash mumkin boʻlmagan holatlar:</Text>
              </View>
              {prescription.contraindications.map((c, i) => (
                <Text key={i} style={styles.warningText}>• {c}</Text>
              ))}
            </View>
          )}

          {/* Talaba uchun klinik layfhak */}
          {prescription.studentNotes ? (
            <View style={styles.noteBox}>
              <View style={styles.noteHead}>
                <Lightbulb size={14} color={COLORS.accentDark} />
                <Text style={styles.noteTitle}>Talaba uchun klinik layfhak:</Text>
              </View>
              <Text style={styles.noteText}>{prescription.studentNotes}</Text>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
  },
  leftCol: {
    flex: 1,
    paddingRight: SPACING.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  drugTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  aiPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS.accentSoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  aiPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
  },
  latinSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  patientTag: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  patientTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  dosageTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  dosageTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  rightRingCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: '#E6EBF2',
    borderTopColor: COLORS.widgetGreen,
    borderRightColor: COLORS.widgetGreen,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ringArc: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.widgetGreen,
  },
  ringText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
    fontStyle: 'italic',
  },
  actionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    backgroundColor: COLORS.surfaceMuted,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
  },
  actionBtnActive: {
    backgroundColor: COLORS.accentSoft,
  },
  copiedBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  actionBtnTextActive: {
    color: COLORS.accentDark,
    fontWeight: '800',
  },
  expandBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  expandBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  expandedContent: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    backgroundColor: COLORS.surface,
  },
  rxPaperBox: {
    backgroundColor: '#FAF9F5',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    marginBottom: SPACING.md,
  },
  rxContent: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '600',
    color: '#1E293B',
  },
  detailItem: {
    marginBottom: SPACING.md,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 19,
  },
  bulletItem: {
    fontSize: 13,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  warningBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  warningHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  warningTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.danger,
  },
  warningText: {
    fontSize: 12,
    color: '#991B1B',
    marginTop: 2,
  },
  noteBox: {
    backgroundColor: COLORS.accentSoft,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  noteHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  noteTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.accentDark,
  },
  noteText: {
    fontSize: 12,
    color: '#2D3A00',
    lineHeight: 18,
    fontStyle: 'italic',
  },
});
