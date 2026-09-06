import 'package:flutter/material.dart';
import '../constants/theme.dart';

class HomeScreen extends StatelessWidget {
  final Function(int) onNavigateTab;
  final int favoritesCount;

  const HomeScreen({
    Key? key,
    required this.onNavigateTab,
    required this.favoritesCount,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 110),
      child: Column(
        children: [
          // 2x2 ORGANIK VIDJETLAR SETKASI (Skrinshotdagi kabi)
          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 2,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: 1.3,
            children: [
              // 1. Retseptura (Mauve)
              _buildWidgetCard(
                color: AppColors.widgetMauve,
                icon: Icons.medication_outlined,
                title: 'Retseptura',
                subtitle: 'AI Chat orqali',
                onTap: () => onNavigateTab(1),
              ),

              // 2. Lotin tili (Peach)
              _buildWidgetCard(
                color: AppColors.widgetPeach,
                icon: Icons.menu_book_outlined,
                title: 'Lotin tili',
                subtitle: 'Terminlar tahlili',
                onTap: () => onNavigateTab(2),
              ),

              // 3. Dozalash (Qulflangan)
              _buildLockedWidgetCard(),

              // 4. Konspekt (Coral)
              _buildWidgetCard(
                color: AppColors.widgetCoral,
                icon: Icons.bookmark_outline,
                title: 'Konspekt',
                subtitle: '$favoritesCount ta saqlangan',
                onTap: () => onNavigateTab(3),
              ),
            ],
          ),

          const SizedBox(height: 16),

          // RETSEPTURA PROMO BANNERI
          _buildPromoBanner(
            context: context,
            icon: Icons.auto_awesome,
            iconBg: AppColors.accentSoft,
            iconColor: AppColors.primary,
            title: 'Dori retsepti kerakmi?',
            subtitle: 'AI Chatga kiring va dori nomini yozing — bir zumda tayyor lotincha retsept oling!',
            onTap: () => onNavigateTab(1),
          ),

          const SizedBox(height: 12),

          // LOTIN TILI PROMO BANNERI
          _buildPromoBanner(
            context: context,
            icon: Icons.menu_book_rounded,
            iconBg: const Color(0x2EECA074),
            iconColor: AppColors.widgetPeach,
            title: 'Lotincha termin bormi?',
            subtitle: 'Atamani yozing va uning aniq grammatikasi va klinik maʼnosini oling!',
            onTap: () => onNavigateTab(2),
          ),
        ],
      ),
    );
  }

  Widget _buildWidgetCard({
    required Color color,
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(AppRadius.card),
          boxShadow: [
            BoxShadow(
              color: color.withOpacity(0.3),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Align(
              alignment: Alignment.topRight,
              child: Container(
                width: 28,
                height: 28,
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.25),
                  shape: BoxShape.circle,
                ),
                child: Icon(icon, color: Colors.white, size: 16),
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.85),
                    fontSize: 11,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLockedWidgetCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFE2E6EE),
        borderRadius: BorderRadius.circular(AppRadius.card),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Align(
            alignment: Alignment.topRight,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: const Color(0xFF9BA3B2),
                borderRadius: BorderRadius.circular(AppRadius.pill),
              ),
              child: const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.lock, color: Colors.white, size: 10),
                  SizedBox(width: 4),
                  Text(
                    'Tez kunda',
                    style: TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            ),
          ),
          const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Dozalash',
                style: TextStyle(color: AppColors.textMuted, fontSize: 16, fontWeight: FontWeight.w800),
              ),
              SizedBox(height: 2),
              Text(
                'Kalkulyator (Yopiq)',
                style: TextStyle(color: AppColors.textMuted, fontSize: 11),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPromoBanner({
    required BuildContext context,
    required IconData icon,
    required Color iconBg,
    required Color iconColor,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(AppRadius.card),
          boxShadow: [
            BoxShadow(
              color: AppColors.primary.withOpacity(0.04),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: iconBg,
                borderRadius: BorderRadius.circular(14),
              ),
              child: Icon(icon, color: iconColor, size: 22),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w800,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppColors.textSecondary,
                      height: 1.3,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(Icons.chevron_right, color: AppColors.textMuted),
          ],
        ),
      ),
    );
  }
}
