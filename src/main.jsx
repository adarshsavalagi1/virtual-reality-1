import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Coordinates from './Coordinates.jsx'
import { BrowserRouter as router, Routes, Route, BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
        <Route path='/coordinates' element={<Coordinates />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)

