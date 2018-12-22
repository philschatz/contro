import { IGamepad, INavigator, IWindow  } from '../apis'
import { Control, TriggerControl  } from '../core/control'
import { store } from '../index'
import { BUTTON_TYPE, findButtonNumber, findStickNumbers, STICK_TYPE } from '../maps/gamepad'
import { Vector2 } from '../utils/math'

export interface GamepadStick {

  label: string
  xAxis: number
  yAxis: number

}

export class Gamepad {

  private window: IWindow
  private navigator: INavigator

  private pressedButtons: Set<number> = new Set()
  private gamepadIndex: number
  private gamepadTimestamp = 0

  constructor(
    /* istanbul ignore next */
    { win = window, nav = navigator }: { win?: IWindow, nav?: INavigator } = {},
  ) {
    this.window = win
    this.navigator = nav

    this.window.addEventListener('gamepadconnected', ({ gamepad }) => {
      /* istanbul ignore else */
      if (!this.isConnected()) {
        if (gamepad.mapping === 'standard') {
          this.gamepadIndex = gamepad.index
          store.preferGamepad = true
        }
      }
    })

    this.window.addEventListener('gamepaddisconnected', ({ gamepad }) => {
      /* istanbul ignore else */
      if (this.gamepadIndex === gamepad.index) {
        this.gamepadIndex = undefined
        store.preferGamepad = false
      }
    })
  }

  public isConnected() {
    return this.gamepadIndex !== undefined && this.gamepad.connected
  }

  public hasButton(id: BUTTON_TYPE) {
    return this.isConnected() && typeof findButtonNumber(this.gamepad.id, id) !== 'undefined'
  }

  public hasStick(id: STICK_TYPE) {
    return this.isConnected() && typeof findStickNumbers(this.gamepad.id, id) !== 'undefined'
  }

  private get gamepad(): IGamepad {
    const gamepad = this.navigator.getGamepads()[this.gamepadIndex]
    /* istanbul ignore next */
    if (gamepad.timestamp > this.gamepadTimestamp) store.preferGamepad = true
    this.gamepadTimestamp = gamepad.timestamp
    return gamepad
  }

  public button(button: BUTTON_TYPE): TriggerControl<boolean> {
    const that = this
    return {
      label: button,
      fromGamepad: true,
      query() {
        if (!that.isConnected()) return false
        const buttonNumber = findButtonNumber(that.gamepad, button)
        if (!this.hasOwnProperty('trigger')) {
          /* istanbul ignore else */
          if (that.gamepad.buttons[buttonNumber].pressed) {
            if (!that.pressedButtons.has(buttonNumber)) {
              that.pressedButtons.add(buttonNumber)
              return true
            }
          } else {
            that.pressedButtons.delete(buttonNumber)
          }
          return false
        } else {
          return that.gamepad.buttons[buttonNumber].pressed
        }
      },
      get trigger() {
        delete this.trigger
        return this
      },
    }
  }

  public stick(stick: STICK_TYPE): Control<Vector2> {
    const {gamepad} = this
    const {xAxis, yAxis} = findStickNumbers(gamepad, stick)
    return {
      label: stick,
      query() {
        return new Vector2(gamepad.axes[xAxis], gamepad.axes[yAxis])
      },
    }
  }

}
