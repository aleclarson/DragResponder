var Axis, Gesture, LazyVar, NativeValue, Responder, Type, emptyFunction, getArgProp, type;

NativeValue = require("component").NativeValue;

Responder = require("gesture").Responder;

emptyFunction = require("emptyFunction");

getArgProp = require("getArgProp");

LazyVar = require("LazyVar");

Type = require("Type");

Gesture = require("./Gesture");

Axis = require("./Axis");

type = Type("Draggable");

type.inherits(Responder);

type.defineStatics({
  Gesture: Gesture,
  Axis: Axis
});

type.optionTypes = {
  axis: Axis,
  canDrag: Function,
  captureDistance: Number
};

type.optionDefaults = {
  canDrag: emptyFunction.thatReturnsTrue,
  captureDistance: 10,
  shouldRespondOnStart: emptyFunction.thatReturnsFalse,
  shouldCaptureOnMove: emptyFunction.thatReturnsTrue
};

type.defineFrozenValues({
  axis: getArgProp("axis"),
  offset: function() {
    return NativeValue(0);
  },
  _captureDistance: getArgProp("captureDistance"),
  _lockedAxis: function() {
    return LazyVar((function(_this) {
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
    })(this));
  }
});

type.defineValues({
  _canDrag: getArgProp("canDrag")
});

type.defineMethods({
  _isAxisDominant: function(a, b) {
    return (a - 2) > b && (a >= this._captureDistance);
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
  }
});

type.overrideMethods({
  __createGesture: function(options) {
    options.axis = this.axis;
    return Gesture(options);
  },
  __shouldRespondOnStart: function() {
    if (!this._canDragOnStart()) {
      return false;
    }
    return this.__super(arguments);
  },
  __shouldRespondOnMove: function() {
    if (!this._canDragOnMove()) {
      return false;
    }
    return this.__super(arguments);
  },
  __shouldCaptureOnStart: function() {
    if (!this._canDragOnStart()) {
      return false;
    }
    return this.__super(arguments);
  },
  __shouldCaptureOnMove: function() {
    if (!this._canDragOnMove()) {
      return false;
    }
    return this.__super(arguments);
  },
  __onTouchMove: function() {
    this.gesture.__onTouchMove();
    if (this.isGranted) {
      this.offset.value = this.gesture._startOffset - this.gesture.distance;
    }
    return this.didTouchMove.emit(this.gesture);
  },
  __onTouchEnd: function(event, touchCount) {
    if (touchCount === 0) {
      this._lockedAxis.reset();
    }
    return this.__super(arguments);
  },
  __onGrant: function() {
    var ref;
    if ((ref = this.offset.animation) != null) {
      ref.stop();
    }
    this.gesture._startOffset = this.offset.value;
    return this.__super(arguments);
  }
});

module.exports = type.build();

//# sourceMappingURL=map/Draggable.map
