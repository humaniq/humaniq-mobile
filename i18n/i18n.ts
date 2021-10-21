import * as Localization from "react-native-localize"
import i18n from "i18n-js"
import en from "./en.json"
import ru from "./ru.json"
import dayjs from "dayjs";
import 'dayjs/locale/en'
import 'dayjs/locale/ru'

i18n.fallbacks = true
i18n.translations = { en, ru }

i18n.locale = Localization.getCountry().toLowerCase() || "en"
dayjs.locale(Localization.getCountry().toLowerCase() || "en")
/**
 * Builds up valid keypaths for translations.
 * Update to your default locale of choice if not English.
 */
// type DefaultLocale = typeof en
// export type TxKeyPath = RecursiveKeyOf<DefaultLocale>

// type RecursiveKeyOf<TObj extends Record<string, any>> = {
//   [TKey in keyof TObj & string]: TObj[TKey] extends Record<string, any>
//     ? `${TKey}` | `${TKey}.${RecursiveKeyOf<TObj[TKey]>}`
//     : `${TKey}`
// }[keyof TObj & string]
