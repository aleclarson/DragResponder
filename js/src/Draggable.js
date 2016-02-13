var CAPTURE_DISTANCE, EVENT_KEYS, Factory, NativeValue, OneOf, PAN_METHODS, createMixin, getDistance, getDistanceXY, getPosition, getVelocity, isDominant, objectify;

NativeValue = require("component").NativeValue;

OneOf = require("type-utils").OneOf;

objectify = require("objectify");

Factory = require("factory");

CAPTURE_DISTANCE = 10;

EVENT_KEYS = ["shouldRespondOnStart", "shouldCaptureOnStart", "shouldCaptureOnMove", "onDragStart", "onDrag", "onDragEnd"];

PAN_METHODS = ["onStartShouldSetPanResponder", "onStartShouldSetPanResponderCapture", "onMoveShouldSetPanResponderCapture", "onPanResponderGrant", "onPanResponderMove", "onPanResponderRelease"];

module.exports = Factory("DraggableAxis", {
  optionTypes: {
    axis: OneOf(["x", "y"])
  },
  events: EVENT_KEYS,
  boundMethods: PAN_METHODS,
  customValues: {
    mixin: {
      lazy: function() {
        return createMixin(this);
      }
    },
    transform: {
      lazy: function() {
        if (this.x) {
          return {
            translateX: this.offset
          };
        } else {
          return {
            translateY: this.offset
          };
        }
      }
    }
  },
  initFrozenValues: function(options) {
    return {
      x: options.axis === "x",
      y: options.axis === "y",
      axis: options.axis,
      offset: NativeValue(0),
      _handlers: objectify({
        keys: EVENT_KEYS,
        values: options
      })
    };
  },
  initReactiveValues: function() {
    return {
      isEligible: true,
      isDragging: false
    };
  },
  onStartShouldSetPanResponder: function(event, gesture) {
    var base, shouldRespond;
    shouldRespond = typeof (base = this._handlers).shouldRespondOnStart === "function" ? base.shouldRespondOnStart() : void 0;
    return shouldRespond != null ? shouldRespond : shouldRespond = false;
  },
  onStartShouldSetResponderCapture: function(event, gesture) {
    var base, shouldCapture;
    this.isEligible = true;
    shouldCapture = typeof (base = this._handlers).shouldCaptureOnStart === "function" ? base.shouldCaptureOnStart() : void 0;
    return shouldCapture != null ? shouldCapture : shouldCapture = false;
  },
  onMoveShouldSetPanResponderCapture: function(event, gesture) {
    var distance, dx, dy;
    if (!this.isEligible) {
      return false;
    }
    distance = getDistanceXY(gesture, this.x);
    dx = Math.abs(distance.x);
    dy = Math.abs(distance.y);
    if (isDominant(dy, dx)) {
      return true;
    }
    if (isDominant(dx, dy)) {
      this.isEligible = false;
    }
    return false;
  },
  onPanResponderGrant: function(event, gesture) {
    var base;
    this.isDragging = true;
    this.offset.stopAnimation();
    this.startOffset = this.offset.value;
    return typeof (base = this._handlers).onDragStart === "function" ? base.onDragStart() : void 0;
  },
  onPanResponderMove: function(event, gesture) {
    var base, distance;
    distance = getDistance(gesture);
    this.offset.value = this.startOffset + distance;
    return typeof (base = this._handlers).onDrag === "function" ? base.onDrag() : void 0;
  },
  onPanResponderRelease: function(event, gesture) {
    var base;
    this.isDragging = false;
    return typeof (base = this._handlers).onDragEnd === "function" ? base.onDragEnd({
      velocity: getVelocity(gesture)
    }) : void 0;
  }
});

createMixin = function(draggable) {
  var methods, responder;
  methods = objectify({
    keys: PAN_METHODS,
    values: draggable
  });
  responder = PanResponder.create(methods);
  return responder.panHandlers;
};

isDominant = function(a, b) {
  return (a - 2) > b && (a >= CAPTURE_DISTANCE);
};

getPosition = function(gesture, x) {
  return gesture[x ? "moveX" : "moveY"];
};

getVelocity = function(gesture, x) {
  return gesture[x ? "vx" : "vy"];
};

getDistance = function(gesture, x) {
  return gesture[x ? "dx" : "dy"];
};

getDistanceXY = function(gesture, x) {
  return {
    x: gesture[x ? "dy" : "dx"],
    y: gesture[x ? "dx" : "dy"]
  };
};

//# sourceMappingURL=../../map/src/Draggable.map
