import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Modal,
  ModalDialog,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/joy'
import {
  Collapse,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { useMemo, useState } from 'react'
import { http, TeacherClassesResponse } from '../../../http'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import Autocomplete from '@mui/joy/Autocomplete'
import SaveIcon from '@mui/icons-material/Save'
import DeleteIcon from '@mui/icons-material/Delete'
import WarningRoundedIcon from '@mui/icons-material/WarningRounded'
import { Class } from '../../../model'

const ClassesAutocomplete = ({
  onAdd,
  selectedClasses,
}: {
  onAdd: (value: Class) => void
  selectedClasses: Class[]
}) => {
  const { data, isLoading } = http.useClasses()
  const [value, setValue] = useState<Class | null>(null)

  const filteredClasses = useMemo(() => {
    if (!data) {
      return []
    }
    const selectedClassesIds = new Set(selectedClasses.map((c) => c.id))
    return data.filter((c) => !selectedClassesIds.has(c.id)) || []
  }, [selectedClasses, data])

  return (
    <>
      <TableCell
        scope="row"
        sx={{
          pl: 1,
        }}
      >
        <Autocomplete
          loading={isLoading}
          loadingText="加载中..."
          options={filteredClasses}
          getOptionLabel={(option) => option.name}
          placeholder="添加班级"
          value={value}
          onChange={(e, value) => setValue(value)}
        />
      </TableCell>
      <TableCell align="right">
        <IconButton
          size="sm"
          color="success"
          disabled={!value}
          onClick={() => {
            if (value) {
              onAdd(value)
              setValue(null)
            }
          }}
        >
          <AddIcon />
        </IconButton>
      </TableCell>
    </>
  )
}

const DeleteConfirmDialog = ({
  open,
  setOpen,
  onConfirm,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  onConfirm: () => void
}) => {
  return (
    <Modal
      aria-labelledby="alert-dialog-modal-title"
      aria-describedby="alert-dialog-modal-description"
      open={open}
      onClose={() => setOpen(false)}
    >
      <ModalDialog variant="outlined" role="alertdialog">
        <Typography
          id="alert-dialog-modal-title"
          component="h2"
          level="inherit"
          fontSize="1.25em"
          mb="0.25em"
          startDecorator={<WarningRoundedIcon />}
        >
          删除用户
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography
          id="alert-dialog-modal-description"
          textColor="text.tertiary"
          mb={3}
        >
          确定要删除用户吗？
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button
            variant="plain"
            color="neutral"
            onClick={() => setOpen(false)}
          >
            取消
          </Button>
          <Button
            variant="solid"
            color="danger"
            onClick={() => {
              onConfirm()
              setOpen(false)
            }}
          >
            删除
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  )
}

const TeacherEditor = ({
  teacher,
  onMutated,
  isNew,
}: {
  teacher: TeacherClassesResponse[0]
  onMutated: () => void
  isNew?: boolean
}) => {
  const [addedClasses, setAddedClasses] = useState<Map<number, Class>>(
    () => new Map()
  ) // Class id -> Class
  const [removedClassIds, setRemovedClassIds] = useState<Set<number>>(
    () => new Set()
  )

  const [editingState, setEditingState] = useState({
    name: teacher.name,
    phone: teacher.phone,
    is_admin: teacher.is_admin,
  })

  const [deleteOpen, setDeleteOpen] = useState(false)

  const displayClasses = useMemo(() => {
    return [
      ...teacher.classes.filter((c) => !removedClassIds.has(c.id)),
      ...addedClasses.values(),
    ]
  }, [teacher.classes, addedClasses, removedClassIds])

  const handleSave = async () => {
    try {
      if (isNew) {
        await http.toast(async () => {
          await http.addTeacher({
            name: editingState.name,
            phone: editingState.phone,
            is_admin: editingState.is_admin,
          })
          await http.addTeacherClassRelations(
            teacher.id,
            Array.from(addedClasses.keys())
          )
        })
        return
      }

      await http.toast(
        Promise.all([
          http.updateTeacher({
            id: teacher.id,
            ...editingState,
          }),
          http.addTeacherClassRelations(
            teacher.id,
            Array.from(addedClasses.keys())
          ),
          http.deleteTeacherClassRelations(
            teacher.id,
            Array.from(removedClassIds)
          ),
        ])
      )
    } finally {
      onMutated()
    }
  }

  const handleDelete = async () => {
    try {
      await http.toastOnError(http.deleteTeacher(teacher.id))
    } finally {
      onMutated()
    }
  }

  return (
    <Stack spacing={3}>
      <Stack sx={{ maxWidth: 0o400 }} spacing={1}>
        <Typography level="h6">基本信息</Typography>

        <TextField
          label="姓名"
          value={editingState.name}
          onChange={(e) => {
            setEditingState((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }}
        />
        <TextField
          label="手机号码"
          value={editingState.phone}
          onChange={(e) => {
            setEditingState((prev) => ({
              ...prev,
              phone: e.target.value,
            }))
          }}
        />
        <Stack direction="row">
          <Typography flex={1}>管理员</Typography>
          <Switch
            checked={editingState.is_admin}
            onChange={(e) => {
              setEditingState((prev) => ({
                ...prev,
                is_admin: e.target.checked,
              }))
            }}
          />
        </Stack>
      </Stack>

      <Stack>
        <Typography level="h6">管理的班级</Typography>
        <Table size="small" aria-label="purchases">
          <TableHead>
            <TableRow>
              <TableCell>班级名称</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {displayClasses.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.name}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="sm"
                    color="danger"
                    onClick={() => {
                      if (addedClasses.delete(c.id)) {
                        setAddedClasses(new Map(addedClasses))
                      } else {
                        setRemovedClassIds(new Set(removedClassIds.add(c.id)))
                      }
                    }}
                  >
                    <RemoveIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <ClassesAutocomplete
                onAdd={(value) => {
                  setAddedClasses(new Map(addedClasses.set(value.id, value)))
                }}
                selectedClasses={displayClasses}
              />
            </TableRow>
          </TableBody>
        </Table>
      </Stack>

      <Stack direction="row" spacing={2}>
        <Button
          color="success"
          startDecorator={<SaveIcon />}
          onClick={handleSave}
        >
          {isNew ? '创建用户' : '保存'}
        </Button>
        {!isNew && (
          <Button
            color="danger"
            startDecorator={<DeleteIcon />}
            onClick={() => setDeleteOpen(true)}
          >
            删除用户
          </Button>
        )}
      </Stack>
      <DeleteConfirmDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        onConfirm={handleDelete}
      />
    </Stack>
  )
}

const TeacherRow = ({
  teacher,
  isNew,
  onMutated,
}: {
  teacher: TeacherClassesResponse[0]
  isNew?: boolean
  onMutated: () => void
}) => {
  const [open, setOpen] = useState(isNew) // open editor by default for new teacher

  return (
    <>
      <TableRow
        sx={(theme) => ({
          [`& > .${tableCellClasses.root}`]: {
            padding: '12px',
          },
          background: isNew
            ? `rgba(${theme.vars.palette.success.lightChannel} / 0.1)`
            : undefined,
        })}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="sm"
            variant={open ? 'soft' : 'plain'}
            onClick={() => setOpen(!open)}
          >
            <KeyboardArrowRightIcon
              sx={{
                transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s',
              }}
            />
          </IconButton>
        </TableCell>
        <TableCell scope="row">{teacher.name}</TableCell>
        <TableCell>{teacher.phone}</TableCell>
        <TableCell>
          <Chip size="sm" color={teacher.is_admin ? 'primary' : 'neutral'}>
            {teacher.is_admin ? '是' : '否'}
          </Chip>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell
          style={{
            paddingBottom: 0,
            paddingTop: 0,
            border: open ? undefined : 'unset',
          }}
          colSpan={5}
        >
          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit
            appear
            sx={{
              p: 1,
              maxWidth: 0o700,
            }}
          >
            <TeacherEditor
              teacher={teacher}
              onMutated={onMutated}
              isNew={isNew}
            />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

const UserManage = () => {
  const { data, error, mutate } = http.useTeachers()
  const [addedTeacher, setAddedTeacher] = useState<
    TeacherClassesResponse[0] | null
  >(null)

  return (
    <Stack>
      {error && (
        <Alert
          color="danger"
          sx={{
            my: 1,
          }}
        >
          {'网络错误：' + String(error.message)}
        </Alert>
      )}

      <Typography level="h4">教师列表</Typography>
      <TableContainer>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>姓名</TableCell>
              <TableCell>手机号码</TableCell>
              <TableCell>管理员</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data?.map((teacher) => (
              <TeacherRow
                key={teacher.id}
                teacher={teacher}
                onMutated={mutate}
              />
            ))}
            {addedTeacher && (
              <TeacherRow
                teacher={addedTeacher}
                isNew
                onMutated={() => {
                  setAddedTeacher(null)
                  mutate()
                }}
              />
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
          startDecorator={<AddIcon />}
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

export default UserManage
