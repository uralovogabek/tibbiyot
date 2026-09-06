import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../constants/theme.dart';
import '../models/prescription_model.dart';
import '../services/gemini_service.dart';

class PrescriptionChatScreen extends StatefulWidget {
  final Function(PrescriptionModel) onToggleFavorite;
  final List<PrescriptionModel> favorites;

  const PrescriptionChatScreen({
    Key? key,
    required this.onToggleFavorite,
    required this.favorites,
  }) : super(key: key);

  @override
  State<PrescriptionChatScreen> createState() => _PrescriptionChatScreenState();
}

class _PrescriptionChatScreenState extends State<PrescriptionChatScreen> {
  final TextEditingController _controller = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  bool _isLoading = false;

  final List<Map<String, dynamic>> _messages = [
    {
      'sender': 'ai',
      'text': 'Assalomu alaykum! Dori nomini yozing, men sizga rasmiy lotincha retsepturasini (Rp.:, D.t.d., S.) tuzib beraman 💊',
    },
    {
      'sender': 'user',
      'text': 'Amoksitsillin',
    },
    {
      'sender': 'ai',
      'prescription': PrescriptionModel(
        id: 'rx-amox-init',
        drugName: 'Amoksitsillin',
        latinName: 'Amoxicillinum',
        dosageForm: 'Tabletkalar',
        dosage: '500 mg',
        latinRecipe: 'Rp.: Tab. Amoxicillini 0.5\nD.t.d. N 20\nS. 1 tabletkadan kuniga 3 mahal ovqatdan keyin.',
        pharmacologicalGroup: 'Yarimsintetik penitsillinlar guruhi antibiotiki',
        dosageInstructions: 'Kattalarga 500 mg dan kuniga 3 mahal.',
        studentNotes: 'Mnemotika: Amoksitsillin kislotaga chidamli, ovqat bilan bogʻliq emas.',
      ),
    },
  ];

  final List<String> _quickChips = [
    'Amoksitsillin',
    'Seftriakson',
    'Paratsetamol',
    'Ibuprofen',
    'Azitromitsin',
  ];

  Future<void> _sendMessage([String? text]) async {
    final query = (text ?? _controller.text).trim();
    if (query.isEmpty || _isLoading) return;

    _controller.clear();
    setState(() {
      _messages.add({'sender': 'user', 'text': query});
      _isLoading = true;
    });

    _scrollToBottom();

    final result = await GeminiService.generatePrescription(query);

    setState(() {
      _messages.add({
        'sender': 'ai',
        'prescription': result,
      });
      _isLoading = false;
    });

    _scrollToBottom();
  }

  void _scrollToBottom() {
    Future.delayed(const Duration(milliseconds: 150), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 250),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Xabarlar ro'yxati
        Expanded(
          child: ListView.builder(
            controller: _scrollController,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            itemCount: _messages.length + (_isLoading ? 1 : 0),
            itemBuilder: (context, index) {
              if (index == _messages.length && _isLoading) {
                return _buildLoadingBubble();
              }

              final msg = _messages[index];
              if (msg['sender'] == 'user') {
                return _buildUserBubble(msg['text']);
              } else if (msg['prescription'] != null) {
                return _buildPrescriptionCard(msg['prescription'] as PrescriptionModel);
              } else {
                return _buildAiBubble(msg['text']);
              }
            },
          ),
        ),

        // Tezkor chiplar
        Container(
          height: 38,
          margin: const EdgeInsets.only(bottom: 6),
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: _quickChips.length,
            itemBuilder: (context, index) {
              return GestureDetector(
                onTap: () => _sendMessage(_quickChips[index]),
                child: Container(
                  margin: const EdgeInsets.only(right: 8),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(AppRadius.pill),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.04),
                        blurRadius: 6,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Text(
                    _quickChips[index],
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppColors.primary,
                    ),
                  ),
                ),
              );
            },
          ),
        ),

        // Chat Input maydoni
        Container(
          padding: const EdgeInsets.fromLTRB(16, 4, 16, 95),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(AppRadius.dock),
              boxShadow: [
                BoxShadow(
                  color: AppColors.primary.withOpacity(0.08),
                  blurRadius: 18,
                  offset: const Offset(0, 6),
                ),
              ],
            ),
            child: Row(
              children: [
                const Icon(Icons.medication_outlined, color: AppColors.primary, size: 20),
                const SizedBox(width: 8),
                Expanded(
                  child: TextField(
                    controller: _controller,
                    onSubmitted: (_) => _sendMessage(),
                    decoration: const InputDecoration(
                      hintText: 'Dori nomini yozing (masalan: Paratsetamol)...',
                      hintStyle: TextStyle(color: AppColors.textMuted, fontSize: 13),
                      border: InputBorder.none,
                    ),
                  ),
                ),
                GestureDetector(
                  onTap: () => _sendMessage(),
                  child: Container(
                    width: 34,
                    height: 34,
                    decoration: const BoxDecoration(
                      color: AppColors.primary,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.send_rounded, color: Colors.white, size: 16),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildUserBubble(String text) {
    return Align(
      alignment: Alignment.centerRight,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: AppColors.primary,
          borderRadius: BorderRadius.circular(18).copyWith(bottomRight: const Radius.circular(4)),
          boxShadow: [
            BoxShadow(
              color: AppColors.primary.withOpacity(0.15),
              blurRadius: 8,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Text(
          text,
          style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w600),
        ),
      ),
    );
  }

  Widget _buildAiBubble(String text) {
    return Align(
      alignment: Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18).copyWith(bottomLeft: const Radius.circular(4)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 8,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Text(
          text,
          style: const TextStyle(color: AppColors.textPrimary, fontSize: 13, height: 1.4),
        ),
      ),
    );
  }

  Widget _buildLoadingBubble() {
    return Align(
      alignment: Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
        ),
        child: const Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            SizedBox(
              width: 14,
              height: 14,
              child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.primary),
            ),
            SizedBox(width: 8),
            Text(
              'Gemini AI retsept tayyorlamoqda...',
              style: TextStyle(color: AppColors.primary, fontSize: 12, fontWeight: FontWeight.w600),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPrescriptionCard(PrescriptionModel rx) {
    final isFav = widget.favorites.any((f) => f.id == rx.id);

    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppRadius.card),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withOpacity(0.06),
            blurRadius: 14,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Sarlavha
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    rx.drugName,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  Text(
                    rx.latinName,
                    style: const TextStyle(
                      fontSize: 13,
                      fontStyle: FontStyle.italic,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
              Row(
                children: [
                  IconButton(
                    icon: Icon(
                      isFav ? Icons.bookmark : Icons.bookmark_outline,
                      color: isFav ? AppColors.accentDark : AppColors.textMuted,
                      size: 20,
                    ),
                    onPressed: () => widget.onToggleFavorite(rx),
                  ),
                  IconButton(
                    icon: const Icon(Icons.copy_rounded, color: AppColors.primary, size: 20),
                    onPressed: () {
                      Clipboard.setData(ClipboardData(text: rx.latinRecipe));
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Retsept nusxalandi!'),
                          duration: Duration(seconds: 2),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ],
          ),

          const SizedBox(height: 10),

          // Rasmiy Lotincha Retseptura Varaqasi
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFFFAF9F5),
              borderRadius: BorderRadius.circular(12),
              border: const Border(
                left: BorderSide(color: AppColors.primary, width: 3),
              ),
            ),
            child: Text(
              rx.latinRecipe,
              style: const TextStyle(
                fontFamily: 'monospace',
                fontSize: 13,
                height: 1.5,
                fontWeight: FontWeight.w600,
                color: Color(0xFF1E293B),
              ),
            ),
          ),

          const SizedBox(height: 10),

          // Farmakologik guruhi va eslatma
          Text(
            'Guruh: ${rx.pharmacologicalGroup}',
            style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
          ),
          const SizedBox(height: 4),
          Text(
            'Tartib: ${rx.dosageInstructions}',
            style: const TextStyle(fontSize: 12, color: AppColors.textPrimary, fontWeight: FontWeight.w500),
          ),
        ],
      ),
    );
  }
}
