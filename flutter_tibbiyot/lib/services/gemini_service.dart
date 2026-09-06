import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/prescription_model.dart';
import '../models/latin_term_model.dart';

class GeminiService {
  static const String apiKey = '';
  static const String modelName = 'gemini-3.5-flash';

  /// Dori nomi bo'yicha tibbiy retseptura generatsiyasi (Dart / Gemini 3.5 Flash)
  static Future<PrescriptionModel> generatePrescription(String drugName) async {
    final systemPrompt = '''
Sen tibbiyot oliygohlari talabalari uchun klinik farmakologiya va retseptura professori va ekspertisan.
Talaba senga dori nomini kiritadi.
Sening vazifang quyidagi qat'iy standartlar asosida O'ZBEK tilida to'liq va professional tibbiy retseptura tahlilini JSON formatida berish:
1. Rasmiy lotincha retsept namunasi (Rp.: [Dori shakli va nomi lotincha qaratqich kelishigida - Gen.] [Doza] \\n D.t.d. N [soni] \\n S. [Qabul qilish tartibi o'zbekcha]).
2. Farmakologik guruhi va ta'siri.
3. Standart dozalash qoidalari.
4. Talabalar uchun klinik layfhak / eslatma.

Javobing FAQAT quyidagi JSON formatida bo'lsin:
{
  "drugName": "$drugName",
  "latinName": "Dori xalqaro lotincha nomi",
  "dosageForm": "Chiqarilish shakli",
  "dosage": "Standart doza",
  "latinRecipe": "Rp.: ...\\nD.t.d. N ...\\nS. ...",
  "pharmacologicalGroup": "Farmakologik guruhi",
  "dosageInstructions": "Qabul qilish tartibi",
  "studentNotes": "Talaba uchun klinik layfhak"
}
''';

    try {
      final url = Uri.parse(
        'https://generativelanguage.googleapis.com/v1beta/models/$modelName:generateContent?key=$apiKey',
      );

      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'contents': [
            {
              'parts': [
                {'text': '$systemPrompt\n\nDori nomi: $drugName'}
              ]
            }
          ],
          'generationConfig': {
            'temperature': 0.2,
            'responseMimeType': 'application/json',
          }
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(utf8.decode(response.bodyBytes));
        final rawText = data['candidates']?[0]?['content']?['parts']?[0]?['text'] ?? '';
        final cleanJson = rawText.replaceAll('```json', '').replaceAll('```', '').trim();
        final parsed = jsonDecode(cleanJson);
        return PrescriptionModel.fromJson(parsed);
      } else {
        return _fallbackPrescription(drugName);
      }
    } catch (e) {
      return _fallbackPrescription(drugName);
    }
  }

  /// Lotincha termin tahlili
  static Future<LatinTermModel> translateLatinTerm(String term) async {
    final systemPrompt = '''
Sen tibbiy lotin tili (Lingua Latina Medica) bo'yicha oliygoh professori va lingvistsan.
Talaba lotincha tibbiy termin yoki o'zbekcha anatomik nom kiritadi.
Sening vazifang quyidagi JSON formatida aniq O'ZBEK tilida tahlil berish:
{
  "term": "Lotincha rasmiy termin",
  "phonetic": "Talaffuzi",
  "grammar": "Grammatik shakli (Nom. sing., jinsi, turlanishi)",
  "uzbekMeaning": "O'zbekcha aniq tibbiy ma'nosi",
  "russianMeaning": "Ruscha rasmiy tibbiy atamasi",
  "category": "anatomiya",
  "exampleSentence": "Misol gap",
  "clinicalContext": "Klinik ahamiyati"
}
''';

    try {
      final url = Uri.parse(
        'https://generativelanguage.googleapis.com/v1beta/models/$modelName:generateContent?key=$apiKey',
      );

      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'contents': [
            {
              'parts': [
                {'text': '$systemPrompt\n\nTermin: $term'}
              ]
            }
          ],
          'generationConfig': {
            'temperature': 0.1,
            'responseMimeType': 'application/json',
          }
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(utf8.decode(response.bodyBytes));
        final rawText = data['candidates']?[0]?['content']?['parts']?[0]?['text'] ?? '';
        final cleanJson = rawText.replaceAll('```json', '').replaceAll('```', '').trim();
        final parsed = jsonDecode(cleanJson);
        return LatinTermModel.fromJson(parsed);
      } else {
        return _fallbackLatinTerm(term);
      }
    } catch (e) {
      return _fallbackLatinTerm(term);
    }
  }

  static PrescriptionModel _fallbackPrescription(String drugName) {
    return PrescriptionModel(
      id: 'rx-${DateTime.now().millisecondsSinceEpoch}',
      drugName: drugName,
      latinName: '${drugName}um',
      dosageForm: 'Tabletkalar (Tabulettae)',
      dosage: '500 mg',
      latinRecipe: 'Rp.: Tab. ${drugName}i 0.5\nD.t.d. N 20 in tabulettis\nS. 1 tabletkadan kuniga 2-3 mahal ovqatdan keyin.',
      pharmacologicalGroup: 'Keng taʼsir doirasiga ega dori vositasi',
      dosageInstructions: 'Kattalarga 500 mg dan kuniga 2-3 mahal.',
      studentNotes: 'Lotincha retsept qaratqich kelishigida (Genetivus) yoziladi.',
    );
  }

  static LatinTermModel _fallbackLatinTerm(String term) {
    return LatinTermModel(
      id: 'lt-${DateTime.now().millisecondsSinceEpoch}',
      term: term,
      phonetic: term.toLowerCase(),
      grammar: 'Terminus technicus medicus',
      uzbekMeaning: '$term tibbiy atamasi',
      russianMeaning: 'Медицинский термин $term',
      category: 'klinika',
      exampleSentence: 'Terminus in anatomia usurpari solet.',
      clinicalContext: 'Klinik amaliyotda keng qoʻllaniladi.',
    );
  }
}
