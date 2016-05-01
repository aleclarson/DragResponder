var Axis, Gesture, Type, type;

Gesture = require("gesture");

Type = require("Type");

Axis = require("./Axis");

type = Type("Draggable_Gesture");

type.inherits(Gesture);

type.optionTypes = {
  axis: Axis
};

type.defineProperties({
  startOffset: {
    get: function() {
      return this._startOffset;
    }
  },
  startPosition: {
    get: function() {
      if (this._horizontal) {
        return this.x0;
      } else {
        return this.y0;
      }
    }
  },
  position: {
    get: function() {
      if (this._horizontal) {
        return this.x;
      } else {
        return this.y;
      }
    }
  },
  distance: {
    get: function() {
      if (this._horizontal) {
        return this.dx - this._grantDX;
      } else {
        return this.dy - this._grantDY;
      }
    }
  },
  velocity: {
    get: function() {
      if (this._horizontal) {
        return this.vx;
      } else {
        return this.vy;
      }
    }
  }
});

type.defineFrozenValues({
  _horizontal: function(options) {
    return options.axis === "x";
  }
});

type.defineValues({
  _startOffset: null
});

module.exports = type.build();

//# sourceMappingURL=../../map/src/Gesture.map
