var CAPTURE_DISTANCE, Factory, Gesture, NativeValue, Responder, emptyFunction;

NativeValue = require("component").NativeValue;

Responder = require("gesture").Responder;

emptyFunction = require("emptyFunction");

Factory = require("factory");

Gesture = require("./Gesture");

CAPTURE_DISTANCE = 10;

module.exports = Factory("Draggable", {
  kind: Responder,
  optionTypes: {
    axis: Gesture.Axis,
    canDrag: Function,
    shouldCaptureAtVelocity: Function
  },
  optionDefaults: {
    canDrag: emptyFunction.thatReturnsTrue,
    shouldCaptureAtVelocity: emptyFunction.thatReturnsFalse
  },
  customValues: {
    startOffset: {
      get: function() {
        return this._startOffset;
      },
      set: function(newValue) {
        this.offset.value = newValue;
        return this._startOffset = newValue;
      }
    }
  },
  initFrozenValues: function(options) {
    return {
      axis: options.axis,
      offset: NativeValue(0)
    };
  },
  initValues: function(options) {
    return {
      _eligible: false,
      _canDrag: options.canDrag,
      _shouldCaptureAtVelocity: options.shouldCaptureAtVelocity
    };
  },
  initReactiveValues: function() {
    return {
      _startOffset: null,
      _gesture: null
    };
  },
  _isDominantAxis: function(a, b) {
    return (a - 2) > b && (a >= CAPTURE_DISTANCE);
  },
  _getDominantAxis: function() {
    var dx, dy;
    dx = Math.abs(this._gesture.dx);
    dy = Math.abs(this._gesture.dy);
    if (this._isDominantAxis(dx, dy)) {
      return "x";
    }
    if (this._isDominantAxis(dy, dx)) {
      return "y";
    }
    return null;
  },
  _onStartShouldSetPanResponderCapture: function(gesture) {
    if (!this._enabled) {
      return false;
    }
    log.it("Responder._shouldCaptureOnStart()");
    this._eligible = true;
    this._gesture = Gesture({
      gesture: gesture,
      axis: this.axis
    });
    if (!this._canDrag(this._gesture)) {
      return false;
    }
    if (this.offset.isAnimating && this._shouldCaptureAtVelocity(Math.abs(this.offset.velocity))) {
      this.offset.stopAnimation();
      return true;
    }
    return this._shouldCaptureOnStart(this._gesture);
  },
  _onMoveShouldSetPanResponderCapture: function() {
    var dominantAxis;
    if (!this._enabled) {
      return false;
    }
    if (!this._eligible) {
      return false;
    }
    this._gesture._updateValues();
    if (!this._canDrag(this._gesture)) {
      return false;
    }
    dominantAxis = this._getDominantAxis();
    if (dominantAxis === null) {
      return false;
    }
    if (dominantAxis !== this.axis) {
      return this._eligible = false;
    }
    return this._shouldCaptureOnMove(this._gesture);
  },
  _onPanResponderGrant: function() {
    this._startOffset = this.offset.value;
    return Responder.prototype._onPanResponderGrant.call(this);
  },
  _onPanResponderMove: function() {
    if (!this._gesture) {
      return;
    }
    this._gesture._updateValues();
    this.offset.value = this._startOffset + this._gesture.distance;
    return Responder.prototype._onPanResponderMove.call(this);
  }
});

//# sourceMappingURL=../../map/src/Draggable.map
