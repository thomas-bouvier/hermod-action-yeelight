import { Handler } from './index'
import { i18nFactory } from '../factories'
import { NluSlot, slotType } from 'hermes-javascript'
import { message } from '../utils'
import { utils } from '../utils/yeelight'
import { Yeelight } from 'yeelight-node-binding'
import { SLOT_CONFIDENCE_THRESHOLD } from '../constants'

export const turnOffHandler: Handler = async function (msg, flow) {
    const i18n = i18nFactory.get()
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
        if (!(await utils.getCurrentStatus(yeelight))) {
            return i18n('yeelight.turnOff.single.already')
        } else {
            yeelight.set_power('off')
            return i18n('yeelight.turnOff.single.updated')
        }
    } else {
        for (let yeelight of yeelights) {
            yeelight.set_power('off')
        }
    
        flow.end()
        return i18n('yeelight.turnOff.all.updated')
    }
}
