import { controllerConfigs } from '../configs'

export enum BUTTON_TYPE {
  'ARROW_UP' = 'ARROW_UP',
  'ARROW_DOWN' = 'ARROW_DOWN',
  'ARROW_LEFT' = 'ARROW_LEFT',
  'ARROW_RIGHT' = 'ARROW_RIGHT',
  'HOME' = 'HOME',
  'START' = 'START',
  'SELECT' = 'SELECT',
  'ACTION_TOP' = 'ACTION_TOP',
  'ACTION_LEFT' = 'ACTION_LEFT',
  'ACTION_RIGHT' = 'ACTION_RIGHT',
  'ACTION_BOTTOM' = 'ACTION_BOTTOM',
  'BUMPER_LEFT_ONE' = 'BUMPER_LEFT_ONE',
  'BUMPER_LEFT_TWO' = 'BUMPER_LEFT_TWO',
  'BUMPER_RIGHT_ONE' = 'BUMPER_RIGHT_ONE',
  'BUMPER_RIGHT_TWO' = 'BUMPER_RIGHT_TWO',
  'ACTION_STICK_LEFT' = 'ACTION_STICK_LEFT',
  'ACTION_STICK_RIGHT' = 'ACTION_STICK_RIGHT',
  'ACTION_TOUCHSCREEN' = 'ACTION_TOUCHSCREEN',
}
export enum STICK_TYPE {
  'LEFT' = 'LEFT',
  'RIGHT' = 'RIGHT',
}
export enum ANALOG_TYPE {
  'BUMPER_LEFT' = 'BUMPER_LEFT',
  'BUMPER_RIGHT' = 'BUMPER_RIGHT',
}

export function findButtonNumber(gamepadId: string, button: BUTTON_TYPE) {
  const mapping = controllerConfigs.find(({id}) => gamepadId === id)
  return mapping.buttons[button]
}

export function findStickNumbers(gamepadId: string, stick: STICK_TYPE) {
  const mapping = controllerConfigs.find(({id}) => gamepadId === id)
  return mapping.sticks[stick]
}
