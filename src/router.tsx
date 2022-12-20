import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Admin } from './pages/Admin'
import { Index } from './pages/Index'
import { Login } from './pages/Login'
import { User } from './pages/User'

export const router = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        path: '',
        element: <Index />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'user',
        element: <User />,
      },
      {
        path: 'admin',
        element: <Admin />,
        children: [
          {
            path: '',
            element: <Navigate to="stats" replace />,
          },
          {
            path: 'stats',
            element: <div>ww</div>,
          },
        ],
      },
    ],
  },
])
