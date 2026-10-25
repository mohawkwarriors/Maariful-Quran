/**
 * TypeScript Interfaces for Maariful Quran Interactive Reader
 */

export interface VocabularyItem {
  word: string;
  root: string;
  meaning: string;
  grammarNote?: string;
}

export interface PhraseCard {
  id: string;
  arabicPhrase: string;
  englishPhrase: string;
  verseNumber?: number;
  vocabulary?: VocabularyItem[];
}

export interface SubSection {
  type: 'ahkam' | 'asbab' | 'insights';
  title: string;
  content: string;
}

export interface CuratedTerm {
  term: string;
  arabicWord?: string;
  arabicRoot?: string;
  literalMeaning: string;
  relatedWords?: string[];
  theologicalContext: string;
  volumeReference?: string;
}

export interface ThematicSection {
  id: string;
  surahNumber: number;
  verseRange: [number, number];
  title: string;
  summary?: string;
  juzNumber: number;
  revelationType: 'Makki' | 'Madani';
  volumeNumber?: number;
  archivePageUrl?: string;
  arabicText: string;
  translation: string;
  phraseCards: PhraseCard[];
  commentary: string;
  subsections: SubSection[];
  curatedTerms?: CuratedTerm[];
}

export interface SurahManifestItem {
  number: number;
  nameArabic: string;
  nameTransliterated: string;
  nameEnglish: string;
  versesCount: number;
  revelationType: 'Makki' | 'Madani';
  orderOfRevelation: number;
  juzStart: number;
  juzEnd: number;
  volumeNumber?: number;
  archivePageUrl?: string;
  sectionsCount: number;
  thematicSummary: string;
  sectionsPreview?: {
    id: string;
    verseRange: [number, number];
    title: string;
    summary?: string;
  }[];
}

export interface HistoricalContext {
  revelationEra?: string;
  chronologicalOrder?: number;
  historicalBackdrop?: string;
  asbabAlNuzul?: string;
  background?: string;
  keyCatalysts?: string[];
  scholarlyReference?: string;
}

export interface SurahData {
  number: number;
  nameArabic: string;
  nameTransliterated: string;
  nameEnglish: string;
  versesCount: number;
  revelationType: 'Makki' | 'Madani';
  volumeNumber?: number;
  archivePageUrl?: string;
  juz: number[];
  bismillahPre: boolean;
  introductoryTafseer: string;
  historicalContext?: HistoricalContext;
  sections: ThematicSection[];
}

export interface SearchResultItem {
  id: string;
  type: 'surah' | 'section' | 'ahkam' | 'term';
  surahNumber: number;
  surahName: string;
  title: string;
  snippet: string;
  sectionId?: string;
  verseRange?: [number, number];
}

export interface BookmarkRecord {
  id?: string;
  surahNumber: number;
  surahName: string;
  sectionId: string;
  sectionTitle?: string;
  verseRange?: [number, number];
  timestamp: number;
}
