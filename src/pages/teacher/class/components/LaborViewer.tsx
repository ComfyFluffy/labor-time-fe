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
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import StudentInfo from '../../../../components/StudentInfo'
import { useState } from 'react'
import { service } from '../../../../services/service'
import ItemEditor from '../../../../components/ItemEditor'
import { usePreferences } from '../../../../utils/store'
import { StudentWithoutClass } from '../../../../services/teacher'
import ApiErrorAlert from '../../../../components/ApiErrorAlert'
import { LaborItem } from '../../../../services/model'
import { AskPass, AskReject } from './submitPopups'

export default function LaborViewer({
  open,
  onClose,
  student,
}: {
  student: StudentWithoutClass
} & Pick<ModalProps, 'onClose' | 'open'>) {
  const theme = useTheme()
  const downSm = useMediaQuery(theme.breakpoints.down('sm'))

  const [openedItem, setOpenedItem] = useState<{
    item: LaborItem
    type: 'pass' | 'reject'
  } | null>(null)

  const selectedSchoolYear = usePreferences((state) => state.selectedSchoolYear)

  const { data, error, mutate } = service.teacher.useStudentLaborItems(
    student.id,
    selectedSchoolYear
  )

  const laborItemAction = (item: LaborItem) => (
    <Stack direction="row" justifyContent="end" spacing={2}>
      {item.state !== 'approved' && (
        <Button
          startDecorator={<CheckIcon />}
          color="success"
          variant="soft"
          onClick={() => {
            setOpenedItem({
              item,
              type: 'pass',
            })
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
            setOpenedItem({
              item,
              type: 'reject',
            })
          }}
        >
          打回
        </Button>
      )}
    </Stack>
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
            <Stack spacing={1}>
              <Typography level="h5">学生信息</Typography>
              <StudentInfo name={student.name} uid={student.uid} />
            </Stack>

            <Divider orientation={downSm ? 'horizontal' : 'vertical'} />

            <Stack
              spacing={2}
              sx={{
                flex: 1,
              }}
            >
              <ApiErrorAlert error={error} />

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
                        action={laborItemAction(item)}
                      />
                    ))}
                    {category.items.length === 0 && (
                      <Typography level="body2" sx={{ ml: 2 }} color="neutral">
                        无项目
                      </Typography>
                    )}
                  </Stack>
                ))}
            </Stack>
          </Stack>

          <Modal open={openedItem !== null} onClose={() => setOpenedItem(null)}>
            <ModalDialog>
              <ModalClose />
              {openedItem &&
                (openedItem.type === 'pass' ? (
                  <AskPass
                    itemId={openedItem.item.id}
                    hours={openedItem.item.duration_hour}
                    description={openedItem.item.description}
                    onSuccess={() => {
                      mutate()
                      setOpenedItem(null)
                    }}
                  />
                ) : (
                  <AskReject
                    itemId={openedItem.item.id}
                    onSuccess={() => {
                      mutate()
                      setOpenedItem(null)
                    }}
                  />
                ))}
            </ModalDialog>
          </Modal>
        </ModalDialog>
      </Modal>
    </>
  )
}
