import { withHermes } from 'hermes-javascript'
import bootstrap from './bootstrap'
import handlers from './handlers'
import { translation, logger } from './utils'

// Initialize hermes
export default function ({
    hermesOptions = {},
    bootstrapOptions = {}
} = {}) : Promise<() => void>{
    return new Promise((resolve, reject) => {
        withHermes(async (hermes, done) => {
            try {
                // Bootstrap config, locale, i18n…
                await bootstrap(bootstrapOptions)

                const dialog = hermes.dialog()

                dialog.flows([
                    {
                        intent: 'turnOn',
                        action: handlers.turnOn
                    },
                    {
                        intent: 'turnOff',
                        action: handlers.turnOff
                    },
                    {
                        intent: 'setBrightness',
                        action: handlers.setBrightness
                    },
                    {
                        intent: 'shiftDown',
                        action: handlers.shiftDown
                    },
                    {
                        intent: 'shiftUp',
                        action: handlers.shiftUp
                    }
                ])
                resolve(done)
            } catch (error) {
                // Output initialization errors to stderr and exit
                const message = await translation.errorMessage(error)
                logger.error(message)
                logger.error(error)
                // Exit
                done()
                // Reject
                reject(error)
            }
        }, hermesOptions)
    })
}