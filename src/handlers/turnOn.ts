import { Handler } from './index'
import { yeeFactory, i18nFactory } from '../factories'

export const turnOnHandler: Handler = async function (msg, flow) {
    const i18n = i18nFactory.get()
    const yeelight = yeeFactory.get()

    yeelight.set_power('on')

    flow.end()
    return i18n('yeelight.turnOn.updated')
}
