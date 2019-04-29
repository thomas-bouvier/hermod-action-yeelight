
import { Yeelight } from 'yeelight-node-binding'
import { configFactory, yeeFactory } from '../../factories'

function getAllLights(siteId: string): Yeelight[] {
    const config = configFactory.get()
    const yeelights = yeeFactory.getAll()

    const ret: Yeelight[] = []

    for (let yeelight of yeelights) {
        for (let i = 1;; i++) {
            const key = `lamp${ i }Id`
            if (config[key]) {
                if (config[key] === yeelight.id && siteId === config[`lamp${ i }SiteId`]) {
                    ret.push(yeelight)
                }
            } else {
                break
            }
        }
    }

    return (ret.length === 0) ? yeelights : ret
}

function getLightsFromRoom(rooms: string[]): Yeelight[] {
    const config = configFactory.get()
    const yeelights = yeeFactory.getAll()

    const ret: Yeelight[] = []

    for (let yeelight of yeelights) {
        for (let i = 1;; i++) {
            const key = `lamp${ i }Id`
            if (config[key]) {
                if (config[key] === yeelight.id && rooms.includes(config[`lamp${ i }Room`])) {
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
