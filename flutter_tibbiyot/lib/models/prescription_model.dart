class PrescriptionModel {
  final String id;
  final String drugName;
  final String latinName;
  final String dosageForm;
  final String dosage;
  final String latinRecipe;
  final String pharmacologicalGroup;
  final String dosageInstructions;
  final String studentNotes;
  final bool isFavorite;

  PrescriptionModel({
    required this.id,
    required this.drugName,
    required this.latinName,
    required this.dosageForm,
    required this.dosage,
    required this.latinRecipe,
    required this.pharmacologicalGroup,
    required this.dosageInstructions,
    required this.studentNotes,
    this.isFavorite = false,
  });

  factory PrescriptionModel.fromJson(Map<String, dynamic> json) {
    return PrescriptionModel(
      id: json['id'] ?? 'rx-${DateTime.now().millisecondsSinceEpoch}',
      drugName: json['drugName'] ?? '',
      latinName: json['latinName'] ?? '',
      dosageForm: json['dosageForm'] ?? 'Tabletkalar',
      dosage: json['dosage'] ?? '500 mg',
      latinRecipe: json['latinRecipe'] ?? '',
      pharmacologicalGroup: json['pharmacologicalGroup'] ?? '',
      dosageInstructions: json['dosageInstructions'] ?? '',
      studentNotes: json['studentNotes'] ?? '',
      isFavorite: json['isFavorite'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'drugName': drugName,
      'latinName': latinName,
      'dosageForm': dosageForm,
      'dosage': dosage,
      'latinRecipe': latinRecipe,
      'pharmacologicalGroup': pharmacologicalGroup,
      'dosageInstructions': dosageInstructions,
      'studentNotes': studentNotes,
      'isFavorite': isFavorite,
    };
  }

  PrescriptionModel copyWith({bool? isFavorite}) {
    return PrescriptionModel(
      id: id,
      drugName: drugName,
      latinName: latinName,
      dosageForm: dosageForm,
      dosage: dosage,
      latinRecipe: latinRecipe,
      pharmacologicalGroup: pharmacologicalGroup,
      dosageInstructions: dosageInstructions,
      studentNotes: studentNotes,
      isFavorite: isFavorite ?? this.isFavorite,
    );
  }
}
