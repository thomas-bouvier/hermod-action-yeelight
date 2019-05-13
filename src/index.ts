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
                        intent: 'thomas-bouvier:TurnOn',
                        action: handlers.turnOn
                    },
                    {
                        intent: 'thomas-bouvier:TurnOff',
                        action: handlers.turnOff
                    },
                    {
                        intent: 'thomas-bouvier:SetBrightness',
                        action: handlers.setBrightness
                    },
                    {
                        intent: 'thomas-bouvier:ShiftDown',
                        action: handlers.shiftDown
                    },
                    {
                        intent: 'thomas-bouvier:ShiftUp',
                        action: handlers.shiftUp
                    },
                    {
                        intent: 'thomas-bouvier:SetColor',
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