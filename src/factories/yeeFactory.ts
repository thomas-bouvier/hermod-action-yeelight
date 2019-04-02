import { logger } from '../utils'
import { Client } from 'yeelight-node-binding'

let yeelight

function init() {
    const client = new Client()

    client.bind(y => {
        yeelight = y
    })

    client.on('message', data => {
        logger.debug(data.toString());
    })
}

function get() {
    return yeelight
}

export const yeeFactory = {
    init,
    get
}
