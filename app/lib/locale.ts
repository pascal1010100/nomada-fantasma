/**
 * Locale detection utilities
 * 
 * Centralized logic for detecting and validating locale from requests.
 * Supports multiple detection methods: URL path, headers, and Accept-Language.
 */

export type SupportedLocale = 'es' | 'en';
export const SUPPORTED_LOCALES: readonly SupportedLocale[] = ['es', 'en'] as const;
export const DEFAULT_LOCALE: SupportedLocale = 'es';

/**
 * Detects locale from a Request object using multiple strategies:
 * 1. x-locale header (highest priority)
 * 2. Accept-Language header
 * 3. URL pathname (first segment after /)
 * 4. Default to 'es'
 * 
 * @param request - The incoming Request object
 * @returns A valid supported locale
 */
export function getLocaleFromRequest(request: Request): SupportedLocale {
    const url = new URL(request.url);
    const urlLocale = url.pathname.split('/')[1];
    const headerLocale = request.headers.get('x-locale');
    const acceptLanguage = request.headers.get('accept-language');
    
    // Priority: header > accept-language > url > default
    const candidateLocale = headerLocale || acceptLanguage?.split(',')[0] || urlLocale || DEFAULT_LOCALE;
    const localeToken = candidateLocale.split('-')[0].toLowerCase();
    
    // Validate against supported locales
    if (SUPPORTED_LOCALES.includes(localeToken as SupportedLocale)) {
        return localeToken as SupportedLocale;
    }
    
    return DEFAULT_LOCALE;
}

/**
 * Validates if a string is a supported locale
 * 
 * @param locale - The locale string to validate
 * @returns True if the locale is supported
 */
export function isValidLocale(locale: string): locale is SupportedLocale {
    return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

/**
 * Normalizes a locale string to a supported locale
 * 
 * @param locale - The locale string to normalize
 * @returns A valid supported locale
 */
export function normalizeLocale(locale: string | null | undefined): SupportedLocale {
    if (!locale) return DEFAULT_LOCALE;
    
    const normalized = locale.split('-')[0].toLowerCase();
    return isValidLocale(normalized) ? normalized : DEFAULT_LOCALE;
}
