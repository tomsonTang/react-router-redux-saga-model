# react-router-redux-saga-model
将 react-router 、redux、与 redux-saga-model 进行封装

`npm i react-router-redux-saga-model`

很多时候我们的 `Provider` 需要手动和 store 进行关联，同时还需要手动配置 history 与 redux 的同步，以及设置响应 history 的 Router。

这里将其透明化：

```jsx
import {BrowserRouterControllerProvider} from 'react-router-redux-saga-model'

ReactDOM.render(
  <BrowserRouterControllerProvider>
    <div>
        <Link to="/about">关于</Link>
        <Link to="/">主页</Link>
        <Route exact path="/" component={Index}/>
        <Route path="/about" component={About}/>
    </div>
  </BrowserRouterControllerProvider>,
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

- BrowserRouterControllerProvider
- HashRouterControllerProvider
- MemoryRouterControllerProvider

## 高级 API

- RouterType 对应 [`history`](https://github.com/ReactTraining/history) 的 3 中 history 类型：

  `RouterType.Browser` 
  `RouterType.Hash`
  `RouterType.Memory`


- RouterControllerProvider

  有时候我们有特殊需要需要设置 默认的 state，middleware，reducer（由于使用了 sagaModel，正常是不需要提供额外的 reducer）

  ```jsx
  import {RouterControllerProvider,RouterType} from 'react-router-redux-saga-model';

  const initialState = {};
  const initialReducer = {};
  const initialMiddleware = [];

  <RouterControllerProvider type={RouterType.Browser} state={initialState} reducers={initialReducer} middleware={initialMiddleware}>
    <div>
        <Link to="/about">关于</Link>
        <Link to="/">主页</Link>
        <Route exact path="/" component={Index}/>
        <Route path="/about" component={About}/>
    </div>
  </RouterControllerProvider>
  ```

## 与 sagaModel 配合使用 

```jsx
import {BrowserRouterControllerProvider} from 'react-router-redux-saga-model'
import modles from 'somewhere'

ReactDOM.render(
  <BrowserRouterControllerProvider modles={modles}>
    <div>
        <Link to="/about">关于</Link>
        <Link to="/">主页</Link>
        <Route exact path="/" component={Index}/>
        <Route path="/about" component={About}/>
    </div>
  </BrowserRouterControllerProvider>,
  document.querySelector('#root')
)
```

这时候所有的 sagaModels 都会被解析并处理。

## 例子

