import React, { useEffect, useRef, useState } from 'react';
import { ADS_CONFIG } from '../../config/ads';
import { TV_SPONSORED_ADS, TVAd } from '../../data/tvAds';
import { ExternalLink, Sparkles, Building2, Smartphone, Compass, Plane, Radio, Coffee } from 'lucide-react';

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
  refreshInterval?: number;
  label?: string;
  minHeight?: string;
  fallbackSponsored?: boolean;
  sponsorIndex?: number;
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  slot = ADS_CONFIG.SLOTS.TV_COMPANION_BANNER,
  format = 'auto',
  responsive = true,
  className = '',
  style,
  refreshInterval = 0,
  label = 'Sponsored',
  fallbackSponsored = false,
  sponsorIndex = 0,
}) => {
  const [adKey, setAdKey] = useState<number>(0);
  const [isAdFilled, setIsAdFilled] = useState<boolean>(false);
  const [showFallback, setShowFallback] = useState<boolean>(false);
  const insRef = useRef<HTMLModElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const fallbackAd: TVAd = TV_SPONSORED_ADS[sponsorIndex % TV_SPONSORED_ADS.length];

  // Push to adsbygoogle on mount or whenever adKey increments
  useEffect(() => {
    let timer: any = null;

    try {
      timer = setTimeout(() => {
        try {
          if (typeof window !== 'undefined') {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          }
        } catch (err) {
          // Ad blocker or sandboxed environment
        }
      }, 150);
    } catch (e) {
      // Ignore
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [adKey]);

  // Check if Google AdSense has truly filled with visible rendered height
  useEffect(() => {
    const insElement = insRef.current;
    if (!insElement) return;

    let timeoutTimer: any = null;

    const checkFilledStatus = () => {
      const status = insElement.getAttribute('data-ad-status');
      const iframe = insElement.querySelector('iframe');
      
      // Verified real rendering check: Must have rendered height > 30px
      const hasRenderedHeight =
        (iframe && (iframe.offsetHeight > 30 || iframe.getBoundingClientRect().height > 30)) ||
        insElement.offsetHeight > 30;

      if (status === 'filled' && hasRenderedHeight) {
        setIsAdFilled(true);
        setShowFallback(false);
      } else if (status === 'unfilled') {
        setIsAdFilled(false);
        if (fallbackSponsored) {
          setShowFallback(true);
        }
      } else if (iframe && hasRenderedHeight) {
        setIsAdFilled(true);
        setShowFallback(false);
      }
    };

    // Initial check
    checkFilledStatus();

    // Check after delay in case iframe height expands
    const checkTimer1 = setTimeout(checkFilledStatus, 800);
    const checkTimer2 = setTimeout(checkFilledStatus, 2000);

    // Fallback trigger if AdSense doesn't fill within 2.5s (e.g. adblocker, sandbox)
    if (fallbackSponsored) {
      timeoutTimer = setTimeout(() => {
        if (!isAdFilled) {
          setShowFallback(true);
        }
      }, 2500);
    }

    // Observe attribute and DOM changes inside the ins tag
    const observer = new MutationObserver(() => {
      checkFilledStatus();
    });

    observer.observe(insElement, {
      attributes: true,
      attributeFilter: ['data-ad-status'],
      childList: true,
      subtree: true,
    });

    // ResizeObserver for reliable height detection
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        checkFilledStatus();
      });
      resizeObserver.observe(insElement);
    }

    return () => {
      clearTimeout(checkTimer1);
      clearTimeout(checkTimer2);
      if (timeoutTimer) clearTimeout(timeoutTimer);
      observer.disconnect();
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [adKey, fallbackSponsored, isAdFilled]);

  // Periodic Refresh without interrupting playback
  useEffect(() => {
    if (!refreshInterval || refreshInterval <= 0) return;

    const interval = setInterval(() => {
      setIsAdFilled(false);
      setAdKey((prev) => prev + 1);
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const renderFallbackIcon = (iconName: string) => {
    switch (iconName) {
      case 'momo':
        return <Smartphone className="w-5 h-5 text-amber-950" />;
      case 'bk':
        return <Building2 className="w-5 h-5 text-white" />;
      case 'rwanda':
        return <Compass className="w-5 h-5 text-white" />;
      case 'rwandair':
        return <Plane className="w-5 h-5 text-white" />;
      case 'airtel':
        return <Radio className="w-5 h-5 text-white" />;
      case 'inyange':
        return <Coffee className="w-5 h-5 text-white" />;
      default:
        return <Sparkles className="w-5 h-5 text-white" />;
    }
  };

  // If neither AdSense is verified filled nor fallback is ready: RENDER ABSOLUTELY NOTHING!
  // This completely eliminates empty white boxes or "Advertisement" placeholders!
  if (!isAdFilled && !showFallback) {
    return (
      <div className="hidden h-0 w-0 p-0 m-0 border-0 overflow-hidden" aria-hidden="true">
        <ins
          key={adKey}
          ref={insRef}
          className="adsbygoogle"
          style={{ display: 'none' }}
          data-ad-client={ADS_CONFIG.CLIENT_ID}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      </div>
    );
  }

  // Display Fallback Sponsored Card if Google AdSense didn't fill
  if (showFallback && !isAdFilled) {
    return (
      <div className={`w-full my-4 animate-fadeIn ${className}`}>
        <div className="flex items-center justify-between px-1 mb-1.5 text-[10px] uppercase font-bold tracking-widest text-slate-400 select-none">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            {label}
          </span>
          <span className="text-[9px] font-medium text-slate-400">Partner Spotlight</span>
        </div>

        <div className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-r ${fallbackAd.bgGradient} text-white shadow-md border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-md shrink-0"
              style={{ backgroundColor: fallbackAd.accentColor }}
            >
              {renderFallbackIcon(fallbackAd.iconName)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm sm:text-base font-black text-white tracking-tight truncate">
                  {fallbackAd.sponsor}
                </h4>
                <span className="px-2 py-0.2 rounded text-[9px] font-bold bg-white/20 text-white uppercase tracking-wider">
                  {fallbackAd.badgeText}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-amber-200 line-clamp-1">
                {fallbackAd.title}
              </p>
              <p className="text-[11px] sm:text-xs text-slate-200 line-clamp-1 hidden xs:block">
                {fallbackAd.tagline}
              </p>
            </div>
          </div>

          <a
            href={fallbackAd.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start sm:self-center inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-xs text-slate-950 shadow-md transition-transform hover:scale-105 active:scale-95 shrink-0"
            style={{ backgroundColor: fallbackAd.accentColor }}
          >
            <span>{fallbackAd.ctaText}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  // Google AdSense confirmed loaded and filled with verified height
  return (
    <div
      ref={containerRef}
      className={`w-full overflow-hidden transition-all duration-300 my-4 animate-fadeIn ${className}`}
    >
      <div className="flex items-center justify-between px-1 mb-1 text-[10px] uppercase font-bold tracking-widest text-slate-400 select-none">
        <span>{label}</span>
      </div>

      <div
        className="w-full rounded-2xl bg-white/95 border border-slate-200/80 p-2 shadow-sm flex items-center justify-center overflow-hidden"
        style={style}
      >
        <ins
          key={adKey}
          ref={insRef}
          className="adsbygoogle w-full block"
          style={{ display: 'block', width: '100%', ...style }}
          data-ad-client={ADS_CONFIG.CLIENT_ID}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      </div>
    </div>
  );
};
