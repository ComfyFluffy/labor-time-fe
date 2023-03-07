import { makeLazy } from '../../utils/lazy'

const Student = makeLazy(() => import('./Student'))

export const studentRoute = () => ({
  path: '/student',
  element: <Student />,
})
