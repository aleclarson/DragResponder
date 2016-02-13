
{ View, Style, Children } = require "component"

Draggable = require "./Draggable"

module.exports = Component "DraggableView",

  propTypes:
    draggable: Draggable.Kind
    style: Style
    children: Children

  render: ->
    return View
      style: [
        @props.style
        transform: [
          @draggable.transform
        ]
      ]
      children: @props.children
      mixins: [
        @draggable.mixin
      ]
