export interface ScholarCitationInfo {
  author: string | null;
  work: string | null;
  fullCitation: string;
  badgeLabel: string;
}

/**
 * Extracts and normalizes classical scholarly authorities and their works from exegesis text.
 * Cites the speaker (e.g., "Imam al-Qurtubi") and original reference/work cleanly.
 */
export function parseScholarCitation(
  text: string,
  existingSource?: string
): ScholarCitationInfo {
  const clean = text.replace(/\s+/g, ' ').trim();

  // 1. Match author name from beginning of citation or narrative
  let author: string | null = null;
  const authorMatch = clean.match(
    /^(?:According\s+to\s+(?:the\s+(?:great|famous|well-known)\s+commentator(?:\s+and\s+Companion)?\s+)?|The\s+famous\s+commentator\s+)?(Imam\s+[A-Za-z`'’\-]+(?:\s+[A-Za-z`'’\-]+)*|Sayyidna\s+[A-Za-z`'’\-]+(?:\s+[A-Za-z`'’\-]+)*|Al-Qurtubi|al-Suyuti|Qurtubi|Ibn\s+Kathir|Ibn\s+Abbas|Hasan\s+al-Basri|Muqatil)\b/i
  );

  if (authorMatch) {
    author = authorMatch[1].replace(/[\(（][^()]+[\)）]/g, '').trim();
    if (/qurtubi/i.test(author)) author = 'Imam al-Qurtubi';
    else if (/abu\s+hanifah/i.test(author)) author = 'Imam Abu Hanifah';
    else if (/shafi/i.test(author)) author = "Imam al-Shafi'i";
    else if (/malik/i.test(author)) author = 'Imam Malik';
    else if (/baghawi/i.test(author)) author = 'Imam al-Baghawi';
    else if (/ibn\s+kathir/i.test(author)) author = 'Ibn Kathir';
    else if (/ibn\s+abbas/i.test(author)) author = "Sayyidna 'Abdullah ibn 'Abbas";
    else if (/suyuti/i.test(author)) author = 'Imam al-Suyuti';
    else if (/razi/i.test(author)) author = 'Imam al-Razi';
    else if (/ghazali/i.test(author)) author = 'Imam al-Ghazali';
  } else if (
    /^According\s+to\s+the\s+great\s+commentator\s+and\s+Companion\s+['’`]?Abdullah\s+ibn\s+['’`]?Abbas/i.test(
      clean
    )
  ) {
    author = "Sayyidna 'Abdullah ibn 'Abbas";
  }

  // 2. Identify work or book
  let work: string | null = null;
  const trailingParen = clean.match(/[\(（]([^\(\)]+)[\)）]\s*$/);
  if (trailingParen) {
    const candidate = trailingParen[1].trim();
    // Exclude Quran verse references (e.g. 2:220) or long sentences
    if (
      !/^\d+:\d+/.test(candidate) &&
      candidate.length < 50 &&
      !/^\s*(?:Ask\s+|Only\s+|Worship\s+)/i.test(candidate)
    ) {
      work = candidate;
    }
  }

  // Check specific collection mentions in lead-in text like "taken from the 'Musnad' of Darimi"
  if (!work) {
    const musnadMatch = clean.match(
      /taken from the\s+["“]?Musnad["”]?\s+of\s+([A-Za-z`'’\-]+)/i
    );
    if (musnadMatch) {
      work = `Musnad ${musnadMatch[1]}`;
    }
  }

  // Normalize recognized works
  if (work) {
    if (/^qurtubi$/i.test(work)) work = 'Tafsir al-Qurtubi';
    else if (/^mazhari$/i.test(work)) work = 'Tafsir al-Mazhari';
    else if (/ruh\s*[-–]?\s*ul?\s*[-–]?\s*ma/i.test(work)) work = "Ruh al-Ma'ani";
    else if (/musnad.*darimi/i.test(work)) work = 'Musnad al-Darimi';
  }

  // Format clean footer source citation
  let fullCitation = '';
  if (author && work) {
    if (work === `Tafsir ${author}` || work === `Tafsir al-${author.replace('Imam ', '')}`) {
      fullCitation = `${author} (${work})`;
    } else {
      fullCitation = `${author} · ${work}`;
    }
  } else if (author) {
    fullCitation = author;
  } else if (work) {
    fullCitation = work;
  } else {
    fullCitation = existingSource || "Ma'ariful Qur'an Classical Exegesis";
  }

  return {
    author,
    work,
    fullCitation,
    badgeLabel: 'CLASSICAL AUTHORITY',
  };
}
