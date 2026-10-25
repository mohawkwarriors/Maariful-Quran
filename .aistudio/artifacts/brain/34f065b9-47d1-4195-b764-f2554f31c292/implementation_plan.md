# Implementation Plan: Historical Context & Asbab al-Nuzul Integration

A comprehensive plan to integrate authentic historical context and occasions of revelation (*Asbab al-Nuzul* — أسباب النزول) at the beginning of every Surah in the Ma'ariful Qur'an reader.

---

## 1. Overview & Objectives

### User Need
The user requested adding **Historical Context and Occasions of Revelation (*Asbab al-Nuzul*)**, specifically integrated **at the beginning of every Surah**, providing readers with the background, historical era, and specific circumstances under which the sacred verses were revealed.

### Key Deliverables — [COMPLETED]
1. **Pristine Editorial Card at Surah Opening**: [Done]
   - Seamlessly placed in the Surah Hero header block (below Bismillah and introductory overview) before the first verse section begins.
   - Distinctive Islamic study aesthetic with an authentic calligraphy badge (`أسباب النزول`), chronological revelation tag, and quiet, high-legibility typography.
2. **Layered Revelation Insights**: [Done]
   - **Chronological & Geographical Setting**: Clear Makki/Madani period classification, approximate year of revelation, and historical setting (e.g. *Post-Hijrah Madani Consolidation*, *Early Public Dawah in Makkah*, *Treaty of Hudaybiyyah*).
   - **Asbab al-Nuzul (Occasion of Revelation)**: Classical accounts (from Mufti Muhammad Shafi's *Ma'ariful Qur'an*, Imam al-Suyuti's *Lubab al-Nuqul*, and Imam al-Wahidi's *Asbab al-Nuzul*) documenting the specific community events, treaties, or inquiries from the Quraysh/Ahl al-Kitab that prompted the revelation.
   - **Prophetic Mission Significance**: The theological and legal impact of the Surah's descent on the early Muslim community.
3. **Interactive & Responsive UI**: [Done]
   - Collapsible/expandable affordance allowing readers who prefer a compact view to collapse the historical section with 1 click, while retaining default open visibility.
4. **Data & Schema Integration**: [Done]
   - Updated `SurahData` interface in `src/types/quran.ts`.
   - Seeded authentic historical context and Asbab al-Nuzul for foundational Surahs (Al-Fatihah, Al-Baqarah).
   - Updated `server.ts` generation prompt and schema so any dynamically loaded Surah automatically synthesizes authoritative Asbab al-Nuzul.

---

## 2. Proposed Architecture & Component Flow

```
[ App.tsx: Active Surah Loaded ]
               │
               ▼
   [ SurahHero.tsx (Surah Beginning) ]
               │
               ├── 1. Title & Arabic Cartouche (سورة البقرة)
               ├── 2. Bismillah Cartouche (بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ)
               ├── 3. Introductory Tafseer Overview
               │
               ▼
   [ HistoricalContextSection.tsx (NEW) ]
               │
               ├── Category Badge: "أسباب النزول · Asbab al-Nuzul"
               ├── Historical Setting & Chronology Tag
               ├── The Occasion of Revelation (The Narrative)
               ├── Key Historical Catalysts & Inquiries
               └── Classical Scholar Citations (Ma'ariful Qur'an)
```

---

## 3. Detailed Implementation Steps

### Step 1: Update TypeScript Interfaces (`src/types/quran.ts`)
Add a structured `HistoricalContext` model:
```typescript
export interface HistoricalContext {
  revelationEra: string;          // e.g. "Early Madani (1-2 AH / 622-624 CE)"
  chronologicalOrder?: number;    // Traditional order of revelation (e.g. 87 for Al-Baqarah)
  historicalBackdrop: string;     // The overarching political, social, and spiritual setting
  asbabAlNuzul: string;           // The specific incidents, inquiries, or milestones that catalyzed revelation
  keyCatalysts?: string[];        // Bulleted catalysts (e.g. "Questions posed by the Rabbis of Yathrib", "Shift of the Qiblah")
  scholarlyReference?: string;    // e.g. "Ma'ariful Qur'an Vol. 1, citing Al-Wahidi and Ibn Jarir al-Tabari"
}
```
Update `SurahData` interface to include `historicalContext?: HistoricalContext`.

### Step 2: Create `SurahHistoricalContext` Component (`src/components/SurahHistoricalContext.tsx`)
Create a dedicated, beautifully crafted component:
- **Card styling**: Matches the existing warm parchment/charcoal theme (`bg-white dark:bg-[#202025] border border-stone-200/80 dark:border-stone-800/80 rounded-2xl p-5 sm:p-7 shadow-xs`).
- **Header**:
  - Left: Landmark / Scroll icon with an amber pill `أسباب النزول` and title `Historical Context & Occasions of Revelation`.
  - Right: Chronological era badge (e.g., `Madani · Order of Revelation: 87`) and collapse/expand toggle.
- **Body Content**:
  - *The Historical Setting*: Paragraph explaining where the Prophet (ﷺ) and believers stood historically.
  - *Occasions of Revelation (Asbab al-Nuzul)*: Authentic narrative detailing what triggered the descent of the Surah.
  - *Key Historical Catalysts*: 2–3 concise tags/bullets highlighting concrete inquiries or events.
  - *Scholarship attribution*: Footnote attribution to classical authorities and Mufti Muhammad Shafi.

### Step 3: Integrate into `SurahHero.tsx`
- Import and render `SurahHistoricalContext` directly beneath the Bismillah and introductory Tafseer in `SurahHero.tsx`.
- Ensure harmonious vertical rhythm, mobile responsiveness, and dark mode support.

### Step 4: Enrich Data Sources & Dynamic Generator
- Update `/public/data/surahs/001.json` (Al-Fatihah: revealed in Makkah early in the mission, recited in every prayer; also confirmed in Madinah upon the change of Qiblah).
- Update `/public/data/surahs/002.json` (Al-Baqarah: comprehensive Madani revelation following the Hijrah, establishing the legal charter of the Muslim commonwealth, confronting hypocrisy, and addressing queries from the Jewish scholars of Madinah).
- Update `server.ts` Gemini prompt and schema so any other Surahs fetched dynamically receive full `historicalContext` conforming to classical sources.

---

## 4. Verification & Testing
1. **Visual Check**:
   - Verify layout on both mobile (<640px) and wide desktop screens.
   - Verify smooth transitions in both Parchment (Light) and Charcoal (Dark) themes.
2. **Content Fidelity**:
   - Verify that Arabic terms (`أسباب النزول`, names of Sahabah and locations) are correctly spelled and rendered with sacred typographic respect.
3. **Build Validation**:
   - Run `lint_applet` to confirm 0 TypeScript or lint issues.
   - Run `compile_applet` to verify successful production build.
