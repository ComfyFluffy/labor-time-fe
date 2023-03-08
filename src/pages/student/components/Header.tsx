import { Button, Stack, Typography } from '@mui/joy'
import { service } from '../../../services/service'

export default function Header() {
  const { data } = service.student.useSelfInfo()

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
          <Typography color="neutral">{data.uid}</Typography>
        </Stack>
      )}
      <Button onClick={() => service.logout()} variant="soft" color="neutral">
        登出
      </Button>
    </Stack>
  )
}
