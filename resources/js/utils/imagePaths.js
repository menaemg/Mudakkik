/**
 * Shared utility for image path handling.
 * Use this instead of defining getImagePath inline in components.
 */

/**
 * Converts a storage path to a full URL.
 * Handles absolute URLs, relative storage paths, and null/undefined values.
 * 
 * @param {string|null} path - The image path to convert
 * @param {string} fallback - Fallback image to use if path is empty
 * @returns {string} The full image URL
 */
export const getImagePath = (path, fallback = '/assets/images/placeholder.webp') => {
    if (!path) return fallback;
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
};

/**
 * Safely parses a URL and returns the hostname.
 * Returns null if the URL is invalid or malformed.
 * 
 * @param {string} url - The URL to parse
 * @returns {string|null} The hostname or null if invalid
 */
export const safeHostname = (url) => {
    if (!url) return null;
    try {
        return new URL(url).hostname.replace('www.', '');
    } catch {
        return null;
    }
};

/**
 * Safely parses a URL and returns the domain for display.
 * Returns a fallback string if the URL is invalid.
 * 
 * @param {string} url - The URL to parse
 * @param {string} fallback - Fallback text if URL is invalid
 * @returns {string} The domain or fallback text
 */
export const getDomain = (url, fallback = 'Visit Site') => {
    const hostname = safeHostname(url);
    return hostname || fallback;
};
