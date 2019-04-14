import { Handler } from './index'
import { yeeFactory } from '../factories'
import { NluSlot, slotType } from 'hermes-javascript'
import { message, translation } from '../utils'
import { utils } from '../utils/yeelight'
import { DEFAULT_SHIFT_AMOUNT } from '../constants'

export const shiftUpHandler: Handler = async function (msg, flow) {
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

    let newBrightness = currentBrightness + shiftAmount
    if (newBrightness > 100) {
        newBrightness = 100
    }

    // Setting the brightness
    yeelight.set_bright(newBrightness)

    flow.end()
    return translation.shiftUp(currentBrightness, newBrightness, shiftAmount)
}
