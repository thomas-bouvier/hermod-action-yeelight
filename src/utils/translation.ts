import { i18nFactory } from '../factories/i18nFactory'

export const translation = {
    // Outputs an error message based on the error object, or a default message if not found.
    errorMessage: async (error: Error): Promise<string> => {
        let i18n = i18nFactory.get()

        if(!i18n) {
            await i18nFactory.init()
            i18n = i18nFactory.get()
        }

        if(i18n) {
            return i18n([`error.${error.message}`, 'error.unspecific'])
        } else {
            return 'Oops, something went wrong.'
        }
    },

    // Takes an array from the i18n and returns a random item.
    randomTranslation(key: string | string[], opts: {[key: string]: any}): string {
        const i18n = i18nFactory.get()
        const possibleValues = i18n(key, { returnObjects: true, ...opts })

        if (typeof possibleValues === 'string')
            return possibleValues
        
        const randomIndex = Math.floor(Math.random() * possibleValues.length)
        return possibleValues[randomIndex]
    },

    setBrightness(currentBrightness: number, newBrightness: number, wasOff: boolean): string {
        const i18n = i18nFactory.get()

        if (!wasOff && newBrightness > currentBrightness) {
            return i18n('yeelight.setBrightness.increased', {
                percentage: newBrightness
            })
        }
        
        if (!wasOff && newBrightness < currentBrightness) {
            return i18n('yeelight.setBrightness.decreased', {
                percentage: newBrightness
            })
        }
    
        return i18n('yeelight.setBrightness.updated', {
            percentage: newBrightness
        })
    },

    shiftDown(currentBrightness: number, shiftAmount: number): string {
        const i18n = i18nFactory.get()

        if (currentBrightness === 1) {
            return i18n('yeelight.shiftDown.minimum')
        }
        
        return i18n('yeelight.shiftDown.decreased', {
            percentage: shiftAmount
        })
    },

    shiftUp(currentBrightness: number, shiftAmount: number): string {
        const i18n = i18nFactory.get()

        if (currentBrightness === 100) {
            return i18n('yeelight.shiftUp.maximum')
        }

        return i18n('yeelight.shiftUp.increased', {
            percentage: shiftAmount
        })
    },

    setColor(color: string): string {
        const i18n = i18nFactory.get()

        return i18n('yeelight.setColor.updated', {
            color: i18n('colors.' + color)
        })
    }
}