# react-router-redux-saga-model
将 react-router 、redux、与 redux-saga-model 进行封装

`npm i react-router-redux-saga-model`

```javascript
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

