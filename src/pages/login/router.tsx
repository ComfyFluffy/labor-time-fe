import { makeLazy } from '../../utils/lazy'

const Login = makeLazy(() => import('./Login'))

export const loginRoute = () => ({
  path: 'login',
  element: <Login />,
})
