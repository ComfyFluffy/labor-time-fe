import { Card, Stack, Typography } from '@mui/joy'
import ApiErrorAlert from '../../../../components/ApiErrorAlert'
import { service } from '../../../../services/service'
import PassRateInfo from './PassRateInfo'

export interface SystemManagementProps {
  schoolYear: string
}

export default function SchoolsOverview({ schoolYear }: SystemManagementProps) {
  const { data, error } = service.superAdmin.useSchoolPassedData(schoolYear)

  return (
    <Stack spacing={2}>
      <ApiErrorAlert error={error} />

      {data && data[0] && <PassRateInfo threshold={data[0].pass_hour} />}

      {passedRate && (
        <Card>
          <Stack spacing={1}>
            <Typography color="success" level="h2">
              {passedRate}%
            </Typography>
            <Typography color="neutral">
              总通过率（{data?.length ?? 0} 个班级）
            </Typography>
          </Stack>
        </Card>
      )}

      {chart && (
        <Card component={Stack} alignItems="center" spacing={2}>
          <Typography color="neutral" level="h5">
            全部班级通过率
          </Typography>
          <Bar data={chart.data} options={chart.options} width="100%" />
        </Card>
      )}
    </Stack>
  )
}
