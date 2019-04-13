import { Handler } from './index'
import { yeeFactory, i18nFactory } from '../factories'
import { NluSlot, slotType } from 'yeelight-node-binding'
import { message, translation } from '../utils'
import { utils } from '../utils/yeelight'
import { DEFAULT_SHIFT_AMOUNT } from '../constants'

export const shiftDownHandler: Handler = async function (msg, flow) {
    const i18n = i18nFactory.get()
    const yeelight = yeeFactory.get()

    const percentageSlot: NluSlot<slotType.percentage> | null = message.getSlotsByName(msg, 'percent', {
        onlyMostConfident: true,
        threshold: 0.5
    })

    // Getting the current brightness
    const currentBrightness = await utils.getCurrentBrightness(yeelight)

    let shiftAmount: number

    if (percentageSlot) {
        // Getting the integer value
        shiftAmount = Math.abs(percentageSlot.value.value)

    } else {
        shiftAmount = DEFAULT_SHIFT_AMOUNT
    }

    let newBrightness = currentBrightness - shiftAmount
    if (newBrightness < 1) {
        newBrightness = 1
    }

    // Setting the brightness
    yeelight.set_bright(newBrightness)

    flow.end()
    return translation.shiftDown(currentBrightness, newBrightness, shiftAmount)
}
