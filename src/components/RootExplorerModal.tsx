import React, { useState, useMemo, useEffect } from 'react';
import {
  getAllLexiconRoots,
  LexiconRootSummary,
  WordDeepDiveData
} from '../services/quranLexicon';
import { BookOpen, Search, X, Layers, Sparkles } from 'lucide-react';

interface RootExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWord?: (word: string) => void;
  initialRoot?: string | null;
}

export const RootExplorerModal: React.FC<RootExplorerModalProps> = ({
  isOpen,
  onClose,
  onSelectWord,
  initialRoot,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoot, setSelectedRoot] = useState<LexiconRootSummary | null>(null);

  const allRoots = useMemo(() => getAllLexiconRoots(), []);

  useEffect(() => {
    if (initialRoot && isOpen) {
      // Normalize target root (e.g. "ن - ز - ل (N-Z-L)" -> "نزل")
      const cleanTarget = initialRoot.replace(/[^\w\u0600-\u06FF]/g, '').toLowerCase();
      const matched = allRoots.find((r) => {
        const cleanR = r.root.replace(/[^\w\u0600-\u06FF]/g, '').toLowerCase();
        return cleanR.includes(cleanTarget) || cleanTarget.includes(cleanR);
      });
      if (matched) {
        setSelectedRoot(matched);
        setSearchQuery(matched.root);
      } else {
        setSearchQuery(initialRoot);
      }
    } else if (!isOpen) {
      setSearchQuery('');
      setSelectedRoot(null);
    }
  }, [initialRoot, allRoots, isOpen]);

  const filteredRoots = useMemo(() => {
    if (!searchQuery.trim()) return allRoots;
    const q = searchQuery.toLowerCase().trim();
    return allRoots.filter(
      (r) =>
        r.root.toLowerCase().includes(q) ||
        r.rootMeaning.toLowerCase().includes(q) ||
        r.sampleWords.some(
          (w) =>
            w.word.includes(q) ||
            w.meaning.toLowerCase().includes(q) ||
            (w.transliteration && w.transliteration.toLowerCase().includes(q))
        )
    );
  }, [allRoots, searchQuery]);

  // Set default selected root if null
  const currentRoot = selectedRoot || filteredRoots[0] || allRoots[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-[#FBF9F5] dark:bg-[#1C1C21] border border-stone-200 dark:border-stone-700/80 rounded-2xl shadow-2xl flex flex-col z-10 animate-in zoom-in-95 duration-150 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E8E5DF] dark:border-[#2E2E33] flex items-center justify-between gap-3 bg-white dark:bg-[#202025]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#5F4B3E]/12 dark:bg-[#5F4B3E]/20 flex items-center justify-center text-[#5F4B3E] dark:text-[#8C7262]">
              <Layers className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="font-serif-heading font-semibold text-lg sm:text-xl text-stone-900 dark:text-stone-100">
                Quranic Root Explorer
              </h2>
              <p className="text-[11px] text-[#596B8E] dark:text-[#788BB3]">
                Linguistic etymology, triliteral roots & derived vocabulary
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#27272D] transition-colors cursor-pointer"
            aria-label="Close Root Explorer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 sm:p-4 border-b border-[#E8E5DF] dark:border-[#2E2E33] bg-white/70 dark:bg-[#202025]/70">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search Quranic roots by Arabic or English"
              placeholder="Search roots by Arabic or English (e.g. ك-ت-ب, K-T-B, mercy, book)..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700/80 bg-white dark:bg-[#25252A] text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#CD7743]/40"
            />
          </div>
        </div>

        {/* Content: 2-column Split on Desktop */}
        <div className="flex-1 min-h-0 flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-stone-200 dark:divide-stone-800 overflow-hidden">
          {/* Left: Roots List */}
          <div className="w-full sm:w-2/5 overflow-y-auto p-3 space-y-1.5 max-h-[35vh] sm:max-h-none">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 px-2 py-1">
              Roots ({filteredRoots.length})
            </div>
            {filteredRoots.length === 0 ? (
              <div className="p-4 text-center text-xs text-stone-500">
                No roots matched your query
              </div>
            ) : (
              filteredRoots.map((r) => {
                const isSelected = currentRoot?.root === r.root;
                return (
                  <button
                    key={r.root}
                    onClick={() => setSelectedRoot(r)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-[#5F4B3E]/15 dark:bg-[#5F4B3E]/25 border border-[#5F4B3E]/35 text-stone-900 dark:text-stone-100 font-semibold shadow-2xs'
                        : 'hover:bg-stone-100 dark:hover:bg-[#25252B] text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="font-mono text-xs text-[#5F4B3E] dark:text-[#8C7262]">
                        {r.root}
                      </div>
                      <div className="text-[11px] text-stone-500 truncate">
                        {r.rootMeaning}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-[#2A2A30] text-stone-500 border border-stone-200 dark:border-stone-700 shrink-0">
                      {r.wordCount} {r.wordCount === 1 ? 'word' : 'words'}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {/* Right: Selected Root Deep Dive */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-white/40 dark:bg-[#1E1E23]/40">
            {currentRoot ? (
              <>
                <div className="p-4 rounded-xl bg-white dark:bg-[#232328] border border-stone-200/80 dark:border-stone-700/80 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-[#5F4B3E] dark:text-[#8C7262] bg-[#5F4B3E]/10 dark:bg-[#5F4B3E]/20 px-2.5 py-1 rounded-md border border-[#5F4B3E]/25">
                      Root: {currentRoot.root}
                    </span>
                    <span className="text-xs text-stone-400 font-mono">
                      {currentRoot.wordCount} occurrences indexed
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                      Foundational Semantic Core
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-reader mt-1">
                      {currentRoot.rootMeaning}
                    </p>
                  </div>
                </div>

                {/* Derived Words in this Root */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#596B8E] dark:text-[#788BB3] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#CD7743]" />
                    <span>Quranic Vocabulary Derived from this Root</span>
                  </h4>

                  <div className="grid grid-cols-1 gap-2">
                    {currentRoot.sampleWords.map((w, wIdx) => (
                      <div
                        key={`root-word-${wIdx}`}
                        className="p-3 rounded-xl bg-white dark:bg-[#232328] border border-stone-200/70 dark:border-stone-800 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            dir="rtl"
                            className="font-quran text-xl sm:text-2xl text-[#CD7743] dark:text-[#E08955] leading-[1.4] sm:leading-[1.5] inline-block px-1"
                          >
                            {w.word}
                          </span>
                          <div>
                            {w.transliteration && (
                              <div className="font-semibold text-stone-800 dark:text-stone-200 text-xs">
                                {w.transliteration}
                              </div>
                            )}
                            <div className="text-[11px] text-stone-600 dark:text-stone-400">
                              {w.meaning}
                            </div>
                          </div>
                        </div>

                        {onSelectWord && (
                          <button
                            onClick={() => {
                              onSelectWord(w.word);
                              onClose();
                            }}
                            className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#CD7743]/10 dark:bg-[#CD7743]/20 text-[#CD7743] dark:text-[#E08955] hover:bg-[#CD7743]/20 transition-colors cursor-pointer shrink-0"
                          >
                            View in Text
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="py-16 text-center text-xs text-stone-400">
                Select a root to examine its semantic core and derivatives
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
