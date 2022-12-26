import {
  Box,
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
import Autocomplete from '@mui/joy/Autocomplete'
import { useState } from 'react'

const AskReason = ({
  onClose,
  open,
  onSubmit,
}: {
  onSubmit: (reason: string | null) => void
} & Pick<ModalProps, 'onClose' | 'open'>) => {
  const autocompleteReasons = ['证据无效', '证据不符合要求', '证据不完整']

  const [reason, setReason] = useState<string | null>(null)

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog>
        <ModalClose />
        <Stack spacing={2}>
          <Typography level="h5">打回原因</Typography>
          <Autocomplete
            placeholder="请选择或输入原因"
            options={autocompleteReasons}
            value={reason}
            onChange={(e, value) => setReason(value)}
            slotProps={{
              listbox: {
                disablePortal: true,
              },
            }}
          />
          <Stack direction="row" spacing={1} justifyContent="end">
            <Button
              color="danger"
              variant="soft"
              onClick={() => {
                onSubmit(reason)
              }}
            >
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
  onClose,
  student,
}: {
  student: Student
} & Pick<ModalProps, 'onClose' | 'open'>) => {
  const theme = useTheme()
  const downSm = useMediaQuery(theme.breakpoints.down('sm'))

  const [askReasonOpen, setAskReasonOpen] = useState(false)

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <ModalDialog>
          <ModalClose />
          <Box sx={{ mt: 4 }} />
          <Stack spacing={2} direction={downSm ? 'column' : 'row'}>
            <Stack spacing={1}>
              <Typography level="h5">学生信息</Typography>
              <StudentInfo student={student} />
            </Stack>

            <Divider orientation={downSm ? 'horizontal' : 'vertical'} />

            <Stack spacing={1}>
              <Typography level="h5" sx={{ ml: 2 }}>
                第一课堂
              </Typography>
              <ItemEditor
                viewMode
                item={{
                  id: 0,
                  description: 'awddaw',
                  category_id: 1,
                  duration_hour: 10,
                  picture_urls: ['https://picsum.photos/200/300'],
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
                      onClick={() => {
                        setAskReasonOpen(true)
                      }}
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
          </Stack>
        </ModalDialog>
      </Modal>

      <AskReason
        onSubmit={(reason) => {
          setAskReasonOpen(false)
        }}
        open={askReasonOpen}
        onClose={() => {
          setAskReasonOpen(false)
        }}
      />
    </>
  )
}
