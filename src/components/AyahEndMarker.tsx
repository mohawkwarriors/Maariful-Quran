import React from 'react';

export interface AyahMarkerProps {
  vNum: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const toArabicNumeral = (num: number): string => {
  const arabicDigits = ['\u0660', '\u0661', '\u0662', '\u0663', '\u0664', '\u0665', '\u0666', '\u0667', '\u0668', '\u0669'];
  return num
    .toString()
    .split('')
    .map((d) => arabicDigits[parseInt(d, 10)] ?? d)
    .join('');
};

/**
 * Authentic Classical Quranic Ayah End Marker (U+06DD).
 * Uses the exact same font glyph (U+06DD) and Eastern Arabic numerals (U+0660-U+0669) as the Arabic Quran text.
 * Renders in a dedicated inline container with calibrated vertical alignment so it is
 * optically and vertically centered with the surrounding text line.
 */
export const AyahEndMarker: React.FC<AyahMarkerProps> = ({
  vNum,
  className = '',
  size = 'md',
}) => {
  const arabicNum = toArabicNumeral(vNum);

  // Proportional sizing calibrated to font em heights:
  // - 'sm' for English translation body text (centered on line)
  // - 'md' for standard standalone markers
  // - 'lg' for inline word-by-word Arabic flow (matches 28px-32px Arabic font)
  const sizeStyles: React.CSSProperties =
    size === 'sm'
      ? {
          fontSize: '1.25em',
          margin: '0 0.35rem',
          verticalAlign: '0.12em',
        }
      : size === 'lg'
      ? {
          fontSize: '1.9em',
          margin: '0 0.5rem',
          verticalAlign: 'middle',
        }
      : {
          fontSize: '1.5em',
          margin: '0 0.4rem',
          verticalAlign: 'middle',
        };

  return (
    <span
      dir="rtl"
      className={`font-quran inline-flex items-center justify-center select-none text-[#CD7743] dark:text-[#E08955] transition-transform hover:scale-105 cursor-default shrink-0 leading-none ${className}`}
      title={`Ayah ${vNum}`}
      aria-label={`Ayah ${vNum}`}
      style={{
        ...sizeStyles,
        lineHeight: 1,
        unicodeBidi: 'isolate',
        whiteSpace: 'nowrap',
        fontKerning: 'none',
      }}
    >
      <span className="leading-none whitespace-nowrap select-none">
        {'\u06dd'}{arabicNum}
      </span>
    </span>
  );
};

export { toArabicNumeral };
