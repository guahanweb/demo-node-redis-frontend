import React from 'react';
import ReactDOM from 'react-dom';
import 'scss/index.scss';
import App from './App';
import { VotingProvider } from 'hooks/withVoting';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <VotingProvider address="ws://localhost:4000">
      <App />
    </VotingProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
