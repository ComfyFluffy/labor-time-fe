import { Table } from '@mui/joy'
import { useState } from 'react'
import { TeacherWithClasses } from '../../../../../services/admin'
import { service } from '../../../../../services/service'
import TeacherTableEditorRow from './TeacherTableEditorRow'

export default function TeacherTableEditor() {
  const { data, error, mutate } = service.schoolAdmin.useTeachers()
  const [addedTeacher, setAddedTeacher] = useState<TeacherWithClasses | null>(
    null
  )

  return (
    <Table aria-label="collapsible table">
      <thead>
        <tr>
          <th />
          <th>姓名</th>
          <th>手机号码</th>
          <th>院级管理员</th>
        </tr>
      </thead>

      <tbody>
        {data?.map((user) => (
          <TeacherTableEditorRow
            key={user.id}
            teacher={user}
            onMutated={(teacher) => {
              if (teacher) {
                const index = data.findIndex((t) => t.id === teacher.id)
                const newData = [...data]
                newData[index] = teacher
                mutate(newData)
              } else {
                mutate()
              }
            }}
          />
        ))}
        {addedTeacher && (
          <TeacherTableEditorRow
            teacher={addedTeacher}
            isNew
            onMutated={() => mutate()}
          />
        )}
      </tbody>
    </Table>
  )
}
