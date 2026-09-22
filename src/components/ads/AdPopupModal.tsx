import React, { useEffect, useState, useRef } from 'react';
import { X, Clock, Sparkles, Volume2, ShieldCheck } from 'lucide-react';
import { ADS_CONFIG } from '../../config/ads';
import { useAds } from '../../context/AdContext';
import { AdSenseBanner } from './AdSenseBanner';

interface AdPopupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdPopupModal: React.FC<AdPopupModalProps> = ({ isOpen, onClose }) => {
  const { adSettings } = useAds();

  const initialSeconds = adSettings.tv_ad_countdown_seconds || ADS_CONFIG.TV_AD_COUNTDOWN_SECONDS || 10;

  const [countdown, setCountdown] = useState<number>(initialSeconds);
  const [isAdLoaded, setIsAdLoaded] = useState<boolean>(false);
  const timerStartedRef = useRef<boolean>(false);

  // Reset when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setCountdown(initialSeconds);
      setIsAdLoaded(false);
      timerStartedRef.current = false;
      return;
    }

    setCountdown(initialSeconds);
    setIsAdLoaded(false);
    timerStartedRef.current = false;

    // Safety fallback: if Google AdSense or ad blocker takes more than 2.5s, start timer anyway
    const fallbackTimer = setTimeout(() => {
      setIsAdLoaded(true);
    }, 2500);

    return () => clearTimeout(fallbackTimer);
  }, [isOpen, initialSeconds]);

  // Start countdown ticking ONLY after ad is loaded
  useEffect(() => {
    if (!isOpen || !isAdLoaded || timerStartedRef.current) return;

    timerStartedRef.current = true;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isAdLoaded]);

  if (!isOpen) return null;

  const canClose = countdown === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-lg max-h-[88vh] bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-700 flex flex-col overflow-hidden animate-scaleUp">
        
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-rba-navy via-slate-900 to-rba-navy text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rba-yellow" />
              Google AdSense Broadcast
            </span>
          </div>

          {/* Top Close / Countdown Button */}
          <div className="flex items-center gap-2">
            {!isAdLoaded ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300">
                <div className="w-3 h-3 border-2 border-rba-yellow border-t-transparent rounded-full animate-spin" />
                <span>Loading Ad...</span>
              </div>
            ) : !canClose ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-rba-yellow/40 text-xs font-black text-rba-yellow backdrop-blur-sm">
                <Clock className="w-3.5 h-3.5 animate-pulse" />
                <span>Skip in {countdown}s</span>
              </div>
            ) : (
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-lg transition-transform hover:scale-105 active:scale-95 border border-red-400"
                aria-label="Skip Ad Now"
              >
                <X className="w-4 h-4 stroke-[3]" />
                <span>SKIP AD NOW</span>
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-semibold bg-slate-800/60 py-1.5 px-3 rounded-xl border border-slate-700/50">
            <Volume2 className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="truncate">Live stream is playing smoothly in background</span>
          </div>

          {/* Forced Google AdSense Display */}
          <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800 shadow-inner flex flex-col items-center justify-center min-h-[260px] relative">
            {!isAdLoaded && (
              <div className="absolute inset-0 z-10 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center space-y-3 p-4 text-center">
                <div className="w-8 h-8 border-4 border-rba-yellow border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-bold text-slate-300">Serving Google AdSense advertisement...</p>
              </div>
            )}

            <AdSenseBanner
              slot={ADS_CONFIG.SLOTS.POPUP_INTERSTITIAL}
              format="rectangle"
              responsive={true}
              minHeight="250px"
              label="Google AdSense Partner"
              forceDisplayMode="GOOGLE"
              onAdLoaded={() => setIsAdLoaded(true)}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Benix Space TV Verified Network
            </span>
            <span>Worldwide Delivery</span>
          </div>
        </div>

        {/* Fixed Bottom Action Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-slate-400 font-bold hidden sm:block">
            {!isAdLoaded ? 'Preparing ad...' : !canClose ? `Skip available in ${countdown}s` : 'Ad complete'}
          </span>

          <button
            onClick={canClose ? onClose : undefined}
            disabled={!canClose}
            className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 ${
              canClose
                ? 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-xl cursor-pointer hover:scale-102 active:scale-98 border border-amber-400/40'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            {canClose ? (
              <>
                <X className="w-4 h-4 stroke-[3]" />
                <span>CLOSE AD & WATCH TV</span>
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Please wait {countdown}s...</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
