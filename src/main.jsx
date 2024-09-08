import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Report from './pages/report.jsx'
import About from './pages/about.jsx'
import SOS from './pages/sos.jsx'
import MapAll from './pages/mapAll.jsx'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


const router = createBrowserRouter([
  {
    path: "/",
    element: <MapAll />,
  },

  {
    path: "/allData",
    element: <App />,
  },

  {
    path: "/sos",
    element: <SOS />,
  },

  {
    path: "/report",
    element: <Report />,
  },

  {
    path: "/about",
    element: <About />,
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
