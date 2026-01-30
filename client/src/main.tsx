import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' // Import file CSS chính (Tailwind)

// Dấu ! ở cuối để khẳng định với TS là 'root' chắc chắn tồn tại
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)