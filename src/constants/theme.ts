export const COLORS = {
  // Asosiy brend ranglari (foydalanuvchi tanlagan)
  primary: '#10367D',          // Chuqur shohona ko'k
  primaryLight: '#1E499D',
  primaryDark: '#0B2353',
  primarySoft: 'rgba(16, 54, 125, 0.08)',

  accent: '#A5CE00',           // Bio-limon yashil
  accentDark: '#759400',
  accentSoft: 'rgba(165, 206, 0, 0.18)',

  // Skrinshotdagi yumshoq minimalist fon
  background: '#F3F4F8',       // Yumshoq nafis och kulrang
  backgroundAlt: '#E8ECF2',

  // Skrinshotdagi 2x2 vidjet ranglari (organik pastel)
  widgetMauve: '#93789E',      // Yumshoq binafsha/mauve
  widgetPeach: '#ECA074',      // Iliq shaftoli
  widgetGreen: '#82B766',      // Mayin pista yashil
  widgetCoral: '#E56D67',      // Mayin qizil/marjon
  widgetNavy: '#10367D',

  // Yuzalar va kartochkalar
  surface: '#FFFFFF',          // Toza oq karta foni
  surfaceMuted: '#F8FAFC',
  border: '#E8EDF2',
  borderLight: '#F1F4F8',

  // Matnlar
  textPrimary: '#1E2432',      // Chuqur qora-ko'k
  textSecondary: '#6E788B',    // Yumshoq kulrang
  textMuted: '#9CA5B4',
  textWhite: '#FFFFFF',

  // Status
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
};

export const RADIUS = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  card: 24,                    // Skrinshotdagi yumaloq kartochkalar
  dock: 36,                    // Suzuvchi pastki dock radiusi
  full: 9999,                  // Kapsula pills
};

export const SHADOWS = {
  // Skrinshotdagi juda yumshoq va nafis havodor soyalar
  card: {
    shadowColor: '#102A54',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 3,
  },
  dock: {
    shadowColor: '#102A54',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  widget: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 4,
  },
  fab: {
    shadowColor: '#10367D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  modal: {
    shadowColor: '#102A54',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 16,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};
