
{ NativeValue } = require "component"

{ Responder } = require "gesture"

emptyFunction = require "emptyFunction"
Factory = require "factory"

Gesture = require "./Gesture"

CAPTURE_DISTANCE = 10

module.exports = Factory "Draggable",

  kind: Responder

  optionTypes:
    axis: Gesture.Axis
    canDrag: Function
    shouldCaptureAtVelocity: Function

  optionDefaults:
    canDrag: emptyFunction.thatReturnsTrue
    shouldCaptureAtVelocity: emptyFunction.thatReturnsFalse

  customValues:

    startOffset:
      get: -> @_startOffset
      set: (newValue) ->
        @offset.value = newValue
        @_startOffset = newValue

  initFrozenValues: (options) ->

    axis: options.axis

    offset: NativeValue 0

  initValues: (options) ->

    _eligible: no

    _canDrag: options.canDrag

    _shouldCaptureAtVelocity: options.shouldCaptureAtVelocity

  initReactiveValues: ->

    _startOffset: null

    _gesture: null

  _isDominantAxis: (a, b) ->
    (a - 2) > b and (a >= CAPTURE_DISTANCE)

  _getDominantAxis: ->
    dx = Math.abs @_gesture.dx
    dy = Math.abs @_gesture.dy
    return "x" if @_isDominantAxis dx, dy
    return "y" if @_isDominantAxis dy, dx
    return null

  _onStartShouldSetPanResponderCapture: (gesture) ->
    return no unless @_enabled
    log.it "Responder._shouldCaptureOnStart()"
    @_eligible = yes
    @_gesture = Gesture { gesture, @axis }
    return no unless @_canDrag @_gesture
    if @offset.isAnimating and @_shouldCaptureAtVelocity Math.abs @offset.velocity
      @offset.stopAnimation()
      return yes
    @_shouldCaptureOnStart @_gesture

  _onMoveShouldSetPanResponderCapture: ->
    return no unless @_enabled
    return no unless @_eligible
    @_gesture._updateValues()
    return no unless @_canDrag @_gesture
    dominantAxis = @_getDominantAxis()
    return no if dominantAxis is null
    return @_eligible = no if dominantAxis isnt @axis
    @_shouldCaptureOnMove @_gesture

  _onPanResponderGrant: ->
    @_startOffset = @offset.value
    Responder::_onPanResponderGrant.call this

  _onPanResponderMove: ->
    return unless @_gesture
    @_gesture._updateValues()
    @offset.value = @_startOffset + @_gesture.distance
    Responder::_onPanResponderMove.call this
