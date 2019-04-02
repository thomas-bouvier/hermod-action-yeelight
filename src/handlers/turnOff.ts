import { Handler } from './index'
import { yeeFactory, i18nFactory } from '../factories'

export const turnOffHandler: Handler = async function (msg, flow) {
    const i18n = i18nFactory.get()

    yeeFactory.get().set_power('off')

    flow.end()
    return i18n('turnOff.updated')
}
