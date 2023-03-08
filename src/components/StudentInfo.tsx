import { Stack, Typography } from '@mui/joy'
import { Student } from '../services/model'

export default function StudentInfo({ student }: { student: Student }) {
  return (
    <Stack direction="row" spacing={2}>
      <Stack>
        <Typography color="neutral">学号</Typography>
        <Typography color="neutral">姓名</Typography>
        <Typography color="neutral">班级</Typography>
      </Stack>
      <Stack>
        {[student.uid, student.name, student.classname].map((v, i) => (
          <Typography key={i}>{v}</Typography>
        ))}
      </Stack>
    </Stack>
  )
}
