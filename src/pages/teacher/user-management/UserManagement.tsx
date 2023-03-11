import { service } from '../../../services/service'
import AdminEditor from './components/AdminEditor'
import SchoolTeachersEditor from './components/SchoolTeachersEditor'

export default function UserManagement() {
  const { data } = service.teacher.useSelfInfo()

  return data?.role_id === 3 ? <AdminEditor /> : <SchoolTeachersEditor />
}
