import { Stack, Table } from '@mui/joy'
import { service } from '../../../../../services/service'
import { toastOnError } from '../../../../../utils/toast'
import AdminEditorRow from './AdminEditorRow'

export default function AdminEditor() {
  const { data, mutate } = service.superAdmin.useTeachers(1, '2022-2023')

  const handleAdminChange = async (teacherId: number, newValue: boolean) => {
    if (newValue) {
      await toastOnError(service.superAdmin.addAdmin(teacherId))
    } else {
      await toastOnError(service.superAdmin.removeAdmin(teacherId))
    }
    mutate()
  }

  return (
    <Stack>
      <Table>
        <thead>
          <tr>
            <th>姓名</th>
            <th>手机号码</th>
            <th>院级管理员</th>
          </tr>
        </thead>

        <tbody>
          {data?.map((teacher) => (
            <AdminEditorRow
              key={teacher.id}
              teacher={teacher}
              onChange={(newValue) => handleAdminChange(teacher.id, newValue)}
            />
          ))}
        </tbody>
      </Table>
    </Stack>
  )
}
