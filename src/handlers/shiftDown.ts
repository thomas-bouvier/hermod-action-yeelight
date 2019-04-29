import { Handler } from './index'
import { NluSlot, slotType } from 'hermes-javascript'
import { message, translation } from '../utils'
import { utils } from '../utils/yeelight'
import { Yeelight } from 'yeelight-node-binding'
import { DEFAULT_SHIFT_AMOUNT } from '../constants'
import { i18nFactory } from '../factories'

export const shiftDownHandler: Handler = async function (msg, flow) {
    const i18n = i18nFactory.get()
    let yeelights: Yeelight[]

    const percentageSlot: NluSlot<slotType.percentage> | null = message.getSlotsByName(msg, 'percent', {
        onlyMostConfident: true,
        threshold: 0.5
    })

    let shiftAmount: number

    if (percentageSlot) {
        // Getting the integer value
        shiftAmount = Math.abs(percentageSlot.value.value)
    } else {
        shiftAmount = DEFAULT_SHIFT_AMOUNT
    }

    const roomsSlot: NluSlot<slotType.custom>[] | null = message.getSlotsByName(msg, 'house_room', {
        threshold: 0.5
    })

    if (roomsSlot) {
        yeelights = utils.getLightsFromRoom(roomsSlot.map(x => x.value.value))
    } else {
        yeelights = utils.getAllLights(msg.siteId)
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
