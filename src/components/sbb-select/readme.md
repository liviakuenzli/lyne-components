# sbb-select

<!-- Auto Generated Below -->


## Properties

| Property           | Attribute           | Description                       | Type                 | Default     |
| ------------------ | ------------------- | --------------------------------- | -------------------- | ----------- |
| `disableAnimation` | `disable-animation` | Whether the animation is enabled. | `boolean`            | `false`     |
| `disabled`         | `disabled`          |                                   | `boolean`            | `false`     |
| `inputPlaceholder` | `input-placeholder` |                                   | `string`             | `undefined` |
| `multiple`         | `multiple`          |                                   | `boolean`            | `false`     |
| `readonly`         | `readonly`          |                                   | `boolean`            | `false`     |
| `value`            | `value`             |                                   | `string \| string[]` | `undefined` |


## Events

| Event        | Description                                                                                                                         | Type                |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `change`     |                                                                                                                                     | `CustomEvent<any>`  |
| `did-close`  | Emits whenever the menu is closed.                                                                                                  | `CustomEvent<void>` |
| `did-open`   | Emits whenever the menu is opened.                                                                                                  | `CustomEvent<void>` |
| `didChange`  | <span style="color:red">**[DEPRECATED]**</span> only used for React. Will probably be removed once React 19 is available.<br/><br/> | `CustomEvent<any>`  |
| `will-close` | Emits whenever the menu begins the closing transition.                                                                              | `CustomEvent<void>` |
| `will-open`  | Emits whenever the menu starts the opening transition.                                                                              | `CustomEvent<void>` |


## Methods

### `close() => Promise<void>`

Closes the selection panel.

#### Returns

Type: `Promise<void>`



### `open() => Promise<void>`

Opens the selection panel.

#### Returns

Type: `Promise<void>`




----------------------------------------------


