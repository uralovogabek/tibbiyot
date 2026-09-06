import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'constants/theme.dart';
import 'models/prescription_model.dart';
import 'models/latin_term_model.dart';
import 'screens/home_screen.dart';
import 'screens/prescription_chat_screen.dart';
import 'screens/latin_chat_screen.dart';
import 'screens/favorites_screen.dart';
import 'widgets/flower_menu.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
    ),
  );
  runApp(const TibbiyotApp());
}

class TibbiyotApp extends StatelessWidget {
  const TibbiyotApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Tibbiyot',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        scaffoldBackgroundColor: AppColors.background,
        primaryColor: AppColors.primary,
        useMaterial3: true,
      ),
      home: const MainNavigationScreen(),
    );
  }
}

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({Key? key}) : super(key: key);

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentTab = 0;
  bool _isFlowerMenuOpen = false;

  final List<PrescriptionModel> _favoritePrescriptions = [];
  final List<LatinTermModel> _favoriteTerms = [];

  void _toggleRxFavorite(PrescriptionModel rx) {
    setState(() {
      final exists = _favoritePrescriptions.any((f) => f.id == rx.id);
      if (exists) {
        _favoritePrescriptions.removeWhere((f) => f.id == rx.id);
      } else {
        _favoritePrescriptions.add(rx);
      }
    });
  }

  void _toggleLatinFavorite(LatinTermModel term) {
    setState(() {
      final exists = _favoriteTerms.any((f) => f.id == term.id);
      if (exists) {
        _favoriteTerms.removeWhere((f) => f.id == term.id);
      } else {
        _favoriteTerms.add(term);
      }
    });
  }

  String _getTitle() {
    switch (_currentTab) {
      case 0:
        return 'Bugun';
      case 1:
        return 'Retseptura AI';
      case 2:
        return 'Lotin tili AI';
      case 3:
        return 'Konspekt';
      default:
        return 'Tibbiyot';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Stack(
        children: [
          SafeArea(
            child: Column(
              children: [
                // Minimalist Header
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Row(
                            children: [
                              Text(
                                '6-Sentabr, 2026',
                                style: TextStyle(color: AppColors.textSecondary, fontSize: 13),
                              ),
                              SizedBox(width: 4),
                              Icon(Icons.calendar_today_outlined, size: 13, color: AppColors.textSecondary),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Text(
                            _getTitle(),
                            style: const TextStyle(
                              fontSize: 30,
                              fontWeight: FontWeight.w900,
                              color: AppColors.textPrimary,
                              letterSpacing: -0.5,
                            ),
                          ),
                        ],
                      ),
                      Container(
                        width: 40,
                        height: 40,
                        decoration: const BoxDecoration(
                          color: Colors.white,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.tune_rounded, color: AppColors.textPrimary, size: 20),
                      ),
                    ],
                  ),
                ),

                // Asosiy Ekran Maydoni
                Expanded(
                  child: IndexedStack(
                    index: _currentTab,
                    children: [
                      HomeScreen(
                        onNavigateTab: (index) => setState(() => _currentTab = index),
                        favoritesCount: _favoritePrescriptions.length + _favoriteTerms.length,
                      ),
                      PrescriptionChatScreen(
                        onToggleFavorite: _toggleRxFavorite,
                        favorites: _favoritePrescriptions,
                      ),
                      LatinChatScreen(
                        onToggleFavorite: _toggleLatinFavorite,
                        favorites: _favoriteTerms,
                      ),
                      FavoritesScreen(
                        favoritePrescriptions: _favoritePrescriptions,
                        favoriteTerms: _favoriteTerms,
                        onRemovePrescription: _toggleRxFavorite,
                        onRemoveTerm: _toggleLatinFavorite,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // SUZUVCHI PASTKI DOCK NAVIGATSIYA (Floating Dock)
          Positioned(
            left: 20,
            right: 20,
            bottom: 24,
            child: Align(
              alignment: Alignment.bottomCenter,
              child: Container(
                constraints: const BoxConstraints(maxWidth: 390),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(AppRadius.dock),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.primary.withOpacity(0.12),
                      blurRadius: 24,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Home
                    IconButton(
                      icon: Icon(
                        Icons.grid_view_rounded,
                        color: _currentTab == 0 ? AppColors.primary : AppColors.textMuted,
                      ),
                      onPressed: () => setState(() => _currentTab = 0),
                    ),

                    // Retseptura
                    IconButton(
                      icon: Icon(
                        Icons.medication_outlined,
                        color: _currentTab == 1 ? AppColors.primary : AppColors.textMuted,
                      ),
                      onPressed: () => setState(() => _currentTab = 1),
                    ),

                    // MARKAZIY TUGMA (GUL MENYUSINI OCHADI)
                    GestureDetector(
                      onTap: () {
                        setState(() {
                          _isFlowerMenuOpen = true;
                        });
                      },
                      child: Container(
                        width: 52,
                        height: 52,
                        margin: const EdgeInsets.only(bottom: 12),
                        decoration: BoxDecoration(
                          color: AppColors.primary,
                          shape: BoxShape.circle,
                          border: Border.all(color: Colors.white, width: 3),
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.primary.withOpacity(0.3),
                              blurRadius: 12,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: const Icon(Icons.auto_awesome, color: AppColors.accent, size: 22),
                      ),
                    ),

                    // Lotin tili
                    IconButton(
                      icon: Icon(
                        Icons.menu_book_outlined,
                        color: _currentTab == 2 ? AppColors.primary : AppColors.textMuted,
                      ),
                      onPressed: () => setState(() => _currentTab = 2),
                    ),

                    // Konspekt
                    IconButton(
                      icon: Icon(
                        Icons.bookmark_outline,
                        color: _currentTab == 3 ? AppColors.primary : AppColors.textMuted,
                      ),
                      onPressed: () => setState(() => _currentTab = 3),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // GUL KABI OCHILUVCHI RADIAL MENYU
          if (_isFlowerMenuOpen)
            FlowerMenuModal(
              onClose: () => setState(() => _isFlowerMenuOpen = false),
              onSelectTab: (index) => setState(() => _currentTab = index),
            ),
        ],
      ),
    );
  }
}
