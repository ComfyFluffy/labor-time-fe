import { Alert, Stack, Typography, useTheme } from '@mui/joy'
import { ComponentRef, useMemo, useRef, ComponentProps } from 'react'
import { Bar, getElementAtEvent } from 'react-chartjs-2'

import ApiErrorAlert from '../../../../components/ApiErrorAlert'
import PassRateInfo from './PassRateInfo'
import { service } from '../../../../services/service'
import { calculatePassingRate, getPassingBarOptions } from './barUtils'
import { useNavigate } from 'react-router-dom'

export interface ClassesOverviewProps {
  schoolId: number
  schoolYear: string
}

export default function ClassesOverview({
  schoolId,
  schoolYear,
}: ClassesOverviewProps) {
  const { data, error } = service.teacher.useClassesStats(schoolYear, schoolId)

  const passingRate = useMemo(() => data && calculatePassingRate(data), [data])

  const theme = useTheme()

  const chart = useMemo(
    () =>
      data &&
      getPassingBarOptions(
        data.map((d) => d.classname),
        data.map((d) => d.pass_student / d.total_student),
        (index) =>
          `人数：${data[index].pass_student} / ${data[index].total_student}`,
        theme
      ),
    [data, theme]
  )

  const chartRef = useRef<ComponentRef<typeof Bar>>(null)

  const navigate = useNavigate()

  const handleChartClick: ComponentProps<typeof Bar>['onClick'] = (e) => {
    if (!chartRef.current || !data) {
      return
    }
    // Navigate to the class page when the user clicks on a bar
    const element = getElementAtEvent(chartRef.current as never, e)
    if (!element.length) {
      return
    }
    navigate(`/teacher/class/${data[element[0].index].class_id}`)
  }
  return (
    <Stack spacing={2}>
      <ApiErrorAlert error={error} />

      {data && data[0] && <PassRateInfo threshold={data[0].pass_hour} />}

      {passingRate && (
        <Alert color="success" component={Stack} spacing={1}>
          <Typography color="success" level="h2">
            {passingRate}%
          </Typography>
          <Typography color="neutral">
            总通过率（{data?.length ?? 0} 个班级）
          </Typography>
        </Alert>
      )}

      {chart && (
        <Stack alignItems="center" spacing={2}>
          <Typography color="neutral" level="h5">
            全部班级通过率
          </Typography>
          <Bar
            data={chart.data}
            options={chart.options}
            width="90%"
            ref={chartRef}
            onClick={handleChartClick}
          />
        </Stack>
      )}
    </Stack>
  )
}
