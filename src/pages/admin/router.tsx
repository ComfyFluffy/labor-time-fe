import { Navigate } from 'react-router-dom'
import { makeLazy } from '../../utils'

const Layout = makeLazy(() => import('./Layout'))
const Overview = makeLazy(() => import('./overview/Overview'))
const Class = makeLazy(() => import('./class/Class'))
const UserManagement = makeLazy(
  () => import('./user-management/UserManagement')
)
const SystemManagement = makeLazy(
  () => import('./system-management/SystemManagement')
)

export const adminRoute = () => ({
  path: '/admin',
  element: <Layout />,
  children: [
    { path: '', element: <Navigate to="overview" replace /> },
    {
      path: 'overview',
      element: <Overview />,
    },
    { path: 'class/:classId', element: <Class /> },
    { path: 'user-management', element: <UserManagement /> },
    { path: 'system-management', element: <SystemManagement /> },
  ],
})
