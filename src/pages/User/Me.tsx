import { Button, Stack, Typography } from '@mui/joy'
import { http } from '../../http'

export const Me = () => {
  const { data } = http.useStudent()

  return (
    <Stack direction="row" justifyContent="end" alignItems="center" spacing={2}>
      {data && (
        <Stack
          direction="row"
          justifyContent="end"
          alignItems="center"
          spacing={1}
        >
          <Typography color="neutral">{data.name}</Typography>
          <Typography color="neutral">{data.student_id}</Typography>
        </Stack>
      )}
      <Button onClick={() => http.logout()} variant="soft" color="neutral">
        登出
      </Button>
    </Stack>
  )
}
