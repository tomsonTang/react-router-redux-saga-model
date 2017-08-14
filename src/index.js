import React from "react";
import { Provider } from "react-redux";
import { SagaModel } from "redux-saga-model";
import {
  ConnectedRouter,
  routerMiddleware,
  routerReducer as routing
} from "react-router-redux";
import createBrowserHistory from "history/createBrowserHistory";
import createHashHistory from "history/createHashHistory";
import createMemoryHistory from "history/createMemoryHistory";
import invariant from "invariant";

const RouterType = {
  Browser: "browser",
  Hash: "hash",
  Memory: "memory"
};

// see https://github.com/ReactTraining/history
function getHistoryByType(type, props) {
  switch (type) {
    case RouterType.Browser:
      return createBrowserHistory({
        basename: props.basename,
        forceRefresh: props.forceRefresh,
        keyLength: props.keyLength,
        getUserConfirmation: props.getUserConfirmation
      });

    case RouterType.Memory:
      return createMemoryHistory({
        initialEntries: props.initialEntries,
        initialIndex: props.initialIndex,
        keyLength: props.keyLength,
        getUserConfirmation: props.getUserConfirmation
      });

    case RouterType.Hash:
    default:
      return createHashHistory({
        basename: props.basename,
        hashType: props.hashType,
        getUserConfirmation: props.getUserConfirmation
      });
  }
}

// see https://github.com/ReactTraining/react-router/tree/master/packages/react-router-redux
function BindRouter({ children, sagaModel,component }) {

  const history = sagaModel.history();
  let inner;

  if (children) {
    inner = typeof children === "function" ? children(sagaModel) : children;
  }//
  else{
    inner = React.createElement(component,{
      sagaModel,
      history:history,
      register:(::sagaModel.register),
      dump:(::sagaModel.dump),
    });
  }


  return (
    <ConnectedRouter history={history}>
      {inner}
    </ConnectedRouter>
  );
}

function RouterProvider(props) {
  invariant(props.children || props.component, "RouterProvider: children or component should be defined");

  const {
    children,
    component,
    type = RouterType.Hash,
    models = [],
    state = {},
    reducers = {},
    middleware = [],
    plugins = [],
    ...ops
  } = props;

  const initialState = state;
  const initialReducer = {
    ...reducers,
    routing
  };
  const history = getHistoryByType(type, ops);
  const initialMiddleware = [routerMiddleware(history), ...middleware];
  const initialModels = models;
  const sagaModel = new SagaModel({
    initialState,
    initialReducer,
    initialMiddleware,
    initialModels,
    history
  });

  plugins.forEach(::sagaModel.use);

  return (
    <Provider store={sagaModel.store()}>
      <BindRouter children={children} sagaModel={sagaModel} component={component} />
    </Provider>
  );
}

function BrowserRouterProvider(props) {
  invariant(
    props !== null && typeof props == "object",
    "BrowserRouterProvider: props should be defined"
  );
  return <RouterProvider {...props} type={RouterType.Browser} />;
}

function HashRouterProvider(props) {
  invariant(
    props !== null && typeof props == "object",
    "HashRouterProvider: props should be defined"
  );
  return <RouterProvider {...props} type={RouterType.Hash} />;
}

function MemoryRouterProvider(props) {
  invariant(
    props !== null && typeof props == "object",
    "MemoryRouterProvider: props should be defined"
  );
  return <RouterProvider {...props} type={RouterType.Memory} />;
}

export {
  RouterType,
  BindRouter,
  RouterProvider,
  BrowserRouterProvider,
  HashRouterProvider,
  MemoryRouterProvider
};

export default HashRouterProvider;
