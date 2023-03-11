import { Navigate } from 'react-router-dom'
import { makeLazy } from '../../utils/lazy'
import Settings from './settings/Settings'

const Teacher = makeLazy(() => import('./Teacher'))
const Overview = makeLazy(() => import('./overview/Overview'))
const Class = makeLazy(() => import('./class/Class'))
const UserManagement = makeLazy(
  () => import('./user-management/UserManagement')
)

export const teacherRoute = () => ({
  path: 'teacher',
  element: <Teacher />,
  children: [
    { path: '', element: <Navigate to="overview" replace /> },
    {
      path: 'overview',
      element: <Overview />,
    },
    { path: 'class/:classId', element: <Class /> },
    { path: 'user-management', element: <UserManagement /> },
    { path: 'settings', element: <Settings /> },
  ],
})
