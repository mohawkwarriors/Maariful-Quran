export interface TopicReference {
  surahNumber: number;
  surahName: string;
  verseRange: [number, number];
  sectionId: string;
  excerpt: string;
}

export interface QuranThematicTopic {
  id: string;
  title: string;
  arabicTitle?: string;
  category: 'creed' | 'ethics' | 'law' | 'narrative' | 'spirituality';
  description: string;
  references: TopicReference[];
}

export const QURAN_TOPIC_CATEGORIES = [
  { id: 'all', label: 'All Themes' },
  { id: 'creed', label: 'Creed & Divinity (Tawhid)' },
  { id: 'law', label: 'Financial & Social Law (Mu\'amalat)' },
  { id: 'ethics', label: 'Morals & Character (Akhlaq)' },
  { id: 'narrative', label: 'Prophets & Nations' },
  { id: 'spirituality', label: 'Inner Life & Worship' },
] as const;

export const QURAN_THEMATIC_TOPICS: QuranThematicTopic[] = [
  {
    id: 'tawhid-divine-sovereignty',
    title: 'Divine Unity & Supreme Sovereignty',
    arabicTitle: 'توحيد الله وسلطانه',
    category: 'creed',
    description: 'The absolute oneness of Allah, the rejection of polytheism, and the affirmation of His exclusive Lordship over all creation.',
    references: [
      {
        surahNumber: 2,
        surahName: 'Al-Baqarah',
        verseRange: [21, 29],
        sectionId: '2-21-29',
        excerpt: 'Universal call to humanity to worship the singular Creator who made the earth a couch and heaven a canopy.'
      },
      {
        surahNumber: 2,
        surahName: 'Al-Baqarah',
        verseRange: [254, 260],
        sectionId: '2-254-260',
        excerpt: 'Ayat al-Kursi (The Throne Verse) declaring Allah\'s eternal life, sleepless vigilance, and encompassing knowledge.'
      },
      {
        surahNumber: 1,
        surahName: 'Al-Fatihah',
        verseRange: [1, 7],
        sectionId: '1-1-4',
        excerpt: 'All praise belongs to Allah, Lord of all realms, the Entirely Merciful, Sovereign of the Day of Recompense.'
      }
    ]
  },
  {
    id: 'economic-justice-riba',
    title: 'Economic Justice & Prohibition of Usury (Riba)',
    arabicTitle: 'العدالة المالية وتحريم الربا',
    category: 'law',
    description: 'The decisive prohibition of exploitative interest, the distinction between ethical trade and usury, and the mandate of fair debt relief.',
    references: [
      {
        surahNumber: 2,
        surahName: 'Al-Baqarah',
        verseRange: [275, 281],
        sectionId: '2-275-281',
        excerpt: 'Allah has permitted legitimate commerce and strictly forbidden usury; warnings against economic exploitation.'
      },
      {
        surahNumber: 2,
        surahName: 'Al-Baqarah',
        verseRange: [282, 283],
        sectionId: '2-282-283',
        excerpt: 'The verse of financial contracts (Ayat al-Mudayanah): recording transactions, securing witness testimony, and maintaining honest bookkeeping.'
      },
      {
        surahNumber: 2,
        surahName: 'Al-Baqarah',
        verseRange: [261, 274],
        sectionId: '2-261-274',
        excerpt: 'The spiritual rewards of spending in the way of Allah without reminders of generosity or injury.'
      }
    ]
  },
  {
    id: 'prophetic-narratives-adam',
    title: 'Creation of Humankind & the Viceregency of Adam',
    arabicTitle: 'خلق آدم واستخلاف الإنسان',
    category: 'narrative',
    description: 'The divine proclamation of human stewardship on earth, the test of knowledge, angelic prostration, and the deception of Iblis.',
    references: [
      {
        surahNumber: 2,
        surahName: 'Al-Baqarah',
        verseRange: [30, 39],
        sectionId: '2-30-39',
        excerpt: 'The appointment of Adam as Khalifah (vicegerent), teaching of the names, and divine guidance after descending to earth.'
      }
    ]
  },
  {
    id: 'abrahamic-covenant-qiblah',
    title: 'The Abrahamic Legacy & the Reorientation of the Qiblah',
    arabicTitle: 'ملة إبراهيم وتحويل القبلة',
    category: 'narrative',
    description: 'The foundation of the Ka\'bah by Ibrahim and Isma\'il, their prayers for an ummah submitted to God, and the turning toward the Sacred Sanctuary.',
    references: [
      {
        surahNumber: 2,
        surahName: 'Al-Baqarah',
        verseRange: [124, 141],
        sectionId: '2-124-141',
        excerpt: 'The trials of Ibrahim, the construction of the House of Peace in Makkah, and the pure primordial monotheism (Hanifiyyah).'
      },
      {
        surahNumber: 2,
        surahName: 'Al-Baqarah',
        verseRange: [142, 152],
        sectionId: '2-142-152',
        excerpt: 'The divine command turning the orientation of prayer (Qiblah) toward the Masjid al-Haram, establishing the Middle Nation.'
      }
    ]
  },
  {
    id: 'fasting-ramadan-legislation',
    title: 'Spiritual Discipline: Fasting & Ramadan',
    arabicTitle: 'تشريع الصيام وشهر رمضان',
    category: 'spirituality',
    description: 'The prescription of fasting to attain God-consciousness (Taqwa), the revelation of the Quran in Ramadan, and divine nearness during supplication.',
    references: [
      {
        surahNumber: 2,
        surahName: 'Al-Baqarah',
        verseRange: [183, 188],
        sectionId: '2-183-187',
        excerpt: 'Fasting prescribed as it was for earlier communities; the night of prayer and Allah\'s declaration of nearness to those who call.'
      }
    ]
  },
  {
    id: 'patience-adversity-trials',
    title: 'Patience, Trials & Martyrdom in the Divine Path',
    arabicTitle: 'الصبر والابتلاء والشهادة',
    category: 'ethics',
    description: 'Facing the unavoidable tests of life—fear, hunger, loss of wealth, health, and lives—with steadfast forbearance and reliance on Allah.',
    references: [
      {
        surahNumber: 2,
        surahName: 'Al-Baqarah',
        verseRange: [153, 162],
        sectionId: '2-153-162',
        excerpt: 'Seek help through patience and prayer; Allah is with the patient; the blessed station of those martyred in Allah\'s way.'
      },
      {
        surahNumber: 2,
        surahName: 'Al-Baqarah',
        verseRange: [214, 218],
        sectionId: '2-214-218',
        excerpt: 'Do you expect to enter Paradise without experiencing the hardship of those before you who were shaken until they cried out for aid?'
      }
    ]
  },
  {
    id: 'nature-of-hypocrisy-nifaq',
    title: 'The Anatomy of Hypocrisy (Nifaq)',
    arabicTitle: 'حقيقة النفاق والمنافقين',
    category: 'creed',
    description: 'Insight into spiritual duplicity: declaring faith with the tongue while concealing malice, spreading corruption while claiming peacemaking.',
    references: [
      {
        surahNumber: 2,
        surahName: 'Al-Baqarah',
        verseRange: [8, 20],
        sectionId: '2-8-20',
        excerpt: 'The psychological profile of the Munafiqun: the parable of the kindled fire and the storm cloud laden with darkness and thunder.'
      }
    ]
  },
  {
    id: 'charity-social-solidarity',
    title: 'Purifying Charity (Sadaqah) & Social Solidarity',
    arabicTitle: 'الإنفاق في سبيل الله والتكافل',
    category: 'ethics',
    description: 'The ethics of selfless giving: grain that grows seven ears, purifying intention, avoiding ostentation, and uplifting the vulnerable.',
    references: [
      {
        surahNumber: 2,
        surahName: 'Al-Baqarah',
        verseRange: [261, 274],
        sectionId: '2-261-274',
        excerpt: 'The parable of the grain of corn yielding seven hundredfold; giving openly and secretly to safeguard human dignity.'
      }
    ]
  },
  {
    id: 'supplication-divine-mercy',
    title: 'Repentance, Supplication & Divine Mercy',
    arabicTitle: 'الدعاء والتوبة والرحمة الإلهية',
    category: 'spirituality',
    description: 'Turning back to Allah with humility, the concluding supplications of Surah Al-Baqarah, and the divine promise not to burden a soul beyond capacity.',
    references: [
      {
        surahNumber: 2,
        surahName: 'Al-Baqarah',
        verseRange: [284, 286],
        sectionId: '2-284-286',
        excerpt: 'The ultimate petition of the believers: "Our Lord, lay not upon us a burden like that which You laid upon those before us."'
      },
      {
        surahNumber: 1,
        surahName: 'Al-Fatihah',
        verseRange: [5, 7],
        sectionId: '1-1-4',
        excerpt: 'The universal prayer: "Guide us to the Straight Path, the path of those upon whom You have bestowed favor."'
      }
    ]
  }
];
