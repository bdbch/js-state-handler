(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'dompurify'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, require('dompurify'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, global.dompurify);
    global.StateHandler = mod.exports;
  }
})(this, function (module, DOMPurify) {
  'use strict';

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var StateHandler = function () {
    function StateHandler() {
      var initialState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var initialFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      _classCallCheck(this, StateHandler);

      this.data = Object.assign({}, this.sanitize(initialState));
      this.initialState = initialState;
      this.functions = [];

      if (initialFn) {
        this.addToRenderer(initialFn);
      }
    }

    _createClass(StateHandler, [{
      key: 'set',
      value: function set(newState) {
        var changedKeys = Object.keys(newState);
        var fnsToRun = this.functions.filter(function (fnObj) {
          return fnObj.keys.filter(function (key) {
            return changedKeys.indexOf(key) > -1;
          }).length !== 0;
        }).map(function (fnObj) {
          return fnObj.method;
        });

        Object.assign(this.data, this.sanitize(newState));
        this.render(fnsToRun);
      }
    }, {
      key: 'reset',
      value: function reset() {
        Object.assign(this.data, this.initialState);
        this.render(this.functions);
      }
    }, {
      key: 'render',
      value: function render() {
        var fns = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var fnsToRun = fns || this.functions.map(function (fnObj) {
          return fnObj.method;
        });
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = fnsToRun[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var fn = _step.value;

            fn();
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    }, {
      key: 'addToRenderer',
      value: function addToRenderer() {
        var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        if (!fn && typeof fn !== 'function' && (typeof fn === 'undefined' ? 'undefined' : _typeof(fn)) !== 'object') {
          console.error('Please provide a function or an array of functions to add them to the renderer');
          return false;
        }

        if ((typeof fn === 'undefined' ? 'undefined' : _typeof(fn)) === 'object') {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = fn[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var renderFunction = _step2.value;

              if (typeof renderFunction.method !== 'function') {
                console.error('The provided data is not a function.');
                return false;
              }

              if (renderFunction.keys === '*') {
                renderFunction.keys = Object.keys(this.data);
              }

              this.functions.push(renderFunction);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        } else {
          if (fn.keys === '*') {
            fn.keys = Object.keys(this.data);
          }
          this.functions.push(fn);
        }
      }
    }, {
      key: 'pushNewState',
      value: function pushNewState(currentState, object) {
        currentState = [].concat(_toConsumableArray(currentState), [object]);
      }
    }, {
      key: 'sanitize',
      value: function sanitize(dirty) {
        var clean = Object.assign({}, dirty);

        for (var key in clean) {
          /** Checks for the 'sanitize' key on the "second level of the object": */
          if (clean[key]['sanitize']) {
            /** I noticed the set() value takes an Array, so I made a seperate if blok for that to iterate through the Array */
            if (clean[key]['value'] instanceof Array) {
              clean[key]['value'].forEach(function (element, index, array) {
                array[index] = DOMPurify.sanitize(element);
              });
              /** This is in the case of an object */
            } else {
              clean[key]['value'] = DOMPurify.sanitize(clean[key]['value']);
            }
          }
        }

        return clean;
      }
    }]);

    return StateHandler;
  }();

  /**
  * {
  *   notMalicious: {
  *     value: 'Friendly',
  *     sanitize: true
  *   }
  * }
  */
  module.exports = StateHandler;
});
