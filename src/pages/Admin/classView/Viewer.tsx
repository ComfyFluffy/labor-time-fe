import {
  Button,
  Divider,
  Modal,
  ModalClose,
  ModalDialog,
  ModalProps,
  Stack,
  Typography,
  useTheme,
} from '@mui/joy'
import { useMediaQuery } from '@mui/material'
import { Student } from '../../../model'
import { ItemEditor } from '../../User/Editor'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import UndoIcon from '@mui/icons-material/Undo'
import { StudentInfo } from '../../../components/StudentInfo'
import Autocomplete, { autocompleteClasses } from '@mui/joy/Autocomplete'
import { useState } from 'react'

const AskReason = ({
  reason,
  onChange,
  onClose,
  open,
}: {
  reason: string | null
  onChange: (reason: string | null) => void
} & Pick<ModalProps, 'open' | 'onClose'>) => {
  const autocompleteReasons = ['证据无效', '证据不符合要求', '证据不完整']

  return (
    <Modal open onClose={onClose}>
      <ModalDialog>
        <ModalClose />
        <Stack spacing={2}>
          <Typography level="h5">打回原因</Typography>
          <Autocomplete
            placeholder="请选择或输入原因"
            options={autocompleteReasons}
            value={reason}
            onChange={(e, value) => onChange(value)}
          />
          <Stack direction="row" spacing={1} justifyContent="end">
            <Button color="danger" variant="soft">
              打回
            </Button>
          </Stack>
        </Stack>
      </ModalDialog>
    </Modal>
  )
}

export const Viewer = ({
  open,
  student,
}: {
  student: Student
} & Pick<ModalProps, 'onClose' | 'open'>) => {
  const theme = useTheme()
  const downSm = useMediaQuery(theme.breakpoints.down('sm'))

  const [reason, setReason] = useState<string | null>(null)

  return (
    <>
      <Modal open>
        <ModalDialog>
          <ModalClose />
          {/* <Box sx={{ mt: 1 }} /> */}
          <Stack spacing={2} direction={downSm ? 'column' : 'row'}>
            <Stack spacing={1}>
              <Typography level="h5">学生信息</Typography>
              <StudentInfo student={student} />
            </Stack>

            <Divider orientation={downSm ? 'horizontal' : 'vertical'} />

            <ItemEditor
              viewMode
              item={{
                id: 0,
                description: 'awddaw',
                category_id: 1,
                duration_hour: 10,
                picture_urls: [],
                state: 'pending',
              }}
              action={
                <Stack direction="row" justifyContent="end" spacing={2}>
                  <Button
                    startDecorator={<CheckIcon />}
                    color="success"
                    variant="soft"
                  >
                    通过
                  </Button>
                  <Button
                    startDecorator={<CloseIcon />}
                    color="danger"
                    variant="soft"
                  >
                    打回
                  </Button>
                  <Button
                    startDecorator={<UndoIcon />}
                    color="neutral"
                    variant="soft"
                  >
                    撤销打回
                  </Button>
                </Stack>
              }
            />
          </Stack>
        </ModalDialog>
      </Modal>

      <AskReason
        reason={reason}
        onChange={(reason) => {
          setReason(reason)
        }}
      />
    </>
  )
}
