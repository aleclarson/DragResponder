
Gesture = require "gesture"
Factory = require "factory"

Axis = require "./Axis"

DISTANCE = { x: "dx",    y: "dy" }
POSITION = { x: "moveX", y: "moveY" }
VELOCITY = { x: "vx",    y: "vy" }

module.exports = Factory "Draggable_Gesture",

  kind: Gesture

  optionTypes:
    axis: Axis

  customValues:

    startPosition: get: ->
      if @_horizontal then @x0 else @y0

    position: get: ->
      if @_horizontal then @x else @y

    distance: get: ->
      if @_horizontal then @dx - @_grantDX
      else @dy - @_grantDY

    velocity: get: ->
      if @_horizontal then @vx else @vy

  initFrozenValues: (options) ->

    _horizontal: options.axis is "x"
