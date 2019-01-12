import { expect } from 'chai'
import * as Mocha from 'mocha'
import { findButtonNumber, BUTTON_TYPE } from './gamepad'
import { IGamepad, IGamepadButton } from '../apis';

class MockGamepad implements IGamepad {

  public id = 'test_gamepad'
  public index: number = 0
  public buttons: IGamepadButton[] = []
  public axes: number[] = []
  public connected: boolean = true
  public timestamp: number = 0
  public mapping: string = 'standard'

}

describe('The `Gamepad` mapping helper function', () => {

  describe('`findButtonNumber()`', () => {

    it('should return the correct key value for a given alias', () => {
      expect(findButtonNumber(new MockGamepad(), BUTTON_TYPE.ARROW_UP)).to.equal(12)
    })

  })

})
