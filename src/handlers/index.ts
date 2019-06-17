import { handler, ConfidenceThresholds } from 'snips-toolkit'
import { turnOnHandler } from './turnOn'
import { turnOffHandler } from './turnOff'
import { setBrightnessHandler } from './setBrightness'
import { shiftDownHandler } from './shiftDown'
import { shiftUpHandler } from './shiftUp'
import { setColorHandler } from './setColor'
import { INTENT_PROBABILITY_THRESHOLD, ASR_UTTERANCE_CONFIDENCE_THRESHOLD } from '../constants'

const thresholds: ConfidenceThresholds = {
    intent: INTENT_PROBABILITY_THRESHOLD,
    asr: ASR_UTTERANCE_CONFIDENCE_THRESHOLD
}

// Add handlers here, and wrap them.
export default {
    turnOn: handler.wrap(turnOnHandler, thresholds),
    turnOff: handler.wrap(turnOffHandler, thresholds),
    setBrightness: handler.wrap(setBrightnessHandler, thresholds),
    shiftDown: handler.wrap(shiftDownHandler, thresholds),
    shiftUp: handler.wrap(shiftUpHandler, thresholds),
    setColor: handler.wrap(setColorHandler, thresholds)
}
