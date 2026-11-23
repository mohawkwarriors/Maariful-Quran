import { CuratedTerm } from '../types/quran';

export const VOCABULARY_KNOWLEDGE: Record<string, Partial<CuratedTerm>> = {
  salah: {
    term: 'Salah (الصلاة)',
    arabicRoot: 'ص-ل-و (Ṣ-L-W)',
    literalMeaning: 'Supplication, devotion, and sacred connection.',
    relatedWords: ['Musalli (prayer performer)', 'Salawat (prayers / blessings)', 'Silah (link / connection)'],
    theologicalContext:
      'The designated ritual worship prescribed five times daily, embodying the highest physical and spiritual expression of human servitude connecting the servant directly to Allah.',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 116",
  },
  muttaqin: {
    term: 'Al-Muttaqin (المتقين)',
    arabicRoot: 'و-ق-ي (W-Q-Y)',
    literalMeaning: 'Those who take a defensive shield against harm.',
    relatedWords: ['Taqwa (God-consciousness / piety)', 'Wiqayah (shield / protection)', 'Ittaqa (guarded against evil)'],
    theologicalContext:
      "Those who erect a protective shield against divine displeasure by obeying Allah's commandments and restraining their souls from prohibited desires.",
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 104",
  },
  taqwa: {
    term: 'Taqwa (التقوى)',
    arabicRoot: 'و-ق-ي (W-Q-Y)',
    literalMeaning: 'Vigilant forbearance, self-restraint, and shielding.',
    relatedWords: ['Muttaqi (God-fearing person)', 'Tuqat (precaution)', 'Awqa (most protective)'],
    theologicalContext:
      'The inner spiritual moral conscience that keeps a believer perpetually mindful of Allah, acting as an inward barrier against sins in public and seclusion alike.',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 106",
  },
  ghayb: {
    term: 'Al-Ghayb (الغيب)',
    arabicRoot: 'غ-ي-ب (Gh-Y-B)',
    literalMeaning: 'That which is hidden, unseen, and beyond physical senses.',
    relatedWords: ['Gha\'ib (absent)', 'Ghaybah (occultation / absence)', 'Ightiyab (speaking of the absent)'],
    theologicalContext:
      'The celestial and metaphysical realities verified solely by infallible prophetic revelation, including the Divine Essence and Attributes, angels, the grave, and the Day of Judgment.',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 110",
  },
  riba: {
    term: 'Riba (الربا)',
    arabicRoot: 'ر-ب-و (R-B-W)',
    literalMeaning: 'Unearned surplus, unjustified excess, or swelling.',
    relatedWords: ['Rabwah (elevated hill)', 'Yurbi (causes to increase)', 'Tarbiyah (growth / nurturing)'],
    theologicalContext:
      'Any stipulated excess charged on a debt without an equivalent countervalue (Iwad) in exchange. Categorically prohibited in Islam because it institutionalizes wealth exploitation.',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 642",
  },
  zakah: {
    term: 'Zakah (الزكاة)',
    arabicRoot: 'ز-ك-و (Z-K-W)',
    literalMeaning: 'Purification, spiritual growth, and blessing.',
    relatedWords: ['Tazkiyah (spiritual purification)', 'Zaki (pure / righteous)', 'Yazakka (purifies himself)'],
    theologicalContext:
      "The obligatory annual fiscal duty levied on qualifying surplus wealth to purify one's assets and support the underprivileged.",
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 122",
  },
  ibadah: {
    term: 'Ibadah (العبادة)',
    arabicRoot: 'ع-ب-د (ʿ-B-D)',
    literalMeaning: 'Utmost humility coupled with supreme love and reverence.',
    relatedWords: ['Abd (servant / slave of God)', 'Ubudiyyah (servitude)', 'Ma\'bud (object of worship)'],
    theologicalContext:
      'The totality of inward convictions and outward actions rendered sincerely and exclusively for the pleasure of Allah, in accordance with prophetic guidance.',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 68",
  },
  rahman: {
    term: 'Ar-Rahman (الرحمن)',
    arabicRoot: 'ر-ح-م (R-Ḥ-M)',
    literalMeaning: 'Vast, overwhelming, all-encompassing mercy.',
    relatedWords: ['Rahim (perpetually merciful)', 'Rahmah (mercy / compassion)', 'Rahim (womb / kinship bond)'],
    theologicalContext:
      'The active, cosmic benevolence of Allah that encompasses all created beings—believer and disbeliever alike—in this worldly existence through sustenance and life.',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 43",
  },
  rahim: {
    term: 'Ar-Rahim (الرحيم)',
    arabicRoot: 'ر-ح-م (R-Ḥ-M)',
    literalMeaning: 'Continuous, perpetual, and specialized grace.',
    relatedWords: ['Ar-Rahman (All-Beneficent)', 'Marhamah (mutual compassion)', 'Tarham (seeking mercy)'],
    theologicalContext:
      'The abiding, eternal attribute of divine grace reserved specifically for righteous believers in the Hereafter.',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 46",
  },
  rabb: {
    term: 'Ar-Rabb (الرب)',
    arabicRoot: 'ر-ب-ب (R-B-B)',
    literalMeaning: 'The Evolver, Sustainer, and Caregiver who nurtures to perfection.',
    relatedWords: ['Rabib (foster ward)', 'Rububiyyah (divine lordship)', 'Ribbiyyun (godly devotees)'],
    theologicalContext:
      'The divine name indicating providential care, continuous creation, and progressive nourishment of every atom across all domains of existence.',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 55",
  },
  kufr: {
    term: 'Kufr (الكفر)',
    arabicRoot: 'ك-ف-ر (K-F-R)',
    literalMeaning: 'To cover, conceal, or bury (linguistically: a farmer burying seed in earth; theologically: burying the light of truth).',
    relatedWords: ['Kafir (one who conceals truth / disbeliever)', 'Kaffarah (prescribed expiation that conceals / wipes out sins)', 'Kuffar (disbelievers / farmers who bury seed)'],
    theologicalContext:
      'In Ma\'ariful Qur\'an, Mufti Muhammad Shafi explains that Kufr denotes deliberate, stubborn persistence in burying the truth after divine guidance and moral conscience have been made abundantly clear. The root conveys concealing something evident, showing that rejection of truth is an active suppression of one\'s innate God-consciousness (فطرة / Fitrah).',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 128",
  },
  kaffar: {
    term: 'Kaffar (كَفَّار / كفر)',
    arabicRoot: 'ك-ف-ر (K-F-R)',
    literalMeaning: 'To cover, conceal, or bury (linguistically: a farmer who buries seed in dark soil; theologically: obstinately concealing the truth).',
    relatedWords: ['Kafir (disbeliever / one who conceals truth)', 'Kufr (active rejection of truth)', 'Kaffarah (prescribed expiation that wipes out sins)', 'Kuffar (farmers who bury seed / deniers)'],
    theologicalContext:
      'In Ma\'ariful Qur\'an, Mufti Muhammad Shafi explains that Kufr here refers to deliberate, stubborn persistence in burying the truth after divine guidance and moral conscience have been made abundantly clear. The linguistic root conveys concealing something evident, showing that rejection of truth is an active suppression of one\'s innate God-consciousness (فطرة / Fitrah).',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 128-132",
  },
  kafaru: {
    term: 'Kafaru (كَفَرُوا)',
    arabicRoot: 'ك-ف-ر (K-F-R)',
    literalMeaning: 'They willfully covered, concealed, and denied the truth.',
    relatedWords: ['Kufr (denial / covering)', 'Kafir (one who denies)', 'Kaffarah (expiation)'],
    theologicalContext:
      'Referring specifically to obstinate ringleaders of disbelief whose inner defiance reached a point of no return. Mufti Shafi notes that their disbelief was not due to lack of evidence, but deliberate malice and pride.',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 128",
  },
  ghishawah: {
    term: 'Ghishawah (غِشَاوَة)',
    arabicRoot: 'غ-ش-و (Gh-Sh-W)',
    literalMeaning: 'An opaque cataract, dense veil, or membrane covering perception.',
    relatedWords: ['Ghashiya (it engulfed / covered)', 'Yaghsha (he covers)', 'Al-Ghashiyah (The Overwhelming Event)'],
    theologicalContext:
      'Mufti Shafi points out a subtle grammatical nuance: while the seal is placed on hearts and ears, the vision is covered by a "Ghishawah" (veil), indicating that their sensory perception remains physically intact yet spiritually blinded to moral signs through willful obstinacy.',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 135",
  },
  khatm: {
    term: 'Khatm (خَتْم)',
    arabicRoot: 'خ-ت-م (Kh-T-M)',
    literalMeaning: 'To imprint a wax seal, stamp firmly closed, or finalize.',
    relatedWords: ['Khatam (seal / signet ring)', 'Khatam an-Nabiyyin (Seal of the Prophets)', 'Khitam (closing seal)'],
    theologicalContext:
      'Mufti Shafi explains that this sealing is the natural divine law of moral consequences: persistent rejection of truth darkens the spiritual receptor until it loses the capacity to receive guidance, like soot encrusting a mirror until it can no longer reflect light.',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 133",
  },
  marad: {
    term: 'Marad (مَرَض)',
    arabicRoot: 'م-ر-ض (M-R-D)',
    literalMeaning: 'Chronic sickness, imbalance, corruption, or moral decay.',
    relatedWords: ['Marid (sick person)', 'Mumarrid (healer / caregiver)', 'Tamarrud (disorder)'],
    theologicalContext:
      'Refers to spiritual ailments festering in the psyche of hypocrites—chiefly jealousy, skepticism, and moral cowardice. As they persist in malicious plotting against truth, Allah permits their inner malice to swell as a consequence of their own deceit.',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 144",
  },
  andad: {
    term: 'Andad (أَنْدَاد)',
    arabicRoot: 'ن-د-د (N-D-D)',
    literalMeaning: 'Peers, equals, or rival counterparts set up in competition.',
    relatedWords: ['Nidd (rival / peer)', 'Nadid (counterpart)', 'Niddiyyah (rivalry)'],
    theologicalContext:
      'False deities, idols, or worldly objects of supreme devotion elevated alongside Allah. Mufti Shafi notes that anyone who attributes independent causal authority to creation sets up a form of Nidd.',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 176",
  },
  fasad: {
    term: 'Fasad (فَسَاد)',
    arabicRoot: 'ف-س-د (F-S-D)',
    literalMeaning: 'Rot, ruin, moral disorder, or disruption of balance.',
    relatedWords: ['Mufsid (corrupter / instigator of discord)', 'Afsada (he caused mischief)', 'Fasid (corrupted / invalid)'],
    theologicalContext:
      'Any action that destabilizes the spiritual, moral, or social order established by divine guidance. Hypocrites label their subversive compromises "peacemaking" (إصلاح / Islah), which the Qur\'an exposes as pure Fasad.',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 148",
  },
  islah: {
    term: 'Islah (إِصْلَاح)',
    arabicRoot: 'ص-ل-ح (Ṣ-L-Ḥ)',
    literalMeaning: 'Rectification, peacemaking, restorative healing, and setting right.',
    relatedWords: ['Salih (righteous / virtuous person)', 'Sulh (reconciliation / treaty)', 'Muslih (reformer / peacemaker)'],
    theologicalContext:
      'Restoring balance and righteousness in accordance with divine law. Authentic reform begins with inward self-rectification before extending to societal reform.',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 150",
  },
  nifaq: {
    term: 'Nifaq (النفاق)',
    arabicRoot: 'ن-ف-ق (N-F-Q)',
    literalMeaning: 'Duplicity, double-dealing; entering through one opening and exiting another.',
    relatedWords: ['Munafiq (hypocrite)', 'Nafaq (tunnel / subterranean burrow)', 'Infaq (spending wealth)'],
    theologicalContext:
      'Professing belief outwardly while concealing denial or cynicism internally. Condemned as spiritually more insidious and socially destructive than open disbelief.',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 142",
  },
  siyam: {
    term: 'As-Siyam (الصيام)',
    arabicRoot: 'ص-و-م (Ṣ-W-M)',
    literalMeaning: 'Total abstention, holding back, and silence.',
    relatedWords: ['Sa\'im (fasting person)', 'Sawm (fast)', 'Mustaswim (one seeking to fast)'],
    theologicalContext:
      'Prescribed ritual abstention from food, drink, and intimate relations from dawn until sunset with explicit intention to cultivate Taqwa.',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 448",
  },
  ahad: {
    term: 'Al-Ahad (الأحد)',
    arabicRoot: 'و-ح-د (W-Ḥ-D)',
    literalMeaning: 'The Single, Unique, and Absolutely Indivisible.',
    relatedWords: ['Wahid (One)', 'Tawhid (monotheism)', 'Ihdah (unification)'],
    theologicalContext:
      'Absolute divine unity that transcends any composition, plurality, partition, or peer in essence, attributes, and actions.',
    volumeReference: "Ma'ariful Qur'an, Vol. 8, p. 892",
  },
  samad: {
    term: 'As-Samad (الصمد)',
    arabicRoot: 'ص-م-د (Ṣ-M-D)',
    literalMeaning: 'The solid, unshakable refuge upon whom all depend.',
    relatedWords: ['Samada (turned towards for sanctuary)', 'Masmud (sought out)', 'Samad (eternal fortress)'],
    theologicalContext:
      'The Self-Sufficient Sovereign who neither requires nourishment nor has any need of companions, while every created soul is destitute before Him.',
    volumeReference: "Ma'ariful Qur'an, Vol. 8, p. 895",
  },
  waswasah: {
    term: 'Al-Waswasah (الوسوسة)',
    arabicRoot: 'و-س-و-س (W-S-W-S)',
    literalMeaning: 'Faint, repetitive, rustling whispers.',
    relatedWords: ['Waswas (the covert whisperer)', 'Muwiswis (one troubled by doubts)', 'Waswas (whisper)'],
    theologicalContext:
      'Insidious suggestions cast into human hearts by demonic agents and toxic companions to sow doubt, vanity, procrastination, and spiritual discouragement.',
    volumeReference: "Ma'ariful Qur'an, Vol. 8, p. 918",
  },
  'sirat al-mustaqim': {
    term: 'As-Sirat al-Mustaqim (الصراط المستقيم)',
    arabicRoot: 'ص-ر-ط / ق-و-م',
    literalMeaning: 'The even, level, and unswerving highway.',
    relatedWords: ['Istiqamah (steadfast uprightness)', 'Qayyim (upright)', 'Sarat (straight road)'],
    theologicalContext:
      'The balanced tradition of Islam revealed in the Qur\'an and lived by the Prophet, avoiding theological excess (Ghuluw) and spiritual apathy (Tafrit).',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 76",
  },
  falaq: {
    term: 'Al-Falaq (الفلق)',
    arabicRoot: 'ف-ل-ق (F-L-Q)',
    literalMeaning: 'The cleaving of dawn; the bursting forth of light through darkness.',
    relatedWords: ['Faliq (cleaver of seeds)', 'Infilaq (daybreak)', 'Falq (fissure)'],
    theologicalContext:
      "Allah's cosmic power to dispel any suffocation, evil, or oppression by bursting forth the radiant morning of relief.",
    volumeReference: "Ma'ariful Qur'an, Vol. 8, p. 910",
  },
  ghasiq: {
    term: 'Al-Ghasiq (الغاسق)',
    arabicRoot: 'غ-س-ق (Gh-S-Q)',
    literalMeaning: 'Intense nocturnal gloom and darkness when it completely settles.',
    relatedWords: ['Ghasaq (twilight / nightfall)', 'Ighsaq (deepening shadow)'],
    theologicalContext:
      'The cloak of darkness during which malevolent forces, crime, and predators emerge under cover of obscurity.',
    volumeReference: "Ma'ariful Qur'an, Vol. 8, p. 912",
  },
  naffathat: {
    term: 'An-Naffathat (النفاثات)',
    arabicRoot: 'ن-ف-ث (N-F-Th)',
    literalMeaning: 'Those who blow with fine saliva upon knots.',
    relatedWords: ['Nafath (gentle breath with moisture)', 'Nafthah (spiritual breath)'],
    theologicalContext:
      'Occult practitioners and sorcerers who knot cords while chanting incantations to channel demonic harm.',
    volumeReference: "Ma'ariful Qur'an, Vol. 8, p. 913",
  },
  hasad: {
    term: 'Al-Hasad (الحسد)',
    arabicRoot: 'ح-س-د (Ḥ-S-D)',
    literalMeaning: 'Destructive envy; burning desire for another to lose their blessings.',
    relatedWords: ['Hasid (envier)', 'Mahsud (the envied)', 'Tahad (mutual spite)'],
    theologicalContext:
      'A toxic spiritual malady protesting divine wisdom by resenting blessings bestowed upon fellow humans.',
    volumeReference: "Ma'ariful Qur'an, Vol. 8, p. 914",
  },
  khalifah: {
    term: 'Khalifah (خليفة)',
    arabicRoot: 'خ-ل-ف (Kh-L-F)',
    literalMeaning: 'A vicegerent, deputy, or successor executing delegated authority.',
    relatedWords: ['Khilafah (stewardship)', 'Khulafa (successors)', 'Istikhlaf (entrustment)'],
    theologicalContext:
      'Humanity\'s role as moral trustees on earth, charged with establishing justice and divine covenants.',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 182",
  },
  kursi: {
    term: 'Al-Kursi (الكرسي)',
    arabicRoot: 'ك-ر-س (K-R-S)',
    literalMeaning: 'Throne, footstool of power, and seat of supreme sovereignty.',
    relatedWords: ['Karasa (established solidly)', 'Mukarras (firmly founded)'],
    theologicalContext:
      "The vast seat of divine dominion encompassing the heavens and earth, symbolizing Allah's effortless governance.",
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 608",
  },
  taghut: {
    term: 'At-Taghut (الطاغوت)',
    arabicRoot: 'ط-غ-ي (Ṭ-Gh-Y)',
    literalMeaning: 'Transgression; that which exceeds boundaries of righteousness.',
    relatedWords: ['Tughyan (tyranny)', 'Taghiyah (despot)', 'Tagha (exceeded all bounds)'],
    theologicalContext:
      'Any idol, tyrannical system, or demonic entity worshipped or obeyed in rebellion against the Creator.',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 614",
  },
  asr: {
    term: 'Al-\'Asr (العصر)',
    arabicRoot: "ع-ص-ر ('A-Ṣ-R)",
    literalMeaning: 'Time through the ages; the declining hours of late afternoon.',
    relatedWords: ['\'Asir (squeezed juice)', '\'Asr (epoch)', 'Mu\'sirat (rain clouds)'],
    theologicalContext:
      'The irreplaceable capital of human lifespan that drains away second by second toward the eternal reckoning.',
    volumeReference: "Ma'ariful Qur'an, Vol. 8, p. 865",
  },
  kawthar: {
    term: 'Al-Kawthar (الكوثر)',
    arabicRoot: 'ك-ث-ر (K-Th-R)',
    literalMeaning: 'Inexhaustible abundance of goodness, blessing, and perpetual grace.',
    relatedWords: ['Kathir (abundant)', 'Kathrah (plenty)', 'Takathur (amassing wealth)'],
    theologicalContext:
      'The celestial fountain in Paradise and the limitless spiritual and temporal bounties granted to Prophet Muhammad.',
    volumeReference: "Ma'ariful Qur'an, Vol. 8, p. 880",
  },
  nasr: {
    term: 'An-Nasr (النصر)',
    arabicRoot: 'ن-ص-ر (N-Ṣ-R)',
    literalMeaning: 'Decisive divine assistance, victory, and succor.',
    relatedWords: ['Nasir (protector)', 'Mansur (victorious)', 'Nusrah (support)'],
    theologicalContext:
      'Divine intervention granting ultimate victory to steadfast truth over overwhelming worldly odds.',
    volumeReference: "Ma'ariful Qur'an, Vol. 8, p. 888",
  },
  mulk: {
    term: 'Al-Mulk (الملك)',
    arabicRoot: 'م-ل-ك (M-L-K)',
    literalMeaning: 'Sovereign ownership, royal dominion, and absolute authority.',
    relatedWords: ['Malik (Supreme King)', 'Malik (Master)', 'Malakut (celestial kingdom)'],
    theologicalContext:
      "Allah's undivided and eternal dominion over every realm, creature, and motion in existence.",
    volumeReference: "Ma'ariful Qur'an, Vol. 8, p. 490",
  },
  istianah: {
    term: "Al-Isti'anah (الاستعانة)",
    arabicRoot: 'ع-و-ن (\'A-W-N)',
    literalMeaning: 'Seeking aid, succor, and active reliance upon divine strength.',
    relatedWords: ["'Awn (help / assistance)", "Musta'an (the One sought for help)", "Ta'awun (mutual cooperation)"],
    theologicalContext:
      'Recognizing that human effort is powerless without Allah\'s enabling grace (Tawfiq), uniting sincere exertion with exclusive reliance upon Him in worship and worldly affairs.',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 73",
  },
  salihat: {
    term: 'As-Salihat (الصالحات)',
    arabicRoot: 'ص-ل-ح (Ṣ-L-Ḥ)',
    literalMeaning: 'Righteous, sound, and wholesome deeds free of corruption.',
    relatedWords: ['Salih (righteous)', 'Islah (reformation / peacemaking)', 'Maslahah (public good)'],
    theologicalContext:
      'Virtuous actions performed with sincere faith (Iman) and in accordance with Prophetic guidance (Sunnah) that bring spiritual harmony in both worlds.',
    volumeReference: "Ma'ariful Qur'an, Vol. 8, p. 868",
  },
  haqq: {
    term: 'Al-Haqq (الحق)',
    arabicRoot: 'ح-ق-ق (Ḥ-Q-Q)',
    literalMeaning: 'Established truth, unshakable reality, and binding moral duty.',
    relatedWords: ['Haqiqah (ultimate reality)', 'Huquq (rights and obligations)', 'Ahaqq (most worthy)'],
    theologicalContext:
      'One of the Supreme Names of Allah and the immutable standard of divine revelation, creed, and justice to which believers mutually counsel one another.',
    volumeReference: "Ma'ariful Qur'an, Vol. 8, p. 869",
  },
  sabr: {
    term: 'As-Sabr (الصبر)',
    arabicRoot: 'ص-ب-ر (Ṣ-B-R)',
    literalMeaning: 'Restraining the soul from panic, despair, or complaint; steadfast endurance.',
    relatedWords: ['Sabir (patient one)', 'Musabarah (persevering against adversity)', 'Sabbar (deeply steadfast)'],
    theologicalContext:
      'Threefold spiritual fortitude: constancy in obeying Allah (Sabr \'ala al-Ta\'ah), restraint from prohibited desires (Sabr \'an al-Ma\'siyah), and dignified composure during trials (Sabr \'ala al-Bala\').',
    volumeReference: "Ma'ariful Qur'an, Vol. 1, p. 386",
  },
  nahr: {
    term: 'An-Nahr (النحر)',
    arabicRoot: 'ن-ح-ر (N-Ḥ-R)',
    literalMeaning: 'Sacrifice offered at the upper chest; upright devotion in prayer.',
    relatedWords: ['Yawm an-Nahr (Day of Sacrifice / Eid al-Adha)', 'Manhar (place of offering)'],
    theologicalContext:
      'Offering animal sacrifice solely in Allah\'s name in gratitude for His boundless favors, standing in contrast to pagan offerings dedicated to idols.',
    volumeReference: "Ma'ariful Qur'an, Vol. 8, p. 883",
  },
  kafirun: {
    term: 'Al-Kafirun (الكافرون)',
    arabicRoot: 'ك-ف-ر (K-F-R)',
    literalMeaning: 'Those who cover over, conceal, or reject manifest truth.',
    relatedWords: ['Kufr (disbelief / ingratitude)', 'Kaffarah (expiation)', 'Kafur (ungrateful)'],
    theologicalContext:
      'An uncompromising demarcation between pure monotheism (Tawhid) and polytheism (Shirk), rejecting any syncretic compromise in matters of divine worship.',
    volumeReference: "Ma'ariful Qur'an, Vol. 8, p. 885",
  },
  afwaj: {
    term: 'Afwaj (أفواج)',
    arabicRoot: 'ف-و-ج (F-W-J)',
    literalMeaning: 'Throngs, multitudes, and successive waves of people.',
    relatedWords: ['Fawj (company / contingent)', 'Afwajan (in crowds and delegations)'],
    theologicalContext:
      'Following the Conquest of Makkah (Fath Makkah), entire Arabian tribes entered the fold of Islam in massive delegations rather than as isolated individuals.',
    volumeReference: "Ma'ariful Qur'an, Vol. 8, p. 889",
  },
  tawwab: {
    term: 'At-Tawwab (التواب)',
    arabicRoot: 'ت-و-ب (T-W-B)',
    literalMeaning: 'The Oft-Returning; the One who continually accepts repentance.',
    relatedWords: ['Tawbah (repentance)', 'Ta\'ib (penitent believer)', 'Mathab (place of return)'],
    theologicalContext:
      'Allah\'s attribute of repeatedly turning toward His servants with mercy—first by inspiring their hearts to repent, and second by pardoning their slips and elevating their ranks.',
    volumeReference: "Ma'ariful Qur'an, Vol. 8, p. 891",
  },
  hasid: {
    term: 'Al-Hasid (الحاسد)',
    arabicRoot: 'ح-س-د (Ḥ-S-D)',
    literalMeaning: 'The envier when his resentment turns into active malice.',
    relatedWords: ['Hasad (destructive envy)', 'Mahsud (the envied)'],
    theologicalContext:
      'Seeking refuge in Allah from the covert and overt harm of the envious soul when it acts upon its burning resentment of divine blessings granted to others.',
    volumeReference: "Ma'ariful Qur'an, Vol. 8, p. 914",
  },
  'al-waswas al-khannas': {
    term: 'Al-Waswas Al-Khannas (الوسواس الخناس)',
    arabicRoot: 'و-س-و-س / خ-ن-س',
    literalMeaning: 'The stealthy whisperer who slinks back and retreats.',
    relatedWords: ['Waswasah (insidious whispering)', 'Khanasa (shrunk back / hid)'],
    theologicalContext:
      'The devil perches near the human heart to cast subtle doubts when a person is heedless, immediately shrinking back and retreating whenever Allah\'s name is remembered (Dhikr).',
    volumeReference: "Ma'ariful Qur'an, Vol. 8, p. 918",
  },
};
