import { Alert, Button, Modal, ModalDialog, Stack, Typography } from '@mui/joy'
import { shallow } from 'zustand/shallow'
import StudentInfo from '../../../components/StudentInfo'
import { service } from '../../../services/service'
import { usePreferences } from '../../../utils/store'

export default function ConfirmInfo() {
  const { confirmPersonalInfo, personalInfoConfirmed } = usePreferences(
    (state) => ({
      confirmPersonalInfo: state.confirmPersonalInfo,
      personalInfoConfirmed: state.personalInfoConfirmed,
    }),
    shallow
  )

  const { data, error } = service.student.useSelfInfo()

  return (
    <Modal open={!personalInfoConfirmed}>
      <ModalDialog>
        <Stack spacing={2}>
          <Stack spacing={1}>
            <Typography level="h4">个人信息</Typography>
            <Typography>请确认你的个人信息，如有错误请联系辅导员</Typography>
          </Stack>

          {error && <Alert color="danger">获取个人信息失败</Alert>}
          {data && (
            <StudentInfo
              name={data.name}
              uid={data.uid}
              className={data.classname}
            />
          )}

          <Button variant="solid" onClick={() => confirmPersonalInfo()}>
            确认
          </Button>
        </Stack>
      </ModalDialog>
    </Modal>
  )
}
