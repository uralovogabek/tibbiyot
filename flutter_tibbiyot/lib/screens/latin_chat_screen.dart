import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../constants/theme.dart';
import '../models/latin_term_model.dart';
import '../services/gemini_service.dart';

class LatinChatScreen extends StatefulWidget {
  final Function(LatinTermModel) onToggleFavorite;
  final List<LatinTermModel> favorites;

  const LatinChatScreen({
    Key? key,
    required this.onToggleFavorite,
    required this.favorites,
  }) : super(key: key);

  @override
  State<LatinChatScreen> createState() => _LatinChatScreenState();
}

class _LatinChatScreenState extends State<LatinChatScreen> {
  final TextEditingController _controller = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  bool _isLoading = false;

  final List<Map<String, dynamic>> _messages = [
    {
      'sender': 'ai',
      'text': 'Salom! Istalgan lotincha atamani yoki oʻzbekcha tibbiy soʻzni yozing — men uning aniq grammatikasi va tarjimasini tahlil qilib beraman 🏛️',
    },
    {
      'sender': 'user',
      'text': 'Arteria coronaria sinistra',
    },
    {
      'sender': 'ai',
      'term': LatinTermModel(
        id: 'lt-init-1',
        term: 'Arteria coronaria sinistra',
        phonetic: 'artéria koronária sinístra',
        grammar: 'Substantivum + Adjectivum (f, Nom. sing.)',
        uzbekMeaning: 'Chap toj (yurak) arteriyasi',
        russianMeaning: 'Левая венечная артерия',
        category: 'anatomiya',
        exampleSentence: 'Arteria coronaria sinistra de sinu aortae oritur.',
        clinicalContext: 'Klinikada eng koʻp miokard infarktiga sabab boʻluvchi qon tomir.',
      ),
    },
  ];

  final List<String> _quickTerms = [
    'Arteria coronaria',
    'Musculus biceps',
    'Infarctus myocardii',
    'Fractura',
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

    final result = await GeminiService.translateLatinTerm(query);

    setState(() {
      _messages.add({
        'sender': 'ai',
        'term': result,
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
        // Xabarlar
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
              } else if (msg['term'] != null) {
                return _buildLatinCard(msg['term'] as LatinTermModel);
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
            itemCount: _quickTerms.length,
            itemBuilder: (context, index) {
              return GestureDetector(
                onTap: () => _sendMessage(_quickTerms[index]),
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
                    _quickTerms[index],
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppColors.widgetMauve,
                    ),
                  ),
                ),
              );
            },
          ),
        ),

        // Input
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
                const Icon(Icons.menu_book_outlined, color: AppColors.widgetPeach, size: 20),
                const SizedBox(width: 8),
                Expanded(
                  child: TextField(
                    controller: _controller,
                    onSubmitted: (_) => _sendMessage(),
                    decoration: const InputDecoration(
                      hintText: 'Lotincha atama yozing...',
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
                      color: AppColors.widgetMauve,
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
          color: AppColors.widgetMauve,
          borderRadius: BorderRadius.circular(18).copyWith(bottomRight: const Radius.circular(4)),
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
              child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.widgetMauve),
            ),
            SizedBox(width: 8),
            Text(
              'Gemini AI atamani tahlil qilmoqda...',
              style: TextStyle(color: AppColors.widgetMauve, fontSize: 12, fontWeight: FontWeight.w600),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLatinCard(LatinTermModel term) {
    final isFav = widget.favorites.any((f) => f.id == term.id);

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
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                term.term,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppColors.primary,
                ),
              ),
              IconButton(
                icon: Icon(
                  isFav ? Icons.bookmark : Icons.bookmark_outline,
                  color: isFav ? AppColors.accentDark : AppColors.textMuted,
                  size: 20,
                ),
                onPressed: () => widget.onToggleFavorite(term),
              ),
            ],
          ),
          Text(
            '[${term.phonetic}] • ${term.grammar}',
            style: const TextStyle(fontSize: 12, fontStyle: FontStyle.italic, color: AppColors.textSecondary),
          ),
          const SizedBox(height: 8),
          Text(
            'UZ: ${term.uzbekMeaning}',
            style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
          ),
          Text(
            'RU: ${term.russianMeaning}',
            style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
          ),
        ],
      ),
    );
  }
}
