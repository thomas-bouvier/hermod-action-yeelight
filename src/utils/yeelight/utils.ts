
import { Yeelight } from 'yeelight-node-binding'
import { configFactory, yeeFactory } from '../../factories'

function getAllLights(): Yeelight[] {
    return yeeFactory.getAll()
}

function getLightsFromRoom(room: string): Yeelight[] {
    const config = configFactory.get()
    const yeelights = yeeFactory.getAll()

    const ret: Yeelight[] = []

    for (let yeelight of yeelights) {
        for (let i = 1; ; i++) {
            const key = `lamp${ i }Id`
            if (config[key]) {
                if (config[key] === yeelight.id && config[`lamp${ i }Room`] === room) {
                    ret.push(yeelight)
                }
            } else {
                break
            }
        }
    }

    return ret
}

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
    getAllLights,
    getLightsFromRoom,
    getCurrentStatus,
    getCurrentBrightness
}
