import React from 'react';
import ReactDOM from 'react-dom';
import 'scss/index.scss';
import { App } from './App';
import { WebsocketProvider } from 'hooks/withWebsocket';
import { AppProvider } from "hooks/withAppState";
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <WebsocketProvider address="ws://localhost:4000">
      <AppProvider>
        <App />
      </AppProvider>
    </WebsocketProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
