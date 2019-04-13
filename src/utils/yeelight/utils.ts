
async function getCurrentBrightness(yeelight): Promise<number> {
    const currentBrightness = JSON.parse(await yeelight.get_prop('bright'))

    if (currentBrightness.hasOwnProperty('result')) {
        return +currentBrightness.result[0]
    }

    return 0
}

export const utils = {
    getCurrentBrightness
}
