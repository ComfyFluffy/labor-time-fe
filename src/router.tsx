import { createBrowserRouter } from 'react-router-dom'
import { adminRoute } from './pages/admin/router'
import Index from './pages/Index'
import { loginRoute } from './pages/login/router'
import { studentRoute } from './pages/student/router'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
    children: [loginRoute(), studentRoute(), adminRoute()],
  },
])
