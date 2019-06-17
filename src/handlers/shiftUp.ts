import { NluSlot, slotType } from 'hermes-javascript/types'
import { translation } from '../utils'
import { utils } from '../utils/yeelight'
import { Yeelight } from 'yeelight-node-binding'
import { i18n, message, Handler } from 'snips-toolkit'
import { DEFAULT_SHIFT_AMOUNT, SLOT_CONFIDENCE_THRESHOLD } from '../constants'

export const shiftUpHandler: Handler = async function (msg, flow) {
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

    if (roomsSlot && roomsSlot.length > 0) {
        yeelights = utils.getLightsFromRooms(roomsSlot.map(x => x.value.value))
    } else {
        yeelights = utils.getAllLights(msg.siteId, allSlot !== null)
    }

    if (yeelights.length === 1) {
        const yeelight = yeelights[0]

        // Turn on the light if currently off
        if (!(await utils.getCurrentStatus(yeelight))) {
            yeelight.set_power('on')

            // Setting the brightness
            yeelight.set_bright(shiftAmount)

            flow.end()
            return translation.shiftUpToSpeech(shiftAmount)
        } else {
            // Getting the current brightness
            const currentBrightness = await utils.getCurrentBrightness(yeelight)

            let newBrightness = currentBrightness + shiftAmount
            if (newBrightness > 100) {
                newBrightness = 100
            }

            // Setting the brightness
            yeelight.set_bright(newBrightness)

            flow.end()
            return translation.shiftUpToSpeech(shiftAmount, currentBrightness)
        }
    } else {
        for (let yeelight of yeelights)   {
            // Turn on the light if currently off
            if (!(await utils.getCurrentStatus(yeelight))) {
                yeelight.set_power('on')

                // Setting the brightness
                yeelight.set_bright(shiftAmount)
            } else {
                // Getting the current brightness
                const currentBrightness = await utils.getCurrentBrightness(yeelight)

                let newBrightness = currentBrightness + shiftAmount
                if (newBrightness > 100) {
                    newBrightness = 100
                }

                // Setting the brightness
                yeelight.set_bright(newBrightness)
            }
        }

        flow.end()
        return i18n.translate('yeelight.shiftUp.all.increased')
    }
}
