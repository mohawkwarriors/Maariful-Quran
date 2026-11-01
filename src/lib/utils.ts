import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export { getEjtaalUrl } from '../services/lanesLexicon';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * @deprecated Expandable Root Explorer has been removed in favor of direct Lane's Lexicon on ejtaal.net
 */
export function triggerOpenRootExplorer(_root?: string) {
  // No-op: replaced by direct classical ejtaal.net link
}
