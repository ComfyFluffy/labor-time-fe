import { Box, Stack, Typography } from '@mui/joy'
import { DataGrid } from '@mui/x-data-grid'
import { useParams } from 'react-router-dom'
import { Student } from '../../../model'
import { Viewer } from './Viewer'

export type ClassViewParams = {
  classId: string
}

export const ClassView = () => {
  const { classId } = useParams<ClassViewParams>()

  const data = {
    id: 1,
    name: '计算机科学与技术',
    students: [
      {
        id: 19,
        student_id: '8008121406',
        name: '姓名姓名',
        class_name: '63512',
        major: 'ef',
        dormitory: '63512',
        total_hours: 32, // 总时长
      },
      {
        id: 20,
        student_id: '3479932',
        name: 'name',
        class_name: '63512',
        major: 'ef',
        dormitory: '63512',
        total_hours: 32, // 总时长
      },
      {
        id: 21,
        student_id: '3479932',
        name: 'name',
        class_name: '63512',
        major: 'ef',
        dormitory: '63512',
        total_hours: 32, // 总时长
      },
      {
        id: 22,
        student_id: '3479932',
        name: 'name',
        class_name: '63512',
        major: 'ef',
        dormitory: '63512',
        total_hours: 32, // 总时长
      },
      {
        id: 23,
        student_id: '3479932',
        name: 'name',
        class_name: '63512',
        major: 'ef',
        dormitory: '63512',
        total_hours: 32, // 总时长
      },
      {
        id: 24,
        student_id: '3479932',
        name: 'name',
        class_name: '63512',
        major: 'ef',
        dormitory: '63512',
        total_hours: 32, // 总时长
      },
      {
        id: 25,
        student_id: '3479932',
        name: 'name',
        class_name: '63512',
        major: 'ef',
        dormitory: '63512',
        total_hours: 32, // 总时长
      },
      {
        id: 26,
        student_id: '3479932',
        name: 'name',
        class_name: '63512',
        major: 'ef',
        dormitory: '63512',
        total_hours: 32, // 总时长
      },
      {
        id: 27,
        student_id: '3479932',
        name: 'name',
        class_name: '63512',
        major: 'ef',
        dormitory: '63512',
        total_hours: 32, // 总时长
      },
    ] as Student[],
  }

  return (
    <Stack>
      <Viewer student={data.students[0]} />
      <Typography level="h3">{data.name}</Typography>
      <Box
        sx={{
          height: 'calc(100vh - 144px)',
        }}
      >
        <DataGrid
          rows={data.students}
          columns={[
            { field: 'student_id', headerName: '学号', width: 0o150 },
            {
              field: 'name',
              headerName: '姓名',
              width: 0o150,
              sortable: false,
            },
            { field: 'total_hours', headerName: '总有效时长', width: 0o150 },
            { field: 'dormitory', headerName: '寝室号', width: 0o150 },
            { field: 'state', headerName: '当前状态', width: 0o150 },
          ]}
          pageSize={50}
          sx={{}}
          onRowClick={(params) => {
            console.log(params)
          }}
          disableSelectionOnClick
        />
      </Box>
    </Stack>
  )
}
