import React from 'react';
import {
  ExternalLink,
  Volume2,
  Sparkles,
  Plane,
  Building2,
  Smartphone,
  Compass,
  Radio,
  Coffee,
  X,
} from 'lucide-react';
import { TVAd } from '../../data/tvAds';

interface TVAdOverlayProps {
  ad: TVAd;
  countdown: number;
  totalDuration?: number;
  onClose: () => void;
  stationName?: string;
}

export const TVAdOverlay: React.FC<TVAdOverlayProps> = ({
  ad,
  countdown,
  totalDuration = 10,
  onClose,
  stationName = 'Benix Space TV',
}) => {
  const progressPercent = Math.max(0, Math.min(100, (countdown / totalDuration) * 100));

  const renderBrandIcon = () => {
    switch (ad.iconName) {
      case 'momo':
        return <Smartphone className="w-6 h-6 sm:w-7 sm:h-7 text-amber-950" />;
      case 'bk':
        return <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-white" />;
      case 'rwanda':
        return <Compass className="w-6 h-6 sm:w-7 sm:h-7 text-white" />;
      case 'rwandair':
        return <Plane className="w-6 h-6 sm:w-7 sm:h-7 text-white" />;
      case 'airtel':
        return <Radio className="w-6 h-6 sm:w-7 sm:h-7 text-white" />;
      case 'inyange':
        return <Coffee className="w-6 h-6 sm:w-7 sm:h-7 text-white" />;
      default:
        return <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-white" />;
    }
  };

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between bg-black/80 backdrop-blur-md text-white p-3 sm:p-6 animate-fadeIn select-none">
      
      {/* Top Bar: Sponsored Tag + Live Broadcast Indicator + Countdown Pill */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="px-2.5 py-1 rounded-md bg-amber-500 text-slate-950 text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 fill-current" />
            Sponsored Ad
          </span>

          {/* Broadcast speaking indicator: Shows audio is alive */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-white text-[10px] sm:text-xs font-semibold backdrop-blur-sm">
            <Volume2 className="w-3.5 h-3.5 text-rba-yellow animate-pulse" />
            <span className="truncate max-w-[140px] sm:max-w-none">
              Live Audio Playing • {stationName}
            </span>
          </div>
        </div>

        {/* Countdown Badge & Optional Quick Skip */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-white/20 text-xs font-bold text-white shadow-inner">
            <span className="w-2 h-2 rounded-full bg-rba-yellow animate-ping" />
            <span>Ad ends in <strong className="text-rba-yellow text-sm font-black">{countdown}s</strong></span>
          </div>

          {/* Quick skip button if user is in a hurry */}
          {countdown <= 5 && (
            <button
              onClick={onClose}
              className="p-1 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
              title="Close ad"
              aria-label="Close ad"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Center Showcase: Brand Card & Promotional Message */}
      <div className="my-auto max-w-2xl mx-auto w-full py-2">
        <div className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${ad.bgGradient} border border-white/20 shadow-2xl relative overflow-hidden`}>
          
          {/* Subtle Ambient Background Watermark */}
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none transform scale-150">
            {renderBrandIcon()}
          </div>

          {/* Sponsor Identity Header */}
          <div className="flex items-center gap-3 sm:gap-4 mb-3">
            <div
              className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-lg shrink-0"
              style={{ backgroundColor: ad.accentColor }}
            >
              {renderBrandIcon()}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base sm:text-xl font-black text-white tracking-tight">
                  {ad.sponsor}
                </h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white uppercase tracking-wider">
                  {ad.badgeText}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-200 font-medium">
                {ad.category}
              </p>
            </div>
          </div>

          {/* Title & Tagline */}
          <h3 className="text-base sm:text-2xl font-black text-white leading-tight mb-1">
            {ad.title}
          </h3>
          <p className="text-xs sm:text-sm text-amber-200 font-bold mb-2.5">
            {ad.tagline}
          </p>
          <p className="text-xs sm:text-sm text-slate-100/90 leading-relaxed mb-4 line-clamp-2 sm:line-clamp-3">
            {ad.description}
          </p>

          {/* Highlights Pills */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
            {ad.highlights.map((highlight, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-lg bg-black/30 border border-white/10 text-[10px] sm:text-xs font-semibold text-white backdrop-blur-sm"
              >
                ✓ {highlight}
              </span>
            ))}
          </div>

          {/* Call To Action Button */}
          <div className="flex items-center justify-between gap-4 pt-1 border-t border-white/15">
            <a
              href={ad.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-black text-xs sm:text-sm text-slate-950 shadow-xl transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: ad.accentColor }}
            >
              <span>{ad.ctaText}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <span className="text-[10px] sm:text-xs text-white/70 italic hidden sm:inline">
              Opens sponsor website
            </span>
          </div>

        </div>
      </div>

      {/* Bottom Bar: Animated Progress Bar & Note */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-300 px-1">
          <span>Broadcasting live from Kigali • Audio streaming active</span>
          <span>Returning to full video in <strong>{countdown}s</strong></span>
        </div>

        {/* 10s Countdown Progress Bar */}
        <div className="w-full h-1.5 sm:h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rba-yellow to-amber-500 transition-all duration-1000 ease-linear rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

    </div>
  );
};
