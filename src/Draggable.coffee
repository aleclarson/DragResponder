
{ NativeValue } = require "component"

{ Responder } = require "gesture"

emptyFunction = require "emptyFunction"
LazyVar = require "lazy-var"
Factory = require "factory"

Gesture = require "./Gesture"
Axis = require "./Axis"

CAPTURE_DISTANCE = 10

module.exports = Factory "Draggable",

  statics: { Gesture, Axis }

  kind: Responder

  optionTypes:
    axis: Axis
    canDrag: Function

  optionDefaults:
    canDrag: emptyFunction.thatReturnsTrue
    shouldRespondOnStart: emptyFunction.thatReturnsFalse
    shouldCaptureOnMove: emptyFunction.thatReturnsTrue

  initFrozenValues: (options) ->

    axis: options.axis

    offset: NativeValue 0

    _lockedAxis: LazyVar =>
      dx = Math.abs @gesture.dx
      dy = Math.abs @gesture.dy
      return "x" if @_isAxisDominant dx, dy
      return "y" if @_isAxisDominant dy, dx
      return null

  initValues: (options) ->

    _canDrag: options.canDrag

  init: ->
    @offset.type = Number

  _isAxisDominant: (a, b) ->
    (a - 2) > b and (a >= CAPTURE_DISTANCE)

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

#
# Responder.prototype
#

  __createGesture: (options) ->
    options.axis = @axis
    return Gesture options

  __shouldRespondOnStart: ->

    unless @_canDragOnStart()
      return no

    return Responder::__shouldRespondOnStart.apply this, arguments

  __shouldRespondOnMove: ->

    unless @_canDragOnMove()
      return no

    return Responder::__shouldRespondOnMove.apply this, arguments

  __shouldCaptureOnStart: ->

    unless @_canDragOnStart()
      return no

    return Responder::__shouldCaptureOnStart.apply this, arguments

  __shouldCaptureOnMove: ->

    unless @_canDragOnMove()
      return no

    return Responder::__shouldCaptureOnMove.apply this, arguments

  __onTouchMove: ->

    @gesture.__onTouchMove()

    @offset.value = @gesture._startOffset + @gesture.distance if @isCaptured

    @didTouchMove.emit @gesture

  __onTouchEnd: (touchCount) ->

    if touchCount is 0
      @_lockedAxis.reset()

    Responder::__onTouchEnd.apply this, arguments

  __onGrant: ->

    @offset.animation?.stop()

    @gesture._startOffset = @offset.value

    Responder::__onGrant.apply this, arguments
