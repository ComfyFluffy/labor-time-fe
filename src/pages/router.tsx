import { createBrowserRouter } from 'react-router-dom'
import { adminRoute } from './admin/router'
import Index from './Index'
import { loginRoute } from './login/router'
import { studentRoute } from './student/router'

export const rootRouter = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
    children: [loginRoute(), studentRoute(), adminRoute()],
  },
])
