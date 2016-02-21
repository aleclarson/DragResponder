
{ NativeValue } = require "component"
{ OneOf } = require "type-utils"

objectify = require "objectify"
Factory = require "factory"

CAPTURE_DISTANCE = 10

EVENT_KEYS = [
  "shouldRespondOnStart"
  "shouldCaptureOnStart"
  "shouldCaptureOnMove"
  "onDragStart"
  "onDrag"
  "onDragEnd"
]

PAN_METHODS = [
  "onStartShouldSetPanResponder"
  "onStartShouldSetPanResponderCapture"
  "onMoveShouldSetPanResponderCapture"
  "onPanResponderGrant"
  "onPanResponderMove"
  "onPanResponderRelease"
]

module.exports = Factory "Draggable",

  optionTypes:
    axis: OneOf [ "x", "y" ]
    shouldRespondOnStart: [ Function, Void ]
    shouldCaptureOnStart: [ Function, Void ]
    shouldCaptureOnMove: [ Function, Void ]
    onDragStart: [ Function, Void ]
    onDrag: [ Function, Void ]
    onDragEnd: [ Function, Void ]

  boundMethods: PAN_METHODS

  customValues:

    mixin: lazy: ->
      createMixin this

    transform: lazy: ->
      if @x then { translateX: @offset }
      else { translateY: @offset }

  initFrozenValues: (options) ->
    x: options.axis is "x"
    y: options.axis is "y"
    axis: options.axis
    offset: NativeValue 0
    _handlers: objectify { keys: EVENT_KEYS, values: options }

  initReactiveValues: ->
    isEligible: yes
    isDragging: no

  onStartShouldSetPanResponder: (event, gesture) ->
    shouldRespond = @_handlers.shouldRespondOnStart?()
    shouldRespond ?= no

  onStartShouldSetPanResponderCapture: (event, gesture) ->
    @isEligible = yes
    shouldCapture = @_handlers.shouldCaptureOnStart?()
    shouldCapture ?= no

  onMoveShouldSetPanResponderCapture: (event, gesture) ->
    return no unless @isEligible
    distance = getDistanceXY gesture, @x
    dx = Math.abs distance.x
    dy = Math.abs distance.y
    return yes if isDominant dy, dx
    @isEligible = no if isDominant dx, dy
    return no

  onPanResponderGrant: (event, gesture) ->
    @isDragging = yes
    @offset.stopAnimation()
    # @offset.value = roundToScreenScale @offset.value
    @startOffset = @offset.value
    @_handlers.onDragStart? {
      position: getPosition gesture, @x
    }

  onPanResponderMove: (event, gesture) ->
    distance = getDistance gesture, @x
    @offset.value = @startOffset + distance
    @_handlers.onDrag? {
      position: getPosition gesture, @x
      distance: getDistance gesture, @x
    }

  onPanResponderRelease: (event, gesture) ->
    @isDragging = no
    @_handlers.onDragEnd? {
      velocity: getVelocity gesture, @x
      position: getPosition gesture, @x
      distance: getDistance gesture, @x
    }

createMixin = (draggable) ->
  methods = objectify { keys: PAN_METHODS, values: draggable }
  responder = PanResponder.create methods
  responder.panHandlers

isDominant = (a, b) ->
  (a - 2) > b and (a >= CAPTURE_DISTANCE)

getPosition = (gesture, x) ->
  gesture[if x then "moveX" else "moveY"]

getVelocity = (gesture, x) ->
  gesture[if x then "vx" else "vy"]

getDistance = (gesture, x) ->
  gesture[if x then "dx" else "dy"]

getDistanceXY = (gesture, x) ->
  x: gesture[if x then "dy" else "dx"]
  y: gesture[if x then "dx" else "dy"]
