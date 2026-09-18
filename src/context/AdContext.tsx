import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ADS_CONFIG } from '../config/ads';
import { usePlayer } from './PlayerContext';

interface AdContextType {
  isPopupOpen: boolean;
  tvWatchSeconds: number;
  triggerPopupNow: () => void;
  closePopup: () => void;
  isWatchingTv: boolean;
}

const AdContext = createContext<AdContextType | undefined>(undefined);

export const AdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isTvPlaying, activeTvStation } = usePlayer();
  const location = useLocation();

  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [tvWatchSeconds, setTvWatchSeconds] = useState<number>(0);

  // Check whether the user is actively watching TV:
  // Either isTvPlaying is true, or user is on a TV page with active TV stream
  const isWatchingTv =
    isTvPlaying ||
    (location.pathname === '/tv' && activeTvStation !== null) ||
    location.pathname.startsWith('/tv/');

  // Timer: Accumulate TV watch time every second when watching TV
  useEffect(() => {
    // If popup is already open, do not increment timer
    if (isPopupOpen) return;

    // Only count when TV is actively playing or watching TV
    if (!isWatchingTv) return;

    const interval = setInterval(() => {
      setTvWatchSeconds((prev) => {
        const next = prev + 1;
        if (next >= ADS_CONFIG.POPUP_INTERVAL_SECONDS) {
          setIsPopupOpen(true);
          return 0; // Reset counter for the next 15-minute cycle
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isWatchingTv, isPopupOpen]);

  const triggerPopupNow = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    // Reset watch timer so the next popup triggers in 15 minutes
    setTvWatchSeconds(0);
  };

  return (
    <AdContext.Provider
      value={{
        isPopupOpen,
        tvWatchSeconds,
        triggerPopupNow,
        closePopup,
        isWatchingTv,
      }}
    >
      {children}
    </AdContext.Provider>
  );
};

export const useAds = () => {
  const context = useContext(AdContext);
  if (!context) {
    throw new Error('useAds must be used within an AdProvider');
  }
  return context;
};
