import { createBrowserRouter, Navigate } from 'react-router-dom'
import { teacherRoute } from './teacher/router'
import Index from './Index'
import { loginRoute } from './login/router'
import { studentRoute } from './student/router'

export const rootRouter = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
    children: [loginRoute(), studentRoute(), teacherRoute()],
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
])
