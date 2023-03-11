import { Stack, Typography } from '@mui/joy'

export interface StudentInfoProps {
  uid: string
  name: string
  className?: string
}
export default function StudentInfo({
  uid,
  name,
  className,
}: StudentInfoProps) {
  return (
    <Stack direction="row" spacing={2}>
      <Stack>
        <Typography color="neutral">学号</Typography>
        <Typography color="neutral">姓名</Typography>
        {className && <Typography color="neutral">班级</Typography>}
      </Stack>
      <Stack>
        <Typography>{uid}</Typography>
        <Typography>{name}</Typography>
        {className && <Typography>{className}</Typography>}
      </Stack>
    </Stack>
  )
}
