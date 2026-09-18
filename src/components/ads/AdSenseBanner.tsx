import React, { useEffect, useRef, useState } from 'react';
import { ADS_CONFIG } from '../../config/ads';

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
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  slot = ADS_CONFIG.SLOTS.TV_COMPANION_BANNER,
  format = 'auto',
  responsive = true,
  className = '',
  style,
  refreshInterval = 0,
}) => {
  const [adKey, setAdKey] = useState<number>(0);
  const [isAdFilled, setIsAdFilled] = useState<boolean>(false);
  const insRef = useRef<HTMLModElement | null>(null);

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
          // Silent catch for ad blocker or dev environment
        }
      }, 100);
    } catch (e) {
      // Ignore
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [adKey]);

  // Monitor the ins element via MutationObserver:
  // Only show the ad container when Google AdSense has actually filled and loaded an ad!
  useEffect(() => {
    const insElement = insRef.current;
    if (!insElement) return;

    const checkFilledStatus = () => {
      const status = insElement.getAttribute('data-ad-status');
      const hasIframe = insElement.querySelector('iframe') !== null;
      const hasContent = insElement.children.length > 0;

      if (status === 'filled' || (hasIframe && hasContent)) {
        setIsAdFilled(true);
      } else if (status === 'unfilled') {
        setIsAdFilled(false);
      }
    };

    // Initial check
    checkFilledStatus();

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

    return () => observer.disconnect();
  }, [adKey]);

  // Periodic Refresh without interrupting playback
  useEffect(() => {
    if (!refreshInterval || refreshInterval <= 0) return;

    const interval = setInterval(() => {
      setIsAdFilled(false);
      setAdKey((prev) => prev + 1);
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  return (
    // Only takes up space and displays when an ad is confirmed filled by Google
    <div
      className={`w-full overflow-hidden transition-all duration-300 ${
        isAdFilled ? `my-3 ${className}` : 'hidden h-0 p-0 m-0 border-0'
      }`}
      style={{ display: isAdFilled ? 'block' : 'none' }}
    >
      <div className="flex items-center justify-between px-1 mb-1 text-[10px] uppercase font-bold tracking-widest text-slate-400 select-none">
        <span>Advertisement</span>
      </div>

      <div
        className="w-full rounded-2xl bg-white/90 border border-slate-200/80 p-2 shadow-sm flex items-center justify-center overflow-hidden"
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
