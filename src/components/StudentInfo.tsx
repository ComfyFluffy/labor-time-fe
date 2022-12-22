import { Stack, Typography } from '@mui/joy'
import { Student } from '../model'

export const StudentInfo = ({ student }: { student: Student }) => {
  return (
    <Stack direction="row" spacing={2}>
      <Stack>
        <Typography color="neutral">学号</Typography>
        <Typography color="neutral">姓名</Typography>
        <Typography color="neutral">专业</Typography>
        <Typography color="neutral">班级</Typography>
        <Typography color="neutral">寝室</Typography>
      </Stack>
      <Stack>
        {[
          student.student_id,
          student.name,
          student.major,
          student.class_name,
          student.dormitory,
        ].map((v, i) => (
          <Typography key={i}>{v}</Typography>
        ))}
      </Stack>
    </Stack>
  )
}
