import { Handler } from './index'
import { yeeFactory } from '../factories'
import { NluSlot, slotType } from 'hermes-javascript'
import { message, translation } from '../utils'
import { utils } from '../utils/yeelight'

export const setBrightnessHandler: Handler = async function (msg, flow) {
    const yeelight = yeeFactory.get()

    const percentageSlot: NluSlot<slotType.percentage> | null = message.getSlotsByName(msg, 'percent', {
        onlyMostConfident: true,
        threshold: 0.5
    })

    // We need this slot, so if the slot had a low confidence or was not mark as required,
    // we throw an error.
    if (!percentageSlot) {
        throw new Error('intentNotRecognized')
    }

    // Getting the integer value
    const newBrightness: number = Math.abs(percentageSlot.value.value)

    // Getting the current brightness
    const currentBrightness = await utils.getCurrentBrightness(yeelight)

    // Turn on the light if currently off
    if (!(await utils.getCurrentStatus(yeelight))) {
        yeelight.set_power('on')
    }

    // Setting the brightness
    yeelight.set_bright(newBrightness)

    flow.end()
    return translation.setBrightness(currentBrightness, newBrightness)
}
