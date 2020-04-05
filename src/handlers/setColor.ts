import { NluSlot, slotType } from 'hermes-protocol/types'
import { translation } from '../utils'
import { utils } from '../utils/yeelight'
import { Yeelight } from 'yeelight-node'
import { i18n, message, Handler } from 'hermod-toolkit'
import { COLORS, SLOT_CONFIDENCE_THRESHOLD } from '../constants'

export const setColorHandler: Handler = async function (msg, flow) {
    let yeelights: Yeelight[]

    const colorSlot: NluSlot<slotType.custom> | null = message.getSlotsByName(msg, 'color', {
        onlyMostConfident: true,
        threshold: SLOT_CONFIDENCE_THRESHOLD
    })

    // We need this slot, so if the slot had a low confidence or was not mark as required,
    // we throw an error.
    if (!colorSlot) {
        throw new Error('intentNotRecognized')
    }

    // Getting the integer value
    const color: string = colorSlot.value.value

    if (!COLORS[color]) {
        flow.end()
        return i18n.translate('dialog.unknownColor')
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
        }

        // Setting the color
        yeelight.set_rgb(COLORS[color].rgb)

        flow.end()
        return translation.setColorToSpeech(color)
    } else {
        for (let yeelight of yeelights)  {
            if (!(await utils.getCurrentStatus(yeelight))) {
                yeelight.set_power('on')
            }
    
            // Setting the color
            yeelight.set_rgb(COLORS[color].rgb)
        }

        flow.end()
        return i18n.translate('yeelight.setColor.all.updated', {
            color: i18n.translate('colors.' + color)
        })
    }
}
