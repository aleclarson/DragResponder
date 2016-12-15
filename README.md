
# DragResponder v2.1.1 ![stable](https://img.shields.io/badge/stability-stable-4EBA0F.svg?style=flat)

A [`Gesture.Responder`](https://github.com/aleclarson/gesture) that provides uni-directional movement tracking.

### Options

```coffee
# Either "x" or "y".
axis: String

# The default value of `this.offset`.
# Defaults to 0.
offset: Number

# The required distance travelled before a drag is recognized.
# Defaults to 10.
captureDistance: Number

# Return `false` when dragging should be prevented.
canDrag: Function
```

### Properties

```coffee
# Defaults to 'options.axis'
drag.axis

# A 'NativeValue' that represents the position of the gesture.
# Feel free to animate this value.
# Defaults to zero.
drag.offset

# Equals `true` if the axis equals "x".
drag.isHorizontal

# An `Event` that emits when dragging occurs.
drag.didDrag ->
```

-

## DragResponder.Gesture

Extends the `Gesture` type to support common dragging-related properties. 

### Properties

```coffee
# The value of 'drag.offset' when the gesture began.
gesture.startOffset

# The absolute position when the gesture began.
gesture.startPosition

# The distance travelled in the first move event.
gesture.startDistance

# The absolute position at the current time.
gesture.position

# The distance travelled during the gesture.
# Does not include 'options.captureDistance'.
gesture.distance

# The directional velocity at the current time.
gesture.velocity
```
