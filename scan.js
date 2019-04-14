const { Client } = require('yeelight-node-binding')
const fs = require('fs')

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

    let counter = 1
    for (let yeelight of yeelights) {
        console.log('Lamp ' + counter + ':', yeelight.id)

        const id = `lamp_${ counter }_id=${ yeelight.id }`
        const room = `lamp_${ counter }_room=`
        
        fs.appendFileSync('config.ini', `\n${ id }\n${ room }`)

        yeelight.set_power('on')
        await sleep(5000)
        yeelight.set_power('off')

        counter++
    }

    process.exit()
}

scan()