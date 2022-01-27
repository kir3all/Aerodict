import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux'
import Header from './components/Header'
import configureStore from './store'
import HoverLink from './components/Links';
const store = configureStore()

ReactDOM.render(
  <React.StrictMode>
    <Provider store={{ ...store }}>
      <div className='Header'><Header /></div>
      <div className='Block'><App /></div>
      <HoverLink />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
