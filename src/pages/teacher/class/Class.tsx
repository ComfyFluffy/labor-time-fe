import { Input, Stack, Typography, useTheme } from '@mui/joy'
import { useMediaQuery } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { service } from '../../../services/service'
import { StudentState, studentStates } from '../../../services/model'
import Autocomplete from '@mui/joy/Autocomplete'
import { usePreferences } from '../../../utils/store'
import ApiErrorAlert from '../../../components/ApiErrorAlert'
import ClassTable, { studentStateDisplay } from './components/ClassTable'
import { StudentWithoutClass } from '../../../services/teacher'
import LaborViewer from './components/LaborViewer'

export type ClassViewParams = {
  classId: string
}

const ClassWithProps = ({ classId }: { classId: number }) => {
  const { data, error, mutate } = service.teacher.useClassStudents(classId)

  const [viewerItem, setViewerItem] = useState<StudentWithoutClass | null>(null)

  const [searchText, setSearchText] = useState('')
  const [stateFilter, setStateFilter] = useState<StudentState | null>(null)

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
      <ApiErrorAlert error={error} />

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
            <LaborViewer
              student={viewerItem}
              open={viewerItem !== null}
              onClose={() => {
                setViewerItem(null)
                mutate()
              }}
            />
          )}

          <ClassTable students={filteredData} onRowClick={setViewerItem} />
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
