import {
  Alert,
  Button,
  Chip,
  ColorPaletteProp,
  Input,
  Stack,
  Typography,
  useTheme,
} from '@mui/joy'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useMediaQuery,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { service } from '../../../services/service'
import { Student, StudentState, studentStates } from '../../../services/model'
import { Viewer } from './Viewer'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import EditIcon from '@mui/icons-material/Edit'
import Autocomplete from '@mui/joy/Autocomplete'
import { rowOnHover } from '../../../utils/styles'
import { toastProcess } from '../../../utils/toast'
import { usePreferences } from '../../../utils/store'

export type ClassViewParams = {
  classId: string
}

const studentStateDisplay: Record<
  StudentState,
  {
    color: ColorPaletteProp
    text: string
  }
> = {
  allApproved: {
    color: 'success',
    text: '已全部通过',
  },
  hasPendingItem: {
    color: 'warning',
    text: '有待审核项目',
  },
  hasRejectedItem: {
    color: 'danger',
    text: '有未通过项目',
  },
  notSubmitted: {
    color: 'neutral',
    text: '未提交',
  },
}

const ClassWithProps = ({ classId }: { classId: number }) => {
  const { data, error, mutate } = service.teacher.useClassStudents(classId)
  const { data: classesData } = service.teacher.useManagedClasses()

  const [viewerItem, setViewerItem] = useState<Student | null>(null)

  const [xlsxDownloading, setXlsxDownloading] = useState(false)

  const [searchText, setSearchText] = useState('')
  const [stateFilter, setStateFilter] = useState<StudentState | null>(null)

  const className = useMemo(
    () => classesData?.find((c) => c.id === classId)?.name,
    [classesData, classId]
  )

  const theme = useTheme()
  const upSm = useMediaQuery(theme.breakpoints.up('sm'))

  useEffect(() => {
    setSearchText('')
    setStateFilter(null)
  }, [classId])

  const filteredData = data?.filter(
    (student) =>
      (!stateFilter || student.state === stateFilter) &&
      (!searchText ||
        student.uid.includes(searchText) ||
        student.name.includes(searchText))
  )

  return (
    <Stack spacing={2}>
      {error && <Alert color="danger">获取班级数据失败：{error.message}</Alert>}

      {className && <Typography level="h4">{className}</Typography>}

      <Stack direction="row" spacing={2} alignItems="center">
        <Button
          startDecorator={<FileDownloadIcon />}
          color="primary"
          onClick={async () => {
            try {
              setXlsxDownloading(true)
              await toastProcess(
                service.teacher.downloadXlsxByClassIds([classId]),
                '下载'
              )
            } finally {
              setXlsxDownloading(false)
            }
          }}
          disabled={!data || xlsxDownloading}
        >
          导出表格
        </Button>
        <Button startDecorator={<EditIcon />} color="success" disabled={!data}>
          添加学生
        </Button>
      </Stack>

      <Stack
        direction={upSm ? 'row' : 'column'}
        spacing={2}
        alignItems={upSm ? 'end' : undefined}
      >
        <Input
          placeholder="学号 / 姓名"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value)
          }}
        />
        <Autocomplete
          placeholder="当前状态"
          options={studentStates}
          getOptionLabel={(state) => studentStateDisplay[state].text}
          value={stateFilter}
          onChange={(e, value) => {
            setStateFilter(value)
          }}
        />
      </Stack>

      {filteredData && (
        <>
          {viewerItem && (
            <Viewer
              student={viewerItem}
              open={viewerItem !== null}
              onClose={() => {
                setViewerItem(null)
                mutate()
              }}
            />
          )}

          <Table
            size="small"
            sx={{
              userSelect: 'none',
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>学号</TableCell>
                <TableCell>姓名</TableCell>
                <TableCell
                  sx={{
                    maxWidth: 0o100,
                  }}
                >
                  有效时长
                </TableCell>
                <TableCell>当前状态</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredData.map((student) => {
                const stateDisplay = studentStateDisplay[student.state]
                return (
                  <TableRow
                    key={student.uid}
                    onClick={() => {
                      setViewerItem(student)
                    }}
                    sx={rowOnHover}
                  >
                    <TableCell>{student.uid}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.total_hour}</TableCell>
                    <TableCell>
                      <Chip color={stateDisplay.color} size="sm">
                        {stateDisplay.text}
                      </Chip>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </>
      )}
      {filteredData?.length === 0 && (
        <Typography
          level="body2"
          color="neutral"
          sx={{
            pl: 2,
          }}
        >
          无数据
        </Typography>
      )}
    </Stack>
  )
}

export default function Class() {
  const navigate = useNavigate()

  useEffect(
    () =>
      usePreferences.subscribe(
        (state) => state.selectedSchoolYear,
        () => {
          navigate('./overview', { replace: true })
        }
      ),
    []
  )

  const { classId } = useParams<ClassViewParams>()

  const classIdNumber = classId !== undefined ? parseInt(classId) : undefined
  if (classIdNumber === undefined) {
    return <Typography>未选择班级</Typography>
  }
  if (Number.isNaN(classIdNumber)) {
    return <Typography>班级 ID {classId} 不合法</Typography>
  }
  return <ClassWithProps classId={classIdNumber} />
}
