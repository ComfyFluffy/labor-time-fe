import { Box, Theme } from '@mui/joy'
import { alpha } from '@mui/material'
import { ComponentProps, ReactNode } from 'react'
import { Bar } from 'react-chartjs-2'

export const getPassingBarOptions = (
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
    maintainAspectRatio: false,
  }
  return { data: chartData, options: chartOptions }
}

export const calculatePassingRate = (
  data: {
    pass_student: number
    total_student: number
  }[]
) => {
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
}

export const BarChartContainer = ({
  children,
  itemCount,
}: {
  children: ReactNode
  itemCount: number
}) => {
  return (
    <Box
      sx={{
        width: 1,
        height: itemCount * 25 + 50,
      }}
    >
      {children}
    </Box>
  )
}
