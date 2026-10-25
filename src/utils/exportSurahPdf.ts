import { SurahData } from '../types/quran';

export function exportSurahForAnnotation(surah: SurahData): void {
  const newWindow = window.open('', '_blank');
  if (!newWindow) {
    alert('Please allow pop-ups in your browser to generate the printable annotation PDF.');
    return;
  }

  const paddedNum = String(surah.number).padStart(3, '0');
  const docTitle = `Surah_${paddedNum}_${surah.nameTransliterated}_Annotation`;
  const juzText = surah.juz && surah.juz.length > 0 ? surah.juz.join(', ') : '1';

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${docTitle}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    @font-face {
      font-family: 'KFGQPC Uthmanic Script HAFS';
      src: url('https://cdn.jsdelivr.net/gh/mustafa0x/quran-fonts@master/fonts/KFGQPC%20Uthmanic%20Script%20HAFS.woff2') format('woff2'),
           url('https://cdn.jsdelivr.net/gh/mustafa0x/quran-fonts@master/fonts/KFGQPC%20Uthmanic%20Script%20HAFS.woff') format('woff');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }

    @page {
      size: A4 portrait;
      margin: 14mm 14mm 16mm 14mm;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      margin: 0;
      padding: 0;
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      color: #1C1917;
      background: #FFFFFF;
      line-height: 1.6;
    }

    /* Screen-Only Floating Toolbar */
    .screen-toolbar {
      position: sticky;
      top: 0;
      z-index: 999;
      background: #1C1917;
      color: #FFFFFF;
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.18);
    }
    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .toolbar-btn {
      background: #CD7743;
      color: #FFFFFF;
      border: none;
      padding: 8px 18px;
      border-radius: 6px;
      font-size: 13.5px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: background 0.2s;
    }
    .toolbar-btn:hover {
      background: #B86432;
    }
    .toolbar-btn-secondary {
      background: #374151;
    }
    .toolbar-btn-secondary:hover {
      background: #4B5563;
    }
    .toolbar-tip {
      font-size: 12.5px;
      color: #D1D5DB;
    }

    @media print {
      .screen-toolbar {
        display: none !important;
      }
      body {
        background: #FFFFFF !important;
      }
    }

    .doc-container {
      max-width: 820px;
      margin: 0 auto;
      padding: 24px;
    }

    @media print {
      .doc-container {
        max-width: 100% !important;
        padding: 0 !important;
      }
    }

    /* Surah Cover / Header */
    .surah-header {
      text-align: center;
      padding-bottom: 18px;
      margin-bottom: 22px;
      border-bottom: 2px solid #E5E7EB;
    }
    .surah-meta-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #596B8E;
      margin-bottom: 10px;
    }
    .surah-arabic-title {
      font-family: 'KFGQPC Uthmanic Script HAFS', 'Amiri', serif;
      font-size: 40px;
      color: #111827;
      margin: 0 0 6px 0;
      direction: rtl;
      line-height: 1.4;
    }
    .surah-english-title {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 26px;
      color: #CD7743;
      font-weight: 600;
      margin: 0;
    }
    .surah-meaning {
      font-size: 14px;
      color: #6B7280;
      font-style: italic;
      margin: 4px 0 14px 0;
    }

    /* Student / Date annotation bar */
    .annotation-header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px dashed #CBD5E1;
      border-radius: 6px;
      padding: 8px 16px;
      font-size: 12px;
      color: #475569;
      background: #F8FAFC;
      margin-top: 14px;
    }

    .bismillah-cartouche {
      text-align: center;
      margin: 20px 0 24px 0;
      font-family: 'KFGQPC Uthmanic Script HAFS', 'Amiri', serif;
      font-size: 26px;
      color: #CD7743;
      direction: rtl;
      padding: 12px;
      border: 1px solid rgba(205, 119, 67, 0.3);
      border-radius: 12px;
      background: rgba(205, 119, 67, 0.04);
      line-height: 1.6;
    }

    /* Section Card */
    .section-card {
      break-inside: avoid;
      page-break-inside: avoid;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 16px 18px;
      margin-bottom: 22px;
      background: #FFFFFF;
    }
    .section-header {
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #F1F5F9;
    }
    .section-badge {
      font-size: 11px;
      font-weight: 700;
      color: #CD7743;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .section-title {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 20px;
      font-weight: 700;
      color: #0F172A;
      margin: 2px 0 0 0;
      line-height: 1.3;
    }
    .section-summary {
      font-size: 12px;
      color: #64748B;
      margin-top: 4px;
      line-height: 1.45;
    }

    /* Arabic verses */
    .arabic-text {
      direction: rtl;
      text-align: right;
      font-family: 'KFGQPC Uthmanic Script HAFS', 'Amiri', serif;
      font-size: 22px;
      line-height: 2.2;
      color: #0F172A;
      padding: 12px 16px;
      background: #FAFAF9;
      border-radius: 6px;
      border-right: 3px solid #CD7743;
      margin-bottom: 12px;
      word-spacing: 2px;
    }

    /* English translation */
    .translation-text {
      font-size: 13.5px;
      line-height: 1.6;
      color: #334155;
      margin-bottom: 14px;
    }

    /* Annotation Ruled Area */
    .annotation-box {
      margin-top: 14px;
      padding-top: 10px;
      border-top: 1px dashed #CBD5E1;
    }
    .annotation-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #94A3B8;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .annotation-label::after {
      content: '';
      flex: 1;
      height: 1px;
      background: #E2E8F0;
    }
    .annotation-lines {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 4px 0 8px 0;
    }
    .annotation-line {
      height: 1px;
      background: #E2E8F0;
      width: 100%;
    }
  </style>
</head>
<body>
  <!-- Screen Floating Toolbar -->
  <div class="screen-toolbar">
    <div class="toolbar-left">
      <button class="toolbar-btn" onclick="window.print()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        Save as PDF / Print
      </button>
      <button class="toolbar-btn toolbar-btn-secondary" onclick="window.close()">Close</button>
    </div>
    <div class="toolbar-tip">
      💡 Tip: In the destination dropdown of your print dialog, select <strong>"Save as PDF"</strong> to download this file.
    </div>
  </div>

  <div class="doc-container">
    <!-- Surah Header -->
    <header class="surah-header">
      <div class="surah-meta-row">
        <span>Surah ${surah.number}</span>
        <span>·</span>
        <span>${surah.revelationType}</span>
        <span>·</span>
        <span>${surah.versesCount} Verses</span>
        <span>·</span>
        <span>Juz ${juzText}</span>
      </div>
      <h1 class="surah-arabic-title">سورة ${surah.nameArabic}</h1>
      <h2 class="surah-english-title">Surah ${surah.nameTransliterated}</h2>
      <p class="surah-meaning">"${surah.nameEnglish}"</p>

      <!-- Student / Researcher annotation header -->
      <div class="annotation-header-bar">
        <span><strong>Student / Reader:</strong> ________________________________</span>
        <span><strong>Date:</strong> ________________</span>
        <span><strong>Focus:</strong> ____________________</span>
      </div>
    </header>

    ${surah.bismillahPre ? `
      <div class="bismillah-cartouche">
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </div>
    ` : ''}

    <!-- Sections for Annotation -->
    <main>
      ${surah.sections.map((section) => `
        <article class="section-card">
          <div class="section-header">
            <span class="section-badge">VERSES ${section.verseRange[0]}–${section.verseRange[1]}</span>
            <h3 class="section-title">${section.title}</h3>
            ${section.summary ? `<p class="section-summary">${section.summary}</p>` : ''}
          </div>

          <div class="arabic-text">${section.arabicText}</div>
          <div class="translation-text">${section.translation}</div>

          <!-- Annotation ruled area -->
          <div class="annotation-box">
            <div class="annotation-label">Personal Reflections & Annotations</div>
            <div class="annotation-lines">
              <div class="annotation-line"></div>
              <div class="annotation-line"></div>
              <div class="annotation-line"></div>
              <div class="annotation-line"></div>
            </div>
          </div>
        </article>
      `).join('')}
    </main>
  </div>

  <script>
    window.addEventListener('load', () => {
      setTimeout(() => {
        window.print();
      }, 500);
    });
  </script>
</body>
</html>`;

  newWindow.document.open();
  newWindow.document.write(htmlContent);
  newWindow.document.close();
}
