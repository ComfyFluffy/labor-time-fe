import {
  createBrowserRouter,
  Navigate,
  Outlet,
  useMatch,
} from 'react-router-dom'
import { Admin } from './pages/Admin'
import { ClassView } from './pages/Admin/classView'
import { Index } from './pages/Index'
import { Login } from './pages/Login'
import { Student } from './pages/Student'
import { usePreferences } from './store'

const LoginRedirect = () => {
  const token = usePreferences((state) => state.token)
  const isLoginPage = useMatch('/login')

  if (token || isLoginPage) {
    return <Outlet />
  }
  return <Navigate to="/login" replace />
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginRedirect />,
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
        path: 'student',
        element: <Student />,
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
          {
            path: 'classView/:classId',
            element: <ClassView />,
          },
        ],
      },
    ],
  },
])
