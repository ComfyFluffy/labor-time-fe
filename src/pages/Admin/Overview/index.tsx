import { Alert, Button, Checkbox, Stack, styled, Typography } from '@mui/joy'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { http, ClassesStatsResponse } from '../../../http'
import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { rowOnHover } from '../../../styles'

const FlexCenter = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

const Row = ({
  row,
  checked,
  onChange,
}: {
  row: ClassesStatsResponse[0]
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => {
  const checkboxRef = useRef<HTMLSpanElement>(null)

  const nav = useNavigate()

  return (
    <TableRow
      onClick={() => {
        nav(`/admin/class/${row.class.id}`)
      }}
      sx={rowOnHover}
    >
      <TableCell
        sx={{
          width: 0o70,
        }}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <FlexCenter>
          <Checkbox onChange={onChange} checked={checked} ref={checkboxRef} />
        </FlexCenter>
      </TableCell>
      <TableCell>{row.class.name}</TableCell>
      <TableCell>{row.statistics.total}</TableCell>
      <TableCell>
        <Typography color="success">{row.statistics.all_approved}</Typography>
      </TableCell>
      <TableCell>
        <Typography color="warning">
          {row.statistics.has_pending_item}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography color="neutral">{row.statistics.not_submitted}</Typography>
      </TableCell>
    </TableRow>
  )
}

export const Overview = () => {
  const [selectedClassIds, setSelectedClassIds] = useState<Set<number>>(
    new Set()
  )

  const [xlsxDownloading, setXlsxDownloading] = useState(false)

  const { data, error } = http.useClassesStats()

  const approvedRate = useMemo(() => {
    if (!data) {
      return
    }
    let total_sum = 0
    let approved_sum = 0
    for (const {
      statistics: { total, all_approved },
    } of data) {
      total_sum += total
      approved_sum += all_approved
    }
    return ((approved_sum / total_sum) * 100).toFixed(1)
  }, [data])

  const fullIdSet = useMemo(() => {
    if (!data) {
      return
    }
    const set = new Set<number>()
    for (const {
      class: { id },
    } of data) {
      set.add(id)
    }
    return set
  }, [data])

  return (
    <Stack spacing={2}>
      {error && <Alert color="danger">获取班级数据失败：{error.message}</Alert>}

      <Typography level="h3">软件学院</Typography>

      {approvedRate && (
        <Stack>
          <Typography color="success" level="h2">
            {approvedRate}%
          </Typography>
          <Typography color="neutral">已审核</Typography>
        </Stack>
      )}

      <Stack direction="row">
        <Button
          startDecorator={<FileDownloadIcon />}
          color="primary"
          disabled={selectedClassIds.size === 0 || xlsxDownloading}
          onClick={async () => {
            try {
              setXlsxDownloading(true)
              await http.toast(
                http.downloadXlsxByClassIds([...selectedClassIds]),
                '下载'
              )
            } finally {
              setXlsxDownloading(false)
            }
          }}
        >
          导出选择的班级
        </Button>
      </Stack>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <FlexCenter>
                <Checkbox
                  indeterminate={
                    !!fullIdSet &&
                    selectedClassIds.size > 0 &&
                    selectedClassIds.size < fullIdSet.size
                  }
                  checked={
                    !!fullIdSet && selectedClassIds.size === fullIdSet.size
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedClassIds(new Set(fullIdSet))
                    } else {
                      setSelectedClassIds(new Set())
                    }
                  }}
                />
              </FlexCenter>
            </TableCell>
            <TableCell>班级</TableCell>
            <TableCell>总人数</TableCell>
            <TableCell>全部通过</TableCell>
            <TableCell>待审核</TableCell>
            <TableCell>未提交</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row) => (
            <Row
              key={row.class.id}
              row={row}
              checked={selectedClassIds.has(row.class.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedClassIds(
                    new Set(selectedClassIds).add(row.class.id)
                  )
                } else {
                  const newSet = new Set(selectedClassIds)
                  newSet.delete(row.class.id)
                  setSelectedClassIds(newSet)
                }
              }}
            />
          ))}
        </TableBody>
      </Table>
    </Stack>
  )
}
