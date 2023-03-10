import { Card, Stack, Typography, useTheme } from '@mui/joy'
import { useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import ApiErrorAlert from '../../../../components/ApiErrorAlert'
import { service } from '../../../../services/service'
import { calculatePassingRate, getPassingBarOptions } from './barUtils'
import PassRateInfo from './PassRateInfo'

export interface SchoolsOverviewProps {
  schoolYear: string
}

export default function SchoolsOverview({ schoolYear }: SchoolsOverviewProps) {
  const { data, error } = service.superAdmin.useSchoolPassedData(schoolYear)

  const passingRate = useMemo(() => data && calculatePassingRate(data), [data])

  const theme = useTheme()

  const chart = useMemo(
    () =>
      data &&
      getPassingBarOptions(
        data.map((d) => d.college_name),
        data.map((d) => d.pass_student / d.total_student),
        (index) =>
          `人数：${data[index].pass_student} / ${data[index].total_student}`,
        theme
      ),
    [data, theme]
  )

  return (
    <Stack spacing={2}>
      <ApiErrorAlert error={error} />

      {data && data[0] && <PassRateInfo />}

      {passingRate && (
        <Card>
          <Stack spacing={1}>
            <Typography color="success" level="h2">
              {passingRate}%
            </Typography>
            <Typography color="neutral">
              总通过率（{data?.length ?? 0} 个学院）
            </Typography>
          </Stack>
        </Card>
      )}

      {chart && (
        <Card component={Stack} alignItems="center" spacing={2}>
          <Typography color="neutral" level="h5">
            全部学院通过率
          </Typography>
          <Bar data={chart.data} options={chart.options} width="100%" />
        </Card>
      )}
    </Stack>
  )
}
