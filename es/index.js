var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import React from "react";
import { Provider } from "react-redux";
import { sagaModelManagerFactory } from "redux-saga-model";
import { ConnectedRouter, routerMiddleware, routerReducer as routing } from "react-router-redux";
import createBrowserHistory from "history/createBrowserHistory";
import createHashHistory from "history/createHashHistory";
import createMemoryHistory from "history/createMemoryHistory";

var RouterType = {
  Browser: "browser",
  Hash: "hash",
  Memory: "memory"
};

// see https://github.com/ReactTraining/history
var getHistoryByType = function getHistoryByType(type, props) {
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

// see https://github.com/ReactTraining/react-router/tree/master/packages/react-router-redux
var RouterController = function RouterController(_ref) {
  var children = _ref.children,
      history = _ref.history;

  return React.createElement(
    ConnectedRouter,
    { history: history },
    children
  );
};

var needChildren = function needChildren() {
  throw new Error('RouterControllerProvider \'children can not be null or undefined ');
};

var RouterControllerProvider = function RouterControllerProvider(props) {
  var _props$children = props.children,
      children = _props$children === undefined ? needChildren() : _props$children,
      _props$type = props.type,
      type = _props$type === undefined ? RouterType.Hash : _props$type,
      _props$modles = props.modles,
      modles = _props$modles === undefined ? [] : _props$modles,
      _props$state = props.state,
      state = _props$state === undefined ? {} : _props$state,
      _props$middleware = props.middleware,
      middleware = _props$middleware === undefined ? [] : _props$middleware,
      ops = _objectWithoutProperties(props, ["children", "type", "modles", "state", "middleware"]);

  var initialState = state;
  var initialReducer = {
    routing: routing
  };
  var history = getHistoryByType(type, ops);
  var initialMiddleware = [routerMiddleware(history)];
  var initialModles = modles;
  var modelManager = sagaModelManagerFactory({ initialState: initialState, initialReducer: initialReducer, initialMiddleware: initialMiddleware, initialModles: initialModles });

  return React.createElement(
    Provider,
    { store: modelManager.getStore() },
    React.createElement(RouterController, { children: children, history: history })
  );
};

var BrowserRouterControllerProvider = function BrowserRouterControllerProvider(props) {
  return React.createElement(RouterControllerProvider, _extends({}, props, { type: RouterType.Browser }));
};

var HashRouterControllerProvider = function HashRouterControllerProvider(props) {
  return React.createElement(RouterControllerProvider, _extends({}, props, { type: RouterType.Hash }));
};

var MemoryRouterControllerProvider = function MemoryRouterControllerProvider(props) {
  return React.createElement(RouterControllerProvider, _extends({}, props, { type: RouterType.Memory }));
};

export { RouterType, RouterController, RouterControllerProvider, BrowserRouterControllerProvider, HashRouterControllerProvider, MemoryRouterControllerProvider };

export default HashRouterControllerProvider;