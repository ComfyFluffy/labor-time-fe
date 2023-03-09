import { Chip, ListItem, Stack, Typography } from '@mui/joy'
import { roleIdToRole, Teacher } from '../../../../services/model'

export default function TeacherCard({ name, phone, role_id }: Teacher) {
  return (
    <ListItem>
      <Stack
        sx={{
          px: 2,
          py: 1,
        }}
        spacing={1}
        alignItems="start"
      >
        <Stack direction="row" alignItems="baseline" spacing={1}>
          <Typography fontSize="xl">{name}</Typography>
          <Typography fontSize="xs">{phone}</Typography>
        </Stack>
        <Chip size="sm">{roleIdToRole.get(role_id)}</Chip>
      </Stack>
    </ListItem>
  )
}
