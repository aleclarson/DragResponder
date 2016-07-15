
{ NativeValue } = require "component"
{ Responder } = require "gesture"

emptyFunction = require "emptyFunction"
fromArgs = require "fromArgs"
LazyVar = require "LazyVar"
Type = require "Type"

Gesture = require "./Gesture"
Axis = require "./Axis"

type = Type "Draggable"

type.inherits Responder

type.defineStatics { Gesture, Axis }

type.optionTypes =
  axis: Axis
  canDrag: Function
  captureDistance: Number

type.optionDefaults =
  canDrag: emptyFunction.thatReturnsTrue
  captureDistance: 10
  shouldRespondOnStart: emptyFunction.thatReturnsFalse
  shouldCaptureOnMove: emptyFunction.thatReturnsTrue

type.defineFrozenValues

  axis: fromArgs "axis"

  offset: -> NativeValue 0

  _captureDistance: fromArgs "captureDistance"

  _lockedAxis: -> LazyVar =>
    dx = Math.abs @gesture.dx
    dy = Math.abs @gesture.dy
    return "x" if @_isAxisDominant dx, dy
    return "y" if @_isAxisDominant dy, dx
    return null

type.defineValues

  _canDrag: fromArgs "canDrag"

type.defineMethods

  _isAxisDominant: (a, b) ->
    (a - 2) > b and (a >= @_captureDistance)

  _canDragOnStart: ->

    unless @_canDrag @gesture
      @terminate()
      return no

    return yes

  _canDragOnMove: ->

    unless @_canDrag @gesture
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
    @gesture.__onTouchMove event
    @offset.value = @gesture._startOffset + @gesture.distance if @isGranted
    @_events.emit "didTouchMove", [ @gesture, event ]

  __onTouchEnd: (event, touchCount) ->

    if touchCount is 0
      @_lockedAxis.reset()

    @__super arguments

  __onGrant: ->
    @offset.animation?.stop()
    @gesture._startOffset = @offset.value
    @__super arguments

module.exports = type.build()
