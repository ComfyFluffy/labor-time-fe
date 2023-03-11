import { Stack, Table } from '@mui/joy'
import ApiErrorAlert from '../../../../../components/ApiErrorAlert'
import { service } from '../../../../../services/service'
import { toastOnError } from '../../../../../utils/toast'
import AdminEditorRow from './AdminEditorRow'

export interface AdminTableEditorProps {
  schoolId: number
}

export default function AdminTableEditor({ schoolId }: AdminTableEditorProps) {
  const { data, mutate, error } = service.superAdmin.useTeachers(schoolId)
  const { data: self, error: selfError } = service.teacher.useSelfInfo()

  const handleAdminChange = async (teacherId: number, newValue: boolean) => {
    if (newValue) {
      await toastOnError(service.superAdmin.addAdmin(teacherId))
    } else {
      await toastOnError(service.superAdmin.removeAdmin(teacherId))
    }
    mutate()
  }

  return (
    <Stack spacing={2}>
      <ApiErrorAlert error={error || selfError} />
      <Table>
        <thead>
          <tr>
            <th>姓名</th>
            <th>手机号码</th>
            <th>院级管理员</th>
          </tr>
        </thead>

        <tbody>
          {data &&
            self &&
            data.map((teacher) => (
              <AdminEditorRow
                key={teacher.id}
                teacher={teacher}
                onChange={(newValue) => handleAdminChange(teacher.id, newValue)}
                switchDisabled={teacher.id === self.id}
              />
            ))}
        </tbody>
      </Table>
    </Stack>
  )
}
