var Axis, Gesture, Type, type;

Gesture = require("gesture");

Type = require("Type");

Axis = require("./Axis");

type = Type("Draggable_Gesture");

type.inherits(Gesture);

type.defineOptions({
  axis: Axis.isRequired
});

type.defineGetters({
  startOffset: function() {
    return this._startOffset;
  },
  startPosition: function() {
    if (this._horizontal) {
      return this.x0;
    } else {
      return this.y0;
    }
  },
  startDistance: function() {
    if (this._horizontal) {
      return this.dx0;
    } else {
      return this.dy0;
    }
  },
  position: function() {
    if (this._horizontal) {
      return this.x;
    } else {
      return this.y;
    }
  },
  distance: function() {
    if (this._horizontal) {
      return this.dx - this.dx0;
    } else {
      return this.dy - this.dy0;
    }
  },
  velocity: function() {
    if (this._horizontal) {
      return this.vx;
    } else {
      return this.vy;
    }
  }
});

type.defineValues(function(options) {
  return {
    _startOffset: options.startOffset,
    _horizontal: options.axis === "x"
  };
});

module.exports = type.build();

//# sourceMappingURL=map/Gesture.map
