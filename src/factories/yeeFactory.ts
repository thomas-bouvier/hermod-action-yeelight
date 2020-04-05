import { logger } from 'hermod-toolkit'
import { Client, Yeelight } from 'yeelight-node'

const yeelights: Yeelight[] = []

function init() {
    const client = new Client()

    client.bind(y => { yeelights.push(y) })

    client.on('message', data => {
        logger.debug(data.toString())
    })
}

function get(): Yeelight {
    return yeelights[0]
}

function getAll(): Yeelight[] {
    return yeelights
}

export const yeeFactory = {
    init,
    get,
    getAll
}
