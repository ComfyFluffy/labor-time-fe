import { Chip, ListItem, Stack, Typography } from '@mui/joy'
import { roleIdToRole } from '../../../../services/model'

export interface TeacherCardProps {
  name: string
  phone: string
  roleId: number
  schoolName: string
}

export default function TeacherCard({
  name,
  phone,
  roleId,
  schoolName,
}: TeacherCardProps) {
  return (
    <ListItem>
      <Stack
        sx={{
          px: 2,
          pb: 0.5,
        }}
        spacing={1}
        alignItems="start"
      >
        <Stack
          direction="row"
          alignItems="baseline"
          spacing={1}
          sx={{
            ml: 1,
          }}
        >
          <Typography fontSize="xl">{name}</Typography>
          <Typography fontSize="xs">{phone}</Typography>
        </Stack>
        <Stack direction="row" alignItems="baseline" spacing={1}>
          <Chip size="sm" color="info">
            {schoolName}
          </Chip>
          <Chip size="sm">{roleIdToRole.get(roleId)}</Chip>
        </Stack>
      </Stack>
    </ListItem>
  )
}
