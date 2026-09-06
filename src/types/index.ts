export type PatientType = 'adult' | 'pediatric';

export type DosageForm = 
  | 'tab'        // Tabletkalar
  | 'caps'       // Kapsulalar
  | 'amp'        // Inyeksiya eritmalari / Ampula
  | 'susp'       // Suspenziya
  | 'ung'        // Malham (Maz)
  | 'gutt'       // Tomchilar (Guttae)
  | 'pulv'       // Kukun (Pulvis)
  | 'supp';      // Shamcha (Suppositorium)

export interface PrescriptionResult {
  id: string;
  drugName: string;
  latinName: string;
  dosageForm: string;
  dosage: string;
  latinRecipe: string; // Rasmiy Lotincha Rp.: formati
  pharmacologicalGroup: string;
  indications: string[];
  dosageInstructions: string;
  contraindications: string[];
  sideEffects: string[];
  studentNotes: string; // Talabalar uchun klinik layfhak / eslatma
  patientType: PatientType;
  createdAt: number;
  isAiGenerated?: boolean;
}

export type LatinCategory = 'anatomiya' | 'klinika' | 'farmakologiya' | 'patologiya';

export interface LatinTerm {
  id: string;
  term: string;          // Lotincha termin
  phonetic: string;      // Talaffuzi
  grammar: string;       // Grammatik shakli (Nom., Gen., jinsi, turlanishi)
  uzbekMeaning: string;  // O'zbekcha tarjimasi
  russianMeaning: string;// Ruscha tarjimasi
  category: LatinCategory;
  exampleSentence: string;
  clinicalContext: string;
  aiExplanation?: string;
}

export type TabType = 'home' | 'prescriptions' | 'latin' | 'favorites' | 'settings';

export interface AppSettings {
  geminiApiKey: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  fontSize: 'normal' | 'large';
  autoSaveHistory: boolean;
}

export interface FavoriteItem {
  id: string;
  type: 'prescription' | 'latin';
  title: string;
  subtitle: string;
  category?: string;
  savedAt: number;
  data: PrescriptionResult | LatinTerm;
}
