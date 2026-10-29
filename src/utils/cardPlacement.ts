import { SubSection } from '../types/quran';
import { QuoteType } from '../components/TafseerQuoteCard';
import { StoryDialogueGroup } from './storyDialogue';

export type RawCommentaryBlock =
  | { type: 'verse-heading'; raw: string }
  | { type: 'subheading'; content: string }
  | {
      type: 'quote';
      quoteType: QuoteType;
      content: string;
      arabic?: string;
      english?: string;
      source?: string;
      verseNumber?: number | string;
    }
  | { type: 'story-dialogue'; group: StoryDialogueGroup }
  | { type: 'text'; content: string };

export type CommentaryBlock =
  | RawCommentaryBlock
  | { type: 'study-card'; card: SubSection };

const AHKAM_KEYWORDS = [
  'injunction',
  'ruling',
  'permissible',
  'forbidden',
  'halal',
  'haram',
  'sunnah',
  'wajib',
  'shariah',
  'obligation',
  'juristic',
  'legal',
  'law',
  'ahkam',
  "mas'alah",
  'bismillah',
  'basmalah',
  'amin',
];

const ASBAB_KEYWORDS = [
  'revelation',
  'revealed',
  'prophet',
  'tradition',
  'narrated',
  'hadith',
  'incident',
  'context',
  'cause of revelation',
  'asbab',
  'background',
];

const INSIGHTS_KEYWORDS = [
  'insight',
  'wisdom',
  'spiritual',
  'subtle',
  'deeper',
  'allegory',
  'significance',
  'secret',
  'reflection',
];

const STOP_WORDS = new Set([
  'with',
  'from',
  'this',
  'that',
  'after',
  'versus',
  'these',
  'those',
  'their',
  'which',
  'about',
  'under',
  'have',
  'been',
  'when',
  'where',
  'what',
]);

/**
 * Score a commentary block's topical relevance against a subsection card.
 */
function scoreBlock(block: RawCommentaryBlock, sub: SubSection): number {
  const text = (
    block.type === 'verse-heading'
      ? block.raw
      : block.type === 'quote' || block.type === 'subheading' || block.type === 'text'
      ? block.content
      : ''
  ).toLowerCase();

  let score = 0;
  const isSubheading = block.type === 'subheading';

  // 1. Keyword alignment based on card type
  const targetKeywords =
    sub.type === 'ahkam'
      ? AHKAM_KEYWORDS
      : sub.type === 'asbab'
      ? ASBAB_KEYWORDS
      : INSIGHTS_KEYWORDS;

  for (const kw of targetKeywords) {
    if (text.includes(kw)) {
      score += isSubheading ? 30 : 2;
    }
  }

  // 2. Specific title term matching
  const titleWords = sub.title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !STOP_WORDS.has(w));

  for (const tw of titleWords) {
    if (text.includes(tw)) {
      score += isSubheading ? 20 : 7;
    }
  }

  return score;
}

/**
 * Interleaves SubSection companion cards (Ahkam/Fiqh, Asbab al-Nuzul, Spiritual Insights)
 * throughout the commentary blocks at their most contextually relevant locations.
 *
 * Invariants & Constraints:
 * 1. Strictly non-adjacent: No two study cards can appear adjacent to each other.
 *    Cards are always separated by at least one (and usually several) commentary blocks.
 * 2. Relevance first: Cards are matched to relevant subheadings, keywords, and topics.
 * 3. Proportional distribution: Cards are distributed throughout the reading flow rather
 *    than bunched at the beginning or end.
 * 4. Never inserted immediately after a standalone verse-heading before its explanation text.
 */
export function interleaveStudyCards(
  blocks: RawCommentaryBlock[],
  subsections?: SubSection[]
): CommentaryBlock[] {
  if (!subsections || subsections.length === 0) {
    return [...blocks];
  }

  if (blocks.length === 0) {
    return subsections.map((card) => ({ type: 'study-card', card }));
  }

  const n = blocks.length;
  const m = subsections.length;

  // Target spacing between card insertion indices (inserting AFTER block i)
  const targetGap = Math.max(1, Math.min(10, Math.floor(n / (m + 1))));

  // Pre-calculate scores: [subIndex][blockIndex]
  const scores: number[][] = subsections.map((sub) =>
    blocks.map((block) => scoreBlock(block, sub))
  );

  // Ideal proportional positions across the section
  const idealPositions = subsections.map((_, j) =>
    Math.max(0, Math.min(n - 1, Math.round(((j + 1) * n) / (m + 1)) - 1))
  );

  // Sort subsections so highest scoring cards lock in their optimal slots first
  const subOrder = subsections
    .map((_, j) => j)
    .sort((a, b) => {
      const maxA = Math.max(...scores[a]);
      const maxB = Math.max(...scores[b]);
      return maxB - maxA;
    });

  // Map subIndex -> blockIndex (card is inserted AFTER blockIndex)
  const assigned = new Map<number, number>();

  for (const subIdx of subOrder) {
    const idealPos = idealPositions[subIdx];
    let bestBlockIdx = -1;
    let bestVal = -Infinity;

    // Search for optimal block index with preferred spacing
    for (let gap = targetGap; gap >= 1; gap--) {
      for (let i = 0; i < n; i++) {
        // Enforce non-adjacency: cannot be closer than gap blocks to any already placed card
        let hasConflict = false;
        for (const prevPos of assigned.values()) {
          if (Math.abs(i - prevPos) < gap) {
            hasConflict = true;
            break;
          }
        }
        if (hasConflict) continue;

        const blockType = blocks[i].type;
        let typeBonus = 0;
        if (blockType === 'verse-heading' && n > 5) {
          typeBonus = -12; // Avoid placing directly after verse heading before reading verse text
        } else if (blockType === 'subheading') {
          typeBonus = 6; // Placing directly under matching subheading is great
        } else if (blockType === 'text') {
          typeBonus = 3;
        }

        const sc = scores[subIdx][i];
        const dist = Math.abs(i - idealPos);
        const val = sc * 2 - (dist / Math.max(1, n)) * 8 + typeBonus;

        if (val > bestVal) {
          bestVal = val;
          bestBlockIdx = i;
        }
      }

      if (bestBlockIdx !== -1) break;
    }

    // Fallback: Pick any unoccupied block index
    if (bestBlockIdx === -1) {
      const used = new Set(assigned.values());
      for (let i = 0; i < n; i++) {
        if (!used.has(i)) {
          bestBlockIdx = i;
          break;
        }
      }
      if (bestBlockIdx === -1) {
        bestBlockIdx = n - 1;
      }
    }

    assigned.set(subIdx, bestBlockIdx);
  }

  // Build the reverse mapping: blockIndex -> SubSection[] to insert AFTER that block
  const insertAfterMap = new Map<number, SubSection[]>();
  for (const [subIdx, blockIdx] of assigned.entries()) {
    const existing = insertAfterMap.get(blockIdx) || [];
    existing.push(subsections[subIdx]);
    insertAfterMap.set(blockIdx, existing);
  }

  // Interleave cards into blocks array
  const result: CommentaryBlock[] = [];
  for (let i = 0; i < n; i++) {
    result.push(blocks[i]);

    const cardsToInsert = insertAfterMap.get(i);
    if (cardsToInsert) {
      for (const card of cardsToInsert) {
        result.push({
          type: 'study-card',
          card,
        });
      }
    }
  }

  return result;
}
