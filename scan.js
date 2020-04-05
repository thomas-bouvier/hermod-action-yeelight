/* eslint no-console: off */

const { Client } = require('yeelight-node')
const fs = require('fs')

const client = new Client()

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function scan() {
    const yeelights = []

    console.log('Your lamps will light up one after the other. Please remember the order')

    client.bind(yeelight => {
        yeelight.set_power('off')
        yeelights.push(yeelight)
    })

    console.log('Discovering lights on your network...')
    await sleep(5000)

    console.log('Generating the config.ini file...')

    let counter = 1
    for (let yeelight of yeelights) {
        console.log('* Lamp ' + counter + ':', yeelight.id)

        const id = `lamp_${ counter }_id=${ yeelight.id }`
        const room = `lamp_${ counter }_room=`
        const site = `lamp_${ counter }_site_id=`
        
        fs.appendFileSync('config.ini', `\n${ id }\n${ room }\n${ site }`)

        yeelight.set_power('on')
        await sleep(5000)
        yeelight.set_power('off')

        counter++
    }

    console.log('config.ini file generated. Don\'t forget to edit it!')
    process.exit()
}

scan()
