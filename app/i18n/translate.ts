import i18n from "i18n-js"

export const t = (key, options?: i18n.TranslateOptions) => {
  return i18n.t(key, options)
}

export enum LocaleCode {
  English = 'en',
  French = 'fr',
  German = 'de',
  Lithuanian = 'lt',
  Polish = 'pl',
  Portuguese = 'pt',
  Russian = 'ru',
  Spanish = 'es',
  Italian = 'it'
}
