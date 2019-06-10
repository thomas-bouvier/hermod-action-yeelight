import { Handler } from './index'
import { NluSlot, slotType } from 'hermes-javascript'
import { message, translation } from '../utils'
import { utils } from '../utils/yeelight'
import { Yeelight } from 'yeelight-node-binding'
import { DEFAULT_SHIFT_AMOUNT, SLOT_CONFIDENCE_THRESHOLD } from '../constants'
import { i18nFactory } from '../factories'

export const shiftDownHandler: Handler = async function (msg, flow) {
    const i18n = i18nFactory.get()
    let yeelights: Yeelight[]

    const percentageSlot: NluSlot<slotType.number> | null = message.getSlotsByName(msg, 'brightness', {
        onlyMostConfident: true,
        threshold: SLOT_CONFIDENCE_THRESHOLD
    })

    let shiftAmount: number

    if (percentageSlot) {
        // Getting the integer value
        shiftAmount = Math.abs(percentageSlot.value.value)
    } else {
        shiftAmount = DEFAULT_SHIFT_AMOUNT
    }

    const roomsSlot: NluSlot<slotType.custom>[] | null = message.getSlotsByName(msg, 'room', {
        threshold: SLOT_CONFIDENCE_THRESHOLD
    })
    const allSlot: NluSlot<slotType.custom> | null = message.getSlotsByName(msg, 'all', {
        threshold: 0.25,
        onlyMostConfident: true
    })

    if (roomsSlot &&roomsSlot.length > 0) {
        yeelights = utils.getLightsFromRooms(roomsSlot.map(x => x.value.value))
    } else {
        yeelights = utils.getAllLights(msg.siteId, allSlot !== null)
    }

    if (yeelights.length === 1) {
        const yeelight = yeelights[0]

        if (!(await utils.getCurrentStatus(yeelight))) {
            flow.end()
            return i18n('yeelight.dialog.single.off')
        }

        // Getting the current brightness
        const currentBrightness = await utils.getCurrentBrightness(yeelight)

        let newBrightness = currentBrightness - shiftAmount
        if (newBrightness < 1) {
            newBrightness = 1
        }
    
        // Setting the brightness
        yeelight.set_bright(newBrightness)
    
        flow.end()
        return translation.shiftDownToSpeech(currentBrightness, shiftAmount)
    } else {
        for (let yeelight of yeelights) {
            // Getting the current brightness
            const currentBrightness = await utils.getCurrentBrightness(yeelight)

            let newBrightness = currentBrightness - shiftAmount
            if (newBrightness < 1) {
                newBrightness = 1
            }

            // Setting the brightness
            yeelight.set_bright(newBrightness)
        }

        flow.end()
        return i18n('yeelight.shiftDown.all.decreased')
    }
}
