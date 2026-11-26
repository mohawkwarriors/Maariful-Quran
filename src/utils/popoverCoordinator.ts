/**
 * Lightweight imperative coordinator for floating Word Explorer, Term, Footnote,
 * and Header dropdown overlays. Guarantees at most one overlay is open across the
 * reader at any time (with zero React context re-renders across large Surahs) and
 * prevents hovering other triggers from doubling up or hijacking a pinned overlay.
 */

interface ActivePopoverEntry {
  id: symbol;
  isPinned: boolean;
  close: () => void;
}

let activePopover: ActivePopoverEntry | null = null;

/**
 * Returns whether the given popover instance is allowed to open via mouse hover.
 * Suppressed while a different popover is explicitly pinned open by click/keyboard.
 */
export function canHoverOpenPopover(id: symbol): boolean {
  if (!activePopover) return true;
  if (activePopover.id === id) return true;
  return !activePopover.isPinned;
}

/**
 * Returns whether any coordinated popover/overlay is currently open.
 */
export function hasActivePopover(): boolean {
  return activePopover !== null;
}

/**
 * Claims the single active popover slot for `id`, immediately closing any previously
 * open popover instance first so two overlays can never overlap.
 */
export function claimActivePopover(id: symbol, isPinned: boolean, close: () => void): void {
  const prev = activePopover;
  activePopover = { id, isPinned, close };
  if (prev && prev.id !== id) {
    prev.close();
  }
}

/**
 * Releases the active popover slot if currently owned by `id`.
 */
export function releaseActivePopover(id: symbol): void {
  if (activePopover && activePopover.id === id) {
    activePopover = null;
  }
}
