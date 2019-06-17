
import { Yeelight } from 'yeelight-node-binding'
import { config } from 'snips-toolkit'
import { yeeFactory } from '../../factories'

function getAllLights(siteId: string, returnAll: boolean = false): Yeelight[] {
    const yeelights = yeeFactory.getAll()
    const ret: Yeelight[] = []

    if (returnAll) return yeelights

    for (let i = 1; i <= yeelights.length; i++) {
        const yeelight = yeelights[i - 1]
        const key = `lamp${ i }Id`

        if (config.get()[key]) {
            if (config.get()[key] === yeelight.id && siteId === config.get()[`lamp${ i }SiteId`]) {
                ret.push(yeelight)
            }
        }
    }

    return (ret.length === 0) ? yeelights : ret
}

function getLightsFromRooms(rooms: string[]): Yeelight[] {
    const yeelights = yeeFactory.getAll()
    const ret: Yeelight[] = []

    for (let i = 1; i <= yeelights.length; i++) {
        const yeelight = yeelights[i - 1]
        const key = `lamp${ i }Id`

        if (config.get()[key]) {
            if (config.get()[key] === yeelight.id && rooms.includes(config.get()[`lamp${ i }Room`])) {
                ret.push(yeelight)
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
    getLightsFromRooms,
    getCurrentStatus,
    getCurrentBrightness
}
