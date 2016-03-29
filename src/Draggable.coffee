
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
    shouldCaptureAtVelocity: Function

  optionDefaults:
    canDrag: emptyFunction.thatReturnsTrue
    shouldCaptureAtVelocity: emptyFunction.thatReturnsFalse
    shouldCaptureOnMove: emptyFunction.thatReturnsTrue

  customValues:

    startOffset:
      get: -> @_startOffset
      set: (newValue, oldValue) ->
        return if newValue is oldValue
        @_startOffset = newValue
        @offset.value = newValue

  initFrozenValues: (options) ->

    axis: options.axis

    offset: NativeValue 0

    _lockedAxis: LazyVar =>
      dx = Math.abs @_gesture.dx
      dy = Math.abs @_gesture.dy
      return "x" if @_isAxisDominant dx, dy
      return "y" if @_isAxisDominant dy, dx
      return null

  initValues: (options) ->

    _eligible: no

    _canDrag: options.canDrag

    _shouldCaptureAtVelocity: options.shouldCaptureAtVelocity

  initReactiveValues: ->

    _startOffset: null

  init: ->
    @offset.type = Number

  _isAxisDominant: (a, b) ->
    (a - 2) > b and (a >= CAPTURE_DISTANCE)

  _isAxisLocked: ->
    unless @_canDrag @_gesture
      return @_eligible = no
    lockedAxis = @_lockedAxis.get()
    if lockedAxis is null
      @_lockedAxis.reset()
      return no
    if lockedAxis isnt @axis
      return @_eligible = no
    return yes

#
# Subclass overrides
#

  _needsUpdate: ->
    return no unless Responder::_needsUpdate.apply this, arguments
    return @_eligible

  _setEligibleResponder: ->
    @_eligible = yes
    Responder::_setEligibleResponder.apply this, arguments
    return

  _getGestureType: -> (options) =>
    options.axis = @axis
    return Gesture options

  _shouldRespondOnStart: ->
    return @_eligible = no unless @_canDrag @_gesture
    return Responder::_shouldRespondOnStart.apply this, arguments

  _shouldRespondOnMove: ->
    return no unless @_isAxisLocked()
    return Responder::_shouldRespondOnMove.apply this, arguments

  _shouldCaptureOnStart: ->
    return @_eligible = no unless @_canDrag @_gesture
    if @offset.isAnimating and @_shouldCaptureAtVelocity Math.abs @offset.velocity
      @offset.stopAnimation()
      return yes
    return Responder::_shouldCaptureOnStart.apply this, arguments

  _shouldCaptureOnMove: ->
    return no unless @_isAxisLocked()
    return Responder::_shouldCaptureOnMove.apply this, arguments

  _onTouchStart: ->
    @_lockedAxis.reset() unless @_active
    return Responder::_onTouchStart.apply this, arguments

  _onTouchMove: (event) ->
    @_gesture._onTouchMove event
    @offset.value = @_startOffset + @_gesture.distance if @_captured
    @didTouchMove.emit @_gesture, event
    return

  _onGrant: ->
    @_startOffset = @offset.value
    log.it "#{@__id}._onGrant: { startOffset: #{@_startOffset} }"
    Responder::_onGrant.apply this, arguments
    return
