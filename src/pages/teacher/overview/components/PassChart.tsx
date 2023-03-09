import { Card, Stack, Theme, Typography, useTheme } from '@mui/joy'
import { alpha } from '@mui/material'
import { ComponentProps, useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import ApiErrorAlert from '../../../../components/ApiErrorAlert'
import PassRateInfo from './PassRateInfo'

const getPassingBarOptions = (
  labels: string[],
  data: number[],
  footer: (index: number) => string,
  theme: Theme
) => {
  const chartData: ComponentProps<typeof Bar>['data'] = {
    labels,
    datasets: [
      {
        label: '通过率',
        data,
        backgroundColor: alpha(theme.palette.success[400], 0.7),
      },
    ],
  }
  const axisColor = theme.palette.neutral[400]
  const chartOptions: ComponentProps<typeof Bar>['options'] = {
    indexAxis: 'y',
    responsive: true,
    scales: {
      x: {
        ticks: {
          format: {
            style: 'percent',
          },
          color: axisColor,
        },
        suggestedMax: 1,
        suggestedMin: 0,
      },
      y: {
        ticks: {
          color: axisColor,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          footer: ([{ dataIndex }]) => footer(dataIndex),
        },
      },
    },
  }
  return { data: chartData, options: chartOptions }
}

export default function PassChart() {
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
