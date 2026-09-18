import React, { useEffect, useState } from 'react';
import { X, Clock, Sparkles, Volume2 } from 'lucide-react';
import { ADS_CONFIG } from '../../config/ads';
import { AdSenseBanner } from './AdSenseBanner';

interface AdPopupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdPopupModal: React.FC<AdPopupModalProps> = ({ isOpen, onClose }) => {
  const [countdown, setCountdown] = useState<number>(ADS_CONFIG.POPUP_COUNTDOWN_SECONDS);

  // When modal opens, reset countdown to 10 seconds and start ticking down
  useEffect(() => {
    if (!isOpen) {
      setCountdown(ADS_CONFIG.POPUP_COUNTDOWN_SECONDS);
      return;
    }

    setCountdown(ADS_CONFIG.POPUP_COUNTDOWN_SECONDS);

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
  }, [isOpen]);

  if (!isOpen) return null;

  const canClose = countdown === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
        
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-rba-navy to-rba-navyLight text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rba-yellow" />
              Advertisement
            </span>
          </div>

          {/* 10-Second Counter & Close Button */}
          <div className="flex items-center gap-2">
            {!canClose ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/20 text-xs font-bold text-rba-yellow backdrop-blur-sm">
                <Clock className="w-3.5 h-3.5 animate-pulse" />
                <span>Close in {countdown}s</span>
              </div>
            ) : (
              <button
                onClick={onClose}
                className="flex items-center gap-1 px-3.5 py-1 rounded-full bg-rba-yellow hover:bg-amber-400 text-rba-dark font-extrabold text-xs shadow-lg transition-all hover:scale-105 active:scale-95"
                aria-label="Close Advertisement"
              >
                <X className="w-3.5 h-3.5 stroke-[3]" />
                <span>Close Ad</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 text-center space-y-4">
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium">
            <Volume2 className="w-3.5 h-3.5 text-rba-blue" />
            <span>TV broadcast is continuing in the background</span>
          </div>

          {/* AdSense Unit */}
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/90 shadow-inner flex flex-col items-center justify-center min-h-[280px]">
            <AdSenseBanner
              slot={ADS_CONFIG.SLOTS.POPUP_INTERSTITIAL}
              format="rectangle"
              responsive={true}
              minHeight="250px"
              label="Sponsored Partner"
            />
          </div>

          {/* Bottom Notice & Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <span>RBA Rwanda • Streaming Partner Network</span>

            <button
              onClick={canClose ? onClose : undefined}
              disabled={!canClose}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                canClose
                  ? 'bg-rba-blue hover:bg-rba-navy text-white shadow-md cursor-pointer hover:scale-102'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {canClose ? (
                <>
                  <X className="w-4 h-4" />
                  <span>Continue Watching TV</span>
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Please wait {countdown} seconds...</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
