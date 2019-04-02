import { configFactory, i18nFactory, yeeFactory } from './factories'
import { LANGUAGE_MAPPINGS } from './constants'

// Put anything that needs to be called on app. startup here.
export default async function (bootstrapOptions: {[key: string]: any}) {
    configFactory.init(bootstrapOptions.config)
    const config = configFactory.get()
    const language = LANGUAGE_MAPPINGS[config.locale]
    await i18nFactory.init(language, bootstrapOptions.i18n)
    yeeFactory.init()
}
