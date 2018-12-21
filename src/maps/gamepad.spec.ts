import { expect } from 'chai'
import * as Mocha from 'mocha'
import { findButtonNumber, BUTTON_TYPE } from './gamepad'

describe('The `Gamepad` mapping helper function', () => {

  describe('`findButtonNumber()`', () => {
    const controllerId = '[temp xbox id]'

    it('should return the correct key value for a given alias', () => {
      expect(findButtonNumber(controllerId, BUTTON_TYPE.ARROW_UP)).to.equal(12)
    })

  })

})
