import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/store'
import App from './App'
import './index.css'

import { setCredentials } from './features/auth/authSlice';

// Restore session from localStorage
const token = localStorage.getItem('token');
const userStr = localStorage.getItem('user');

if (token && userStr) {
  try {
    const user = JSON.parse(userStr);
    store.dispatch(setCredentials({ user, token }));
  } catch (e) {
    console.error('Failed to parse user from localStorage', e);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
