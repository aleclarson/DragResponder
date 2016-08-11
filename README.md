
# Draggable v2.0.0 ![stable](https://img.shields.io/badge/stability-stable-4EBA0F.svg?style=flat)

Built for [React Native](https://github.com/facebook/react-native)!

> A subclass of [`Gesture.Responder`](https://github.com/aleclarson/gesture) that provides uni-directional movement tracking.

- Compatible with React Native **v0.22.x**

```coffee
Draggable = require "Draggable"
```

### Options

```coffee
# Either "x" or "y".
axis: Draggable.Axis

# Return false when dragging should be prevented.
canDrag: Function

# The required distance travelled before a drag is recognized.
# Defaults to 10.
captureDistance: Number
```

### Properties

```coffee
# Defaults to 'options.axis'
drag.axis

# A 'NativeValue' that represents the position of the gesture.
# Feel free to animate this value.
# Defaults to zero.
drag.offset
```

-

## Draggable.Gesture

> The `Draggable.Gesture` type represents a series
> of touch events that have been tracked as a single gesture.

### Properties

```coffee
# The value of 'drag.offset' when the gesture began.
gesture.startOffset

# The absolute position when the gesture began.
gesture.startPosition

# The absolute position at the current time.
gesture.position

# The distance travelled during the gesture.
# Does not include 'options.captureDistance'.
gesture.distance

# The directional velocity at the current time.
gesture.velocity
```
