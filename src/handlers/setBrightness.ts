import { Handler } from './index'
import { yeeFactory, i18nFactory } from '../factories'
import { NluSlot, slotType } from 'yeelight-node-binding'
import { message } from '../utils'

async function getCurrentBrightness(yeelight): Promise<number> {
    const currentBrightness = JSON.parse(await yeelight.get_prop('bright'))

    if (currentBrightness.hasOwnProperty('result')) {
        return currentBrightness.result[0]
    }

    return 0
}

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
    const brightness: number = percentageSlot.value.value

    // Getting the current brightness
    const currentBrightness = await getCurrentBrightness(yeelight)

    // Setting the brightness
    yeelight.set_bright(brightness)

    flow.end()

    // Setting the right key accordingly
    let key = 'brightness.'

    if (brightness > currentBrightness) {
        key += 'increased'
    } else if (brightness < currentBrightness) {
        key += 'decreased'
    } else {
        key += 'same'
    }

    return i18n(key, {
        percentage: brightness
    })
}
