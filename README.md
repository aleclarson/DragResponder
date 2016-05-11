
# draggable v1.0.0 [![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

A [`Gesture.Responder`](https://github.com/aleclarson/gesture#gestureresponder) for controlling a draggable `View`.

Only supports one axis (x or y) at a time.

```coffee
Draggable = require "draggable"

dragY = Draggable
  axis: "y"
  canDrag: (gesture) ->
    # Return `false` if dragging should not be recognized.
  shouldCaptureAtVelocity: (velocity) ->
    # When you inevitably animate 'dragY.offset', you can capture the touch at high animation velocity!

dragY.didTouchStart (gesture) ->
  # Dragging has begun!

dragY.didTouchMove (gesture) ->
  # The user is moving his finger!

dragY.didTouchEnd (gesture) ->
  # Dragging has ended!

# Mix this into the props of a View!
dragY.touchHandlers
```
