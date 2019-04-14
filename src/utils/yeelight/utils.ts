
import { Yeelight } from 'yeelight-node-binding'

async function getCurrentStatus(yeelight: Yeelight): Promise<boolean> {
    const currentBrightness = JSON.parse(await yeelight.get_prop('power'))

    if (currentBrightness.hasOwnProperty('result')) {
        return currentBrightness.result[0] === 'on'
    }

    return false
}

async function getCurrentBrightness(yeelight: Yeelight): Promise<number> {
    const currentBrightness = JSON.parse(await yeelight.get_prop('bright'))

    if (currentBrightness.hasOwnProperty('result')) {
        return +currentBrightness.result[0]
    }

    return 0
}

export const utils = {
    getCurrentStatus,
    getCurrentBrightness
}
