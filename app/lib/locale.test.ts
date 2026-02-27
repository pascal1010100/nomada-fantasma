import { describe, it, expect } from 'vitest';
import {
  getLocaleFromRequest,
  isValidLocale,
  normalizeLocale,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
} from './locale';

describe('Locale', () => {
  describe('getLocaleFromRequest', () => {
    it('should detect locale from x-locale header', () => {
      const request = new Request('http://example.com/en/page', {
        headers: { 'x-locale': 'es' },
      });
      expect(getLocaleFromRequest(request)).toBe('es');
    });

    it('should prioritize x-locale over accept-language', () => {
      const request = new Request('http://example.com/es/page', {
        headers: {
          'x-locale': 'en',
          'accept-language': 'fr-FR,fr;q=0.9',
        },
      });
      expect(getLocaleFromRequest(request)).toBe('en');
    });

    it('should extract locale from accept-language', () => {
      const request = new Request('http://example.com/page', {
        headers: { 'accept-language': 'es-ES,es;q=0.9' },
      });
      expect(getLocaleFromRequest(request)).toBe('es');
    });

    it('should extract locale from URL path', () => {
      const request = new Request('http://example.com/en/page');
      expect(getLocaleFromRequest(request)).toBe('en');
    });

    it('should default to es when no locale detected', () => {
      const request = new Request('http://example.com/page', {
        headers: { 'accept-language': 'fr-FR' },
      });
      expect(getLocaleFromRequest(request)).toBe(DEFAULT_LOCALE);
    });

    it('should handle language-region format', () => {
      const request = new Request('http://example.com/page', {
        headers: { 'accept-language': 'en-US,en;q=0.9' },
      });
      expect(getLocaleFromRequest(request)).toBe('en');
    });

    it('should be case-insensitive', () => {
      const request = new Request('http://example.com/page', {
        headers: { 'x-locale': 'EN' },
      });
      expect(getLocaleFromRequest(request)).toBe('en');
    });
  });

  describe('isValidLocale', () => {
    it('should validate supported locales', () => {
      expect(isValidLocale('es')).toBe(true);
      expect(isValidLocale('en')).toBe(true);
    });

    it('should reject unsupported locales', () => {
      expect(isValidLocale('fr')).toBe(false);
      expect(isValidLocale('de')).toBe(false);
    });

    it('should handle uppercase', () => {
      expect(isValidLocale('ES')).toBe(false); // should be lowercase
    });
  });

  describe('normalizeLocale', () => {
    it('should normalize to lowercase', () => {
      expect(normalizeLocale('EN')).toBe('en');
      expect(normalizeLocale('ES')).toBe('es');
    });

    it('should strip region codes', () => {
      expect(normalizeLocale('en-US')).toBe('en');
      expect(normalizeLocale('es-MX')).toBe('es');
    });

    it('should default when unsupported', () => {
      expect(normalizeLocale('fr')).toBe(DEFAULT_LOCALE);
      expect(normalizeLocale('fr-FR')).toBe(DEFAULT_LOCALE);
    });

    it('should handle null and undefined', () => {
      expect(normalizeLocale(null)).toBe(DEFAULT_LOCALE);
      expect(normalizeLocale(undefined)).toBe(DEFAULT_LOCALE);
      expect(normalizeLocale('')).toBe(DEFAULT_LOCALE);
    });
  });

  describe('Constants', () => {
    it('should define SUPPORTED_LOCALES', () => {
      expect(SUPPORTED_LOCALES).toContain('es');
      expect(SUPPORTED_LOCALES).toContain('en');
      expect(SUPPORTED_LOCALES.length).toBeGreaterThan(0);
    });

    it('should have DEFAULT_LOCALE in SUPPORTED_LOCALES', () => {
      expect(SUPPORTED_LOCALES).toContain(DEFAULT_LOCALE);
    });
  });
});
