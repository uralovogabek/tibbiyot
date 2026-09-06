import { LatinTerm, PatientType, PrescriptionResult } from '../types';
import { INITIAL_LATIN_TERMS, INITIAL_PRESCRIPTIONS } from '../constants/medicalData';
import { StorageService } from './storageService';

export const DEFAULT_GEMINI_MODEL = 'gemini-3.5-flash';
export const DEFAULT_GEMINI_API_KEY = '';

// Lotincha rasmiy farmatsevtik qaratqich kelishigi (Genetivus) konvertori
export function toLatinGenitive(name: string): string {
  const clean = name.trim();
  if (clean.toLowerCase().endsWith('um')) {
    return clean.slice(0, -2) + 'i';
  }
  if (clean.toLowerCase().endsWith('us')) {
    return clean.slice(0, -2) + 'i';
  }
  if (clean.toLowerCase().endsWith('a')) {
    return clean.slice(0, -1) + 'ae';
  }
  if (clean.toLowerCase().endsWith('as')) {
    return clean.slice(0, -2) + 'atis';
  }
  if (clean.toLowerCase().endsWith('is')) {
    return clean.slice(0, -2) + 'idis';
  }
  return clean + 'i';
}

export const GeminiService = {
  async getEffectiveApiKey(customKey?: string): Promise<string> {
    if (customKey && customKey.trim().length > 10) {
      return customKey.trim();
    }
    const settings = await StorageService.getSettings();
    if (settings.geminiApiKey?.trim().length > 10) {
      return settings.geminiApiKey.trim();
    }
    return DEFAULT_GEMINI_API_KEY;
  },

  /**
   * Dori nomi bo'yicha tibbiy retsept namunasi generatsiya qilish (Gemini 3.5 Flash)
   */
  async generatePrescription(
    drugName: string,
    patientType: PatientType = 'adult',
    preferredForm: string = 'tab',
    customKey?: string
  ): Promise<PrescriptionResult & { isQuotaExhausted?: boolean }> {
    const apiKey = await this.getEffectiveApiKey(customKey);

    const isPediatric = patientType === 'pediatric';
    const formLabel = preferredForm === 'amp' ? 'Ampulalar (eritma)' : preferredForm === 'ung' ? 'Malham (Maz)' : preferredForm === 'caps' ? 'Kapsulalar' : 'Tabletkalar';

    const systemPrompt = `Sen tibbiyot oliygohlari talabalari uchun klinik farmakologiya va retseptura (Recipe) professori va ekspertisan.
Talaba senga dori nomini kiritadi.
Sening vazifang quyidagi qat'iy standartlar asosida O'ZBEK tilida to'liq va professional tibbiy retseptura tahlilini JSON formatida berish:
1. Rasmiy lotincha retsept namunasi:
   - Dori nomi qat'iyan qaratqich kelishigida (Genetivus: -i, -ae, -atis) bo'lishi shart!
   - Standart format:
     Rp.: [Dori shakli qisqartmasi: Tab. / Sol. ... in ampullis / Ung. / Caps.] [Dori nomi lotincha Genetivusda] [Doza]
     D.t.d. N [soni]
     S. [Qabul qilish tartibi o'zbekcha]
2. Farmakologik guruhi va ta'siri.
3. Asosiy ko'rsatmalar.
4. Dozalash tartibi (${isPediatric ? 'Bolalar uchun tana vazniga qarab: mg/kg/kun hisobi bilan aniq formula' : 'Kattalar uchun bir martalik va maksimal sutkalik doza'}).
5. Qo'llash mumkin bo'lmagan holatlar (kontrendikatsiyalar).
6. Talabalar uchun klinik layfhak / mnemotika.

Javobing FAQAT va FAQAT quyidagi JSON formatida bo'lsin:
{
  "drugName": "${drugName}",
  "latinName": "Dori nomining xalqaro patentlanmagan lotincha nomi",
  "dosageForm": "${formLabel}",
  "dosage": "${isPediatric ? '10-20 mg/kg' : '500 mg'}",
  "latinRecipe": "Rp.: ...\\nD.t.d. N ...\\nS. ...",
  "pharmacologicalGroup": "Farmakologik guruhi",
  "indications": ["1-ko'rsatma", "2-ko'rsatma"],
  "dosageInstructions": "Qabul qilish tartibi",
  "contraindications": ["1-holat", "2-holat"],
  "sideEffects": ["1-nojo'ya ta'sir"],
  "studentNotes": "Klinik mnemotika va layfhak"
}`;

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_GEMINI_MODEL}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nDori: ${drugName}, Bemor: ${patientType}, Shakli: ${preferredForm}` }]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json',
          }
        })
      });

      if (!response.ok) {
        const isQuota = response.status === 429;
        const fallback = this.generateFallbackPrescription(drugName, patientType, preferredForm, isQuota);
        return { ...fallback, isQuotaExhausted: isQuota };
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        throw new Error('Bo\'sh javob');
      }

      const parsed = JSON.parse(rawText.replace(/```json/g, '').replace(/```/g, '').trim());

      return {
        id: `rx-ai-${Date.now()}`,
        drugName: parsed.drugName || drugName,
        latinName: parsed.latinName || drugName,
        dosageForm: parsed.dosageForm || formLabel,
        dosage: parsed.dosage || (isPediatric ? '250 mg (bolalar)' : '500 mg'),
        latinRecipe: parsed.latinRecipe || `Rp.: Tab. ${toLatinGenitive(drugName)} 0.5\nD.t.d. N 20\nS. Ichilsin.`,
        pharmacologicalGroup: parsed.pharmacologicalGroup || 'Tibbiy dori vositasi',
        indications: Array.isArray(parsed.indications) ? parsed.indications : ['Klinik ko\'rsatma bo\'yicha'],
        dosageInstructions: parsed.dosageInstructions || 'Shifokor nazorati ostida',
        contraindications: Array.isArray(parsed.contraindications) ? parsed.contraindications : ['Komponentlarga yuqori sezuvchanlik'],
        sideEffects: Array.isArray(parsed.sideEffects) ? parsed.sideEffects : ['Allergik reaksiyalar'],
        studentNotes: parsed.studentNotes || 'Lotincha retsept qaratqich kelishigida rasmiylashtiriladi.',
        patientType,
        createdAt: Date.now(),
        isAiGenerated: true,
      };
    } catch (error) {
      console.error('Gemini generatsiya xatosi:', error);
      return this.generateFallbackPrescription(drugName, patientType, preferredForm);
    }
  },

  /**
   * Lotincha yoki O'zbekcha atamani AI orqali chuqur grammatik tahlil qilish
   */
  async translateLatinTerm(term: string, customKey?: string): Promise<LatinTerm & { isQuotaExhausted?: boolean }> {
    const apiKey = await this.getEffectiveApiKey(customKey);

    const systemPrompt = `Sen tibbiy lotin tili (Lingua Latina Medica) bo'yicha oliygoh professori va lingvistsan.
Talaba lotincha tibbiy termin yoki o'zbekcha anatomik nom kiritadi.
MUHIM QOIDALAR:
1. Agar talaba O'ZBEKCHA so'z kiritsa (masalan: yurak, jigar, o'pka, buyrak, me'da, suyak, bosh suyagi, mushak, o'mrov suyagi):
   - Uning rasmiy LOTINCHA anatomik atamasini aniqlagin!
2. Grammatik tahlilda albatta quyidagilarni ko'rsat:
   - Bosh kelishik (Nominativus sing.)
   - Qaratqich kelishigi (Genetivus sing.)
   - Grammatik jinsi (Masculinum, Femininum, Neutrum)
   - Turlanishi (I, II, III, IV, V declinatio)
3. O'zbekcha va Ruscha tibbiy atamasi.
4. Klinik va amaliyotdagi ahamiyati.

Javobing FAQAT quyidagi JSON formatida bo'lsin:
{
  "term": "Lotincha rasmiy termin (urg'u belgisi bilan)",
  "phonetic": "Talaffuzi (o'zbekcha harflarda)",
  "grammar": "Substantivum / Adjectivum, jinsi, turlanishi (Nom. sing. va Gen. sing.)",
  "uzbekMeaning": "O'zbekcha aniq tibbiy ma'nosi",
  "russianMeaning": "Ruscha rasmiy atamasi",
  "category": "anatomiya yoki klinika yoki farmakologiya yoki patologiya",
  "exampleSentence": "Ushbu atama qatnashgan lotincha gap",
  "clinicalContext": "Klinik ahamiyati va talaba bilishi shart bo'lgan nuqta"
}`;

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_GEMINI_MODEL}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nTermin: ${term}` }]
            }
          ],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: 'application/json',
          }
        })
      });

      if (!response.ok) {
        const isQuota = response.status === 429;
        const fallback = this.generateFallbackLatinTerm(term);
        return { ...fallback, isQuotaExhausted: isQuota };
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) return this.generateFallbackLatinTerm(term);

      const parsed = JSON.parse(rawText.replace(/```json/g, '').replace(/```/g, '').trim());

      return {
        id: `lt-ai-${Date.now()}`,
        term: parsed.term || term,
        phonetic: parsed.phonetic || term,
        grammar: parsed.grammar || 'Lotincha tibbiy atama',
        uzbekMeaning: parsed.uzbekMeaning || 'Tibbiy ma\'no',
        russianMeaning: parsed.russianMeaning || 'Медицинский термин',
        category: ['anatomiya', 'klinika', 'farmakologiya', 'patologiya'].includes(parsed.category) ? parsed.category : 'anatomiya',
        exampleSentence: parsed.exampleSentence || `${term} in praxi medica.`,
        clinicalContext: parsed.clinicalContext || 'Klinikada keng qo\'llaniladi.',
      };
    } catch {
      return this.generateFallbackLatinTerm(term);
    }
  },

  generateFallbackPrescription(
    drugName: string,
    patientType: PatientType,
    dosageForm: string = 'tab',
    isQuotaLimit?: boolean
  ): PrescriptionResult {
    const cleanName = drugName.toLowerCase().trim();
    const isPed = patientType === 'pediatric';

    const latinGen = toLatinGenitive(drugName);
    const formPrefix = dosageForm === 'amp' ? 'Sol.' : dosageForm === 'ung' ? 'Ung.' : dosageForm === 'caps' ? 'Caps.' : 'Tab.';
    const subscrip = dosageForm === 'amp' ? 'in ampullis' : dosageForm === 'caps' ? 'in capsulis' : 'in tabulettis';

    const studentNoteMsg = isQuotaLimit
      ? `💡 Eslatma: Google AI Studio kalitingizda kredit limiti (429) yuzaga keldi. Yangi bepul kalitni chat yuqorisidan kiritishingiz mumkin. Hozircha rasmiy Genetivus kelishigi bo'yicha retsept muvaffaqiyatli shakllantirildi.`
      : `💡 Talaba uchun: Retseptda "${toLatinGenitive(drugName)}" qaratqich kelishigida rasmiylashtirildi. ${isPed ? 'Pediatriyada bolalar tana vazniga eʼtibor bering!' : ''}`;

    return {
      id: `rx-local-${Date.now()}`,
      drugName: drugName,
      latinName: `${drugName}um`,
      dosageForm: dosageForm === 'amp' ? 'Ampula eritmasi' : dosageForm === 'ung' ? 'Malham (Maz)' : 'Tabletkalar',
      dosage: isPed ? '10-15 mg/kg (bolalar)' : '500 mg',
      latinRecipe: `Rp.: ${formPrefix} ${latinGen} ${isPed ? '0.25' : '0.5'}\nD.t.d. N 20 ${subscrip}\nS. ${isPed ? 'Bolalar: tana vazniga qarab 10 mg/kg sutkasiga 3 mahal.' : '1 tabletkadan kuniga 2-3 mahal ovqatdan so\'ng.'}`,
      pharmacologicalGroup: 'Keng taʼsir doirali dori vositasi',
      indications: [
        `${drugName} qoʻllash boʻyicha klinik koʻrsatmalar`,
        'Patogen mikroorganizmlar keltirib chiqargan oʻchoqlar',
      ],
      dosageInstructions: isPed
        ? 'Pediatriya: tana vazniga 10-15 mg/kg hisobidan, sutkasiga 3 mahal.'
        : 'Kattalarga: 500 mg dan kuniga 2-3 mahal. Maksimal: 2000 mg.',
      contraindications: ['Individual yuqori sezuvchanlik', 'Ogʻir jigar yetishmovchiligi'],
      sideEffects: ['Allergik reaksiyalar', 'Meʼda-ichak diskomforti'],
      studentNotes: studentNoteMsg,
      patientType,
      createdAt: Date.now(),
      isAiGenerated: true,
    };
  },

  generateFallbackLatinTerm(term: string): LatinTerm {
    const q = term.toLowerCase().trim();

    // Boyitilgan anatomik mosliklar
    if (q.includes('yurak')) {
      return INITIAL_LATIN_TERMS[0]; // Cor
    }
    if (q.includes('jigar')) {
      return INITIAL_LATIN_TERMS[1]; // Hepar
    }
    if (q.includes('o\'pka') || q.includes('opka')) {
      return INITIAL_LATIN_TERMS[2]; // Pulmo
    }
    if (q.includes('buyrak')) {
      return INITIAL_LATIN_TERMS[3]; // Ren
    }
    if (q.includes('arteriya') || q.includes('tomir')) {
      return INITIAL_LATIN_TERMS[4]; // Arteria coronaria
    }

    return {
      id: `lt-fb-${Date.now()}`,
      term: term,
      phonetic: term.toLowerCase(),
      grammar: 'Terminus technicus medicus (Lotincha tibbiy atama)',
      uzbekMeaning: `"${term}" tibbiy atamasi tahlili`,
      russianMeaning: `Медицинский термин ${term}`,
      category: 'anatomiya',
      exampleSentence: `Terminus in anatomia et medicina usurpari solet.`,
      clinicalContext: 'Klinik amaliyotda keng qo\'llaniladi.',
    };
  }
};
