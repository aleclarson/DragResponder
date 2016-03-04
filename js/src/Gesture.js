var Axis, DISTANCE, Factory, Gesture, OneOf, POSITION, VELOCITY;

OneOf = require("type-utils").OneOf;

Gesture = require("gesture");

Factory = require("factory");

Axis = OneOf(["x", "y"]);

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
  statics: {
    Axis: Axis
  },
  kind: Gesture,
  optionTypes: {
    axis: Axis,
    gesture: Object
  },
  customValues: {
    startPosition: {
      get: function() {
        return this._startPosition;
      }
    },
    position: {
      get: function() {
        return this._position;
      }
    },
    startDistance: {
      get: function() {
        var distance;
        distance = this._startDistance;
        return distance != null ? distance : distance = 0;
      }
    },
    distance: {
      get: function() {
        return this._distance - this.startDistance;
      }
    },
    velocity: {
      get: function() {
        return this._velocity;
      }
    }
  },
  initFrozenValues: function(options) {
    return {
      _axis: options.axis,
      _gesture: options.gesture
    };
  },
  initValues: function() {
    return {
      _distance: null,
      _position: null,
      _velocity: null,
      _startPosition: null,
      _startDistance: null
    };
  },
  init: function() {
    return this._updateAxisValues();
  },
  _getAxisValue: function(keymap, axis) {
    if (axis == null) {
      axis = this._axis;
    }
    return this._gesture[keymap[axis]];
  },
  _updateAxisValues: function() {
    this._distance = this._getAxisValue(DISTANCE);
    this._position = this._getAxisValue(POSITION);
    this._velocity = this._getAxisValue(VELOCITY);
  },
  _onTouchStart: function() {
    this._updateAxisValues();
    this._startDistance = null;
    this._touching = true;
  },
  _onTouchMove: function() {
    if (this._startDistance == null) {
      this._startDistance = this._distance;
    }
  }
});

//# sourceMappingURL=../../map/src/Gesture.map
