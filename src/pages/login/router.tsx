import { makeLazy } from '../../utils'

const Login = makeLazy(() => import('./Login'))

export const loginRoute = () => ({
  path: 'login',
  element: <Login />,
})
