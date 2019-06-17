import { NluSlot, slotType } from 'hermes-javascript/types'
import { utils } from '../utils/yeelight'
import { Yeelight } from 'yeelight-node-binding'
import { i18n, message, Handler, logger } from 'snips-toolkit'
import { SLOT_CONFIDENCE_THRESHOLD } from '../constants'

export const turnOnHandler: Handler = async function (msg, flow) {
    let yeelights: Yeelight[]

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

        flow.end()
        if (await utils.getCurrentStatus(yeelight)) {
            return i18n.translate('yeelight.turnOn.single.already')
        } else {
            yeelight.set_power('on')
            return i18n.translate('yeelight.turnOn.single.updated')
        }
    } else {
        for (let yeelight of yeelights) {
            yeelight.set_power('on')
        }
    
        flow.end()
        return i18n.translate('yeelight.turnOn.all.updated')
    }
}
