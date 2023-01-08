import {
  createBrowserRouter,
  Navigate,
  Outlet,
  useMatch,
} from 'react-router-dom'
import { Admin } from './pages/Admin'
import { ClassPage } from './pages/Admin/class'
import { DataManage } from './pages/Admin/DataManage'
import { Overview } from './pages/Admin/Overview'
import SystemManage from './pages/Admin/SystemManage'
import UserManage from './pages/Admin/UserManage'
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
            path: 'overview',
            element: <Overview />,
          },
          {
            path: 'class/:classId',
            element: <ClassPage />,
          },
          {
            path: 'user-manage',
            element: <UserManage />,
          },
          {
            path: 'data-manage',
            element: <DataManage />,
          },
          {
            path: 'system-manage',
            element: <SystemManage />,
          },
        ],
      },
    ],
  },
])
