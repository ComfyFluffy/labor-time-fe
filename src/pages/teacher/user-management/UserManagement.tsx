import { service } from '../../../services/service'
import AdminEditor from './components/AdminEditor'
import SchoolUsersEditor from './components/SchoolUsersEditor'

export default function UserManagement() {
  const { data } = service.teacher.useSelfInfo()

  return data?.role_id === 3 ? <AdminEditor /> : <SchoolUsersEditor />
}
