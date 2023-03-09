import { Stack, Table } from '@mui/joy'
import { service } from '../../../../../services/service'
import AdminEditorRow from './AdminEditorRow'

export default function AdminEditor() {
  const { data, mutate } = service.superAdmin.useTeachers(1, '2022-2023')

  const handleAdminChange = (teacherId: number, newValue: boolean) => {
    if (newValue) {
      service.superAdmin.addAdmin(teacherId)
    } else {
      service.superAdmin.removeAdmin(teacherId)
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
            <th>管理员</th>
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
