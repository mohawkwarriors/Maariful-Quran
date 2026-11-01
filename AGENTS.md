# Project Architectural & Typographic Guidelines: Maariful-Quran Reader

## 1. Arabic Typography & Ayah Markers
- **Ayah End Marker Geometry**: The Ayah End Marker (`AyahEndMarker.tsx`) must strictly render as the authentic **Uthmanic Quran Ayah End Medallion** vector (circular beaded rim, horizontal side finials, top/bottom apex crowns, and centered Eastern Arabic numerals) matching the design of the markers in the Arabic section. Never revert to plain bracketed numbers or unshaped raw glyphs that decouple on iOS.
- **Vertical Alignment**: In `AnnotatedTranslation.tsx`, the medallion must maintain precise optical inline baseline alignment with the surrounding translation text.
- **Root & Word Explore Modals**:
  - The Arabic root text in `RootExplorerModal.tsx` and `WordDeepDiveModal.tsx` must be cleanly vertically and horizontally centered.
  - Do not introduce nested white boxes or high-contrast border wrappers around individual root letters.

## 2. Surah Header & Reader Layout
- **Compact Header Spacing**: The top header (`SurahHero.tsx` / `ReaderHeader.tsx`) must feel compact, breathable, and elegant without feeling crowded or having excessive empty vertical whitespace.
- **RTL & Diacritics Integrity**: Preserve all Arabic diacritics (*tashkeel*) in Quranic text. When manipulating Arabic strings, use Unicode-aware functions or the local Qwen model via `bionic_worker.py` to prevent character fragmentation.

## 3. Pre-Commit Quality Gate
- Run `npm run build` or `npx tsc --noEmit` to verify type and build integrity.
- Run `uv run python "C:\Users\Saahir - PC\.gemini\antigravity\scripts\bionic_worker.py" --mode diff-check` before committing to verify that Ayah marker SVGs, Arabic typography classes, and reading layout rules are preserved.
