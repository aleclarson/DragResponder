
Gesture = require "gesture"
Type = require "Type"

Axis = require "./Axis"

type = Type "Draggable_Gesture"

type.inherits Gesture

type.defineOptions
  axis: Axis.isRequired

type.defineGetters

  startOffset: ->
    @_startOffset

  startPosition: ->
    if @_horizontal
    then @x0
    else @y0

  startDistance: ->
    if @_horizontal
    then @dx0
    else @dy0

  position: ->
    if @_horizontal
    then @x
    else @y

  distance: ->
    if @_horizontal
    then @dx - @dx0
    else @dy - @dy0

  velocity: ->
    if @_horizontal
    then @vx
    else @vy

type.defineValues (options) ->

  _startOffset: options.startOffset

  _horizontal: options.axis is "x"

module.exports = type.build()
