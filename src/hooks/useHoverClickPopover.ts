import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import {
  canHoverOpenPopover,
  claimActivePopover,
  releaseActivePopover,
} from '../utils/popoverCoordinator';

export interface UseHoverClickPopoverOptions {
  /** Lazily mount heavy popover content until first hover/click/keyboard activation. */
  lazy?: boolean;
  /** Delay (ms) before closing on mouse leave when unpinned. Defaults to 200ms. */
  closeDelayMs?: number;
  /** Suppress mouse hover-opening on <640px mobile viewports (e.g. mobile bottom sheets). */
  disableHoverOnMobile?: boolean;
  /** Label used for debugging the unique coordinator Symbol. */
  label?: string;
}

const MOBILE_MQ = '(max-width: 639px)';

function isMobileViewport(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(MOBILE_MQ).matches;
}

/**
 * Returns true if the user just finished a text-selection drag inside `el`.
 * Does not trigger for unrelated text selected elsewhere on the page.
 */
function hasSelectionInside(el: HTMLElement | null): boolean {
  if (!el || typeof window === 'undefined') return false;
  const sel = window.getSelection();
  if (!sel || sel.toString().trim().length === 0) return false;
  const anchorIn = Boolean(sel.anchorNode && el.contains(sel.anchorNode));
  const focusIn = Boolean(sel.focusNode && el.contains(sel.focusNode));
  return anchorIn || focusIn;
}

/**
 * Shared hover/click/pin/keyboard state machine for WordItem, MushafWordItem,
 * TermPopover, and FootnotePopover.
 *
 * - Hover opens unpinned; switching hover targets immediately closes the prior popover.
 * - Clicking a hover-opened trigger pins it open instead of toggling it shut.
 * - While pinned, mouse leave does not auto-close and hovering other triggers is blocked.
 * - Clicking a pinned trigger again, clicking outside, or pressing Escape dismisses it.
 * - Drag-selecting text within the trigger does not accidentally pin or toggle the popover.
 * - For lazy non-button triggers (MushafWordItem), preserves keyboard focus across activation.
 */
export function useHoverClickPopover<T extends HTMLElement = HTMLElement>({
  lazy = false,
  closeDelayMs = 200,
  disableHoverOnMobile = false,
  label = 'popover',
}: UseHoverClickPopoverOptions = {}) {
  const [isActivated, setIsActivated] = useState(!lazy);
  const [open, setOpen] = useState(false);

  const instanceIdRef = useRef<symbol | null>(null);
  if (instanceIdRef.current === null) {
    instanceIdRef.current = Symbol(label);
  }

  const triggerRef = useRef<T | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openedViaHoverRef = useRef(false);
  const isPinnedRef = useRef(false);
  const restoreFocusOnActivateRef = useRef(false);

  const clearCloseTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const forceClose = useCallback(() => {
    clearCloseTimeout();
    openedViaHoverRef.current = false;
    isPinnedRef.current = false;
    if (instanceIdRef.current) {
      releaseActivePopover(instanceIdRef.current);
    }
    setOpen(false);
  }, [clearCloseTimeout]);

  useEffect(() => {
    const id = instanceIdRef.current!;
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      releaseActivePopover(id);
    };
  }, []);

  // Preserve keyboard focus when a lazy trigger remounts inside Popover.Trigger
  useLayoutEffect(() => {
    if (isActivated && restoreFocusOnActivateRef.current) {
      restoreFocusOnActivateRef.current = false;
      triggerRef.current?.focus({ preventScroll: true });
    }
  }, [isActivated]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        forceClose();
        return;
      }
      clearCloseTimeout();
      if (lazy) setIsActivated(true);
      claimActivePopover(instanceIdRef.current!, isPinnedRef.current, forceClose);
      setOpen(true);
    },
    [clearCloseTimeout, forceClose, lazy]
  );

  const handleMouseEnter = useCallback(() => {
    if (disableHoverOnMobile && isMobileViewport()) return;
    const id = instanceIdRef.current!;
    if (!canHoverOpenPopover(id)) return;
    clearCloseTimeout();
    if (lazy) setIsActivated(true);
    if (!isPinnedRef.current) {
      openedViaHoverRef.current = true;
    }
    claimActivePopover(id, isPinnedRef.current, forceClose);
    setOpen(true);
  }, [clearCloseTimeout, disableHoverOnMobile, forceClose, lazy]);

  const handleMouseLeave = useCallback(() => {
    if (isPinnedRef.current) return;
    clearCloseTimeout();
    timeoutRef.current = setTimeout(() => {
      forceClose();
    }, closeDelayMs);
  }, [clearCloseTimeout, closeDelayMs, forceClose]);

  const handlePointerEnter = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.buttons !== 0) return;
      handleMouseEnter();
    },
    [handleMouseEnter]
  );

  const handlePointerLeave = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      handleMouseLeave();
    },
    [handleMouseLeave]
  );

  const handleTriggerClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (hasSelectionInside(e.currentTarget)) {
        e.preventDefault();
        return;
      }

      const id = instanceIdRef.current!;
      if (!isActivated) {
        clearCloseTimeout();
        setIsActivated(true);
        openedViaHoverRef.current = false;
        isPinnedRef.current = true;
        claimActivePopover(id, true, forceClose);
        setOpen(true);
        return;
      }

      if (open && openedViaHoverRef.current) {
        // Clicking a hover-opened trigger pins it open instead of closing it
        e.preventDefault();
        clearCloseTimeout();
        openedViaHoverRef.current = false;
        isPinnedRef.current = true;
        claimActivePopover(id, true, forceClose);
      } else if (!open) {
        clearCloseTimeout();
        openedViaHoverRef.current = false;
        isPinnedRef.current = true;
      }
    },
    [clearCloseTimeout, forceClose, isActivated, open]
  );

  // Only attach handleKeyDown/handleKeyUp to non-button triggers (<div role="button"> / <span role="button">)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (open) {
          forceClose();
        } else {
          if (lazy && !isActivated) {
            restoreFocusOnActivateRef.current = true;
          }
          openedViaHoverRef.current = false;
          isPinnedRef.current = true;
          handleOpenChange(true);
        }
      } else if (e.key === ' ') {
        e.preventDefault();
      }
    },
    [forceClose, handleOpenChange, isActivated, lazy, open]
  );

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === ' ') {
        e.preventDefault();
        if (open) {
          forceClose();
        } else {
          if (lazy && !isActivated) {
            restoreFocusOnActivateRef.current = true;
          }
          openedViaHoverRef.current = false;
          isPinnedRef.current = true;
          handleOpenChange(true);
        }
      }
    },
    [forceClose, handleOpenChange, isActivated, lazy, open]
  );

  return {
    isActivated,
    open,
    triggerRef,
    forceClose,
    handleOpenChange,
    handleMouseEnter,
    handleMouseLeave,
    handlePointerEnter,
    handlePointerLeave,
    handleTriggerClick,
    handleKeyDown,
    handleKeyUp,
  };
}
