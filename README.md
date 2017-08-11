# react-router-redux-saga-model
将 react-router 、redux、与 [redux-saga-model](https://github.com/tomsonTang/redux-saga-model) 进行封装

`npm i react-router-redux-saga-model`

很多时候我们的 `Provider` 需要手动和 store 进行关联，同时还需要手动配置 history 与 redux 的同步，以及设置响应 history 的 Router。

这里将其透明化：

```jsx
import {BrowserRouterProvider} from 'react-router-redux-saga-model'

ReactDOM.render(
  <BrowserRouterProvider>
    <div>
        <Link to="/about">关于</Link>
        <Link to="/">主页</Link>
        <Route exact path="/" component={Index}/>
        <Route path="/about" component={About}/>
    </div>
  </BrowserRouterProvider>,
  document.querySelector('#root')
)
```

```jsx
/* 输出 */
<Provider store={createStore()}>
   <ConnectedRouter history={createBrowserHistory()}>
   	<div>
       <Link to="/about">关于</Link>
       <Link to="/">主页</Link>
       <Route exact path="/" component={Index}/>
       <Route path="/about" component={About}/>
    </div>
   </ConnectedRouter>
</Provider>
```



## 基本 API

- BrowserRouterProvider
- HashRouterProvider
- MemoryRouterProvider

## 高级 API

- RouterType 对应 [`history`](https://github.com/ReactTraining/history) 的 3 中 history 类型：

  `RouterType.Browser` 
  `RouterType.Hash`
  `RouterType.Memory`


- RouterProvider

  有时候我们有特殊需要需要设置 默认的 state，middleware，reducer（由于使用了 sagaModel，正常是不需要提供额外的 reducer）

  ```jsx
  import {RouterProvider,RouterType} from 'react-router-redux-saga-model';

  const initialState = {};
  const initialReducer = {};
  const initialMiddleware = [];

  <RouterProvider type={RouterType.Browser} state={initialState} reducers={initialReducer} middleware={initialMiddleware}>
    <div>
        <Link to="/about">关于</Link>
        <Link to="/">主页</Link>
        <Route exact path="/" component={Index}/>
        <Route path="/about" component={About}/>
    </div>
  </RouterProvider>
  ```

## 与 sagaModel 配合使用 

### 方式一

```jsx
import {BrowserRouterProvider} from 'react-router-redux-saga-model'
import indexModel from './view/index/indexModel.js';

const models = [indexModel];

ReactDOM.render(
  <BrowserRouterProvider modles={models}>
    <div>
        <Link to="/about">关于</Link>
        <Link to="/">主页</Link>
        <Route exact path="/" component={Index}/>
        <Route path="/about" component={About}/>
    </div>
  </BrowserRouterProvider>,
  document.querySelector('#root')
)
```

这时候所有的 sagaModels 都会被解析并处理。

### 方式二

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import {Route} from 'react-router';
import {Link} from 'react-router-dom';
import {BrowserRouterProvider} from 'react-router-redux-saga-model'
import About from './view/about/index.jsx';
import Index from './view/index/index.jsx';
import loading from './plugins/loading.js';
import indexModel from './view/index/indexModel.js';

const App = (sagaModel) =>{
  // sagaModel API
  sagaModel.register(IndexModel);

  return (
    <div>
        <Link to="/about">关于</Link>
        <Link to="/">主页</Link>
        <Route exact path="/" component={Index}/>
        <Route path="/about" component={About}/>
    </div>
  )
};

ReactDOM.render(
  <BrowserRouterProvider children={App} plugins={[loading]}/>,
  document.querySelector('#root')
);
```

通过传入一个回调，拿到 sagaModel 动态设置相关处理。

## 详细例子

[ react-router-redux-saga-model ](https://github.com/tomsonTang/react-router-redux-saga-model-example)

1. `npm install `
2. `npm start`

