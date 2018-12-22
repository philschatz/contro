import { IGamepad } from '../apis';
import { controllerConfigs } from '../configs'
import standardMapping from '../configs/standard'

export enum BUTTON_TYPE {
  'ARROW_UP' = 'ARROW_UP',
  'ARROW_DOWN' = 'ARROW_DOWN',
  'ARROW_LEFT' = 'ARROW_LEFT',
  'ARROW_RIGHT' = 'ARROW_RIGHT',
  'HOME' = 'HOME',
  'START' = 'START',
  'SELECT' = 'SELECT',
  'CLUSTER_TOP' = 'CLUSTER_TOP',
  'CLUSTER_LEFT' = 'CLUSTER_LEFT',
  'CLUSTER_RIGHT' = 'CLUSTER_RIGHT',
  'CLUSTER_BOTTOM' = 'CLUSTER_BOTTOM',
  'BUMPER_TOP_LEFT' = 'BUMPER_TOP_LEFT',
  'BUMPER_BOTTOM_LEFT' = 'BUMPER_BOTTOM_LEFT',
  'BUMPER_TOP_RIGHT' = 'BUMPER_TOP_RIGHT',
  'BUMPER_BOTTOM_RIGHT' = 'BUMPER_BOTTOM_RIGHT',
  'STICK_PRESS_LEFT' = 'STICK_PRESS_LEFT',
  'STICK_PRESS_RIGHT' = 'STICK_PRESS_RIGHT',
  'TOUCHSCREEN' = 'TOUCHSCREEN',
}
export enum STICK_TYPE {
  'LEFT' = 'LEFT',
  'RIGHT' = 'RIGHT',
}
export enum ANALOG_TYPE {
  'BUMPER_LEFT' = 'BUMPER_LEFT',
  'BUMPER_RIGHT' = 'BUMPER_RIGHT',
}

export function findButtonNumber(gamepad: IGamepad, button: BUTTON_TYPE) {
  if (gamepad.mapping === 'standard') {
    return standardMapping.buttons[button]
  }
  const mapping = controllerConfigs.find(({id}) => gamepad.id === id)
  if (!mapping) {
    throw new Error(`Unsupported gamepad "${gamepad.id}"`)
  }
  return mapping.buttons[button]
}

export function findStickNumbers(gamepad: IGamepad, stick: STICK_TYPE) {
  if (gamepad.mapping === 'standard') {
    return standardMapping.sticks[stick]
  }
  const mapping = controllerConfigs.find(({id}) => gamepad.id === id)
  if (!mapping) {
    throw new Error(`Unsupported gamepad "${gamepad.id}"`)
  }
  return mapping.sticks[stick]
}
