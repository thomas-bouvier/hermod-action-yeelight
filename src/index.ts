import { Hermes, Done } from 'hermes-javascript'
import { config, i18n, logger } from 'snips-toolkit'
import handlers from './handlers'
import { yeeFactory } from './factories'

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

        yeeFactory.init()
        config.init()
        await i18n.init(config.get().locale)

        const dialog = hermes.dialog()

        const intentPrefix = config.get().intentPrefix

        // Subscribe to the app intents
        dialog.flows([
            {
                intent: `${ intentPrefix }:TurnOn`,
                action: handlers.turnOn
            },
            {
                intent: `${ intentPrefix }:TurnOff`,
                action: handlers.turnOff
            },
            {
                intent: `${ intentPrefix }:SetBrightness`,
                action: handlers.setBrightness
            },
            {
                intent: `${ intentPrefix }:ShiftDown`,
                action: handlers.shiftDown
            },
            {
                intent: `${ intentPrefix }:ShiftUp`,
                action: handlers.shiftUp
            },
            {
                intent: `${ intentPrefix }:SetColor`,
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