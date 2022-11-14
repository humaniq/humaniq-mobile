import i18n from "i18n-js"
import de from "./translations/de.json"
import en from "./translations/en.json"
import es from "./translations/es.json"
import fr from "./translations/fr.json"
import it from "./translations/it.json"
import lt from "./translations/lt.json"
import pl from "./translations/pl.json"
import pt from "./translations/pt.json"
import ru from "./translations/ru.json"
import dayjs from "dayjs"
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(localizedFormat)

i18n.fallbacks = true
i18n.translations = { en, de, es, fr, it, lt, pl, pt, ru }
// Accepts `{{placeholder}}` and `{placeholder}`.
i18n.placeholder = new RegExp(/(?:\{\{|\{)(.*?)(?:\}\}?)/gm)
