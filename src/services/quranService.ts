import FlexSearch from 'flexsearch';
import { SurahManifestItem, SurahData, SearchResultItem } from '../types/quran';

export interface ManifestResponse {
  totalSurahs: number;
  totalJuz: number;
  edition: string;
  surahs: SurahManifestItem[];
}

export async function fetchManifest(): Promise<ManifestResponse> {
  const res = await fetch('/data/manifest.json');
  if (!res.ok) {
    throw new Error('Failed to load Quran manifest');
  }
  return res.json();
}

export async function fetchSurah(surahNumber: number, surahName?: string): Promise<SurahData> {
  const padded = String(surahNumber).padStart(3, '0');
  
  try {
    const res = await fetch(`/data/surahs/${padded}.json`);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Continue to server-side generation
  }

  // If local file is missing, request server-side generation via Gemini
  const genRes = await fetch('/api/tafseer/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ surahNumber, surahName }),
  });

  if (!genRes.ok) {
    const errData = await genRes.json().catch(() => ({}));
    throw new Error(errData.error || `Unable to load Tafseer for Surah ${surahNumber}`);
  }

  return genRes.json();
}

/**
 * Client-side search index engine using FlexSearch
 */
export class QuranSearchEngine {
  private surahIndex: any;
  private sectionIndex: any;
  private lookupMap: Map<string, SearchResultItem> = new Map();
  private isReady = false;

  constructor() {
    // Using FlexSearch Index for fast, tokenized full-text queries
    // @ts-ignore
    const IndexClass = FlexSearch.Index || (FlexSearch as any).default?.Index || FlexSearch;
    
    this.surahIndex = new IndexClass({
      tokenize: 'forward',
      cache: true,
    });

    this.sectionIndex = new IndexClass({
      tokenize: 'forward',
      cache: true,
    });
  }

  public populateFromManifest(manifest: ManifestResponse) {
    manifest.surahs.forEach((surah) => {
      const docId = `surah-${surah.number}`;
      const searchContent = `${surah.number} ${surah.nameTransliterated} ${surah.nameArabic} ${surah.nameEnglish} ${surah.thematicSummary}`;
      
      this.surahIndex.add(docId, searchContent);
      this.lookupMap.set(docId, {
        id: docId,
        type: 'surah',
        surahNumber: surah.number,
        surahName: `${surah.number}. ${surah.nameTransliterated} (${surah.nameArabic})`,
        title: `${surah.nameTransliterated} — ${surah.nameEnglish}`,
        snippet: surah.thematicSummary,
      });

      // Index section previews if available
      if (surah.sectionsPreview) {
        surah.sectionsPreview.forEach((sec) => {
          const secDocId = `section-${surah.number}-${sec.id}`;
          const secContent = `${surah.nameTransliterated} ${sec.title} Verses ${sec.verseRange[0]}-${sec.verseRange[1]}`;
          this.sectionIndex.add(secDocId, secContent);
          this.lookupMap.set(secDocId, {
            id: secDocId,
            type: 'section',
            surahNumber: surah.number,
            surahName: surah.nameTransliterated,
            sectionId: sec.id,
            verseRange: sec.verseRange,
            title: sec.title,
            snippet: `Surah ${surah.nameTransliterated} • Verses ${sec.verseRange[0]}–${sec.verseRange[1]}`,
          });
        });
      }
    });

    this.isReady = true;
  }

  public indexSurahData(surah: SurahData) {
    surah.sections.forEach((sec) => {
      const secDocId = `section-${surah.number}-${sec.id}`;
      const secContent = `${surah.nameTransliterated} ${sec.title} ${sec.translation} ${sec.commentary} Verses ${sec.verseRange[0]}-${sec.verseRange[1]}`;
      
      this.sectionIndex.add(secDocId, secContent);
      this.lookupMap.set(secDocId, {
        id: secDocId,
        type: 'section',
        surahNumber: surah.number,
        surahName: surah.nameTransliterated,
        sectionId: sec.id,
        verseRange: sec.verseRange,
        title: sec.title,
        snippet: sec.translation.slice(0, 140) + '...',
      });

      // Index Subsections like Ahkam & Insights
      sec.subsections.forEach((sub, subIdx) => {
        const subDocId = `ahkam-${surah.number}-${sec.id}-${subIdx}`;
        const subContent = `${surah.nameTransliterated} ${sub.title} ${sub.content} ${sub.type}`;
        this.sectionIndex.add(subDocId, subContent);
        this.lookupMap.set(subDocId, {
          id: subDocId,
          type: 'ahkam',
          surahNumber: surah.number,
          surahName: surah.nameTransliterated,
          sectionId: sec.id,
          verseRange: sec.verseRange,
          title: `[${sub.type.toUpperCase()}] ${sub.title}`,
          snippet: sub.content.slice(0, 140) + '...',
        });
      });

      // Index Curated Terms
      if (sec.curatedTerms) {
        sec.curatedTerms.forEach((term, tIdx) => {
          const termDocId = `term-${surah.number}-${sec.id}-${tIdx}`;
          const termContent = `${term.term} ${term.arabicRoot || ''} ${term.literalMeaning} ${term.theologicalContext}`;
          this.sectionIndex.add(termDocId, termContent);
          this.lookupMap.set(termDocId, {
            id: termDocId,
            type: 'term',
            surahNumber: surah.number,
            surahName: surah.nameTransliterated,
            sectionId: sec.id,
            verseRange: sec.verseRange,
            title: `Term: ${term.term} (${term.arabicRoot || ''})`,
            snippet: `${term.literalMeaning} — ${term.theologicalContext.slice(0, 110)}...`,
          });
        });
      }
    });
  }

  public search(query: string, limit = 12): SearchResultItem[] {
    if (!query || !query.trim() || !this.isReady) return [];

    const cleanQuery = query.trim();
    const surahMatches: string[] = this.surahIndex.search(cleanQuery, { limit: 5 });
    const sectionMatches: string[] = this.sectionIndex.search(cleanQuery, { limit: 10 });

    const combinedIds = Array.from(new Set([...surahMatches, ...sectionMatches])).slice(0, limit);
    return combinedIds
      .map((id) => this.lookupMap.get(id))
      .filter((item): item is SearchResultItem => item !== undefined);
  }
}

export const globalSearchEngine = new QuranSearchEngine();
