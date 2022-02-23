import React from 'react'
import ReactDOM from 'react-dom'
import './main.css'
import App from './App'
// toast
import Toast , { T } from 'react-toast-mobile';
import 'react-toast-mobile/lib/react-toast-mobile.css';


// github不支持密码提交了？

ReactDOM.render(
  <React.StrictMode>
    <div>
      <Toast />
      <App />
    </div>
  </React.StrictMode>,
  document.getElementById('root')
)
