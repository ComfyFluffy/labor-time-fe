import { Box, Chip, ColorPaletteProp, Table } from '@mui/joy'
import { Student, StudentState } from '../../../../services/model'
import { rowOnHover } from '../../../../utils/styles'

const studentStateDisplay: Record<
  StudentState,
  {
    color: ColorPaletteProp
    text: string
  }
> = {
  allApproved: {
    color: 'success',
    text: '已全部通过',
  },
  hasPendingItem: {
    color: 'warning',
    text: '有待审核项目',
  },
  hasRejectedItem: {
    color: 'danger',
    text: '有未通过项目',
  },
  notSubmitted: {
    color: 'neutral',
    text: '未提交',
  },
}

export interface ClassTableProps {
  students: Student[]
  onRowClick?: (student: Student) => void
}

export default function ClassTable({ students, onRowClick }: ClassTableProps) {
  return (
    <Table
      sx={{
        userSelect: onRowClick ? 'none' : undefined,
      }}
    >
      <thead>
        <tr>
          <th>学号</th>
          <th>姓名</th>
          <Box
            sx={{
              maxWidth: 0o100,
            }}
            component="th"
          >
            有效时长
          </Box>
          <th>当前状态</th>
        </tr>
      </thead>

      <tbody>
        {students.map((student) => {
          const stateDisplay = studentStateDisplay[student.state]
          return (
            <Box
              key={student.uid}
              onClick={() => {
                onRowClick?.(student)
              }}
              sx={onRowClick && rowOnHover}
              component="tr"
            >
              <td>{student.uid}</td>
              <td>{student.name}</td>
              <td>{student.total_hour}</td>
              <td>
                <Chip color={stateDisplay.color} size="sm">
                  {stateDisplay.text}
                </Chip>
              </td>
            </Box>
          )
        })}
      </tbody>
    </Table>
  )
}
