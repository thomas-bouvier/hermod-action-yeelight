import { i18n } from 'hermod-toolkit'

export const translation = {
    setBrightnessToSpeech(currentBrightness: number, newBrightness: number, wasOff: boolean): string {
        if (!wasOff && newBrightness > currentBrightness) {
            return i18n.translate('yeelight.setBrightness.single.increased', {
                percentage: newBrightness
            })
        }
        
        if (!wasOff && newBrightness < currentBrightness) {
            return i18n.translate('yeelight.setBrightness.single.decreased', {
                percentage: newBrightness
            })
        }
    
        return i18n.translate('yeelight.setBrightness.single.updated', {
            percentage: newBrightness
        })
    },

    shiftDownToSpeech(currentBrightness: number, shiftAmount: number): string {
        if (currentBrightness === 1) {
            return i18n.translate('yeelight.shiftDown.single.minimum')
        }
        
        return i18n.translate('yeelight.shiftDown.single.decreased', {
            percentage: shiftAmount
        })
    },

    shiftUpToSpeech(shiftAmount: number, currentBrightness: number = 0): string {
        if (currentBrightness && currentBrightness === 100) {
            return i18n.translate('yeelight.shiftUp.single.maximum')
        }

        return i18n.translate('yeelight.shiftUp.single.increased', {
            percentage: shiftAmount
        })
    },

    setColorToSpeech(color: string): string {
        return i18n.translate('yeelight.setColor.single.updated', {
            color: i18n.translate('colors.' + color)
        })
    }
}
