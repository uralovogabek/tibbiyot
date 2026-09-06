import 'package:flutter/material.dart';
import '../constants/theme.dart';

class FlowerMenuModal extends StatefulWidget {
  final Function(int) onSelectTab;
  final VoidCallback onClose;

  const FlowerMenuModal({
    Key? key,
    required this.onSelectTab,
    required this.onClose,
  }) : super(key: key);

  @override
  State<FlowerMenuModal> createState() => _FlowerMenuModalState();
}

class _FlowerMenuModalState extends State<FlowerMenuModal>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _opacityAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 320),
    );

    _scaleAnimation = CurvedAnimation(
      parent: _controller,
      curve: Curves.elasticOut,
    );

    _opacityAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(_controller);

    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _closeAndSelect(int tabIndex) {
    _controller.reverse().then((_) {
      widget.onSelectTab(tabIndex);
      widget.onClose();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: Stack(
        alignment: Alignment.bottomCenter,
        children: [
          // Orqa fon xiralashishi
          GestureDetector(
            onTap: () {
              _controller.reverse().then((_) => widget.onClose());
            },
            child: AnimatedBuilder(
              animation: _opacityAnimation,
              builder: (context, child) {
                return Container(
                  color: Colors.black.withOpacity(0.4 * _opacityAnimation.value),
                );
              },
            ),
          ),

          // GUL YAPROQLARI (FLOWER BLOOM RADIAL MENU)
          Positioned(
            bottom: 30,
            child: AnimatedBuilder(
              animation: _scaleAnimation,
              builder: (context, child) {
                final val = _scaleAnimation.value;
                return Stack(
                  alignment: Alignment.center,
                  clipBehavior: Clip.none,
                  children: [
                    // 1-YAPROG': 💊 Retseptura AI (Chap-tepaga)
                    Transform.translate(
                      offset: Offset(-85 * val, -95 * val),
                      child: Transform.scale(
                        scale: val.clamp(0.0, 1.0),
                        child: _buildPetal(
                          icon: Icons.medication_outlined,
                          color: AppColors.widgetMauve,
                          label: 'Retseptura',
                          onTap: () => _closeAndSelect(1),
                        ),
                      ),
                    ),

                    // 2-YAPROG': 🏛️ Lotin tili (To'g'ri tepaga)
                    Transform.translate(
                      offset: Offset(0, -135 * val),
                      child: Transform.scale(
                        scale: val.clamp(0.0, 1.0),
                        child: _buildPetal(
                          icon: Icons.menu_book_outlined,
                          color: AppColors.widgetPeach,
                          label: 'Lotin tili',
                          onTap: () => _closeAndSelect(2),
                        ),
                      ),
                    ),

                    // 3-YAPROG': ⭐ Konspekt (O'ng-tepaga)
                    Transform.translate(
                      offset: Offset(85 * val, -95 * val),
                      child: Transform.scale(
                        scale: val.clamp(0.0, 1.0),
                        child: _buildPetal(
                          icon: Icons.bookmark_outline,
                          color: AppColors.widgetCoral,
                          label: 'Konspekt',
                          onTap: () => _closeAndSelect(3),
                        ),
                      ),
                    ),

                    // Markaziy X tugmasi
                    GestureDetector(
                      onTap: () {
                        _controller.reverse().then((_) => widget.onClose());
                      },
                      child: Container(
                        width: 54,
                        height: 54,
                        decoration: BoxDecoration(
                          color: AppColors.primary,
                          shape: BoxShape.circle,
                          border: Border.all(color: Colors.white, width: 3),
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.primary.withOpacity(0.35),
                              blurRadius: 16,
                              offset: const Offset(0, 6),
                            ),
                          ],
                        ),
                        child: const Icon(
                          Icons.close,
                          color: Colors.white,
                          size: 24,
                        ),
                      ),
                    ),
                  ],
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPetal({
    required IconData icon,
    required Color color,
    required String label,
    required VoidCallback onTap,
  }) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        GestureDetector(
          onTap: onTap,
          child: Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              color: color,
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white, width: 2.5),
              boxShadow: [
                BoxShadow(
                  color: color.withOpacity(0.4),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Icon(icon, color: Colors.white, size: 24),
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 11,
            fontWeight: FontWeight.bold,
            shadows: [
              Shadow(
                color: Colors.black45,
                blurRadius: 4,
                offset: Offset(0, 1),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
