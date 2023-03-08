import { Navigate } from 'react-router-dom'
import { makeLazy } from '../../utils/lazy'

const Admin = makeLazy(() => import('./Admin'))
const Overview = makeLazy(() => import('./overview/Overview'))
const Class = makeLazy(() => import('./class/Class'))
const UserManagement = makeLazy(
  () => import('./user-management/UserManagement')
)

export const adminRoute = () => ({
  path: 'admin',
  element: <Admin />,
  children: [
    { path: '', element: <Navigate to="overview" replace /> },
    {
      path: 'overview',
      element: <Overview />,
    },
    { path: 'class/:classId', element: <Class /> },
    { path: 'user-management', element: <UserManagement /> },
  ],
})
