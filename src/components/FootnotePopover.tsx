import React, { useState, useRef, useEffect } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { BookMarked, X, ChevronDown, ChevronUp, Feather } from 'lucide-react';
import { FootnoteItem } from '../types/quran';

export interface FootnotePopoverProps {
  id: number;
  note: FootnoteItem;
  sectionId?: string;
}

export const FootnotePopover: React.FC<FootnotePopoverProps> = ({ id, note, sectionId }) => {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpen(true);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 220);
  };

  const handlePopoverContentMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handlePopoverContentMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 220);
  };

  const anchorId = sectionId ? `fn-ref-${sectionId}-${id}` : `fn-ref-${id}`;
  const targetId = sectionId ? `fn-note-${sectionId}-${id}` : `fn-note-${id}`;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <sup id={anchorId} className="inline-block align-baseline">
        <Popover.Trigger asChild>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="inline-flex items-center justify-center font-sans font-semibold text-[11px] leading-none text-[#CD7743] hover:text-[#B56332] dark:text-[#E08955] dark:hover:text-[#F29F6D] bg-[#CD7743]/10 dark:bg-[#E08955]/15 hover:bg-[#CD7743]/20 dark:hover:bg-[#E08955]/25 border border-[#CD7743]/30 dark:border-[#E08955]/40 rounded-sm px-1.5 py-0.5 mx-0.5 transition-all cursor-pointer shadow-2xs select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-[#CD7743]"
            aria-label={`Footnote ${id}: ${note.author ? note.author + ' - ' : ''}${note.text.slice(0, 50)}...`}
            title="Hover or click to view scholarly footnote"
          >
            [{id}]
          </button>
        </Popover.Trigger>
      </sup>

      <Popover.Portal>
        <Popover.Content
          side="top"
          align="center"
          sideOffset={6}
          className="z-50 w-[420px] sm:w-[480px] max-w-[92vw] max-h-[65vh] overflow-y-auto p-4 sm:p-5 bg-white dark:bg-[#202025] border border-stone-200 dark:border-stone-700/80 rounded-2xl shadow-2xl text-[#1F2937] dark:text-[#F3F4F6] text-xs sm:text-[13px] animate-in fade-in zoom-in-95 duration-150 space-y-3"
          onMouseEnter={handlePopoverContentMouseEnter}
          onMouseLeave={handlePopoverContentMouseLeave}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              <BookMarked className="w-4 h-4 text-[#CD7743] dark:text-[#E08955] shrink-0" />
              <span className="font-serif-heading font-bold text-sm text-[#CD7743] dark:text-[#E08955]">
                Footnote [{id}]
              </span>
              {note.author && (
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md bg-[#CD7743]/10 text-[#CD7743] dark:bg-[#E08955]/15 dark:text-[#E08955] border border-[#CD7743]/20 dark:border-[#E08955]/25">
                  {note.author}
                </span>
              )}
            </div>

            <Popover.Close
              className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-md p-1 transition-colors cursor-pointer shrink-0"
              aria-label="Close footnote"
            >
              <X className="w-4 h-4" />
            </Popover.Close>
          </div>

          {/* Body */}
          <div className="text-stone-700 dark:text-stone-300 font-reader leading-relaxed whitespace-pre-line text-xs sm:text-[13.5px]">
            {note.text}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-400 dark:text-stone-500">
            <span>Ma'ariful Qur'an · Scholarly Footnote</span>
            {sectionId && (
              <a
                href={`#${targetId}`}
                onClick={() => setOpen(false)}
                className="hover:text-[#CD7743] dark:hover:text-[#E08955] transition-colors underline"
              >
                Jump to bottom note ↓
              </a>
            )}
          </div>

          <Popover.Arrow className="fill-white dark:fill-[#202025]" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default FootnotePopover;

/**
 * Parses a paragraph and replaces footnote markers [^1] or [1] with interactive FootnotePopover components
 */
export function renderContentWithFootnotes(
  content: string,
  footnotes?: FootnoteItem[],
  sectionId?: string
): React.ReactNode {
  if (!footnotes || footnotes.length === 0 || !content) {
    return content;
  }

  // Regex matching [^1] or [1]
  const regex = /\[\^?(\d{1,2})\]/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    const num = parseInt(match[1], 10);
    const footnote = footnotes.find((fn) => fn.id === num);

    if (footnote) {
      if (match.index > lastIndex) {
        elements.push(content.slice(lastIndex, match.index));
      }
      elements.push(
        <FootnotePopover
          key={`fn-${sectionId || 'sec'}-${num}-${match.index}`}
          id={num}
          note={footnote}
          sectionId={sectionId}
        />
      );
      lastIndex = regex.lastIndex;
    }
  }

  if (lastIndex === 0) {
    return content;
  }

  if (lastIndex < content.length) {
    elements.push(content.slice(lastIndex));
  }

  return elements;
}

/**
 * Bottom section displaying all footnotes for the section in scholarly academic style
 */
export const FootnotesSection: React.FC<{
  footnotes?: FootnoteItem[];
  sectionId?: string;
}> = ({ footnotes, sectionId }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!footnotes || footnotes.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-800">
      <div className="bg-[#FAF7F2]/80 dark:bg-[#1A1A1E]/80 border border-[#CD7743]/20 dark:border-[#E08955]/20 rounded-2xl p-4 sm:p-5 transition-all">
        {/* Toggle / Header */}
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="w-full flex items-center justify-between gap-3 text-left cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <Feather className="w-4 h-4 text-[#CD7743] dark:text-[#E08955]" />
            <h4 className="font-serif-heading font-semibold text-sm sm:text-base text-stone-800 dark:text-stone-200 group-hover:text-[#CD7743] dark:group-hover:text-[#E08955] transition-colors">
              Footnotes & Scholarly Annotations
            </h4>
            <span className="text-[11px] font-sans font-medium px-2 py-0.5 rounded-full bg-[#CD7743]/10 text-[#CD7743] dark:bg-[#E08955]/15 dark:text-[#E08955]">
              {footnotes.length} {footnotes.length === 1 ? 'note' : 'notes'}
            </span>
          </div>

          <div className="text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {/* Collapsible Content */}
        {isExpanded && (
          <div className="mt-4 pt-3 border-t border-stone-200/60 dark:border-stone-800 space-y-4">
            {footnotes.map((fn) => {
              const anchorId = sectionId ? `fn-note-${sectionId}-${fn.id}` : `fn-note-${fn.id}`;
              const returnId = sectionId ? `fn-ref-${sectionId}-${fn.id}` : `fn-ref-${fn.id}`;

              return (
                <div
                  key={`fn-entry-${fn.id}`}
                  id={anchorId}
                  className="flex items-start gap-3 group/item text-xs sm:text-[13px] leading-relaxed text-stone-700 dark:text-stone-300 font-reader"
                >
                  <a
                    href={`#${returnId}`}
                    title="Jump back to commentary"
                    className="shrink-0 font-sans font-semibold text-[11px] text-[#CD7743] hover:text-[#B56332] dark:text-[#E08955] dark:hover:text-[#F29F6D] bg-[#CD7743]/10 dark:bg-[#E08955]/15 hover:bg-[#CD7743]/20 dark:hover:bg-[#E08955]/25 border border-[#CD7743]/30 dark:border-[#E08955]/40 rounded-sm px-1.5 py-0.5 transition-all shadow-2xs"
                  >
                    [{fn.id}] ↑
                  </a>

                  <div className="space-y-1 min-w-0 flex-1">
                    {fn.author && (
                      <span className="inline-block mr-2 px-1.5 py-0.2 text-[9.5px] uppercase font-bold tracking-wider rounded bg-[#CD7743]/10 text-[#CD7743] dark:bg-[#E08955]/15 dark:text-[#E08955] border border-[#CD7743]/20 dark:border-[#E08955]/25">
                        {fn.author}
                      </span>
                    )}
                    <span className="whitespace-pre-line">{fn.text}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
