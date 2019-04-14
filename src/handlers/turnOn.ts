import { Handler } from './index'
import { i18nFactory } from '../factories'
import { NluSlot, slotType } from 'hermes-javascript'
import { message } from '../utils'
import { utils } from '../utils/yeelight'
import { Yeelight } from 'yeelight-node-binding'

export const turnOnHandler: Handler = async function (msg, flow) {
    const i18n = i18nFactory.get()

    let yeelights: Yeelight[]

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
        yeelight.set_power('on')
    }

    flow.end()
    return i18n('yeelight.turnOn.updated')
}
