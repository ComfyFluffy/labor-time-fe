import { Info } from '@mui/icons-material'
import { Alert, Stack, Typography } from '@mui/joy'

interface PassRateInfoProps {
  threshold?: number
}

export default function PassRateInfo({ threshold }: PassRateInfoProps) {
  return (
    <Alert color="info" startDecorator={<Info />}>
      <Stack>
        <Typography fontSize="lg">通过率</Typography>
        <Typography fontSize="sm">
          通过率是指班级中通过的学生人数占总人数的比例。当一个学生的学时总数达到学院要求时，该学生通过。
        </Typography>
        {threshold !== undefined && (
          <Typography fontSize="sm">
            当前学院学时要求：{threshold} 小时
          </Typography>
        )}
      </Stack>
    </Alert>
  )
}
