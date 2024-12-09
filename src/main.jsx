import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

console.log('main.jsx executing'); // Debug log

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
) 