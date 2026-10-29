import { DialogueTurn } from '../components/StoryDialogueCard';
import { formatQuranCitationFooter, parseQuranCitation } from './quranCitation';

export interface StoryDialogueGroup {
  contextIntro?: string;
  sourceAuthority?: string;
  turns: DialogueTurn[];
}

/**
 * Checks if a sequence of paragraphs corresponds to an extended historical dialogue/story
 * such as the encounter between Caliph Sulayman ibn 'Abd al-Malik and Abu Hazim in Surah 2 (Al-Baqarah).
 */
export function matchStoryDialogueSequence(
  paragraphs: string[],
  startIndex: number
): { matchedCount: number; group: StoryDialogueGroup } | null {
  const current = paragraphs[startIndex]?.trim() || '';

  // Trigger on the Abu Hazim encounter
  const isAbuHazimIntro =
    current.includes('Sulayman ibn ` Abd al-Malik') &&
    (current.includes('Abu Hazim') || current.includes('meet someone who had lived with a Companion'));

  if (!isAbuHazimIntro) return null;

  // Collect all conversational paragraphs until standard exegesis resumes
  let k = startIndex + 1;
  const rawTurns: string[] = [];

  while (k < paragraphs.length) {
    const p = paragraphs[k].trim();
    // Stop condition: next section heading, divider, or normal commentary shift
    if (
      /^\[\s*Verses?/i.test(p) ||
      /^[─\-_=~*]{3,}$/.test(p) ||
      /^(?:Verse\s+\d+\s+speaks|In\s+the\s+last\s+three\s+verses|Abu Hazim's refusal to accept the wages)/i.test(p)
    ) {
      break;
    }
    rawTurns.push(p);
    k++;
  }

  if (rawTurns.length < 3) return null;

  let lastSpeaker = 'The Caliph';
  const turns: DialogueTurn[] = [];

  for (let idx = 0; idx < rawTurns.length; idx++) {
    const raw = rawTurns[idx];

    // Detect speaker
    let speaker = 'The Caliph';
    if (
      /^(?:Abu\s+Hazim|Said\s+Abu\s+Hazim)/i.test(raw) ||
      /replied\s+Abu\s+Hazim/i.test(raw) ||
      /Abu\s+Hazim\s+(?:said|replied|recited|wanted)/i.test(raw)
    ) {
      speaker = 'Abu Hazim';
    } else if (
      /^(?:The\s+Caliph|Said\s+the\s+Caliph)/i.test(raw) ||
      /complained\s+the\s+Caliph/i.test(raw) ||
      /The\s+Caliph\s+(?:said|asked|remarked|burst|advanced|admitted|looked|agreed)/i.test(raw)
    ) {
      speaker = 'The Caliph';
    } else if (/Imam\s+Zuhri/i.test(raw)) {
      speaker = 'Imam Zuhri';
    } else if (/^["“]/.test(raw)) {
      // Alternate between Caliph and Abu Hazim
      speaker = lastSpeaker === 'The Caliph' ? 'Abu Hazim' : 'The Caliph';
    } else {
      speaker = lastSpeaker;
    }

    lastSpeaker = speaker;

    // Check for embedded Quran recitation inside speech
    const arIdx = raw.search(/[\u0600-\u06FF]/);
    const refMatch = raw.match(/\((\d+:\d+(?:[-–—]\d+)?)\)\s*$/);

    if (arIdx !== -1 && refMatch) {
      let leadInRaw = raw.slice(0, arIdx).trim().replace(/^["“]+|["”:\s]+$/g, '').trim();
      const rest = raw.slice(arIdx, refMatch.index).trim();
      const quoteMatch = rest.match(/["“]([^"”]+)["”]/);

      const arabic = quoteMatch
        ? rest.slice(0, quoteMatch.index).trim().replace(/[:：\s"“']+$/, '')
        : rest;
      const english = quoteMatch ? quoteMatch[1].trim() : '';
      const ref = refMatch[1].trim();

      // Resolve human-readable reference title e.g. "Surah Al-Infitar 82:13–14"
      const parsedCite = parseQuranCitation(`(${ref})`);
      const refFormatted = parsedCite
        ? formatQuranCitationFooter(parsedCite)
        : `Qur'an (${ref})`;

      // Clean redundant speaker prefixes (e.g. avoid "Abu Hazim: Abu Hazim recited...")
      leadInRaw = leadInRaw.replace(/^(?:Abu\s+Hazim|The\s+Caliph|Said\s+Abu\s+Hazim|Said\s+the\s+Caliph)\s+/i, '').trim();

      let speech = '';
      const recitationPromptMatch = leadInRaw.match(
        /(?:(?:And\s+)?(?:he\s+)?recited\s+(?:this\s+verse\s+of\s+the\s+Holy\s+Qur'an|another\s+verse|the\s+verse)|Here\s+is\s+the\s+verse)/i
      );

      if (recitationPromptMatch) {
        const promptIdx = recitationPromptMatch.index!;
        const prePrompt = leadInRaw.slice(0, promptIdx).trim();
        const prompt = leadInRaw.slice(promptIdx).trim();

        if (prePrompt) {
          speech = `${prePrompt} ${prompt}`;
        } else {
          speech = prompt;
        }
      } else {
        speech = leadInRaw;
      }

      // Ensure proper capitalization and colon ending for conversational lead-in
      if (speech) {
        speech = speech.charAt(0).toUpperCase() + speech.slice(1);
        if (!speech.endsWith(':') && !speech.endsWith('.')) {
          speech += ':';
        }
      }

      turns.push({
        speaker,
        speech,
        ayah: {
          arabic,
          english,
          reference: refFormatted,
        },
      });
      continue;
    }

    // Clean speaker speech lead-ins
    let speech = raw.trim();
    const leadMatch = speech.match(
      /^(?:(?:Changing the subject,\s+|Said\s+Abu\s+Hazim,\s*|Abu\s+Hazim\s+(?:replied|said)[,:\s]+|The\s+Caliph\s+(?:said\s+to\s+him|asked|remarked|burst\s+into\s+tears,\s+and\s+said\s+with\s+a\s+sigh|advanced\s+another\s+question|agreed\s+with\s+all\s+this,\s+and\s+then\s+asked\s+him\s+pointedly|admitted\s+that\s+it\s+was\s+true,\s+and\s+came\s+out\s+with\s+another\s+question)[,:\s]+))["“]([^"”]+)["”]/i
    );

    if (leadMatch) {
      speech = leadMatch[1].trim();
    } else if (/^["“][^"”]+["”]$/.test(speech)) {
      speech = speech.replace(/^["“]+|["”]+$/g, '').trim();
    }

    turns.push({
      speaker,
      speech,
    });
  }

  return {
    matchedCount: rawTurns.length + 1, // include context intro paragraph
    group: {
      contextIntro: current,
      sourceAuthority: 'Musnad al-Darimi · Related by Imam al-Qurtubi',
      turns,
    },
  };
}
