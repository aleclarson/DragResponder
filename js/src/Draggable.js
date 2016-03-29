var Axis, CAPTURE_DISTANCE, Factory, Gesture, LazyVar, NativeValue, Responder, emptyFunction;

NativeValue = require("component").NativeValue;

Responder = require("gesture").Responder;

emptyFunction = require("emptyFunction");

LazyVar = require("lazy-var");

Factory = require("factory");

Gesture = require("./Gesture");

Axis = require("./Axis");

CAPTURE_DISTANCE = 10;

module.exports = Factory("Draggable", {
  statics: {
    Gesture: Gesture,
    Axis: Axis
  },
  kind: Responder,
  optionTypes: {
    axis: Axis,
    canDrag: Function,
    shouldCaptureAtVelocity: Function
  },
  optionDefaults: {
    canDrag: emptyFunction.thatReturnsTrue,
    shouldCaptureAtVelocity: emptyFunction.thatReturnsFalse,
    shouldCaptureOnMove: emptyFunction.thatReturnsTrue
  },
  customValues: {
    startOffset: {
      get: function() {
        return this._startOffset;
      },
      set: function(newValue, oldValue) {
        if (newValue === oldValue) {
          return;
        }
        this._startOffset = newValue;
        return this.offset.value = newValue;
      }
    }
  },
  initFrozenValues: function(options) {
    return {
      axis: options.axis,
      offset: NativeValue(0),
      _lockedAxis: LazyVar((function(_this) {
        return function() {
          var dx, dy;
          dx = Math.abs(_this._gesture.dx);
          dy = Math.abs(_this._gesture.dy);
          if (_this._isAxisDominant(dx, dy)) {
            return "x";
          }
          if (_this._isAxisDominant(dy, dx)) {
            return "y";
          }
          return null;
        };
      })(this))
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
      _startOffset: null
    };
  },
  init: function() {
    return this.offset.type = Number;
  },
  _isAxisDominant: function(a, b) {
    return (a - 2) > b && (a >= CAPTURE_DISTANCE);
  },
  _isAxisLocked: function() {
    var lockedAxis;
    if (!this._canDrag(this._gesture)) {
      return this._eligible = false;
    }
    lockedAxis = this._lockedAxis.get();
    if (lockedAxis === null) {
      this._lockedAxis.reset();
      return false;
    }
    if (lockedAxis !== this.axis) {
      return this._eligible = false;
    }
    return true;
  },
  _needsUpdate: function() {
    if (!Responder.prototype._needsUpdate.apply(this, arguments)) {
      return false;
    }
    return this._eligible;
  },
  _setEligibleResponder: function() {
    this._eligible = true;
    Responder.prototype._setEligibleResponder.apply(this, arguments);
  },
  _getGestureType: function() {
    return (function(_this) {
      return function(options) {
        options.axis = _this.axis;
        return Gesture(options);
      };
    })(this);
  },
  _shouldRespondOnStart: function() {
    if (!this._canDrag(this._gesture)) {
      return this._eligible = false;
    }
    return Responder.prototype._shouldRespondOnStart.apply(this, arguments);
  },
  _shouldRespondOnMove: function() {
    if (!this._isAxisLocked()) {
      return false;
    }
    return Responder.prototype._shouldRespondOnMove.apply(this, arguments);
  },
  _shouldCaptureOnStart: function() {
    if (!this._canDrag(this._gesture)) {
      return this._eligible = false;
    }
    if (this.offset.isAnimating && this._shouldCaptureAtVelocity(Math.abs(this.offset.velocity))) {
      this.offset.stopAnimation();
      return true;
    }
    return Responder.prototype._shouldCaptureOnStart.apply(this, arguments);
  },
  _shouldCaptureOnMove: function() {
    if (!this._isAxisLocked()) {
      return false;
    }
    return Responder.prototype._shouldCaptureOnMove.apply(this, arguments);
  },
  _onTouchStart: function() {
    if (!this._active) {
      this._lockedAxis.reset();
    }
    return Responder.prototype._onTouchStart.apply(this, arguments);
  },
  _onTouchMove: function(event) {
    this._gesture._onTouchMove(event);
    if (this._captured) {
      this.offset.value = this._startOffset + this._gesture.distance;
    }
    this.didTouchMove.emit(this._gesture, event);
  },
  _onGrant: function() {
    this._startOffset = this.offset.value;
    log.it(this.__id + "._onGrant: { startOffset: " + this._startOffset + " }");
    Responder.prototype._onGrant.apply(this, arguments);
  }
});

//# sourceMappingURL=../../map/src/Draggable.map
