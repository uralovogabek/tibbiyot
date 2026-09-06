import { LatinTerm, PrescriptionResult } from '../types';

export const DOSAGE_FORMS = [
  { id: 'tab', label: 'Tabletkalar', short: 'Tab.', prefix: 'Tab. ' },
  { id: 'amp', label: 'Ampulalar', short: 'Sol. amp.', prefix: 'Sol. ' },
  { id: 'caps', label: 'Kapsulalar', short: 'Caps.', prefix: 'Caps. ' },
  { id: 'ung', label: 'Malham (Maz)', short: 'Ung.', prefix: 'Ung. ' },
  { id: 'gutt', label: 'Tomchilar', short: 'Gutt.', prefix: 'Gutt. ' },
  { id: 'susp', label: 'Suspenziya', short: 'Susp.', prefix: 'Susp. ' },
];

export const INITIAL_PRESCRIPTIONS: PrescriptionResult[] = [
  {
    id: 'rx-amox-1',
    drugName: 'Amoksitsillin',
    latinName: 'Amoxicillinum',
    dosageForm: 'Tabletkalar (Tabulettae)',
    dosage: '500 mg (0.5 g)',
    latinRecipe: `Rp.: Tab. Amoxicillini 0.5\nD.t.d. N 20\nS. 1 tabletkadan kuniga 3 mahal ovqatdan keyin 7 kun ichilsin.`,
    pharmacologicalGroup: 'Yarimsintetik penitsillinlar guruhi keng taʼsir doirali antibiotiki',
    indications: [
      'Nafas yoʻllari infeksiyalari (bronxit, pnevmoniya)',
      'Oʻrta quloq otiti va sinusitlar',
      'Siydik-tanosil tizimi infeksiyalari'
    ],
    dosageInstructions: 'Kattalarga: 500 mg dan kuniga 3 mahal. Bolalarga: tana vazniga 20-40 mg/kg sutkasiga 3 mahalga boʻlib.',
    contraindications: [
      'Penitsillinlarga yuqori sezuvchanlik',
      'Infeksion mononuklyoz (teri toshmasi xavfi)',
      'Ogʻir jigar yetishmovchiligi'
    ],
    sideEffects: [
      'Allergik reaksiyalar (eshakemi)',
      'Koʻngil aynishi, diareya',
      'Disbakterioz'
    ],
    studentNotes: 'Mnemotika: Amoksitsillin kislotaga chidamli, ovqatlanishdan qatʼiy nazar ichish mumkin. Mononuklyozda aslo berilmaydi!',
    patientType: 'adult',
    createdAt: Date.now() - 100000,
  },
  {
    id: 'rx-ceft-2',
    drugName: 'Seftriakson',
    latinName: 'Ceftriaxonum',
    dosageForm: 'Inyeksiya uchun kukun',
    dosage: '1.0 g',
    latinRecipe: `Rp.: Ceftriaxoni 1.0\nD.t.d. N 10 in ampullis\nS. Flakon 3.5 ml 1% li lidokainda eritilib, m/o sutkasiga 1 mahal yuborilsin.`,
    pharmacologicalGroup: 'III avlod sefalosporinlar guruhi parenteral antibiotiki',
    indications: [
      'Ogʻir pnevmoniya va sepsis',
      'Bakterial meningit',
      'Peritonit va qorin boʻshligʻi infeksiyalari'
    ],
    dosageInstructions: 'Kattalarga: 1.0 - 2.0 g sutkasiga 1 mahal. Bolalarga: 20-80 mg/kg sutkasiga 1 mahal.',
    contraindications: [
      'Sefalosporinlarga allergik anafilaksiya',
      'Muddatidan oldin tugʻilgan chaqaloqlar',
      'Kalsiy saqlovchi eritmalar bilan bir vaqtda v/i yuborish'
    ],
    sideEffects: ['Gipoprotrombinemiya', 'Oʻt pufagida choʻkindi paydo boʻlishi'],
    studentNotes: 'Talaba eslatmasi: Seftriakson T1/2 uzoq boʻlgani sababli kuniga 1 marta yuboriladi. Hech qachon Kalsiy eritmalari (Ringer) bilan bir shpritsda aralashtirilmaydi!',
    patientType: 'adult',
    createdAt: Date.now() - 200000,
  },
  {
    id: 'rx-para-3',
    drugName: 'Paratsetamol',
    latinName: 'Paracetamolum',
    dosageForm: 'Tabletkalar (Tabulettae)',
    dosage: '500 mg',
    latinRecipe: `Rp.: Tab. Paracetamoli 0.5\nD.t.d. N 10\nS. Tana harorati 38.5°C dan oshganda 1 tabletkadan ichilsin.`,
    pharmacologicalGroup: 'Analgetik-antipiretik (NPYQ)',
    indications: ['Febril isitma holatlari', 'Bosh ogʻrigʻi, tish ogʻrigʻi'],
    dosageInstructions: 'Kattalarga: 500-1000 mg dan har 4-6 soatda. Maksimal: 4000 mg (4g). Bolalarga: 10-15 mg/kg bir martalik doza.',
    contraindications: ['Ogʻir jigar yetishmovchiligi', 'Surunkali alkogolizm'],
    sideEffects: ['Gepatotoksiklik (doza oshganda)'],
    studentNotes: 'Antidot: Doza oshganda jigar himoyasi uchun N-atsetilsistein (NAC) beriladi!',
    patientType: 'adult',
    createdAt: Date.now() - 300000,
  }
];

export const INITIAL_LATIN_TERMS: LatinTerm[] = [
  {
    id: 'lt-cor',
    term: 'Cor, cordis',
    phonetic: 'kor, kórdis',
    grammar: 'Substantivum, neutrum, declinatio III (Oʻrta jins, 3-turlanish)',
    uzbekMeaning: 'Yurak (anatomik organ)',
    russianMeaning: 'Сердце',
    category: 'anatomiya',
    exampleSentence: 'Cor in mediastino medio situm est.',
    clinicalContext: 'Kardiyologiya atamalari asosi: Cor pulmonale (oʻpka yuragi), Cordis apex (yurak uchi).',
    aiExplanation: 'Lotincha "cor", yunoncha "kardia". Qaratqich kelishigi: cordis.'
  },
  {
    id: 'lt-hepar',
    term: 'Hepar, hepatis',
    phonetic: 'hépar, hepátis',
    grammar: 'Substantivum, neutrum, declinatio III (Oʻrta jins, 3-turlanish)',
    uzbekMeaning: 'Jigar',
    russianMeaning: 'Печень',
    category: 'anatomiya',
    exampleSentence: 'Hepar est organum parenchymatosum maximum.',
    clinicalContext: 'Gepatologiya atamalari asosi: Gepatit, Gepatomegaliya, Porta hepatis (jigar darvozasi).',
    aiExplanation: 'Yunoncha "hepar", lotincha sinonimi "jecur".'
  },
  {
    id: 'lt-pulmo',
    term: 'Pulmo, pulmonis',
    phonetic: 'púlmo, pulmónis',
    grammar: 'Substantivum, masculinum, declinatio III (Muzskoy jins, 3-turlanish)',
    uzbekMeaning: 'Oʻpka',
    russianMeaning: 'Лёгкое',
    category: 'anatomiya',
    exampleSentence: 'Pulmo dexter et pulmo sinister in cavitate thoracis locati sunt.',
    clinicalContext: 'Pulmonologiya: Pulmonectomia, Arteria pulmonalis (oʻpka arteriyasi).',
    aiExplanation: 'Genetivus shakli: pulmonis. Sifat shakli: pulmonalis (oʻpka-).'
  },
  {
    id: 'lt-ren',
    term: 'Ren, renis',
    phonetic: 'ren, rénis',
    grammar: 'Substantivum, masculinum, declinatio III (Muzskoy jins, 3-turlanish)',
    uzbekMeaning: 'Buyrak',
    russianMeaning: 'Почка',
    category: 'anatomiya',
    exampleSentence: 'Ren dexter renem sinistrum paululum humilior est.',
    clinicalContext: 'Nefrologiya: Pelvis renalis (buyrak jomi), Insufficientia renalis (buyrak yetishmovchiligi).',
    aiExplanation: 'Lotincha "ren", yunoncha "nephros".'
  },
  {
    id: 'lt-arteria',
    term: 'Arteria coronaria sinistra',
    phonetic: 'artéria koronária sinístra',
    grammar: 'Substantivum + Adjectivum (f, Nom. sing., I declinatio)',
    uzbekMeaning: 'Chap toj (yurak) arteriyasi',
    russianMeaning: 'Левая венечная артерия',
    category: 'anatomiya',
    exampleSentence: 'Arteria coronaria sinistra de sinu aortae oritur.',
    clinicalContext: 'Miokard infarkti va stenokardiyada eng koʻp shikastlanadigan tomir (LAD tarmogʻi).',
    aiExplanation: '"Corona" — toj, gulchambar. "Sinistra" — chap.'
  },
  {
    id: 'lt-biceps',
    term: 'Musculus biceps brachii',
    phonetic: 'múskulus bíseps brákhii',
    grammar: 'Subst. (m, II decl.) + Adj. + Subst. (Gen.)',
    uzbekMeaning: 'Yelkaning ikki boshli mushagi (Biseps)',
    russianMeaning: 'Двуглавая мышца плеча',
    category: 'anatomiya',
    exampleSentence: 'Musculus biceps brachii antebrachium flectit.',
    clinicalContext: 'Tirsak boʻgʻimida bukuvchi va bilakni supinatsiya qiluvchi asosiy mushak.',
    aiExplanation: 'Bis (ikki) + caput (bosh) = biceps. Brachium = yelka.'
  },
  {
    id: 'lt-infarct',
    term: 'Infarctus myocardii acutus',
    phonetic: 'infárktus miokárdii akútus',
    grammar: 'Subst. (m, IV decl.) + Subst. (Gen.) + Adj. (m)',
    uzbekMeaning: 'Oʻtkir miokard infarkti',
    russianMeaning: 'Острый инфаркт миокарда',
    category: 'klinika',
    exampleSentence: 'Diagnisis: Infarctus myocardii acutus anterior.',
    clinicalContext: 'Yurak mushagi oʻtkir ishemiyasi oqibatidagi nekroz. EKGda ST segment koʻtarilishi.',
    aiExplanation: 'Infarctus — lat. "tiqilib qolmoq". Acutus — oʻtkir, shoshilinch.'
  },
  {
    id: 'lt-fractura',
    term: 'Fractura claviculae dextrae',
    phonetic: 'fraktúra klavikúle dékstre',
    grammar: 'Subst. (f, I decl.) + Subst. (Gen.) + Adj. (Gen.)',
    uzbekMeaning: 'Oʻng oʻmrov suyagining sinishi',
    russianMeaning: 'Перелом правой ключицы',
    category: 'klinika',
    exampleSentence: 'Fractura claviculae cum dislocatione fragmentorum.',
    clinicalContext: 'Travmatologiyada yelkaga yiqilish oqibatida eng koʻp uchraydigan sinish.',
    aiExplanation: 'Clavicula — kalitcha (clavis). Fractura — sinish.'
  }
];

export const POPULAR_MEDICINE_PROMPTS = [
  'Amoksitsillin',
  'Seftriakson',
  'Paratsetamol',
  'Ibuprofen',
  'Azitromitsin',
  'Ketorolak',
  'Drotaverin (No-shpa)',
  'Deksametazon',
];

// GUL MENYUSI UCHUN TIBBIY IMTIHON SAVOLLARI (FLASHCARDS)
export interface FlashcardQuestion {
  id: string;
  question: string;
  category: string;
  answer: string;
  rationale: string;
}

export const MEDICAL_FLASHCARDS: FlashcardQuestion[] = [
  {
    id: 'fc-1',
    category: 'Retseptura',
    question: 'Retseptda dori nomi qaysi lotincha kelishikda yozilishi shart?',
    answer: 'Genetivus (Qaratqich kelishigi)',
    rationale: 'Chunki "Recipe" (Rp.:) soʻzi buyruq maylida boʻlib, "Olgil nimani? - Dorining falon miqdorini" degan maʼnoda qaratqich kelishigini talab qiladi (masalan: Tabulettam Amoxicillini).'
  },
  {
    id: 'fc-2',
    category: 'Farmakologiya',
    question: 'Paratsetamol dozasini oshirib yuborishda jigar nekrozining oldini oluvchi asosiy antidot nima?',
    answer: 'Atsetilsistein (N-acetylcysteine / NAC)',
    rationale: 'Atsetilsistein glutation zaxirasini tiklaydi va paratsetamolning toksik metaboliti (NAPQI)ni zararsizlantiradi.'
  },
  {
    id: 'fc-3',
    category: 'Anatomiya',
    question: '"Cor" (Yurak) soʻzining lotincha grammatik jinsi va turlanishi qanday?',
    answer: 'Neutrum (Oʻrta jins), III declinatio (3-turlanish)',
    rationale: 'Nominativus: Cor, Genetivus: Cordis. Oʻrta jins boʻlgani sababli Nom. va Acc. kelishiklari bir xil boʻladi.'
  },
  {
    id: 'fc-4',
    category: 'Retseptura',
    question: 'Ampula eritmalariga retsept yozishda subskripsiya qanday qisqartma bilan ifodalanadi?',
    answer: 'D.t.d. N ... in ampullis',
    rationale: '"Da tales doses numero ... in ampullis" — shunday dozalardan ... dona ampulalarda ber degani.'
  },
  {
    id: 'fc-5',
    category: 'Klinika',
    question: 'Kardiologiyada "Beva qoldiruvchi arteriya" (Widow maker) deb qaysi tomir ataladi?',
    answer: 'Arteria coronaria sinistra ning LAD (oldingi tushuvchi) tarmogʻi',
    rationale: 'Ushbu tomir chap qorincha oldingi devori va toʻsiqni qon bilan taʼminlaydi, uning oʻtkir trombozi eng xavfli infarktga olib keladi.'
  }
];
