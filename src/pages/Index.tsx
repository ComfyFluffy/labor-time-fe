import { Navigate, Outlet, useMatch } from 'react-router-dom'
import { shallow } from 'zustand/shallow'
import { usePreferences } from '../utils/store'

export default function Index() {
  const [token, loggedUserType] = usePreferences(
    (state) => [state.token, state.loggedUserType],
    shallow
  )
  const isLoginPage = useMatch('/login')

  if (!token && !isLoginPage) {
    return <Navigate to="/login" replace />
  }

  if (token && location.pathname === '/') {
    return <Navigate to={`/${loggedUserType}`} replace />
  }

  return <Outlet />
}
