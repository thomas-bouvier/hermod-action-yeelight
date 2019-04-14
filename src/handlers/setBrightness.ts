import { Handler } from './index'
import { yeeFactory, i18nFactory } from '../factories'
import { NluSlot, slotType } from 'hermes-javascript'
import { message } from '../utils'
import { utils } from '../utils/yeelight'

export const setBrightnessHandler: Handler = async function (msg, flow) {
    const i18n = i18nFactory.get()
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
    const brightness: number = Math.abs(percentageSlot.value.value)

    // Getting the current brightness
    const currentBrightness = await utils.getCurrentBrightness(yeelight)

    // Setting the brightness
    yeelight.set_bright(brightness)

    // Setting the right key accordingly
    let key = 'yeelight.setBrightness.'

    if (brightness > currentBrightness) {
        key += 'increased'
    } else if (brightness < currentBrightness) {
        key += 'decreased'
    } else {
        key += 'same'
    }

    flow.end()
    return i18n(key, {
        percentage: brightness
    })
}
