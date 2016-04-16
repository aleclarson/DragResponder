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
    canDrag: Function
  },
  optionDefaults: {
    canDrag: emptyFunction.thatReturnsTrue,
    shouldRespondOnStart: emptyFunction.thatReturnsFalse,
    shouldCaptureOnMove: emptyFunction.thatReturnsTrue
  },
  initFrozenValues: function(options) {
    return {
      axis: options.axis,
      offset: NativeValue(0),
      _lockedAxis: LazyVar((function(_this) {
        return function() {
          var dx, dy;
          dx = Math.abs(_this.gesture.dx);
          dy = Math.abs(_this.gesture.dy);
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
      _canDrag: options.canDrag
    };
  },
  init: function() {
    return this.offset.type = Number;
  },
  _isAxisDominant: function(a, b) {
    return (a - 2) > b && (a >= CAPTURE_DISTANCE);
  },
  _canDragOnStart: function() {
    if (!this._canDrag(this.gesture)) {
      this.terminate();
      return false;
    }
    return true;
  },
  _canDragOnMove: function() {
    var lockedAxis;
    if (!this._canDrag(this.gesture)) {
      this.terminate();
      return false;
    }
    lockedAxis = this._lockedAxis.get();
    if (lockedAxis === null) {
      this._lockedAxis.reset();
      return false;
    }
    if (lockedAxis !== this.axis) {
      this.terminate();
      return false;
    }
    return true;
  },
  __createGesture: function(options) {
    options.axis = this.axis;
    return Gesture(options);
  },
  __shouldRespondOnStart: function() {
    if (!this._canDragOnStart()) {
      return false;
    }
    return Responder.prototype.__shouldRespondOnStart.apply(this, arguments);
  },
  __shouldRespondOnMove: function() {
    if (!this._canDragOnMove()) {
      return false;
    }
    return Responder.prototype.__shouldRespondOnMove.apply(this, arguments);
  },
  __shouldCaptureOnStart: function() {
    if (!this._canDragOnStart()) {
      return false;
    }
    return Responder.prototype.__shouldCaptureOnStart.apply(this, arguments);
  },
  __shouldCaptureOnMove: function() {
    if (!this._canDragOnMove()) {
      return false;
    }
    return Responder.prototype.__shouldCaptureOnMove.apply(this, arguments);
  },
  __onTouchMove: function() {
    this.gesture.__onTouchMove();
    if (this.isCaptured) {
      this.offset.value = this.gesture._startOffset + this.gesture.distance;
    }
    return this.didTouchMove.emit(this.gesture);
  },
  __onTouchEnd: function(touchCount) {
    if (touchCount === 0) {
      this._lockedAxis.reset();
    }
    return Responder.prototype.__onTouchEnd.apply(this, arguments);
  },
  __onGrant: function() {
    var ref;
    if ((ref = this.offset.animation) != null) {
      ref.stop();
    }
    this.gesture._startOffset = this.offset.value;
    return Responder.prototype.__onGrant.apply(this, arguments);
  }
});

//# sourceMappingURL=../../map/src/Draggable.map
