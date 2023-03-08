import { Navigate, Outlet, useMatch } from 'react-router-dom'
import { usePreferences } from '../utils/store'

export default function Index() {
  const token = usePreferences((state) => state.token)
  const isLoginPage = useMatch('/login')

  if (token || isLoginPage) {
    return <Outlet />
  }
  return <Navigate to="/login" replace />
}
