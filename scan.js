const { Client } = require('yeelight-node-binding')
const fs = require('fs')
const ini = require('ini')

const client = new Client()

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function scan() {
    const yeelights = []

    client.bind(yeelight => {
        yeelight.set_power('off')
        yeelights.push(yeelight)
    })

    await sleep(5000)

    const config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'))

    for (let yeelight of yeelights) {
        console.log(yeelight.id)
        config[yeelight.id] = ''

        yeelight.set_power('on')
        await sleep(5000)
        yeelight.set_power('off')
    }

    fs.writeFileSync('./config.ini', ini.stringify(config))

    process.exit()
}

scan()