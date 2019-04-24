import { Handler } from './index'
import { NluSlot, slotType } from 'hermes-javascript'
import { message, translation } from '../utils'
import { COLORS } from '../constants'
import { utils } from '../utils/yeelight'
import { Yeelight } from 'yeelight-node-binding'

export const setColorHandler: Handler = async function (msg, flow) {
    let yeelights: Yeelight[]

    const colorSlot: NluSlot<slotType.custom> | null = message.getSlotsByName(msg, 'color', {
        onlyMostConfident: true,
        threshold: 0.5
    })

    // We need this slot, so if the slot had a low confidence or was not mark as required,
    // we throw an error.
    if (!colorSlot) {
        throw new Error('intentNotRecognized')
    }

    // Getting the integer value
    const color: string = colorSlot.value.value

    if (!COLORS[color]) {
        throw new Error('unknownColor')
    }

    const roomsSlot: NluSlot<slotType.custom> | null = message.getSlotsByName(msg, 'house_room', {
        onlyMostConfident: true,
        threshold: 0.5
    })

    if (roomsSlot) {
        yeelights = utils.getLightsFromRoom(roomsSlot.value.value)
    } else {
        yeelights = utils.getAllLights()
    }

    for (let yeelight of yeelights) {
        // Turn on the light if currently off
        if (!(await utils.getCurrentStatus(yeelight))) {
            yeelight.set_power('on')
        }

        // Setting the color
        yeelight.set_rgb(COLORS[color].rgb)
    }

    flow.end()
    return ''
    //return translation.setColor(color)
}
