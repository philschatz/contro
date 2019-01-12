/*!
 * Contro
 * (c) 2019 Niklas Higi
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.Contro = {})));
}(this, (function (exports) { 'use strict';

  class Vector2 {
      constructor(x = 0, y = 0) {
          this.x = x;
          this.y = y;
      }
  }

  const mouseButtons = ['left', 'middle', 'right'];
  class Mouse {
      constructor({ canvas, doc = document }) {
          this.pointerLocked = false;
          this.pointerMovement = new Vector2();
          this.pressedButtons = new Set();
          this.queuedButtons = new Set();
          this.scrollDistance = 0;
          this.canvas = canvas;
          this.document = doc;
          const on = this.canvas.addEventListener.bind(this.canvas);
          on('mousedown', (event) => {
              store.preferGamepad = false;
              this.pressedButtons.add(event.button);
              this.queuedButtons.add(event.button);
          });
          on('mouseup', (event) => {
              store.preferGamepad = false;
              this.pressedButtons.delete(event.button);
              this.queuedButtons.delete(event.button);
          });
          on('mousemove', (event) => {
              store.preferGamepad = false;
              this.pointerMovement.x += event.movementX;
              this.pointerMovement.y += event.movementY;
          });
          on('wheel', (event) => {
              store.preferGamepad = false;
              const distance = event.deltaY;
              this.scrollDistance += distance;
          });
      }
      parseButton(button) {
          if (typeof button === 'string') {
              if (mouseButtons.includes(button)) {
                  return mouseButtons.indexOf(button);
              }
              else {
                  throw new Error(`There is no mouse button called "${button}"!`);
              }
          }
          else {
              if (button < mouseButtons.length) {
                  return button;
              }
              else {
                  throw new Error(`There is no mouse button with the index ${button}!`);
              }
          }
      }
      button(button) {
          const that = this;
          button = this.parseButton(button);
          return {
              label: ['Left', 'Middle', 'Right'][button] + ' Mouse Button',
              query() {
                  button = that.parseButton(button);
                  if (!this.hasOwnProperty('trigger')) {
                      if (that.queuedButtons.has(button)) {
                          that.queuedButtons.delete(button);
                          return true;
                      }
                      return false;
                  }
                  else {
                      return that.pressedButtons.has(button);
                  }
              },
              get trigger() {
                  delete this.trigger;
                  return this;
              },
          };
      }
      pointer() {
          return {
              label: 'Cursor',
              query: () => {
                  const movement = this.pointerMovement;
                  this.pointerMovement = new Vector2(0, 0);
                  return movement;
              },
          };
      }
      wheel() {
          return {
              label: 'Mouse wheel',
              query: () => {
                  const distance = this.scrollDistance;
                  this.scrollDistance = 0;
                  return distance;
              },
          };
      }
      lockPointer() {
          this.canvas.requestPointerLock();
      }
      unlockPointer() {
          this.document.exitPointerLock();
      }
      isPointerLocked() {
          return this.document.pointerLockElement === this.canvas;
      }
  }

  /**
   * A map of all the supported key values (property names) and their respective
   * aliases (property values)  that can be used with the `Keyboard` class. The
   * first alias for each key value will be used as a label.
   */
  const keyMap = {
      ' ': ['Space', 'Spacebar', 'Space Bar'],
      'AltGraph': ['Alt Gr'],
      'ArrowDown': ['Down'],
      'ArrowLeft': ['Left'],
      'ArrowRight': ['Right'],
      'ArrowUp': ['Up'],
      'Backspace': ['Backspace'],
      'Control': ['Ctrl', 'Ctl'],
      'Delete': ['Delete', 'Del'],
      'Enter': ['Enter', 'Return'],
      'Escape': ['Escape', 'Esc'],
      'Insert': ['Insert', 'Ins'],
      'PageDown': ['Page Down', 'PgDown'],
      'PageUp': ['Page Up', 'PgUp'],
      'Tab': ['Tab'],
  };
  function findKeyValue(keyString) {
      if (keyString.length === 1)
          return keyString.toLowerCase();
      Object.keys(keyMap).forEach(keyValue => {
          keyMap[keyValue].forEach(key => {
              if (keyString.toLowerCase() === key.toLowerCase()) {
                  keyString = keyValue;
              }
          });
      });
      return keyString;
  }
  function getKeyLabel(key) {
      return key in keyMap ? keyMap[key][0] : (key.length === 1 ? key.toUpperCase() : key);
  }

  const arrowKeyTemplates = {
      arrows: ['Arrow keys', ['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight']],
      wasd: ['WASD', ['W', 'A', 'S', 'D']],
  };
  class Keyboard {
      constructor(
      { doc = document } = {}) {
          this.pressedKeys = new Set();
          this.queuedKeys = new Set();
          this.document = doc;
          this.document.addEventListener('keydown', (event) => {
              store.preferGamepad = false;
              let key = event.key;
              if (key === key.toUpperCase())
                  key = key.toLowerCase();
              this.pressedKeys.add(key);
              this.queuedKeys.add(key);
              return false;
          });
          this.document.addEventListener('keyup', (event) => {
              store.preferGamepad = false;
              let key = event.key;
              if (key === key.toUpperCase())
                  key = key.toLowerCase();
              this.pressedKeys.delete(key);
              this.queuedKeys.delete(key);
              return false;
          });
      }
      key(key) {
          const that = this;
          key = findKeyValue(key);
          return {
              label: getKeyLabel(key),
              query() {
                  return this.hasOwnProperty('trigger') ? that.pressedKeys.has(key) : that.queuedKeys.delete(key);
              },
              get trigger() {
                  delete this.trigger;
                  return this;
              },
          };
      }
      directionalKeys(keys, label) {
          let defaultLabel;
          if (typeof keys === 'string') {
              keys = keys.toLowerCase();
              if (keys in arrowKeyTemplates) {
                  const template = arrowKeyTemplates[keys.toLowerCase()];
                  defaultLabel = template[0];
                  keys = template[1];
              }
              else {
                  throw new Error(`Directional key template "${keys}" not found!`);
              }
          }
          else {
              if (keys.length === 4) {
                  keys = keys.map(key => findKeyValue(key));
                  defaultLabel = keys.map(key => getKeyLabel(key)).join('');
              }
              else {
                  throw new Error('Directional key templates have to consist of four keys!');
              }
          }
          return {
              label: label || defaultLabel,
              query: () => {
                  const vector = new Vector2();
                  if (this.key(keys[0]).query())
                      vector.y -= 1;
                  if (this.key(keys[1]).query())
                      vector.x -= 1;
                  if (this.key(keys[2]).query())
                      vector.y += 1;
                  if (this.key(keys[3]).query())
                      vector.x += 1;
                  return vector;
              },
          };
      }
  }

  var c1 = {
      id: '54c-268-PLAYSTATION(R)3 Controller',
      buttons: {
          ARROW_UP: 4,
          ARROW_DOWN: 6,
          ARROW_LEFT: 7,
          ARROW_RIGHT: 5,
          HOME: 16,
          START: 3,
          SELECT: 0,
          CLUSTER_TOP: 12,
          CLUSTER_LEFT: 15,
          CLUSTER_RIGHT: 13,
          CLUSTER_BOTTOM: 14,
          BUMPER_TOP_LEFT: 10,
          BUMPER_BOTTOM_LEFT: 8,
          BUMPER_TOP_RIGHT: 11,
          BUMPER_BOTTOM_RIGHT: 9,
          STICK_PRESS_LEFT: 1,
          STICK_PRESS_RIGHT: 2,
      },
      sticks: {
          LEFT: { xAxis: 0, yAxis: 1 },
          RIGHT: { xAxis: 2, yAxis: 3 },
      },
      analogs: {},
  };

  var c2 = {
      id: '54c-9cc-Wireless Controller',
      buttons: {
          ARROW_UP: 14,
          ARROW_DOWN: 15,
          ARROW_LEFT: 16,
          ARROW_RIGHT: 17,
          HOME: 12,
          START: 9,
          SELECT: 8,
          CLUSTER_TOP: 3,
          CLUSTER_LEFT: 0,
          CLUSTER_RIGHT: 2,
          CLUSTER_BOTTOM: 1,
          BUMPER_TOP_LEFT: 4,
          BUMPER_BOTTOM_LEFT: 6,
          BUMPER_TOP_RIGHT: 5,
          BUMPER_BOTTOM_RIGHT: 7,
          STICK_PRESS_LEFT: 10,
          STICK_PRESS_RIGHT: 11,
          TOUCHSCREEN: 13,
      },
      sticks: {
          LEFT: { xAxis: 0, yAxis: 1 },
          RIGHT: { xAxis: 2, yAxis: 5 },
      },
      analogs: {
          BUMPER_LEFT: 3,
          BUMPER_RIGHT: 4,
      },
  };

  var c3 = {
      id: 'Wireless Controller (STANDARD GAMEPAD)',
      buttons: {
          ARROW_UP: 12,
          ARROW_DOWN: 13,
          ARROW_LEFT: 14,
          ARROW_RIGHT: 15,
          HOME: 16,
          START: 9,
          SELECT: 8,
          CLUSTER_TOP: 3,
          CLUSTER_LEFT: 2,
          CLUSTER_RIGHT: 1,
          CLUSTER_BOTTOM: 0,
          BUMPER_TOP_LEFT: 4,
          BUMPER_BOTTOM_LEFT: 6,
          BUMPER_TOP_RIGHT: 5,
          BUMPER_BOTTOM_RIGHT: 7,
          STICK_PRESS_LEFT: 10,
          STICK_PRESS_RIGHT: 11,
      },
      sticks: {
          LEFT: { xAxis: 0, yAxis: 1 },
          RIGHT: { xAxis: 2, yAxis: 3 },
      },
      analogs: {},
  };

  var c4 = {
      id: '[temp xbox id]',
      buttons: {
          ARROW_UP: 12,
          ARROW_DOWN: 13,
          ARROW_LEFT: 14,
          ARROW_RIGHT: 15,
          HOME: 16,
          START: 9,
          SELECT: 8,
          CLUSTER_TOP: 3,
          CLUSTER_LEFT: 2,
          CLUSTER_RIGHT: 1,
          CLUSTER_BOTTOM: 0,
          BUMPER_TOP_LEFT: 4,
          BUMPER_BOTTOM_LEFT: 6,
          BUMPER_TOP_RIGHT: 5,
          BUMPER_BOTTOM_RIGHT: 7,
          STICK_PRESS_LEFT: 10,
          STICK_PRESS_RIGHT: 11,
      },
      sticks: {
          LEFT: { xAxis: 0, yAxis: 1 },
          RIGHT: { xAxis: 2, yAxis: 3 },
      },
      analogs: {},
  };

  /* Mappings for all supported controllers.
   * To add a new controller, add a new JSON file and update the entry at the bottom of this file.
   */
  const controllerConfigs = [
      c2,
      c1,
      c3,
      c4,
  ];

  (function (BUTTON_TYPE) {
      BUTTON_TYPE["ARROW_UP"] = "ARROW_UP";
      BUTTON_TYPE["ARROW_DOWN"] = "ARROW_DOWN";
      BUTTON_TYPE["ARROW_LEFT"] = "ARROW_LEFT";
      BUTTON_TYPE["ARROW_RIGHT"] = "ARROW_RIGHT";
      BUTTON_TYPE["HOME"] = "HOME";
      BUTTON_TYPE["START"] = "START";
      BUTTON_TYPE["SELECT"] = "SELECT";
      BUTTON_TYPE["CLUSTER_TOP"] = "CLUSTER_TOP";
      BUTTON_TYPE["CLUSTER_LEFT"] = "CLUSTER_LEFT";
      BUTTON_TYPE["CLUSTER_RIGHT"] = "CLUSTER_RIGHT";
      BUTTON_TYPE["CLUSTER_BOTTOM"] = "CLUSTER_BOTTOM";
      BUTTON_TYPE["BUMPER_TOP_LEFT"] = "BUMPER_TOP_LEFT";
      BUTTON_TYPE["BUMPER_BOTTOM_LEFT"] = "BUMPER_BOTTOM_LEFT";
      BUTTON_TYPE["BUMPER_TOP_RIGHT"] = "BUMPER_TOP_RIGHT";
      BUTTON_TYPE["BUMPER_BOTTOM_RIGHT"] = "BUMPER_BOTTOM_RIGHT";
      BUTTON_TYPE["STICK_PRESS_LEFT"] = "STICK_PRESS_LEFT";
      BUTTON_TYPE["STICK_PRESS_RIGHT"] = "STICK_PRESS_RIGHT";
      BUTTON_TYPE["TOUCHSCREEN"] = "TOUCHSCREEN";
  })(exports.BUTTON_TYPE || (exports.BUTTON_TYPE = {}));

  (function (STICK_TYPE) {
      STICK_TYPE["LEFT"] = "LEFT";
      STICK_TYPE["RIGHT"] = "RIGHT";
  })(exports.STICK_TYPE || (exports.STICK_TYPE = {}));
  var ANALOG_TYPE;
  (function (ANALOG_TYPE) {
      ANALOG_TYPE["BUMPER_LEFT"] = "BUMPER_LEFT";
      ANALOG_TYPE["BUMPER_RIGHT"] = "BUMPER_RIGHT";
  })(ANALOG_TYPE || (ANALOG_TYPE = {}));
  function findButtonNumber(gamepad, button) {
      if (gamepad.mapping === 'standard') {
          return c3.buttons[button];
      }
      const mapping = controllerConfigs.find(({ id }) => gamepad.id === id);
      if (!mapping) {
          throw new Error(`Unsupported gamepad "${gamepad.id}"`);
      }
      return mapping.buttons[button];
  }
  function findStickNumbers(gamepad, stick) {
      if (gamepad.mapping === 'standard') {
          return c3.sticks[stick];
      }
      const mapping = controllerConfigs.find(({ id }) => gamepad.id === id);
      if (!mapping) {
          throw new Error(`Unsupported gamepad "${gamepad.id}"`);
      }
      return mapping.sticks[stick];
  }

  class Gamepad {
      constructor(
      { win = window, nav = navigator } = {}) {
          this.pressedButtons = new Set();
          this.gamepadTimestamp = 0;
          this.window = win;
          this.navigator = nav;
          this.window.addEventListener('gamepadconnected', ({ gamepad }) => {
              if (!this.isConnected()) {
                  if (gamepad.mapping === 'standard') {
                      this.gamepadIndex = gamepad.index;
                      store.preferGamepad = true;
                  }
              }
          });
          this.window.addEventListener('gamepaddisconnected', ({ gamepad }) => {
              if (this.gamepadIndex === gamepad.index) {
                  this.gamepadIndex = undefined;
                  store.preferGamepad = false;
              }
          });
      }
      isConnected() {
          return this.gamepadIndex !== undefined && this.gamepad.connected;
      }
      hasButton(id) {
          return this.isConnected() && typeof findButtonNumber(this.gamepad.id, id) !== 'undefined';
      }
      hasStick(id) {
          return this.isConnected() && typeof findStickNumbers(this.gamepad.id, id) !== 'undefined';
      }
      get gamepad() {
          const gamepad = this.navigator.getGamepads()[this.gamepadIndex];
          if (gamepad.timestamp > this.gamepadTimestamp)
              store.preferGamepad = true;
          this.gamepadTimestamp = gamepad.timestamp;
          return gamepad;
      }
      button(button) {
          const that = this;
          return {
              label: button,
              fromGamepad: true,
              query() {
                  if (!that.isConnected())
                      return false;
                  const buttonNumber = findButtonNumber(that.gamepad, button);
                  if (!this.hasOwnProperty('trigger')) {
                      if (that.gamepad.buttons[buttonNumber].pressed) {
                          if (!that.pressedButtons.has(buttonNumber)) {
                              that.pressedButtons.add(buttonNumber);
                              return true;
                          }
                      }
                      else {
                          that.pressedButtons.delete(buttonNumber);
                      }
                      return false;
                  }
                  else {
                      return that.gamepad.buttons[buttonNumber].pressed;
                  }
              },
              get trigger() {
                  delete this.trigger;
                  return this;
              },
          };
      }
      stick(stick) {
          if (`${stick}` !== exports.STICK_TYPE.LEFT && `${stick}` !== exports.STICK_TYPE.RIGHT) {
              throw new Error(`Invalid Stick type. Expected to be "${exports.STICK_TYPE.LEFT}" or "${exports.STICK_TYPE.RIGHT}" but received "${stick}"`);
          }
          const that = this;
          return {
              label: stick,
              query() {
                  if (!that.isConnected()) {
                      return new Vector2(0, 0);
                  }
                  const { gamepad } = that;
                  const { xAxis, yAxis } = findStickNumbers(gamepad, stick);
                  return new Vector2(gamepad.axes[xAxis], gamepad.axes[yAxis]);
              },
          };
      }
  }

  function and(...controls) {
      if (controls.length < 2)
          throw new Error('Less than two controls specified!');
      return {
          label: controls.map(control => control.label).join(' + '),
          query: () => {
              for (const control of controls) {
                  if (!control.query())
                      return false;
              }
              return true;
          },
      };
  }

  function or(...controls) {
      if (controls.length < 2)
          throw new Error('Less than two controls specified!');
      return {
          get label() {
              return (controls.filter(control => control.fromGamepad).length === 0 ?
                  controls[0]
                  : store.preferGamepad ?
                      controls.filter(control => control.fromGamepad === true)[0]
                      : controls.filter(control => control.fromGamepad !== true)[0]).label;
          },
          query: () => {
              let sampleQueryValue;
              for (const control of controls) {
                  const queryValue = control.query();
                  sampleQueryValue = queryValue;
                  if (queryValue)
                      return queryValue;
              }
              if (typeof sampleQueryValue === 'boolean')
                  return false;
          },
      };
  }

  let store = {
      preferGamepad: false,
  };

  exports.store = store;
  exports.Mouse = Mouse;
  exports.Keyboard = Keyboard;
  exports.Gamepad = Gamepad;
  exports.and = and;
  exports.or = or;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
