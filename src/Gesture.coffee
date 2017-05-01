
Velocity = require "Velocity"
Gesture = require "gesture"
Type = require "Type"

type = Type "DragResponder_Gesture"

type.inherits Gesture

type.defineArgs ->
  required: yes
  types: {axis: String}

type.defineGetters

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
    @_velocity.get()

  direction: ->
    @_velocity.direction

type.defineValues (options) ->

  _horizontal: options.axis is "x"

  _velocity: Velocity {maxAge: 300}

type.overrideMethods

  __onTouchStart: ->
    @__super arguments
    @_velocity.reset()
    return

  __onTouchMove: ->
    @__super arguments
    @_velocity.update Date.now(), @distance
    return

module.exports = type.build()
