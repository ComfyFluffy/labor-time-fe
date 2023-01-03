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
import { ItemEditor } from '../../Student/Editor'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import UndoIcon from '@mui/icons-material/Undo'
import { StudentInfo } from '../../../components/StudentInfo'
import Autocomplete from '@mui/joy/Autocomplete'
import { useState } from 'react'
import { http } from '../../../http'

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
  const [reasonItemId, setReasonItemId] = useState<number | null>(null)

  const { data, error, mutate } = http.useStudentCategories(student.student_id)

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <ModalDialog
          sx={{
            width: downSm ? '90%' : '80%',
            maxWidth: '1200px',
            height: '90%',
            overflow: 'auto',
          }}
        >
          <Stack
            direction="row-reverse"
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 1,
            }}
          >
            <ModalClose
              sx={{
                position: 'unset',
              }}
            />
          </Stack>
          <Stack spacing={2} direction={downSm ? 'column' : 'row'}>
            <Stack spacing={1}>
              <Typography level="h5">学生信息</Typography>
              <StudentInfo student={student} />
            </Stack>

            <Divider orientation={downSm ? 'horizontal' : 'vertical'} />

            <Stack
              spacing={2}
              sx={{
                flex: 1,
              }}
            >
              {error && (
                <Typography color="danger">
                  {'网络错误：' + String(error.message)}
                </Typography>
              )}
              {data &&
                data.map((category) => (
                  <Stack spacing={1} key={category.id}>
                    <Typography level="h5" sx={{ ml: 2 }}>
                      {category.name}
                    </Typography>
                    {category.items.map((item) => (
                      <ItemEditor
                        key={item.id}
                        viewMode
                        item={item}
                        action={
                          <Stack
                            direction="row"
                            justifyContent="end"
                            spacing={2}
                          >
                            {item.state !== 'approved' && (
                              <Button
                                startDecorator={<CheckIcon />}
                                color="success"
                                variant="soft"
                                onClick={async () => {
                                  await http.passItem(item.id)
                                  mutate()
                                }}
                              >
                                通过
                              </Button>
                            )}
                            {item.state !== 'rejected' && (
                              <Button
                                startDecorator={<CloseIcon />}
                                color="danger"
                                variant="soft"
                                onClick={() => {
                                  setAskReasonOpen(true)
                                  setReasonItemId(item.id)
                                }}
                              >
                                打回
                              </Button>
                            )}
                            {(item.state === 'approved' ||
                              item.state === 'rejected') && (
                              <Button
                                startDecorator={<UndoIcon />}
                                color="warning"
                                variant="soft"
                                onClick={async () => {
                                  await http.setItemPending(item.id)
                                  mutate()
                                }}
                              >
                                撤销
                                {item.state === 'approved' ? '通过' : '打回'}
                              </Button>
                            )}
                          </Stack>
                        }
                      />
                    ))}
                    {category.items.length === 0 && (
                      <Typography level="body2" sx={{ ml: 2 }} color="neutral">
                        无数据
                      </Typography>
                    )}
                  </Stack>
                ))}
            </Stack>
          </Stack>
        </ModalDialog>
      </Modal>

      <AskReason
        onSubmit={async (reason) => {
          await http.rejectItem(reasonItemId!, reason || '')
          mutate()
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
