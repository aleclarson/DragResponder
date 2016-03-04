
{ OneOf } = require "type-utils"

Gesture = require "gesture"
Factory = require "factory"

Axis = OneOf [ "x", "y" ]

DISTANCE = { x: "dx",    y: "dy" }
POSITION = { x: "moveX", y: "moveY" }
VELOCITY = { x: "vx",    y: "vy" }

module.exports = Factory "Draggable_Gesture",

  statics: { Axis }

  kind: Gesture

  optionTypes:
    axis: Axis
    gesture: Object

  customValues:

    startPosition: get: ->
      @_startPosition

    position: get: ->
      @_position

    startDistance: get: ->
      distance = @_startDistance
      distance ?= 0

    distance: get: ->
      @_distance - @startDistance

    velocity: get: ->
      @_velocity

  initFrozenValues: (options) ->

    _axis: options.axis

    _gesture: options.gesture

  initValues: ->

    _distance: null

    _position: null

    _velocity: null

    _startPosition: null

    # This offsets a visual jump from the first movement.
    _startDistance: null

  init: ->
    @_updateAxisValues()

  _getAxisValue: (keymap, axis = @_axis) ->
    @_gesture[keymap[axis]]

  _updateAxisValues: ->
    @_distance = @_getAxisValue DISTANCE
    @_position = @_getAxisValue POSITION
    @_velocity = @_getAxisValue VELOCITY
    return

  _onTouchStart: ->
    @_updateAxisValues()
    @_startDistance = null
    @_touching = yes
    return

  _onTouchMove: ->
    @_startDistance ?= @_distance
    return
