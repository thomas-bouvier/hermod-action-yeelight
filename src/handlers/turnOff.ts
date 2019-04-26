import { Handler } from './index'
import { i18nFactory } from '../factories'
import { NluSlot, slotType } from 'hermes-javascript'
import { message } from '../utils'
import { utils } from '../utils/yeelight'
import { Yeelight } from 'yeelight-node-binding'

export const turnOffHandler: Handler = async function (msg, flow) {
    const i18n = i18nFactory.get()
    let yeelights: Yeelight[]

    const roomsSlot: NluSlot<slotType.custom>[] | null = message.getSlotsByName(msg, 'house_room', {
        threshold: 0.5
    })

    if (roomsSlot && roomsSlot.length > 0) {
        yeelights = utils.getLightsFromRoom(roomsSlot.map(x => x.value.value))
    } else {
        yeelights = utils.getAllLights()
    }

    if (yeelights.length === 1) {
        const yeelight = yeelights[0]

        yeelight.set_power('off')

        flow.end()
        return i18n('yeelight.turnOff.single.updated')
    } else {
        for (let yeelight of yeelights) {
            yeelight.set_power('off')
        }
    
        flow.end()
        return i18n('yeelight.turnOff.all.updated')
    }
}
