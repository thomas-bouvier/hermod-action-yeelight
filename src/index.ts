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
                        intent: 'Superuser:turnOn',
                        action: handlers.turnOn
                    },
                    {
                        intent: 'Superuser:turnOff',
                        action: handlers.turnOff
                    },
                    {
                        intent: 'Superuser:setBrightness',
                        action: handlers.setBrightness
                    },
                    {
                        intent: 'Superuser:shiftDown',
                        action: handlers.shiftDown
                    },
                    {
                        intent: 'Superuser:shiftUp',
                        action: handlers.shiftUp
                    },
                    {
                        intent: 'Superuser:setColor',
                        action: handlers.setColor
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