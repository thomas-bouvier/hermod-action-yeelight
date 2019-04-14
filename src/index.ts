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
                        intent: 'Superuser:TurnOn',
                        action: handlers.turnOn
                    },
                    {
                        intent: 'Superuser:TurnOff',
                        action: handlers.turnOff
                    },
                    {
                        intent: 'Superuser:SetBrightness',
                        action: handlers.setBrightness
                    },
                    {
                        intent: 'Superuser:ShiftDown',
                        action: handlers.shiftDown
                    },
                    {
                        intent: 'Superuser:ShiftUp',
                        action: handlers.shiftUp
                    },
                    {
                        intent: 'Superuser:SetColor',
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