import { Handler } from './index'
import { NluSlot, slotType } from 'hermes-javascript'
import { message, translation } from '../utils'
import { utils } from '../utils/yeelight'
import { Yeelight } from 'yeelight-node-binding'
import { i18nFactory } from '../factories'

export const setBrightnessHandler: Handler = async function (msg, flow) {
    const i18n = i18nFactory.get()
    let yeelights: Yeelight[]

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
        return i18n('yeelight.setBrightness.all.updated', {
            percentage: newBrightness
        })
    }
}
