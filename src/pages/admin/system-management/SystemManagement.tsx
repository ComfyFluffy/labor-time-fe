import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  Stack,
  Switch,
  Typography,
} from '@mui/joy'
import { service } from '../../../service'

export default function SystemManagement() {
  const { data, mutate } = service.useSystemState()
  return (
    <Stack
      spacing={2}
      sx={{
        maxWidth: 0o700,
      }}
    >
      <Typography level="h3">系统开关控制</Typography>
      {data && (
        <>
          <FormControl
            orientation="horizontal"
            sx={{ justifyContent: 'space-between' }}
          >
            <Box>
              <FormLabel>学生端</FormLabel>
              <FormHelperText sx={{ mt: 0 }}>
                学生端开启时，学生可以提交新项目或修改被打回项目。
              </FormHelperText>
            </Box>
            <Switch
              checked={data.student}
              color={data.student ? 'success' : 'neutral'}
              onChange={async (e) => {
                await service.toastOnError(
                  service.updateSystemState('student', e.target.checked)
                )
                mutate({
                  ...data,
                  student: e.target.checked,
                })
              }}
            />
          </FormControl>
          <FormControl
            orientation="horizontal"
            sx={{ justifyContent: 'space-between' }}
          >
            <Box>
              <FormLabel>教师端</FormLabel>
              <FormHelperText sx={{ mt: 0 }}>
                教师端开启时，教师可以进行项目的审核。
              </FormHelperText>
            </Box>
            <Switch
              checked={data.teacher}
              color={data.teacher ? 'success' : 'neutral'}
              onChange={async (e) => {
                await service.toastOnError(
                  service.updateSystemState('teacher', e.target.checked)
                )
                mutate({
                  ...data,
                  teacher: e.target.checked,
                })
              }}
            />
          </FormControl>
        </>
      )}
    </Stack>
  )
}
