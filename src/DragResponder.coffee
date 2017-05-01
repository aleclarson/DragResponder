
{AnimatedValue} = require "Animated"
{Responder} = require "gesture"

ResponderSyntheticEvent = require "react-native/lib/ResponderSyntheticEvent"
emptyFunction = require "emptyFunction"
LazyVar = require "LazyVar"
OneOf = require "OneOf"
Event = require "eve"
Type = require "Type"

Gesture = require "./Gesture"

type = Type "DragResponder"

type.inherits Responder

type.defineArgs ->

  required: yes
  types:
    axis: OneOf "x y"
    offset: Number.or AnimatedValue
    captureDistance: Number
    canDrag: Function
    shouldRespondOnStart: Function
    shouldCaptureOnMove: Function

  defaults:
    offset: 0
    captureDistance: 10
    canDrag: emptyFunction.thatReturnsTrue
    shouldRespondOnStart: emptyFunction.thatReturnsFalse
    shouldCaptureOnMove: emptyFunction.thatReturnsTrue

type.defineStatics {Gesture}

type.defineFrozenValues (options) ->

  axis: options.axis

  offset: @_createOffset options.offset

  isHorizontal: options.axis is "x"

  _captureDistance: options.captureDistance

  _lockedAxis: LazyVar =>
    gesture = @_gesture
    dx = Math.abs gesture.dx
    dy = Math.abs gesture.dy
    return "x" if @_isAxisDominant dx, dy
    return "y" if @_isAxisDominant dy, dx
    return null

type.defineValues (options) ->

  _canDrag: options.canDrag

#
# Prototype
#

type.defineMethods

  _createOffset: (offset) ->
    return offset if offset instanceof AnimatedValue
    return AnimatedValue offset

  _isAxisDominant: (a, b) ->
    (a - 2) > b and (a >= @_captureDistance)

  _canDragOnStart: ->
    return yes if @_canDrag @_gesture
    @terminate()
    return no

  _canDragOnMove: ->

    unless @_canDrag @_gesture
      @terminate()
      return no

    lockedAxis = @_lockedAxis.get()

    # Neither axis is dominant!
    if lockedAxis is null
      @_lockedAxis.reset()
      return no

    # The opposite axis is dominant!
    if lockedAxis isnt @axis
      @terminate()
      return no

    # Our axis is dominant!
    return yes

type.overrideMethods

  __createGesture: (options) ->
    options.axis = @axis
    options.startOffset = @offset.get()
    return Gesture options

  __shouldRespondOnStart: ->
    return no unless @_canDragOnStart()
    return @__super arguments

  __shouldRespondOnMove: ->
    return no unless @_canDragOnMove()
    return @__super arguments

  __shouldCaptureOnStart: ->
    return no unless @_canDragOnStart()
    return @__super arguments

  __shouldCaptureOnMove: ->
    return no unless @_canDragOnMove()
    return @__super arguments

  __onTouchMove: (event) ->
    gesture = @_gesture
    gesture.__onTouchMove event
    @_isGranted and @offset.set gesture.startOffset + gesture.distance
    @didTouchMove.emit gesture
    return

  __onTouchEnd: (event) ->
    {touches} = event.nativeEvent

    if touches.length is 0
      @_lockedAxis.reset()

    @__super arguments

  __onGrant: ->
    gesture = @_gesture
    @offset.stopAnimation()
    @__super arguments
    gesture.startOffset = @offset.get() - gesture.distance
    return

module.exports = type.build()
