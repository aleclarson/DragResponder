var Children, Draggable, Style, View, ref;

ref = require("component"), View = ref.View, Style = ref.Style, Children = ref.Children;

Draggable = require("./Draggable");

module.exports = Component("DraggableView", {
  propTypes: {
    draggable: Draggable.Kind,
    style: Style,
    children: Children
  },
  render: function() {
    return View({
      style: [
        this.props.style, {
          transform: [this.draggable.transform]
        }
      ],
      children: this.props.children,
      mixins: [this.draggable.mixin]
    });
  }
});

//# sourceMappingURL=../../map/src/DraggableView.map
