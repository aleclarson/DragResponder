
Gesture = require "gesture"
Type = require "Type"

Axis = require "./Axis"

type = Type "Draggable_Gesture"

type.inherits Gesture

type.defineOptions
  axis: Axis.isRequired

type.defineProperties

  startOffset: get: ->
    @_startOffset

  startPosition: get: ->
    if @_horizontal then @x0 else @y0

  position: get: ->
    if @_horizontal then @x else @y

  distance: get: ->
    if @_horizontal then @dx - @_grantDX
    else @dy - @_grantDY

  velocity: get: ->
    if @_horizontal then @vx else @vy

type.defineFrozenValues

  _horizontal: (options) -> options.axis is "x"

type.defineValues

  _startOffset: null

module.exports = type.build()
