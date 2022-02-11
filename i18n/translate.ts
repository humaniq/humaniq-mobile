import i18n from "i18n-js"

/**
 * Translates text.
 *
 * @param key The i18n key.
 * @param options Translate options
 */
export function t(key, options?: i18n.TranslateOptions) {
  return key ? i18n.t(key, options) : null
}