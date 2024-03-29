import { Delete, Remove, Save } from '@mui/icons-material'
import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Stack,
  Table,
  Typography,
} from '@mui/joy'
import { useMemo, useState } from 'react'
import MenuButton from '../../../../../components/MenuButton'
import { TeacherWithClasses } from '../../../../../services/admin'
import { Class, roleIdToRole } from '../../../../../services/model'
import { service } from '../../../../../services/service'
import { toastOnError, toastProcess } from '../../../../../utils/toast'
import ClassesAutocomplete from './ClassesAutocomplete'
import DeleteConfirmDialog from './DeleteConfirmDialog'

export default function TeacherEditor({
  teacher,
  onMutated,
  isNew,
}: {
  teacher: TeacherWithClasses
  onMutated: (teacher?: TeacherWithClasses) => void
  isNew?: boolean
}) {
  const [addedClasses, setAddedClasses] = useState<Map<Class['id'], Class>>(
    () => new Map()
  )
  const [removedClassIds, setRemovedClassIds] = useState<Set<number>>(
    () => new Set()
  )

  const [editingState, setEditingState] = useState({
    name: teacher.name,
    phone: teacher.phone,
    role_id: teacher.role_id,
  })

  const [deleteOpen, setDeleteOpen] = useState(false)

  const displayClasses = useMemo(() => {
    const removeDuplicate = (c: Class, i: number, classes: Class[]) =>
      classes.findIndex((c2) => c2.id === c.id) === i
    const classes = [
      ...teacher.classes.filter((c) => !removedClassIds.has(c.id)),
      ...addedClasses.values(),
    ].filter(removeDuplicate)
    return classes
  }, [teacher.classes, addedClasses, removedClassIds])

  const handleSave = async () => {
    try {
      let id = teacher.id
      if (isNew) {
        await toastProcess(async () => {
          id = await service.schoolAdmin.addTeacher({
            name: editingState.name,
            phone: editingState.phone,
            role_id: editingState.role_id,
          })
          await service.schoolAdmin.addTeacherClassRelations(
            id,
            Array.from(addedClasses.keys())
          )
        })
      } else {
        await toastProcess(
          Promise.all([
            service.schoolAdmin.modifyTeacher({
              id: teacher.id,
              ...editingState,
            }),
            service.schoolAdmin.addTeacherClassRelations(
              teacher.id,
              Array.from(addedClasses.keys())
            ),
            service.schoolAdmin.deleteTeacherClassRelations(
              teacher.id,
              Array.from(removedClassIds)
            ),
          ])
        )
      }

      setAddedClasses(new Map())
      setRemovedClassIds(new Set())

      onMutated({
        id,
        ...editingState,
        classes: displayClasses,
      })
    } catch {
      onMutated()
    }
  }

  const handleDelete = async () => {
    try {
      await toastOnError(service.schoolAdmin.deleteTeacher(teacher.id))
    } finally {
      onMutated()
    }
  }

  return (
    <Stack spacing={3}>
      <Stack sx={{ maxWidth: 0o400 }} spacing={1}>
        <Typography level="h6">基本信息</Typography>

        <FormControl>
          <FormLabel>姓名</FormLabel>
          <Input
            value={editingState.name}
            onChange={(e) => {
              setEditingState((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }}
          />
        </FormControl>

        <FormControl>
          <FormLabel>手机号码</FormLabel>
          <Input
            value={editingState.phone}
            onChange={(e) => {
              setEditingState((prev) => ({
                ...prev,
                phone: e.target.value,
              }))
            }}
          />
        </FormControl>

        <Stack alignItems="flex-start">
          <Typography flex={1}>身份</Typography>
          <MenuButton
            items={Array.from(roleIdToRole.entries()).slice(0, 2)}
            selectedItem={
              Array.from(roleIdToRole.entries()).find(
                ([id]) => id === editingState.role_id
              ) || ([0, '未知'] as [number, string])
            }
            display={(item) => item[1]}
            onChange={([role_id]) => {
              setEditingState((prev) => ({
                ...prev,
                role_id,
              }))
            }}
          />
        </Stack>
      </Stack>

      <Stack>
        <Typography level="h6">管理的班级</Typography>
        <Table size="sm">
          <thead>
            <tr>
              <th>班级名称</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {displayClasses.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td align="right">
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
                    <Remove />
                  </IconButton>
                </td>
              </tr>
            ))}
            <tr>
              <ClassesAutocomplete
                onAdd={(value) => {
                  setAddedClasses(new Map(addedClasses.set(value.id, value)))
                }}
                selectedClasses={displayClasses}
              />
            </tr>
          </tbody>
        </Table>
      </Stack>

      <Stack direction="row" spacing={2}>
        <Button color="success" startDecorator={<Save />} onClick={handleSave}>
          {isNew ? '创建用户' : '保存'}
        </Button>
        {!isNew && (
          <Button
            color="danger"
            startDecorator={<Delete />}
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
