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
    CLUSTER_TOP?: number
    CLUSTER_LEFT?: number
    CLUSTER_RIGHT?: number
    CLUSTER_BOTTOM?: number
    BUMPER_TOP_LEFT?: number
    BUMPER_BOTTOM_LEFT?: number
    BUMPER_TOP_RIGHT?: number
    BUMPER_BOTTOM_RIGHT?: number
    STICK_PRESS_LEFT?: number
    STICK_PRESS_RIGHT?: number
    TOUCHSCREEN?: number,
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
