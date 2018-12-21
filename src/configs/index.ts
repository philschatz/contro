/* Mappings for all supported controllers.
 * To add a new controller, add a new JSON file and update the entry at the bottom of this file.
 */
import c1 = require('./ps3')
import c2 = require('./ps4')
import c3 = require('./xbox')

interface StickIndexes {
  xAxis: number
  yAxis: number
}

interface Mapping {
  id: string
  buttons: {
    ARROW_UP?: number
    ARROW_DOWN?: number
    ARROW_LEFT?: number
    ARROW_RIGHT?: number
    HOME?: number
    START?: number
    SELECT?: number
    ACTION_TOP?: number
    ACTION_LEFT?: number
    ACTION_RIGHT?: number
    ACTION_BOTTOM?: number
    BUMPER_LEFT_ONE?: number
    BUMPER_LEFT_TWO?: number
    BUMPER_RIGHT_ONE?: number
    BUMPER_RIGHT_TWO?: number
    ACTION_STICK_LEFT?: number
    ACTION_STICK_RIGHT?: number
    ACTION_TOUCHSCREEN?: number,
  },
  sticks: {
    LEFT?: StickIndexes
    RIGHT?: StickIndexes,
  },
  analogs: {
    BUMPER_LEFT?: number
    BUMPER_RIGHT?: number,
  }
}

export const controllerConfigs = [
  c2, // Use PS4 first for documentation-generation
  c1,
  c3,
] as Mapping[]
