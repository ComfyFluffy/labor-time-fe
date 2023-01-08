import {
  Alert,
  Button,
  Chip,
  ColorPaletteProp,
  Stack,
  TextField,
  Typography,
} from '@mui/joy'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { http } from '../../../http'
import { Student, StudentState } from '../../../model'
import { Viewer } from './Viewer'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import EditIcon from '@mui/icons-material/Edit'

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

const Class = ({ classId }: { classId: number }) => {
  const { data, error, mutate } = http.useClassStudents(classId)
  const { data: classesData } = http.useClasses()

  const [viewerItem, setViewerItem] = useState<Student | null>(null)

  const [searchText, setSearchText] = useState('')

  const className = useMemo(
    () => classesData?.find((c) => c.id === classId)?.name,
    [classesData, classId]
  )

  useEffect(() => {
    setSearchText('')
  }, [classId])

  const filteredData = data?.filter((student) => {
    if (!searchText) {
      return true
    }
    return (
      student.student_id.includes(searchText) ||
      student.name.includes(searchText)
    )
  })

  return (
    <Stack spacing={2}>
      {error && <Alert color="danger">获取班级数据失败：{error.message}</Alert>}

      {className && <Typography level="h4">{className}</Typography>}

      <Stack direction="row" spacing={2} alignItems="center">
        <Button startDecorator={<FileDownloadIcon />} color="primary">
          导出表格
        </Button>
        <Button startDecorator={<EditIcon />} color="success">
          添加学生
        </Button>
      </Stack>

      <TextField
        label="搜索"
        placeholder="学号 / 姓名"
        sx={{
          width: 0o400,
        }}
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value)
        }}
      />

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
                    key={student.student_id}
                    onClick={() => {
                      setViewerItem(student)
                    }}
                    sx={(theme) => ({
                      '&:hover': {
                        backgroundColor: theme.vars.palette.primary.softBg,
                      },
                      transition: 'background-color 0.25s',
                    })}
                  >
                    <TableCell>{student.student_id}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.total_hours}</TableCell>
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

export const ClassPage = () => {
  const { classId } = useParams<ClassViewParams>()
  const classIdNumber = classId !== undefined ? parseInt(classId) : undefined
  if (classIdNumber === undefined) {
    return <Typography>未选择班级</Typography>
  }
  if (Number.isNaN(classIdNumber)) {
    return <Typography>班级 ID {classId} 不合法</Typography>
  }
  return <Class classId={classIdNumber} />
}
