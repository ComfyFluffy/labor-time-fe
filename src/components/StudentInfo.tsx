import { Button, Stack, Typography } from '@mui/joy'
import { Student } from '../model'

export const StudentInfo = ({ student }: { student: Student }) => {
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        <Stack>
          <Typography color="neutral">学号</Typography>
          <Typography color="neutral">姓名</Typography>
          <Typography color="neutral">班级</Typography>
        </Stack>
        <Stack>
          {[student.student_id, student.name, student.class_name].map(
            (v, i) => (
              <Typography key={i}>{v}</Typography>
            )
          )}
        </Stack>
      </Stack>

      <Stack spacing={1}>
        <Button color="danger" variant="soft">
          清空所有事项
        </Button>
        <Button color="danger">从班级移除该学生</Button>
      </Stack>
    </Stack>
  )
}
