import { logger } from '../utils'
import { Client, Yeelight } from 'yeelight-node-binding'

let yeelight: Yeelight

function init() {
    const client = new Client()

    client.bind(y => {
        yeelight = y
    })

    client.on('message', data => {
        logger.debug(data.toString());
    })
}

function get(): Yeelight {
    return yeelight
}

export const yeeFactory = {
    init,
    get
}
