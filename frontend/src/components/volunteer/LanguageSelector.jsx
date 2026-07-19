import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' }
];

export default function LanguageSelector({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selected = LANGUAGES.find(l => l.name === value) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        className="inline-flex items-center justify-center w-full rounded-md border border-white/10 bg-black/40 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Globe className="h-4 w-4 mr-2 text-gray-400" />
        <span className="mr-2">{selected.flag}</span>
        {selected.name}
        <ChevronDown className="h-4 w-4 ml-2 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-48 origin-top-right rounded-md bg-dash-card border border-white/10 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-slide-up">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                className={`w-full text-left flex items-center px-4 py-2 text-sm ${value === lang.name ? 'bg-blue-600/20 text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
                role="menuitem"
                onClick={() => {
                  onChange(lang.name);
                  setIsOpen(false);
                }}
              >
                <span className="mr-3">{lang.flag}</span>
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
