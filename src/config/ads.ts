/**
 * Google AdSense Configuration for Benix Space TV
 */

export const ADS_CONFIG = {
  // Google AdSense Publisher ID
  CLIENT_ID: 'ca-pub-4078466828008985',

  // Direct WhatsApp contact for advertisers (+250783987223)
  WHATSAPP_NUMBER: '+250783987223',

  // Default number of Google AdSense ads before showing 1 Custom Ad
  GOOGLE_ADS_PER_CUSTOM_AD: 2,

  // Radio Ad pre-roll settings (4-minute throttle, 10-second countdown)
  RADIO_AD_INTERVAL_SECONDS: 240, // 4 minutes
  RADIO_AD_COUNTDOWN_SECONDS: 10, // 10 seconds countdown

  // Periodic TV Companion Ad Refresh interval (in seconds): 2.5 minutes (150s)
  TV_BANNER_REFRESH_SECONDS: 150,

  // TV Interstitial popup settings (Initial 1-min delay, 5-min repeat interval, 10s countdown)
  TV_AD_INITIAL_DELAY_SECONDS: 60, // 1 minute initial delay
  TV_AD_INTERVAL_SECONDS: 300, // 5 minutes repeat interval
  TV_AD_COUNTDOWN_SECONDS: 10, // 10 seconds ad watch timer

  // Legacy fallback interval for general popup
  POPUP_INTERVAL_SECONDS: 300,
  POPUP_COUNTDOWN_SECONDS: 10,

  // Ad slot IDs (Optional customizable slot IDs)
  SLOTS: {
    TV_COMPANION_BANNER: '1234567890',
    POPUP_INTERSTITIAL: '2345678901',
    IN_FEED_BANNER: '3456789012',
    RADIO_PREROLL: '4567890123',
    SIDEBAR_BANNER: '5678901234',
  },
} as const;
