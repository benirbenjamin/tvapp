import React from 'react';
import { Link } from 'react-router-dom';
import { Radio, Tv, Phone, Mail, MapPin, ExternalLink, Globe } from 'lucide-react';
import { useAds } from '../../context/AdContext';
import { useSettings } from '../../context/SettingsContext';

export const Footer: React.FC = () => {
  const { triggerPopupNow, tvWatchSeconds, isWatchingTv } = useAds();
  const { settings } = useSettings();
  return (
    <footer className="bg-rba-dark text-slate-300 border-t border-rba-navyLight pt-14 pb-28 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: About Platform */}
          <div className="space-y-4">
            <Link to="/">
              <img
                src={settings.logo_url || '/logo.png'}
                alt={settings.site_name || 'Rwanda Broadcasting Agency'}
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.png';
                }}
              />
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              {settings.site_description || 'Rwanda Broadcasting Agency (RBA) is Rwanda’s public service multimedia broadcaster, providing quality news, education, and entertainment across television, radio, and digital streaming platforms nationwide and worldwide.'}
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-bold text-rba-yellow">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Hafi Yawe
              </span>
              <span>•</span>
              <span>Close To You</span>
            </div>

            {/* Social Links */}
            <div className="pt-2 flex items-center gap-3">
              {settings.twitter_url && (
                <a
                  href={settings.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter / X"
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-rba-blue hover:text-white flex items-center justify-center text-slate-300 transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              )}
              {settings.youtube_url && (
                <a
                  href={settings.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-red-600 hover:text-white flex items-center justify-center text-slate-300 transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              )}
              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-blue-600 hover:text-white flex items-center justify-center text-slate-300 transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              )}
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-pink-600 hover:text-white flex items-center justify-center text-slate-300 transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Radio Network Frequencies */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-4 h-4 text-rba-yellow" />
              RBA Radio Stations
            </h4>
            <ul className="text-xs space-y-2 text-slate-400">
              <li>
                <Link to="/radio/radio-rwanda" className="hover:text-white transition-colors flex justify-between">
                  <span>Radio Rwanda</span> <span className="font-semibold text-slate-200">100.7 FM</span>
                </Link>
              </li>
              <li>
                <Link to="/radio/magic-fm" className="hover:text-white transition-colors flex justify-between">
                  <span>Magic FM</span> <span className="font-semibold text-slate-200">90.7 FM</span>
                </Link>
              </li>
              <li>
                <Link to="/radio/radio-rubavu" className="hover:text-white transition-colors flex justify-between">
                  <span>Radio Rubavu</span> <span className="font-semibold text-slate-200">105.1 FM</span>
                </Link>
              </li>
              <li>
                <Link to="/radio/radio-nyagatare" className="hover:text-white transition-colors flex justify-between">
                  <span>Radio Nyagatare</span> <span className="font-semibold text-slate-200">96.6 FM</span>
                </Link>
              </li>
              <li>
                <Link to="/radio/radio-inteko" className="hover:text-white transition-colors flex justify-between">
                  <span>Radio Inteko</span> <span className="font-semibold text-slate-200">89.6 FM</span>
                </Link>
              </li>
              <li>
                <Link to="/radio/radio-huye" className="hover:text-white transition-colors flex justify-between">
                  <span>Radio Huye</span> <span className="font-semibold text-slate-200">100.4 FM</span>
                </Link>
              </li>
              <li>
                <Link to="/radio/radio-musanze" className="hover:text-white transition-colors flex justify-between">
                  <span>Radio Musanze</span> <span className="font-semibold text-slate-200">90.0 FM</span>
                </Link>
              </li>
              <li>
                <Link to="/radio/radio-rusizi" className="hover:text-white transition-colors flex justify-between">
                  <span>Radio Rusizi</span> <span className="font-semibold text-slate-200">93.3 FM</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links & TV */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Tv className="w-4 h-4 text-rba-blue" />
              Television & Programs
            </h4>
            <ul className="text-xs space-y-2.5 text-slate-400">
              <li>
                <Link to="/tv" className="hover:text-white transition-colors">
                  RTV Live Streaming
                </Link>
              </li>
              <li>
                <Link to="/tv" className="hover:text-white transition-colors">
                  KC2 Youth & Sports TV
                </Link>
              </li>
              <li>
                <Link to="/tv" className="hover:text-white transition-colors">
                  Latest News Bulletins
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Rwanda Broadcasting Agency
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Broadcasting Center & Studios
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy & Data Security
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & App Downloads */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Get in Touch
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              {settings.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-rba-blue shrink-0 mt-0.5" />
                  <span>{settings.address}</span>
                </div>
              )}
              {settings.contact_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-rba-yellow shrink-0" />
                  <a href={`tel:${settings.contact_phone.split('/')[0].trim()}`} className="hover:text-white transition-colors">
                    {settings.contact_phone}
                  </a>
                </div>
              )}
              {settings.contact_email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-rba-blue shrink-0" />
                  <a href={`mailto:${settings.contact_email}`} className="hover:text-white transition-colors">
                    {settings.contact_email}
                  </a>
                </div>
              )}
            </div>

            {/* Mobile / Audio App Links */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-400 block mb-2 uppercase tracking-wider">
                Listen On Mobile Apps
              </span>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-semibold hover:bg-white/15 cursor-default">
                  App Store
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-semibold hover:bg-white/15 cursor-default">
                  Google Play
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-semibold hover:bg-white/15 cursor-default">
                  TuneIn Radio
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-4 flex-wrap">
            <p>{settings.footer_text || `© ${new Date().getFullYear()} ${settings.site_name || 'Rwanda Broadcasting Agency (RBA)'}. All rights reserved.`}</p>
            {import.meta.env.DEV && (
              <button
                onClick={triggerPopupNow}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold underline flex items-center gap-1 transition-colors"
                title="Preview the 15-minute AdSense popup modal and 10s countdown timer immediately"
              >
                ⚡ Test 15-min Ad Popup ({Math.floor(tvWatchSeconds / 60)}m {tvWatchSeconds % 60}s {isWatchingTv ? '• TV Active' : ''})
              </button>
            )}
          </div>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link to="/about" className="hover:text-slate-300 transition-colors">About Us</Link>
            <Link to="/contact" className="hover:text-slate-300 transition-colors">Contact</Link>
            <Link to="/admin/login" className="hover:text-slate-300 transition-colors">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
