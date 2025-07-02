import "./components/sentry"
import * as Sentry from '@sentry/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import  {BrowserRouter} from "react-router-dom"
import {Provider,} from "react-redux"
import store from "./js/store/store"
import { UserProvider } from "./components/usercontext";
import { ErrorBoundary } from 'react-error-boundary';
import Fallback from "./components/errorboundary";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Sentry.ErrorBoundary fallback={<p>something went wrong</p>}>
  <Provider store={store} >

      <BrowserRouter>
        <ErrorBoundary fallback={<Fallback/>}>
            <UserProvider>
                <App />
            </UserProvider> 
        </ErrorBoundary>  
      </BrowserRouter>
  </Provider>
  </Sentry.ErrorBoundary>
      
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
