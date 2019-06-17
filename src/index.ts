import { Hermes, Done } from 'hermes-javascript'
import { config, i18n, logger } from 'snips-toolkit'
import handlers from './handlers'

// Enables deep printing of objects.
process.env.DEBUG_DEPTH = undefined

export default async function ({
    hermes,
    done
}: {
    hermes: Hermes,
    done: Done 
}) {
    try {
        const { name } = require('../package.json')
        logger.init(name)
        // Replace 'error' with '*' to log everything
        logger.enable('error')

        config.init()
        await i18n.init(config.get().locale)

        const dialog = hermes.dialog()

        // Subscribe to the app intents
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
    } catch (error) {
        // Output initialization errors to stderr and exit
        const message = await i18n.errorMessage(error)
        logger.error(message)
        logger.error(error)
        // Exit
        done()
    }
}