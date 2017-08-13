var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import React from "react";
import { Provider } from "react-redux";
import { SagaModel } from "redux-saga-model";
import { ConnectedRouter, routerMiddleware, routerReducer as routing } from "react-router-redux";
import createBrowserHistory from "history/createBrowserHistory";
import createHashHistory from "history/createHashHistory";
import createMemoryHistory from "history/createMemoryHistory";
import invariant from 'invariant';

var RouterType = {
  Browser: "browser",
  Hash: "hash",
  Memory: "memory"
};

// see https://github.com/ReactTraining/history
function getHistoryByType(type, props) {
  switch (type) {
    case RouterType.Browser:
      return createBrowserHistory({ basename: props.basename, forceRefresh: props.forceRefresh, keyLength: props.keyLength, getUserConfirmation: props.getUserConfirmation });

    case RouterType.Memory:
      return createMemoryHistory({ initialEntries: props.initialEntries, initialIndex: props.initialIndex, keyLength: props.keyLength, getUserConfirmation: props.getUserConfirmation });

    case RouterType.Hash:
    default:
      return createHashHistory({ basename: props.basename, hashType: props.hashType, getUserConfirmation: props.getUserConfirmation });
  }
};

// see
// https://github.com/ReactTraining/react-router/tree/master/packages/react-route
// r-redux
function BindRouter(_ref) {
  var children = _ref.children,
      history = _ref.history,
      sagaModel = _ref.sagaModel;

  return React.createElement(
    ConnectedRouter,
    { history: history },
    typeof children === 'function' ? children(sagaModel) : children
  );
};

function RouterProvider(props) {

  invariant(props.children, 'RouterProvider: children should be defined');

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
    routing: routing
  });
  var history = getHistoryByType(type, ops);
  var initialMiddleware = [routerMiddleware(history)].concat(_toConsumableArray(middleware));
  var initialModels = models;
  var sagaModel = new SagaModel({ initialState: initialState, initialReducer: initialReducer, initialMiddleware: initialMiddleware, initialModels: initialModels, history: history });

  plugins.forEach(sagaModel.use.bind(sagaModel));

  return React.createElement(
    Provider,
    { store: sagaModel.store() },
    React.createElement(BindRouter, { children: children, history: history, sagaModel: sagaModel })
  );
};

function BrowserRouterProvider(props) {
  invariant(props !== null && (typeof props === "undefined" ? "undefined" : _typeof(props)) == 'object', 'BrowserRouterProvider: props should be defined');
  return React.createElement(RouterProvider, _extends({}, props, { type: RouterType.Browser }));
};

function HashRouterProvider(props) {
  invariant(props !== null && (typeof props === "undefined" ? "undefined" : _typeof(props)) == 'object', 'HashRouterProvider: props should be defined');
  return React.createElement(RouterProvider, _extends({}, props, { type: RouterType.Hash }));
};

function MemoryRouterProvider(props) {
  invariant(props !== null && (typeof props === "undefined" ? "undefined" : _typeof(props)) == 'object', 'MemoryRouterProvider: props should be defined');
  return React.createElement(RouterProvider, _extends({}, props, { type: RouterType.Memory }));
};

export { RouterType, BindRouter, RouterProvider, BrowserRouterProvider, HashRouterProvider, MemoryRouterProvider };

export default HashRouterProvider;