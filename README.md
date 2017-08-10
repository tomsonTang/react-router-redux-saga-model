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
/* 实际输出 */
<Provider store={store}>
   <ConnectedRouter history={history}>
   	<div>
       <Link to="/about">关于</Link>
       <Link to="/">主页</Link>
       <Route exact path="/" component={Index}/>
       <Route path="/about" component={About}/>
    </div>
   </ConnectedRouter>
</Provider>
```



## API

