import React from "react";
import {Provider} from "react-redux";
import {sagaModelManagerFactory} from "redux-saga-model";
import {ConnectedRouter, routerMiddleware, routerReducer as routing} from "react-router-redux";
import createBrowserHistory from "history/createBrowserHistory";
import createHashHistory from "history/createHashHistory";
import createMemoryHistory from "history/createMemoryHistory";

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
function RouterController({children, history}) {
  return (
    <ConnectedRouter history={history}>
      {children}
    </ConnectedRouter>
  );
};

const needChildren = () => {
  throw new Error('RouterControllerProvider \'children can not be null or undefined ');
}

function RouterControllerProvider(props) {

  const {
    children = needChildren(),
    type = RouterType.Hash,
    modles = [],
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
  const initialModles = modles;
  const modelManager = sagaModelManagerFactory({initialState, initialReducer, initialMiddleware, initialModles});

  return (
    <Provider store={modelManager.getStore()}>
      <RouterController children={children} history={history}/>
    </Provider>
  );
};

function BrowserRouterControllerProvider(props) {
  return <RouterControllerProvider {...props} type={RouterType.Browser}/>;
};

function HashRouterControllerProvider(props) {
  return <RouterControllerProvider {...props} type={RouterType.Hash}/>;
};

function MemoryRouterControllerProvider(props) {
  return <RouterControllerProvider {...props} type={RouterType.Memory}/>;
};

export {
  RouterType,
  RouterController,
  RouterControllerProvider,
  BrowserRouterControllerProvider,
  HashRouterControllerProvider,
  MemoryRouterControllerProvider
};

export default HashRouterControllerProvider;
