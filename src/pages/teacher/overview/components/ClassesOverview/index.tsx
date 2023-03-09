import { Alert, Card, Stack, Typography, useTheme } from '@mui/joy'
import { ComponentProps, useMemo } from 'react'
import ApiErrorAlert from '../../../../../components/ApiErrorAlert'
import { service } from '../../../../../services/service'
import { Bar } from 'react-chartjs-2'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js'
import { alpha } from '@mui/material'
import { Info } from '@mui/icons-material'
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

export interface ClassesOverviewProps {
  schoolId: number
  schoolYear: string
}

export default function ClassesOverview({
  schoolId,
  schoolYear,
}: ClassesOverviewProps) {
  const { data, error } = service.teacher.useClassesStats(schoolYear, schoolId)

  const passedRate = useMemo(() => {
    if (!data) {
      return
    }
    let total_sum = 0
    let approved_sum = 0
    for (const { pass_student, total_student } of data) {
      total_sum += total_student
      approved_sum += pass_student
    }
    return ((approved_sum / total_sum) * 100).toFixed(1)
  }, [data])

  const theme = useTheme()

  const [chartData, chartOptions] = useMemo(() => {
    if (!data) {
      return []
    }
    const chartData: ComponentProps<typeof Bar>['data'] = {
      labels: data.map(({ classname }) => classname),
      datasets: [
        {
          label: '通过率',
          data: data.map(
            ({ pass_student, total_student }) => pass_student / total_student
          ),
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
            footer: ([{ dataIndex }]) => {
              const { pass_student, total_student } = data[dataIndex]
              return `通过人数：${pass_student} / ${total_student}`
            },
          },
        },
      },
    }
    return [chartData, chartOptions]
  }, [data, theme])

  return (
    <Stack spacing={2}>
      <ApiErrorAlert error={error} />

      <Alert color="info" startDecorator={<Info />}>
        <Stack>
          <Typography fontSize="lg">通过率</Typography>
          <Typography fontSize="sm">
            通过率是指班级中通过的学生人数占总人数的比例。当一个学生的学时总数达到学院要求时，该学生通过。
          </Typography>
          <Typography fontSize="sm">
            当前学院学时要求：{data && data[0]?.pass_hour} 小时
          </Typography>
        </Stack>
      </Alert>

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

      {chartData && (
        <Card component={Stack} alignItems="center" spacing={2}>
          <Typography color="neutral" level="h5">
            全部班级通过率
          </Typography>
          <Bar data={chartData} options={chartOptions} width="100%" />
        </Card>
      )}
    </Stack>
  )
}
