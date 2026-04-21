/**
 * Language utility functions
 */

/**
 * Maps language code to full language name
 * @param languageCode Two-letter language code (e.g. 'en', 'ja')
 * @returns Full language name (e.g. 'English', 'Japanese')
 */
export const getLanguageName = (languageCode: string): string => {
  const languageMap: { [key: string]: string } = {
    en: "English",
    ja: "Japanese",
    // Add more languages here as needed
  };

  return languageMap[languageCode.toLowerCase()] || "English";
};

// Default language if user preference is not available
export const DEFAULT_LANGUAGE = "en";
