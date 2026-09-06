class LatinTermModel {
  final String id;
  final String term;
  final String phonetic;
  final String grammar;
  final String uzbekMeaning;
  final String russianMeaning;
  final String category;
  final String exampleSentence;
  final String clinicalContext;
  final bool isFavorite;

  LatinTermModel({
    required this.id,
    required this.term,
    required this.phonetic,
    required this.grammar,
    required this.uzbekMeaning,
    required this.russianMeaning,
    required this.category,
    required this.exampleSentence,
    required this.clinicalContext,
    this.isFavorite = false,
  });

  factory LatinTermModel.fromJson(Map<String, dynamic> json) {
    return LatinTermModel(
      id: json['id'] ?? 'lt-${DateTime.now().millisecondsSinceEpoch}',
      term: json['term'] ?? '',
      phonetic: json['phonetic'] ?? '',
      grammar: json['grammar'] ?? '',
      uzbekMeaning: json['uzbekMeaning'] ?? '',
      russianMeaning: json['russianMeaning'] ?? '',
      category: json['category'] ?? 'klinika',
      exampleSentence: json['exampleSentence'] ?? '',
      clinicalContext: json['clinicalContext'] ?? '',
      isFavorite: json['isFavorite'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'term': term,
      'phonetic': phonetic,
      'grammar': grammar,
      'uzbekMeaning': uzbekMeaning,
      'russianMeaning': russianMeaning,
      'category': category,
      'exampleSentence': exampleSentence,
      'clinicalContext': clinicalContext,
      'isFavorite': isFavorite,
    };
  }

  LatinTermModel copyWith({bool? isFavorite}) {
    return LatinTermModel(
      id: id,
      term: term,
      phonetic: phonetic,
      grammar: grammar,
      uzbekMeaning: uzbekMeaning,
      russianMeaning: russianMeaning,
      category: category,
      exampleSentence: exampleSentence,
      clinicalContext: clinicalContext,
      isFavorite: isFavorite ?? this.isFavorite,
    );
  }
}
