import React from 'react';

interface BrandedLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  sublabel?: string;
  fullScreen?: boolean;
}

const SIZE_MAP = {
  sm: { box: 56, medallion: 32, glyph: 18 },
  md: { box: 76, medallion: 44, glyph: 24 },
  lg: { box: 96, medallion: 56, glyph: 30 },
};

export const BrandedLoader: React.FC<BrandedLoaderProps> = ({
  size = 'lg',
  label,
  sublabel,
  fullScreen = false,
}) => {
  const dims = SIZE_MAP[size];
  const uid = React.useId().replace(/:/g, '');

  const content = (
    <div
      className="flex flex-col items-center justify-center gap-4 select-none"
      role="status"
      aria-live="polite"
      aria-label={label || 'Loading'}
    >
      <div
        className="relative flex items-center justify-center"
        style={{ width: dims.box, height: dims.box }}
      >
        {/* Soft ambient radial halo */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none unity-loader-breathe"
          style={{
            background:
              'radial-gradient(circle, rgba(10, 77, 140, 0.16) 0%, rgba(29, 112, 184, 0.06) 55%, transparent 74%)',
          }}
        />

        {/* Primary clockwise sweeping gradient orbital ring */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full unity-loader-spin-cw"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={`unityGrad-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0A4D8C" />
              <stop offset="55%" stopColor="#1D70B8" />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.15" />
            </linearGradient>
          </defs>

          {/* Subtle circular base track */}
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="rgba(10, 77, 140, 0.11)"
            strokeWidth="2.5"
          />

          {/* Sweeping main progress arc */}
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke={`url(#unityGrad-${uid})`}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="175 280"
          />

          {/* Precision leading bead */}
          <circle cx="50" cy="6" r="3.2" fill="#0A4D8C" />
        </svg>

        {/* Secondary counter-rotating geometric ring */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full unity-loader-spin-ccw"
          aria-hidden="true"
        >
          <circle
            cx="50"
            cy="50"
            r="36"
            fill="none"
            stroke="rgba(10, 77, 140, 0.24)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray="14 14 4 14"
          />
        </svg>

        {/* Elevated Center Circular Medallion with custom geometric "U" */}
        <div
          className="relative z-10 rounded-full bg-white flex items-center justify-center border border-[#0A4D8C]/15 shadow-[0_6px_20px_rgba(10,77,140,0.16)]"
          style={{ width: dims.medallion, height: dims.medallion }}
        >
          {/* Inner hairline ring */}
          <div className="absolute inset-[3px] rounded-full border border-[#0A4D8C]/10 pointer-events-none" />

          {/* Architectural Geometric "U" Emblem */}
          <svg
            viewBox="0 0 40 40"
            width={dims.glyph}
            height={dims.glyph}
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={`unityUGlyph-${uid}`} x1="8" y1="6" x2="32" y2="34" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#083B6B" />
                <stop offset="55%" stopColor="#0A4D8C" />
                <stop offset="100%" stopColor="#1D70B8" />
              </linearGradient>
            </defs>
            {/* Outer bold U body */}
            <path
              d="M10.5 9.5V22.5C10.5 27.7467 14.7533 32 20 32C25.2467 32 29.5 27.7467 29.5 22.5V9.5"
              stroke={`url(#unityUGlyph-${uid})`}
              strokeWidth="5.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Crisp inner light accent */}
            <path
              d="M10.5 9.5V22.5C10.5 27.7467 14.7533 32 20 32C25.2467 32 29.5 27.7467 29.5 22.5V9.5"
              stroke="#93C5FD"
              strokeOpacity="0.45"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            {/* Top pillar accents */}
            <circle cx="29.5" cy="9.5" r="1.4" fill="#38BDF8" />
          </svg>
        </div>
      </div>

      {(label || sublabel) && (
        <div className="text-center space-y-0.5">
          {label && (
            <p className="text-xs font-semibold tracking-tight text-[#1E2329]">
              {label}
            </p>
          )}
          {sublabel && (
            <p className="text-[11px] font-medium text-slate-500">
              {sublabel}
            </p>
          )}
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center w-full p-6">
        {content}
      </div>
    );
  }

  return content;
};
