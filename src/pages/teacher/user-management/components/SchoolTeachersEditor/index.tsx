import { Add } from '@mui/icons-material'
import { Button, Stack } from '@mui/joy'
import ApiErrorAlert from '../../../../../components/ApiErrorAlert'
import { service } from '../../../../../services/service'

export default function SchoolTeachersEditor() {
  const { data, error, mutate } = service.schoolAdmin.useTeachers()

  return (
    <Stack spacing={2}>
      <ApiErrorAlert error={error} />

      <Stack
        direction="row"
        spacing={2}
        justifyContent="end"
        sx={{
          mt: 2,
        }}
      >
        <Button
          color="success"
          startDecorator={<Add />}
          onClick={() => {
            setAddedTeacher({
              id: 0,
              name: '',
              phone: '',
              is_admin: false,
              classes: [],
            })
          }}
          disabled={addedTeacher !== null}
        >
          添加用户
        </Button>
      </Stack>
    </Stack>
  )
}
