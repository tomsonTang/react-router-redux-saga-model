import React from "react";
import {Provider} from "react-redux";
import {SagaModelManager} from "redux-saga-model";
import {ConnectedRouter, routerMiddleware, routerReducer as routing} from "react-router-redux";
import createBrowserHistory from "history/createBrowserHistory";
import createHashHistory from "history/createHashHistory";
import createMemoryHistory from "history/createMemoryHistory";
import invariant from 'invariant';

const RouterType = {
  Browser: "browser",
  Hash: "hash",
  Memory: "memory"
};

// see https://github.com/ReactTraining/history
function getHistoryByType(type, props) {
  switch (type) {
    case RouterType.Browser:
      return createBrowserHistory({basename: props.basename, forceRefresh: props.forceRefresh, keyLength: props.keyLength, getUserConfirmation: props.getUserConfirmation});

    case RouterType.Memory:
      return createMemoryHistory({initialEntries: props.initialEntries, initialIndex: props.initialIndex, keyLength: props.keyLength, getUserConfirmation: props.getUserConfirmation});

    case RouterType.Hash:
    default:
      return createHashHistory({basename: props.basename, hashType: props.hashType, getUserConfirmation: props.getUserConfirmation});
  }
};

// see
// https://github.com/ReactTraining/react-router/tree/master/packages/react-route
// r-redux
function BindRouter({children, history,sagaModel}) {
  return (
    <ConnectedRouter history={history}>
      { typeof children === 'function' ? children(sagaModel) : children }
    </ConnectedRouter>
  );
};

function RouterProvider(props) {

  invariant(props.children,'RouterProvider: children should be defined');

  const {
    children,
    type = RouterType.Hash,
    models = [],
    state = {},
    reducers = {},
    middleware = [],
    ...ops
  } = props;

  const initialState = state;
  const initialReducer = {
    ...reducers,
    routing
  };
  const history = getHistoryByType(type, ops);
  const initialMiddleware = [
    routerMiddleware(history), ...middleware
  ];
  const initialModels = models;
  const modelManager = new SagaModelManager({initialState, initialReducer, initialMiddleware, initialModels,history});

  return (
    <Provider store={modelManager.store()}>
      <BindRouter children={children} history={history} sagaModel={modelManager}/>
    </Provider>
  );
};

function BrowserRouterProvider(props) {
  invariant(props !== null && typeof props == 'object','BrowserRouterProvider: props should be defined');
  return <RouterProvider {...props} type={RouterType.Browser}/>;
};

function HashRouterProvider(props) {
  invariant(props !== null && typeof props == 'object','HashRouterProvider: props should be defined');
  return <RouterProvider {...props} type={RouterType.Hash}/>;
};

function MemoryRouterProvider(props) {
  invariant(props !== null && typeof props == 'object','MemoryRouterProvider: props should be defined');
  return <RouterProvider {...props} type={RouterType.Memory}/>;
};

export {
  RouterType,
  BindRouter,
  RouterProvider,
  BrowserRouterProvider,
  HashRouterProvider,
  MemoryRouterProvider
};

export default HashRouterProvider;
