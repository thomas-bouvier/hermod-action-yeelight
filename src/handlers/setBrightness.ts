import { NluSlot, slotType } from 'hermes-javascript/types'
import { translation } from '../utils'
import { utils } from '../utils/yeelight'
import { Yeelight } from 'yeelight-node-binding'
import { i18n, message, Handler } from 'snips-toolkit'
import { SLOT_CONFIDENCE_THRESHOLD } from '../constants'

export const setBrightnessHandler: Handler = async function (msg, flow) {
    let yeelights: Yeelight[]

    const percentageSlot: NluSlot<slotType.number> | null = message.getSlotsByName(msg, 'brightness', {
        onlyMostConfident: true,
        threshold: SLOT_CONFIDENCE_THRESHOLD
    })

    // We need this slot, so if the slot had a low confidence or was not mark as required,
    // we throw an error.
    if (!percentageSlot) {
        throw new Error('intentNotRecognized')
    }

    // Getting the integer value
    const newBrightness: number = Math.abs(percentageSlot.value.value)

    const roomsSlot: NluSlot<slotType.custom>[] | null = message.getSlotsByName(msg, 'room', {
        threshold: SLOT_CONFIDENCE_THRESHOLD
    })
    const allSlot: NluSlot<slotType.custom> | null = message.getSlotsByName(msg, 'all', {
        threshold: 0.25,
        onlyMostConfident: true
    })

    if (roomsSlot && roomsSlot.length > 0) {
        yeelights = utils.getLightsFromRooms(roomsSlot.map(x => x.value.value))
    } else {
        yeelights = utils.getAllLights(msg.siteId, allSlot !== null)
    }

    if (yeelights.length === 1) {
        const yeelight = yeelights[0]

        // Getting the current brightness
        const currentBrightness = await utils.getCurrentBrightness(yeelight)

        // Turn on the light if currently off
        let wasOff: boolean = false
        if (!(await utils.getCurrentStatus(yeelight))) {
            yeelight.set_power('on')
            wasOff = true
        }

        // Setting the brightness
        yeelight.set_bright(newBrightness)

        flow.end()
        return translation.setBrightnessToSpeech(currentBrightness, newBrightness, wasOff)
    } else {
        for (let yeelight of yeelights) {
            if (!(await utils.getCurrentStatus(yeelight))) {
                yeelight.set_power('on')
            }
    
            // Setting the brightness
            yeelight.set_bright(newBrightness)
        }

        flow.end()
        return i18n.translate('yeelight.setBrightness.all.updated', {
            percentage: newBrightness
        })
    }
}
