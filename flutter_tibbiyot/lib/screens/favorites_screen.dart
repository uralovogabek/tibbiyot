import 'package:flutter/material.dart';
import '../constants/theme.dart';
import '../models/prescription_model.dart';
import '../models/latin_term_model.dart';

class FavoritesScreen extends StatelessWidget {
  final List<PrescriptionModel> favoritePrescriptions;
  final List<LatinTermModel> favoriteTerms;
  final Function(PrescriptionModel) onRemovePrescription;
  final Function(LatinTermModel) onRemoveTerm;

  const FavoritesScreen({
    Key? key,
    required this.favoritePrescriptions,
    required this.favoriteTerms,
    required this.onRemovePrescription,
    required this.onRemoveTerm,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final total = favoritePrescriptions.length + favoriteTerms.length;

    if (total == 0) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 60,
              height: 60,
              decoration: const BoxDecoration(
                color: AppColors.accentSoft,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.bookmark_outline, color: AppColors.primary, size: 28),
            ),
            const SizedBox(height: 12),
            const Text(
              'Hozircha saqlanganlar yoʻq',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
            ),
            const SizedBox(height: 6),
            const Text(
              'Kerakli retsept va terminlarni xatchoʻpga saqlang.',
              style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
            ),
          ],
        ),
      );
    }

    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 110),
      children: [
        if (favoritePrescriptions.isNotEmpty) ...[
          const Text(
            'Saqlangan Retseptlar',
            style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.primary),
          ),
          const SizedBox(height: 8),
          ...favoritePrescriptions.map(
            (rx) => Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(AppRadius.card),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.04),
                    blurRadius: 10,
                    offset: const Offset(0, 3),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          rx.drugName,
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                        ),
                        Text(
                          rx.latinName,
                          style: const TextStyle(fontStyle: FontStyle.italic, color: AppColors.textSecondary, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.delete_outline, color: Colors.redAccent, size: 20),
                    onPressed: () => onRemovePrescription(rx),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
        ],
        if (favoriteTerms.isNotEmpty) ...[
          const Text(
            'Saqlangan Lotincha Terminlar',
            style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.primary),
          ),
          const SizedBox(height: 8),
          ...favoriteTerms.map(
            (term) => Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(AppRadius.card),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.04),
                    blurRadius: 10,
                    offset: const Offset(0, 3),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          term.term,
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppColors.primary),
                        ),
                        Text(
                          term.uzbekMeaning,
                          style: const TextStyle(color: AppColors.textPrimary, fontSize: 13),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.delete_outline, color: Colors.redAccent, size: 20),
                    onPressed: () => onRemoveTerm(term),
                  ),
                ],
              ),
            ),
          ),
        ],
      ],
    );
  }
}
