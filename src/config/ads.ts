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

  // Google AdSense Ad Slot IDs
  // NOTE: Replace these empty strings with actual 10-digit Ad Unit IDs created in your Google AdSense Dashboard (https://adsense.google.com -> Ads -> By ad unit).
  // If left empty, Google AdSense will serve auto/responsive display ads for your publisher ID (ca-pub-4078466828008985).
  SLOTS: {
    TV_COMPANION_BANNER: '', // e.g. '9876543210'
    POPUP_INTERSTITIAL: '',
    IN_FEED_BANNER: '',
    RADIO_PREROLL: '',
    SIDEBAR_BANNER: '',
  },
} as const;
