import { Alert, Box, Stack, Typography } from '@mui/joy'
import { DataGrid } from '@mui/x-data-grid'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { http } from '../../../http'
import { Student } from '../../../model'
import { Viewer } from './Viewer'

export type ClassViewParams = {
  classId: string
}

const Class = ({ classId }: { classId: number }) => {
  const { data, error } = http.useClassStudents(classId)

  const [viewerItem, setViewerItem] = useState<Student | null>(null)

  return (
    <Stack>
      {error && <Alert color="danger">获取班级失败：{error.message}</Alert>}
      {data && (
        <>
          {viewerItem && (
            <Viewer
              student={viewerItem}
              open={viewerItem !== null}
              onClose={() => {
                setViewerItem(null)
              }}
            />
          )}
          <Box
            sx={{
              height: 'calc(100vh - 128px)',
            }}
          >
            <DataGrid
              rows={data}
              columns={[
                { field: 'student_id', headerName: '学号', width: 0o150 },
                {
                  field: 'name',
                  headerName: '姓名',
                  width: 0o150,
                  sortable: false,
                },
                {
                  field: 'total_hours',
                  headerName: '总有效时长',
                  width: 0o150,
                },
                { field: 'dormitory', headerName: '寝室号', width: 0o150 },
                { field: 'state', headerName: '当前状态', width: 0o150 },
              ]}
              pageSize={50}
              sx={{}}
              onRowClick={(params) => {
                setViewerItem(params.row as Student)
              }}
              disableSelectionOnClick
            />
          </Box>
        </>
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
