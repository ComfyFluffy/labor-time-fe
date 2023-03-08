import { CheckCircle, Error, Pending, Remove } from '@mui/icons-material'
import {
  Alert,
  AlertProps,
  Box,
  Card,
  IconButton,
  Stack,
  Typography,
  typographyClasses,
} from '@mui/joy'
import { darken, lighten } from '@mui/material'
import { ReactNode, useState } from 'react'
import { Unstable_Grid2 as Grid } from '@mui/material'
import { LaborItem, LaborItemState } from '../../services/model'
import { NewLaborItem } from '../../utils/types'
import { isImageUrl } from '../../utils/utils'
import InputWithLabel from './InputWithLabel'
import UploadedItem from './UploadedItem'
import { service } from '../../services/service'
import { toastProcess } from '../../utils/toast'
import UploadButton from './UploadButton'
import ImageViewer from './ImageViewer'

export interface ItemEditorProps {
  item: LaborItem | NewLaborItem
  onRemove: (item: LaborItem | NewLaborItem) => void
  onChange: (item: LaborItem | NewLaborItem) => void
  viewMode?: boolean
  action?: ReactNode
}
export default function ItemEditor({
  item,
  onRemove,
  onChange,
  viewMode,
  action,
}: ItemEditorProps) {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)
  const [hourInput, setHourInput] = useState(
    item.duration_hour === undefined ? '' : item.duration_hour.toString()
  )

  const editable = !viewMode

  const itemEditable =
    editable && (!('state' in item) || item.state === 'rejected')

  const stateAlert: Partial<
    Record<
      LaborItemState,
      {
        color: AlertProps['color']
        Icon: React.ComponentType
        title: string
        reason?: string
      }
    >
  > = {
    approved: {
      color: 'success',
      Icon: CheckCircle,
      title: '此项目已通过审核',
    },
    rejected: {
      color: 'danger',
      Icon: Error,
      title:
        '此项目被打回' + (editable ? '，请修改后重新提交或移除此项目' : ''),
      reason:
        ('reject_reason' in item && '原因：' + item.reject_reason) || undefined,
    },
    ...(viewMode
      ? undefined
      : {
          pending: {
            color: 'warning',
            Icon: Pending,
            title:
              '此项目正在审核中' +
              (editable ? '，如要修改请联系辅导员打回' : ''),
          },
        }),
  }
  const currentAlert = ('state' in item && stateAlert[item.state]) || undefined
  const image_evidence_urls = item.evidence_urls.filter(isImageUrl)

  return (
    <Card
      sx={(theme) => {
        const isDark = theme.palette.mode === 'dark'

        const primary = isDark
          ? darken(theme.palette.primary[900], 0.6)
          : theme.palette.primary[50]

        const backgrounds = {
          approved: isDark
            ? darken(theme.palette.success[900], 0.6)
            : theme.palette.success[50],

          rejected: isDark
            ? darken(theme.palette.danger[900], 0.6)
            : theme.palette.danger[50],

          pending: viewMode
            ? primary
            : isDark
            ? darken(theme.palette.warning[900], 0.6)
            : lighten(theme.palette.warning[50], 0.8),
        }
        return {
          background: 'state' in item ? backgrounds[item.state] : primary,
        }
      }}
    >
      <Stack spacing={1}>
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            mb: !currentAlert ? -2 : undefined,
          }}
        >
          {currentAlert ? (
            <Alert
              color={currentAlert.color}
              startDecorator={<currentAlert.Icon />}
              variant="plain"
              sx={{ p: 1, flex: 1 }}
            >
              <Box
                sx={{
                  [`& .${typographyClasses.root}`]: {
                    color: 'inherit',
                  },
                }}
              >
                <Typography>{currentAlert.title}</Typography>
                {currentAlert.reason && (
                  <Typography fontSize="sm">{currentAlert.reason}</Typography>
                )}
              </Box>
            </Alert>
          ) : (
            <Box
              sx={{
                flex: 1,
              }}
            />
          )}

          {itemEditable && (
            <IconButton
              size="sm"
              color="danger"
              onClick={onRemove && (() => onRemove(item))}
            >
              <Remove />
            </IconButton>
          )}
        </Stack>

        <InputWithLabel
          label="事项"
          disabled={!itemEditable}
          variant="outlined"
          color={currentAlert?.color || 'primary'}
          value={item.description}
          onChange={(e) =>
            onChange && onChange({ ...item, description: e.target.value })
          }
        />
        <InputWithLabel
          label="学时"
          type="number"
          variant="outlined"
          color={currentAlert?.color || 'primary'}
          disabled={!itemEditable}
          sx={{
            width: 0o100,
          }}
          value={hourInput}
          onChange={(e) => {
            setHourInput(e.target.value)
            onChange &&
              onChange({
                ...item,
                duration_hour: parseInt(hourInput), // TODO: use a form validation library
              })
          }}
        />
        <Typography level="body2">证明材料</Typography>
        <Grid container columns={{ xs: 3, sm: 4, md: 7 }} spacing={1}>
          {item.evidence_urls.map((src) => (
            <UploadedItem
              key={src}
              canBeRemoved={itemEditable}
              src={src}
              onRemove={() => {
                onChange &&
                  onChange({
                    ...item,
                    evidence_urls: item.evidence_urls.filter(
                      (url) => url !== src
                    ),
                  })
              }}
              onClick={() => {
                const index = image_evidence_urls.findIndex(
                  (url) => url === src
                )
                if (index !== -1) {
                  setViewerIndex(index)
                }
              }}
            />
          ))}
          {itemEditable && (
            <Grid xs={1}>
              <UploadButton
                onUpload={(file) => {
                  toastProcess(async () => {
                    const url = await service.student.uploadImage(file)
                    onChange &&
                      onChange({
                        ...item,
                        evidence_urls: [...(item.evidence_urls || []), url],
                      })
                  }, '上传图片')
                }}
              />
            </Grid>
          )}
        </Grid>

        {viewerIndex !== null && (
          <ImageViewer
            src={image_evidence_urls}
            currentIndex={viewerIndex}
            onClose={() => setViewerIndex(null)}
          />
        )}

        {action}
      </Stack>
    </Card>
  )
}
