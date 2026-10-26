import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function triggerOpenRootExplorer(root?: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-root-explorer', { detail: { root } }));
  }
}
