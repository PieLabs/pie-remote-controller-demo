'use strict';
//TODO: This is the babel transpiled PieLabs/pie-controller - really this should be available from the package.

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _pieScoring = require('pie-scoring');

var _pieScoring2 = _interopRequireDefault(_pieScoring);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PieClientSideController = function () {
  function PieClientSideController(config, controllerMap) {
    _classCallCheck(this, PieClientSideController);

    if (!Array.isArray(config.pies)) {
      throw new Error('config.pies must be defined');
    }

    if (!controllerMap) {
      throw new Error('controllerMap must be defined');
    }

    this._config = config;
    this._controllerMap = controllerMap;
    this._processor = new _pieScoring2.default().getProcessor(this._config);
  }

  _createClass(PieClientSideController, [{
    key: 'model',
    value: function model(session, env) {
      return this._callComponentController('model', session, env);
    }
  }, {
    key: 'outcome',
    value: function outcome(session, env) {
      var _this = this;

      return this._callComponentController('outcome', session, env).then(function (outcomes) {
        return _this._processor.score(session, outcomes);
      });
    }
  }, {
    key: 'getLanguages',
    value: function getLanguages() {
      if (Array.isArray(this._config.langs)) {
        return Promise.resolve(this._config.langs);
      } else {
        return Promise.resolve([]);
      }
    }
  }, {
    key: '_callComponentController',
    value: function _callComponentController(fnName, session, env) {
      var _this2 = this;

      var toData = function toData(model) {

        if (!model.element || !model.id) {
          throw new Error('This model is missing either an \'element\' or \'id\' property: ' + JSON.stringify(model));
        }

        return {
          id: model.id,
          element: model.element,
          model: model,
          session: _lodash2.default.find(session, { id: model.id })
        };
      };

      var toPromise = function toPromise(data) {
        var failed = function failed() {
          return Promise.reject(new Error('Can\'t find function for ' + data.element));
        };
        var modelFn = _this2._controllerMap[data.element][fnName] || failed;
        return modelFn(data.model, data.session, env).then(function (result) {
          result.id = data.id;
          return result;
        });
      };

      var promises = (0, _lodash2.default)(this._pies).map(toData).map(toPromise).value();

      return Promise.all(promises);
    }
  }, {
    key: '_pies',
    get: function get() {
      return this._config.pies;
    }
  }]);

  return PieClientSideController;
}();

exports.default = PieClientSideController;