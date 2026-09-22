import React, { useEffect, useState } from 'react';
import { Radio, Sparkles, Volume2, ShieldCheck } from 'lucide-react';
import { ADS_CONFIG } from '../../config/ads';
import { AdSenseBanner } from './AdSenseBanner';
import { Station } from '../../types';

interface RadioAdModalProps {
  isOpen: boolean;
  station: Station | null;
  onComplete: () => void;
}

export const RadioAdModal: React.FC<RadioAdModalProps> = ({ isOpen, station, onComplete }) => {
  const [countdown, setCountdown] = useState<number>(ADS_CONFIG.RADIO_AD_COUNTDOWN_SECONDS);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(ADS_CONFIG.RADIO_AD_COUNTDOWN_SECONDS);
      return;
    }

    setCountdown(ADS_CONFIG.RADIO_AD_COUNTDOWN_SECONDS);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, onComplete]);

  if (!isOpen || !station) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
        
        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-rba-blue to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rba-yellow animate-ping" />
            <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rba-yellow" />
              Radio Sponsor Message
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/20 text-xs font-extrabold text-rba-yellow">
            <span>Radio starts in <strong className="text-white text-sm ml-1 font-black">{countdown}s</strong></span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 text-center space-y-4">
          
          {/* Station Card Preview */}
          <div className="flex items-center justify-center gap-3 p-3 rounded-2xl bg-slate-100 border border-slate-200">
            <img
              src={station.logo_url || '/logo.png'}
              alt={station.name}
              className="w-10 h-10 object-contain rounded-lg shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logo.png';
              }}
            />
            <div className="text-left min-w-0 flex-1">
              <h4 className="font-extrabold text-sm text-slate-900 truncate">{station.name}</h4>
              <p className="text-xs font-medium text-slate-500">
                {station.frequency || 'Live Radio'} • Tune-in initializing...
              </p>
            </div>
            <div className="p-2 rounded-xl bg-rba-blue/10 text-rba-blue">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
          </div>

          {/* Forced Google Ad / Custom Sponsor Banner */}
          <div className="bg-slate-50 rounded-2xl p-2 border border-slate-200/90 shadow-inner min-h-[220px] flex flex-col justify-center items-center">
            <AdSenseBanner
              slot={ADS_CONFIG.SLOTS.RADIO_PREROLL}
              format="rectangle"
              responsive={true}
              minHeight="200px"
              label="Sponsored Radio Partner"
              fallbackSponsored={true}
            />
          </div>

          {/* Progress Bar & Status */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span className="flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
                Connecting to {station.name}...
              </span>
              <span className="text-rba-blue font-black">{countdown} seconds remaining</span>
            </div>

            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-rba-yellow via-amber-500 to-rba-blue transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${((10 - countdown) / 10) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[10px] font-semibold text-slate-400 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Radio audio will automatically un-mute once sponsor clip finishes</span>
          </div>

        </div>

      </div>
    </div>
  );
};
