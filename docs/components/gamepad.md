### `Gamepad` component

An abstraction on top of the [Gamepad API][gamepad-api].

---

#### `constructor({ win, nav })`

Creates a new `Gamepad` instance.

* `win` is **optional** and can be used to inject an alternative `window` object
* `nav` is **optional** and can be used to inject an alternative `navigator` object

---

#### `button(button)`

When `.query()`-ed returns whether the button is currently pressed.

* `button` is the indentifier of the gamepad button. See [Gamepad Buttons][gamepad-buttons] for valid buttons.

---

#### `stick(stick)`

When `.query()`-ed returns a `Vector2` of the current position of the stick.

* `stick` is the name of the (`left`, `right`) or an object
  * the custom object looks like this: `{ label: 'Example stick', xAxis: 0, yAxis: 1 }`

---

#### `isConnected()`

Returns whether a gamepad is currently connected.

---

#### `hasButton(buttonId)`

Returns whether a gamepad has a particular button available.

---

#### `hasStick(stickId)`

Returns whether a gamepad has a particular stick available.



[gamepad-api]: https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API
[gamepad-buttons]: ../gamepad-buttons.md