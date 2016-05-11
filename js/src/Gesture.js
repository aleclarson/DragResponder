var Axis, DISTANCE, Factory, Gesture, POSITION, VELOCITY;

Gesture = require("gesture");

Factory = require("factory");

Axis = require("./Axis");

DISTANCE = {
  x: "dx",
  y: "dy"
};

POSITION = {
  x: "moveX",
  y: "moveY"
};

VELOCITY = {
  x: "vx",
  y: "vy"
};

module.exports = Factory("Draggable_Gesture", {
  kind: Gesture,
  optionTypes: {
    axis: Axis
  },
  customValues: {
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
  },
  initFrozenValues: function(options) {
    return {
      _horizontal: options.axis === "x"
    };
  },
  initValues: function() {
    return {
      _startOffset: null
    };
  }
});

//# sourceMappingURL=../../map/src/Gesture.map
