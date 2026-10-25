import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * On-demand Tafseer generator and enricher using Gemini API
 * Strictly formatted to match the Ma'ariful Qur'an schema
 */

function generateScholarlyFallback(surahNumber: number, surahName?: string, verseRange?: [number, number]) {
  const manifestFilePath = path.join(__dirname, 'public', 'data', 'manifest.json');
  let meta: any = null;
  if (fs.existsSync(manifestFilePath)) {
    try {
      const manifestData = JSON.parse(fs.readFileSync(manifestFilePath, 'utf-8'));
      meta = manifestData.surahs?.find((s: any) => s.number === surahNumber);
    } catch {}
  }

  const nameTrans = meta?.nameTransliterated || surahName || `Surah ${surahNumber}`;
  const nameArabic = meta?.nameArabic || `سورة ${surahNumber}`;
  const nameEnglish = meta?.nameEnglish || 'The Chapter';
  const versesCount = meta?.versesCount || 10;
  const revelationType = meta?.revelationType || 'Makki';
  const juz = meta ? Array.from({ length: meta.juzEnd - meta.juzStart + 1 }, (_, i) => meta.juzStart + i) : [1];
  const summary = meta?.thematicSummary || `Authentic exegesis of Surah ${nameTrans} according to Ma'ariful Qur'an by Mufti Muhammad Shafi.`;

  const previews = meta?.sectionsPreview && meta.sectionsPreview.length > 0
    ? meta.sectionsPreview
    : [{ id: `${surahNumber}-1-${versesCount}`, verseRange: [1, versesCount], title: `Thematic Exegesis of Surah ${nameTrans}` }];

  const sections = previews.map((sec: any) => ({
    id: sec.id,
    surahNumber,
    verseRange: sec.verseRange,
    title: sec.title,
    juzNumber: meta?.juzStart || 1,
    revelationType,
    arabicText: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝`,
    translation: `In the name of Allah, the Entirely Merciful, the Especially Merciful. Guided reflection upon the divine signs, commandments of [Taqwa], and spiritual obligations illuminated in Surah ${nameTrans}. ۝`,
    phraseCards: [
      {
        id: `${sec.id}-card-1`,
        verseNumber: sec.verseRange[0],
        arabicPhrase: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ`,
        englishPhrase: `In the name of Allah, the Entirely Merciful, the Especially Merciful`,
        vocabulary: [
          { word: `بِسْمِ`, root: `س - م - و`, meaning: `In the name of`, grammarNote: `Preposition + Noun` },
          { word: `اللَّهِ`, root: `أ - ل - ه`, meaning: `Allah (The One True God)`, grammarNote: `Proper Name of Divinity` },
          { word: `الرَّحْمَٰنِ`, root: `ر - ح - م`, meaning: `The All-Merciful in essence`, grammarNote: `Divine Attribute` },
          { word: `الرَّحِيمِ`, root: `ر - ح - م`, meaning: `The Especially Merciful in action`, grammarNote: `Divine Attribute` }
        ]
      }
    ],
    commentary: `In Ma'ariful Qur'an, Mufti Muhammad Shafi articulates the central exegesis of Surah ${nameTrans}. This chapter focuses on ${summary.toLowerCase()} The Grand Mufti emphasizes that the purpose of reflection upon this sacred text is not mere academic inquiry, but transforming human action in conformity with the prophetic Sunnah, purifying the heart from spiritual diseases, and grounding the intellect in firm conviction of the hereafter.`,
    subsections: [
      {
        type: 'ahkam',
        title: `Jurisprudential Principles & Rulings in Surah ${nameTrans}`,
        content: `According to the Hanafi school of jurisprudence expounded in Ma'ariful Qur'an, the legal rulings derived from this chapter emphasize moral integrity, fulfilling financial and social trusts, and adhering to the prescribed boundaries of the Shariah.`
      },
      {
        type: 'asbab',
        title: `Historical Context & Occasion of Revelation (Asbab al-Nuzul)`,
        content: `Revealed during the ${revelationType} period of the prophetic mission (chronological revelation order: ${meta?.orderOfRevelation || surahNumber}), this chapter descended to address the spiritual and practical needs of the Muslim community, clarifying divine wisdom and shielding the believers against trials.`
      },
      {
        type: 'insights',
        title: `Spiritual & Contemplative Insights`,
        content: `Mufti Muhammad Shafi draws attention to the subtle balance between divine majesty and supreme mercy, illustrating how true faith combines awe (Khawf) with ardent hope (Raja') in the grace of the Creator.`
      }
    ],
    curatedTerms: [
      {
        term: 'Taqwa',
        arabicWord: 'التقوى',
        arabicRoot: 'و - ق - ي (W-Q-Y)',
        literalMeaning: 'Vigilant shielding against spiritual harm.',
        relatedWords: ['Muttaqin', 'Wiqayah', 'Ittaqa'],
        theologicalContext: 'The inner moral consciousness that preserves the believer from transgressing divine limits in public and private.',
        volumeReference: `Ma'ariful Qur'an, Surah ${nameTrans}`
      }
    ]
  }));

  return {
    number: surahNumber,
    nameArabic,
    nameTransliterated: nameTrans,
    nameEnglish,
    versesCount,
    revelationType,
    juz,
    bismillahPre: surahNumber !== 9,
    introductoryTafseer: `Surah ${nameTrans} (${nameEnglish}) is a ${revelationType} chapter comprising ${versesCount} verses. In Ma'ariful Qur'an, Mufti Muhammad Shafi explains that this surah establishes foundational guidance concerning ${summary.toLowerCase()}`,
    historicalContext: {
      background: `Revealed during the ${revelationType} epoch of divine revelation, Surah ${nameTrans} provided vital spiritual guidance for the community of believers, calling hearts to monotheistic devotion and moral excellence.`
    },
    sections
  };
}

app.post('/api/tafseer/generate', async (req: Request, res: Response) => {
  try {
    const { surahNumber, surahName, verseRange } = req.body;

    if (!surahNumber || surahNumber < 1 || surahNumber > 114) {
      return res.status(400).json({ error: 'Valid Surah number (1-114) is required.' });
    }

    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please check environment variables.',
      });
    }

    const paddedNumber = String(surahNumber).padStart(3, '0');
    const existingFilePath = path.join(__dirname, 'public', 'data', 'surahs', `${paddedNumber}.json`);

    // If file already exists, return existing data
    if (fs.existsSync(existingFilePath)) {
      const fileData = fs.readFileSync(existingFilePath, 'utf-8');
      return res.json(JSON.parse(fileData));
    }

    const rangePrompt = verseRange ? `verses ${verseRange[0]} to ${verseRange[1]}` : `key initial thematic sections (1-3 thematic sections)`;

    const prompt = `You are a world-class Islamic scholar specialized in classical Quranic exegesis (Tafseer), specifically 'Ma'ariful Qur'an' authored by the Grand Mufti of Pakistan, Maulana Mufti Muhammad Shafi (Deobandi school, Hanafi jurisprudence).

Generate complete, authentic, and structured Tafseer data for Surah ${surahNumber} (${surahName || 'Surah ' + surahNumber}), covering ${rangePrompt}.

REQUIREMENTS:
1. Arabic Text: Must use precise Uthmanic Medina script (KFGQPC / Hafs) with full diacritics (harakat) and ayah end markers (۝).
2. Translation: High-register, dignified English translation. For theological/legal terms (e.g. Taqwa, Salah, Zakah, Riba, Ghayb, Kufr, etc.), enclose the term in square brackets like [Taqwa] so the frontend can attach popover definitions.
3. Phrase Cards: Quranic-style phrase-by-phrase cards breaking down Arabic phrases with English translation and word-level root etymology.
4. Commentary: Deep, intellectual, and spiritually nourishing commentary strictly reflecting Mufti Muhammad Shafi's Ma'ariful Qur'an tone. Explain theological nuances, moral imperatives, and historical context.
5. Subsections: Include categorized margin notes for:
   - 'ahkam' (Injunctions & Legal Rulings according to Hanafi jurisprudence)
   - 'asbab' (Occasion of Revelation / historical context)
   - 'insights' (Subtle points, spiritual wisdom, or linguistic nuances)
6. Curated Terms: High-impact theological vocabulary with Arabic root, literal meaning, theological explanation, and volume reference.
7. Background: Provide an authoritative 'historicalContext' object containing a single 'background' string that seamlessly combines the historical backdrop and occasions of revelation into one dignified, cohesive scholarly narrative.`;

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are an expert Islamic scholar producing structured JSON exegesis for the Ma'ariful Quran Interactive Reader.",
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            number: { type: Type.INTEGER },
            nameArabic: { type: Type.STRING },
            nameTransliterated: { type: Type.STRING },
            nameEnglish: { type: Type.STRING },
            versesCount: { type: Type.INTEGER },
            revelationType: { type: Type.STRING },
            juz: {
              type: Type.ARRAY,
              items: { type: Type.INTEGER },
            },
            bismillahPre: { type: Type.BOOLEAN },
            introductoryTafseer: { type: Type.STRING },
            historicalContext: {
              type: Type.OBJECT,
              properties: {
                background: { type: Type.STRING },
              },
            },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  surahNumber: { type: Type.INTEGER },
                  verseRange: {
                    type: Type.ARRAY,
                    items: { type: Type.INTEGER },
                  },
                  title: { type: Type.STRING },
                  juzNumber: { type: Type.INTEGER },
                  revelationType: { type: Type.STRING },
                  arabicText: { type: Type.STRING },
                  translation: { type: Type.STRING },
                  phraseCards: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        verseNumber: { type: Type.INTEGER },
                        arabicPhrase: { type: Type.STRING },
                        englishPhrase: { type: Type.STRING },
                        vocabulary: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              word: { type: Type.STRING },
                              root: { type: Type.STRING },
                              meaning: { type: Type.STRING },
                              grammarNote: { type: Type.STRING },
                            },
                            required: ['word', 'root', 'meaning'],
                          },
                        },
                      },
                      required: ['id', 'arabicPhrase', 'englishPhrase'],
                    },
                  },
                  commentary: { type: Type.STRING },
                  subsections: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        type: { type: Type.STRING },
                        title: { type: Type.STRING },
                        content: { type: Type.STRING },
                      },
                      required: ['type', 'title', 'content'],
                    },
                  },
                  curatedTerms: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        term: { type: Type.STRING },
                        arabicRoot: { type: Type.STRING },
                        literalMeaning: { type: Type.STRING },
                        theologicalContext: { type: Type.STRING },
                        volumeReference: { type: Type.STRING },
                      },
                      required: ['term', 'literalMeaning', 'theologicalContext'],
                    },
                  },
                },
                required: ['id', 'title', 'arabicText', 'translation', 'commentary'],
              },
            },
          },
          required: ['number', 'nameArabic', 'nameTransliterated', 'nameEnglish', 'sections'],
        },
      },
    });

    const parsedData = JSON.parse(response.text || '{}');

    // Optionally save to disk cache for instantaneous subsequent reads
    try {
      const dirPath = path.dirname(existingFilePath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      fs.writeFileSync(existingFilePath, JSON.stringify(parsedData, null, 2), 'utf-8');
    } catch (saveErr) {
      console.warn('Could not persist generated JSON to disk cache:', saveErr);
    }

    return res.json(parsedData);
  } catch (err: any) {
    console.error('Error generating tafseer:', err);
    return res.status(500).json({ error: err.message || 'Failed to generate tafseer' });
  }
});

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
