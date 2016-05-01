
# draggable v1.0.0 [![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Built for [React Native](https://github.com/facebook/react-native)!

`Draggable` is a subclass of [`Gesture.Responder`](https://github.com/aleclarson/gesture). It provides uni-directional movement tracking.

### Draggable.optionTypes

```coffee
# Either "x" or "y".
axis: Draggable.Axis

# Return false when dragging should be prevented.
canDrag: Function

# The required distance travelled before a drag is recognized.
# Defaults to 10.
captureDistance: Number
```

### Draggable.properties

```coffee
# Defaults to 'options.axis'
drag.axis

# A 'NativeValue' that represents the position of the gesture.
# Feel free to animate this value.
# Defaults to zero.
drag.offset
```

### Draggable.Gesture.properties

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
