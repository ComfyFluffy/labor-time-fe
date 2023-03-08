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
import { Student } from '../../../services/model'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import StudentInfo from '../../../components/StudentInfo'
import Autocomplete from '@mui/joy/Autocomplete'
import { useState } from 'react'
import { service } from '../../../services/service'
import { toastOnError } from '../../../utils/toast'
import ItemEditor from '../../../components/ItemEditor'

const AskReason = ({
  onClose,
  open,
  onSubmit,
}: {
  onSubmit: (reason: string | null) => void
} & Pick<ModalProps, 'onClose' | 'open'>) => {
  const autocompleteReasons = ['证据无效', '证据不符合要求', '证据不完整']

  const [reason, setReason] = useState<string | null>(null)
  const [reasonInput, setReasonInput] = useState('')

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog>
        <ModalClose />
        <Stack
          spacing={2}
          component="form"
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit(reasonInput)
          }}
        >
          <Typography level="h5">打回原因</Typography>
          <Autocomplete
            required
            placeholder="请选择或输入原因"
            options={autocompleteReasons}
            value={reason}
            onChange={(e, value) => setReason(value)}
            inputValue={reasonInput}
            onInputChange={(e, value) => setReasonInput(value)}
            autoFocus
            slotProps={{
              listbox: {
                disablePortal: true, // disable portal to fix the bug that the listbox is not visible
              },
            }}
            freeSolo
          />
          <Stack direction="row" spacing={1} justifyContent="end">
            <Button color="danger" variant="soft" type="submit">
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

  const { data, error, mutate } = service.teacher.useStudentLaborItems(
    student.uid
  )

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
            <Stack spacing={2}>
              <Stack spacing={1}>
                <Typography level="h5">学生信息</Typography>
                <StudentInfo student={student} />
              </Stack>
              <Stack spacing={1}>
                <Button color="danger" variant="soft">
                  清空所有事项
                </Button>
                <Button color="danger">从班级移除该学生</Button>
              </Stack>
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
                                  await toastOnError(
                                    service.teacher.passLaborItem({})
                                  )
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
          if (reasonItemId === null) {
            throw new Error('reasonItemId is null')
          }
          await toastOnError(
            service.teacher.rejectLaborItem({
              id: reasonItemId,
              reason: reason || '',
            })
          )
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