import { makeLazy } from '../../utils'

const Student = makeLazy(() => import('./Student'))

export const studentRoute = () => ({
  path: '/student',
  element: <Student />,
})
