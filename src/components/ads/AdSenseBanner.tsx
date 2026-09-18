import React, { useEffect, useRef, useState } from 'react';
import { ADS_CONFIG } from '../../config/ads';
import { Sparkles, RefreshCw } from 'lucide-react';

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

interface AdSenseBannerProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /**
   * Interval in seconds to automatically reload the ad slot with a fresh ad.
   * If 0 or omitted, auto-refresh is disabled.
   */
  refreshInterval?: number;
  label?: string;
  minHeight?: string;
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  slot = ADS_CONFIG.SLOTS.TV_COMPANION_BANNER,
  format = 'auto',
  responsive = true,
  className = '',
  style,
  refreshInterval = 0,
  label = 'Sponsored Advertisement',
  minHeight = '90px',
}) => {
  const [adKey, setAdKey] = useState<number>(0);
  const [adFailed, setAdFailed] = useState<boolean>(false);
  const adRef = useRef<HTMLModElement | null>(null);

  // Push to adsbygoogle on mount or whenever adKey increments
  useEffect(() => {
    let timer: any = null;

    try {
      // Small timeout to guarantee the ins element is mounted and rendered in DOM
      timer = setTimeout(() => {
        try {
          if (typeof window !== 'undefined') {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          }
        } catch (err) {
          // Normal in dev or if adblock is active
          console.debug('AdSense push status:', err);
        }
      }, 100);
    } catch (e) {
      setAdFailed(true);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [adKey]);

  // Periodic Refresh without interrupting video/audio playback
  useEffect(() => {
    if (!refreshInterval || refreshInterval <= 0) return;

    const interval = setInterval(() => {
      // Incrementing adKey unmounts the current ins and mounts a fresh one
      setAdKey((prev) => prev + 1);
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  return (
    <div className={`w-full overflow-hidden my-4 ${className}`}>
      {/* Policy compliant ad label */}
      <div className="flex items-center justify-between px-1 mb-1.5 text-[10px] uppercase font-bold tracking-widest text-slate-400 select-none">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-rba-yellow" />
          {label}
        </span>
        {refreshInterval > 0 && (
          <span className="text-slate-400 font-medium normal-case flex items-center gap-1 text-[10px]">
            <RefreshCw className="w-2.5 h-2.5 animate-spin text-slate-400" style={{ animationDuration: '6s' }} />
            Auto-refreshed
          </span>
        )}
      </div>

      {/* Ad Container */}
      <div
        className="relative w-full rounded-2xl bg-white/70 border border-slate-200/80 p-2 sm:p-3 shadow-sm flex items-center justify-center min-h-[90px] transition-all"
        style={{ minHeight, ...style }}
      >
        <ins
          key={adKey}
          ref={adRef}
          className="adsbygoogle w-full block"
          style={{ display: 'block', minHeight, width: '100%', ...style }}
          data-ad-client={ADS_CONFIG.CLIENT_ID}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />

        {/* Fallback / Sponsor Placeholder: displayed when AdSense is pending, unfilled, or blocked */}
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-3 text-center -z-0 opacity-80">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-md bg-rba-blue/10 text-rba-blue text-[10px] font-black tracking-wider uppercase">
              RBA Rwanda Partner
            </span>
            <span className="text-[11px] font-bold text-slate-600">Google AdSense Space</span>
          </div>
          <p className="text-[10px] text-slate-400 max-w-sm">
            Live broadcaster advertisement unit • Client ID: {ADS_CONFIG.CLIENT_ID}
          </p>
        </div>
      </div>
    </div>
  );
};
