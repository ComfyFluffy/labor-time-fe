import { Box, Chip, ColorPaletteProp, Table } from '@mui/joy'
import { StudentState } from '../../../../services/model'
import { StudentWithoutClass } from '../../../../services/teacher'
import { rowOnHover } from '../../../../utils/styles'

export const studentStateDisplay: Record<
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
  students: StudentWithoutClass[]
  onRowClick?: (student: StudentWithoutClass) => void
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
            component="th"
            sx={{
              maxWidth: 0o100,
            }}
          >
            有效时长
          </Box>
          <th>当前状态</th>
        </tr>
      </thead>

      <Box
        component="tbody"
        sx={{
          cursor: onRowClick ? 'pointer' : undefined,
        }}
      >
        {students.map((student) => {
          const stateDisplay = studentStateDisplay[student.state]
          return (
            <Box
              component="tr"
              key={student.uid}
              onClick={() => {
                onRowClick?.(student)
              }}
              sx={onRowClick && rowOnHover}
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
      </Box>
    </Table>
  )
}
