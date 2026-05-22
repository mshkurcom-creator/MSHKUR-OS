/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface SovereignQRCodeProps {
  value: string;
  theme: 'luxury' | 'minimal' | 'chinese' | 'cosmos' | 'grok';
}

export const SovereignQRCode: React.FC<SovereignQRCodeProps> = ({ value, theme }) => {
  // Let's create an elegant pseudo-QR matrix pattern that feels completely real and highly advanced
  const generateSymmetricMatrix = () => {
    const grid: boolean[][] = [];
    const size = 19;
    
    // Seed matrix based on value hash
    let hash = 0;
    for (let h = 0; h < value.length; h++) {
      hash = value.charCodeAt(h) + ((hash << 5) - hash);
    }

    for (let r = 0; r < size; r++) {
      grid[r] = [];
      for (let c = 0; c < size; c++) {
        // Exclude alignment finder patterns at top-left, top-right, bottom-left
        const isFinderPattern = 
          (r < 6 && c < 6) || // Top-left
          (r < 6 && c >= size - 6) || // Top-right
          (r >= size - 6 && c < 6); // Bottom-left
        
        // Exclude central logo area
        const isLogoArea = (r >= 7 && r <= 11 && c >= 7 && c <= 11);

        if (isFinderPattern || isLogoArea) {
          grid[r].push(false);
        } else {
          // Generate pseudo-random bit with symmetric properties for premium aesthetic balances
          const noise = Math.abs(Math.sin((r * 12.9898 + c * 78.233 + hash) * 43758.5453));
          grid[r].push(noise > 0.45);
        }
      }
    }
    return grid;
  };

  const matrix = generateSymmetricMatrix();

  // Color assignments per theme
  const getThemeColors = () => {
    switch (theme) {
      case 'luxury':
        return {
          bg: 'transparent',
          code: '#c5a059',
          anchors: '#c5a059',
          glow: 'rgba(197, 160, 89, 0.25)'
        };
      case 'chinese':
        return {
          bg: 'transparent',
          code: '#e63946',
          anchors: '#c5a059',
          glow: 'rgba(230, 57, 70, 0.2)'
        };
      case 'cosmos':
        return {
          bg: 'transparent',
          code: '#38bdf8',
          anchors: '#818cf8',
          glow: 'rgba(56, 189, 248, 0.3)'
        };
      case 'grok':
        return {
          bg: 'transparent',
          code: '#208084',
          anchors: '#10b981',
          glow: 'rgba(32, 128, 132, 0.4)'
        };
      case 'minimal':
      default:
        return {
          bg: 'transparent',
          code: '#208084',
          anchors: '#1f2937',
          glow: 'rgba(32, 128, 132, 0.15)'
        };
    }
  };

  const colors = getThemeColors();

  return (
    <div className="relative p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center group overflow-hidden transition-all duration-300 hover:scale-[1.03]"
         style={{ boxShadow: `0 8px 32px 0 ${colors.glow}` }}>
      
      {/* Visual sweep lines */}
      <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-current to-transparent opacity-30 top-0 animate-[bounce_3s_infinite]" 
           style={{ color: colors.code }} />

      <svg width="220" height="220" viewBox="0 0 220 220" className="relative z-10">
        {/* Background base */}
        <rect x="0" y="0" width="220" height="220" fill={colors.bg} rx="16" />

        {/* Dynamic Matrix Points */}
        <g transform="translate(15, 15)">
          {matrix.map((row, r) => 
            row.map((active, c) => {
              if (!active) return null;
              
              // Draw rounded squircle pixels for visual luxury
              return (
                <rect
                  key={`${r}-${c}`}
                  x={c * 10 + 1.5}
                  y={r * 10 + 1.5}
                  width="7"
                  height="7"
                  rx="1.5"
                  fill={colors.code}
                  className="transition-all duration-300 hover:scale-125"
                />
              );
            })
          )}

          {/* Designer Finder Blocks (Anchors) - Styled as high-tech Arabic pattern gates */}
          {/* Top-Left Finder */}
          <g transform="translate(0, 0)">
            <rect x="0" y="0" width="50" height="50" rx="10" fill="none" stroke={colors.anchors} strokeWidth="5.5" />
            <rect x="12" y="12" width="26" height="26" rx="6" fill={colors.code} />
            <circle cx="25" cy="25" r="4" fill={colors.anchors} />
          </g>

          {/* Top-Right Finder */}
          <g transform="translate(140, 0)">
            <rect x="0" y="0" width="50" height="50" rx="10" fill="none" stroke={colors.anchors} strokeWidth="5.5" />
            <rect x="12" y="12" width="26" height="26" rx="6" fill={colors.code} />
            <circle cx="25" cy="25" r="4" fill={colors.anchors} />
          </g>

          {/* Bottom-Left Finder */}
          <g transform="translate(0, 140)">
            <rect x="0" y="0" width="50" height="50" rx="10" fill="none" stroke={colors.anchors} strokeWidth="5.5" />
            <rect x="12" y="12" width="26" height="26" rx="6" fill={colors.code} />
            <circle cx="25" cy="25" r="4" fill={colors.anchors} />
          </g>

          {/* Exquisite Sovereign Central Emblem 'M' */}
          <g transform="translate(75, 75)">
            <rect x="-1" y="-1" width="42" height="42" rx="8" fill="#111" stroke={colors.anchors} strokeWidth="2" />
            {/* Elegant Calligraphic-style M for Mshkur-OS */}
            <path
              d="M 8 32 L 8 10 L 16 24 L 24 10 L 24 32"
              fill="none"
              stroke={colors.code}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Center crown jewel marker representing sovereign grade */}
            <circle cx="20" cy="8" r="2.5" fill={colors.anchors} />
          </g>
        </g>
      </svg>
    </div>
  );
};
