import { Handler } from './index'
import { yeeFactory } from '../factories'
import { NluSlot, slotType } from 'hermes-javascript'
import { message, translation } from '../utils'
import { COLORS } from '../constants'

export const setColorHandler: Handler = async function (msg, flow) {
    const yeelight = yeeFactory.get()

    const colorSlot: NluSlot<slotType.custom> | null = message.getSlotsByName(msg, 'color', {
        onlyMostConfident: true,
        threshold: 0.5
    })

    // We need this slot, so if the slot had a low confidence or was not mark as required,
    // we throw an error.
    if (!colorSlot) {
        throw new Error('intentNotRecognized')
    }

    // Getting the integer value
    const color: string = colorSlot.value.value

    if (!COLORS[color]) {
        throw new Error('unknownColor')
    }

    // Setting the color
    yeelight.set_rgb(COLORS[color].rgb)

    flow.end()
    return translation.setColor(color)
}
