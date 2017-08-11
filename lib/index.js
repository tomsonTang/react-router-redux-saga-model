"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MemoryRouterProvider = exports.HashRouterProvider = exports.BrowserRouterProvider = exports.RouterProvider = exports.BindRouter = exports.RouterType = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require("react-redux");

var _reduxSagaModel = require("redux-saga-model");

var _reactRouterRedux = require("react-router-redux");

var _createBrowserHistory = require("history/createBrowserHistory");

var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);

var _createHashHistory = require("history/createHashHistory");

var _createHashHistory2 = _interopRequireDefault(_createHashHistory);

var _createMemoryHistory = require("history/createMemoryHistory");

var _createMemoryHistory2 = _interopRequireDefault(_createMemoryHistory);

var _invariant = require("invariant");

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var RouterType = {
  Browser: "browser",
  Hash: "hash",
  Memory: "memory"
};

// see https://github.com/ReactTraining/history
function getHistoryByType(type, props) {
  switch (type) {
    case RouterType.Browser:
      return (0, _createBrowserHistory2.default)({ basename: props.basename, forceRefresh: props.forceRefresh, keyLength: props.keyLength, getUserConfirmation: props.getUserConfirmation });

    case RouterType.Memory:
      return (0, _createMemoryHistory2.default)({ initialEntries: props.initialEntries, initialIndex: props.initialIndex, keyLength: props.keyLength, getUserConfirmation: props.getUserConfirmation });

    case RouterType.Hash:
    default:
      return (0, _createHashHistory2.default)({ basename: props.basename, hashType: props.hashType, getUserConfirmation: props.getUserConfirmation });
  }
};

// see
// https://github.com/ReactTraining/react-router/tree/master/packages/react-route
// r-redux
function BindRouter(_ref) {
  var children = _ref.children,
      history = _ref.history,
      sagaModel = _ref.sagaModel;

  return _react2.default.createElement(
    _reactRouterRedux.ConnectedRouter,
    { history: history },
    typeof children === 'function' ? children(sagaModel) : children
  );
};

function RouterProvider(props) {

  (0, _invariant2.default)(props.children, 'RouterProvider: children should be defined');

  var children = props.children,
      _props$type = props.type,
      type = _props$type === undefined ? RouterType.Hash : _props$type,
      _props$models = props.models,
      models = _props$models === undefined ? [] : _props$models,
      _props$state = props.state,
      state = _props$state === undefined ? {} : _props$state,
      _props$reducers = props.reducers,
      reducers = _props$reducers === undefined ? {} : _props$reducers,
      _props$middleware = props.middleware,
      middleware = _props$middleware === undefined ? [] : _props$middleware,
      _props$plugins = props.plugins,
      plugins = _props$plugins === undefined ? [] : _props$plugins,
      ops = _objectWithoutProperties(props, ["children", "type", "models", "state", "reducers", "middleware", "plugins"]);

  var initialState = state;
  var initialReducer = _extends({}, reducers, {
    routing: _reactRouterRedux.routerReducer
  });
  var history = getHistoryByType(type, ops);
  var initialMiddleware = [(0, _reactRouterRedux.routerMiddleware)(history)].concat(_toConsumableArray(middleware));
  var initialModels = models;
  var modelManager = new _reduxSagaModel.SagaModelManager({ initialState: initialState, initialReducer: initialReducer, initialMiddleware: initialMiddleware, initialModels: initialModels, history: history });

  plugins.forEach(modelManager.use.bind(modelManager));

  return _react2.default.createElement(
    _reactRedux.Provider,
    { store: modelManager.store() },
    _react2.default.createElement(BindRouter, { children: children, history: history, sagaModel: modelManager })
  );
};

function BrowserRouterProvider(props) {
  (0, _invariant2.default)(props !== null && (typeof props === "undefined" ? "undefined" : _typeof(props)) == 'object', 'BrowserRouterProvider: props should be defined');
  return _react2.default.createElement(RouterProvider, _extends({}, props, { type: RouterType.Browser }));
};

function HashRouterProvider(props) {
  (0, _invariant2.default)(props !== null && (typeof props === "undefined" ? "undefined" : _typeof(props)) == 'object', 'HashRouterProvider: props should be defined');
  return _react2.default.createElement(RouterProvider, _extends({}, props, { type: RouterType.Hash }));
};

function MemoryRouterProvider(props) {
  (0, _invariant2.default)(props !== null && (typeof props === "undefined" ? "undefined" : _typeof(props)) == 'object', 'MemoryRouterProvider: props should be defined');
  return _react2.default.createElement(RouterProvider, _extends({}, props, { type: RouterType.Memory }));
};

exports.RouterType = RouterType;
exports.BindRouter = BindRouter;
exports.RouterProvider = RouterProvider;
exports.BrowserRouterProvider = BrowserRouterProvider;
exports.HashRouterProvider = HashRouterProvider;
exports.MemoryRouterProvider = MemoryRouterProvider;
exports.default = HashRouterProvider;