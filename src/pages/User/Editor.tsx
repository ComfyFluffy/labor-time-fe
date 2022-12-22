import {
  Alert,
  AlertProps,
  Box,
  Button,
  Card,
  formLabelClasses,
  IconButton,
  inputClasses,
  Sheet,
  Stack,
  styled,
  TextField,
  Theme,
  Typography,
  typographyClasses,
} from '@mui/joy'
import { alpha, darken, lighten, Unstable_Grid2 as Grid } from '@mui/material'
import RemoveIcon from '@mui/icons-material/Remove'
import ErrorIcon from '@mui/icons-material/Error'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import PendingIcon from '@mui/icons-material/Pending'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { CategoryExplanation, Item, ItemState } from '../../model'
import { CategoryWithNewItem, NewItem } from '.'
import { ReactNode, useMemo } from 'react'

const transparentBackground = (theme: Theme) =>
  theme.palette.mode === 'dark'
    ? alpha(theme.palette.common.black, 0.8)
    : alpha(theme.palette.common.white, 0.8)

const StyledTextField = styled(TextField)(({ theme, color }) => ({
  [`& .${inputClasses.disabled}`]: {
    color: theme.vars.palette[color!]?.outlinedColor,
  },

  [`& .${formLabelClasses.root}`]: {
    color: theme.vars.palette.text.secondary,
  },
}))

const UploadButton = () => {
  return (
    <Sheet
      color="primary"
      variant="outlined"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
        height: 0o160,
        borderRadius: '8px',
        flexDirection: 'column',
        background: transparentBackground,
        borderWidth: '2px',
      }}
    >
      <Box>
        <AddIcon
          sx={{
            fontSize: '2rem',
          }}
        />
        <Typography
          level="body2"
          sx={{
            position: 'absolute',
            width: 1,
            color: 'inherit',
          }}
        >
          （最多 3 项）
        </Typography>
      </Box>
    </Sheet>
  )
}

const ImgItem = ({
  onRemove,
  editable,
  src,
}: {
  onRemove?: () => void
  editable?: boolean
  src: string
}) => (
  <Grid
    xs={1}
    sx={{
      position: 'relative',
    }}
  >
    <Box
      sx={{
        background: `url(${src})`,
        height: 0o160,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '8px',
      }}
    />
    {editable && (
      <Box
        sx={(theme) => ({
          display: 'flex',
          position: 'absolute',
          top: 0,
          right: 0,
          p: '10px',
          color: theme.palette.common.white,
        })}
        onClick={onRemove}
      >
        <CloseIcon
          sx={{
            filter: 'drop-shadow(1px 1px 2px rgb(0 0 0 / 0.6))',
          }}
        />
      </Box>
    )}
  </Grid>
)

const Explanation = ({
  explanation: { text, title },
}: {
  explanation: CategoryExplanation
}) => {
  return (
    <Alert color="info">
      <Stack spacing={1}>
        <Typography>{title}</Typography>
        <Typography level="body2">{text}</Typography>
      </Stack>
    </Alert>
  )
}

export const ItemEditor = ({
  item,
  editable,
  onRemove,
  onChange,
  viewMode,
  action,
}: {
  item: Item | NewItem
  editable?: boolean
  onRemove?: (item: Item | NewItem) => void
  onChange?: (item: Item | NewItem) => void
  viewMode?: boolean
  action?: ReactNode
}) => {
  editable = editable && !viewMode

  const itemEditable =
    editable && (!('state' in item) || item.state === 'rejected')

  const stateAlert: Partial<
    Record<
      ItemState,
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
      Icon: CheckCircleIcon,
      title: '此项目已通过审核',
    },
    rejected: {
      color: 'danger',
      Icon: ErrorIcon,
      title: '此项目被打回，请修改后重新提交或移除此项目',
      reason:
        ('rejected_reason' in item && '原因：' + item.rejected_reason) ||
        undefined,
    },
    ...(viewMode
      ? undefined
      : {
          pending: {
            color: 'warning',
            Icon: PendingIcon,
            title: '此项目正在审核中。如要修改，请联系辅导员打回',
          },
        }),
  }
  const currentAlert = ('state' in item && stateAlert[item.state]) || undefined

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
              <RemoveIcon />
            </IconButton>
          )}
        </Stack>

        <StyledTextField
          label="事项"
          disabled={!itemEditable}
          variant="outlined"
          color={currentAlert?.color || 'primary'}
          value={item.description}
          onChange={
            onChange &&
            ((e) => onChange({ ...item, description: e.target.value }))
          }
        />
        <StyledTextField
          label="学时"
          type="number"
          variant="outlined"
          color={currentAlert?.color || 'primary'}
          disabled={!itemEditable}
          sx={{
            width: 0o100,
          }}
          value={item.duration_hour}
          onChange={
            onChange &&
            ((e) =>
              onChange({
                ...item,
                duration_hour: e.target.value as any, // TODO: use a form validation library
              }))
          }
        />
        <Typography level="body2">证明材料</Typography>
        <Grid container columns={{ xs: 3, sm: 4, md: 7 }} spacing={1}>
          {item.picture_urls.map((src) => (
            <ImgItem
              key={src}
              editable={itemEditable}
              src={src}
              onRemove={
                onChange &&
                (() => {
                  onChange({
                    ...item,
                    picture_urls: item.picture_urls.filter(
                      (url) => url !== src
                    ),
                  })
                })
              }
            />
          ))}
          {itemEditable && (
            <Grid xs={1}>
              <UploadButton />
            </Grid>
          )}
        </Grid>
        {action}
      </Stack>
    </Card>
  )
}

export interface EditorProps {
  category: CategoryWithNewItem
  onAddItem: () => void
  onRemoveItem: (item: Item | NewItem) => void
  onUpdateItem: (item: Item | NewItem) => void
}

export const Editor = ({
  category,
  onUpdateItem,
  onRemoveItem,
  onAddItem,
}: EditorProps) => {
  const { name, explanation, items, editable } = category

  // sum of duration_hour
  const overMaxHours = useMemo(
    () =>
      category.max_total_hour &&
      items.reduce((acc, item) => acc + +item.duration_hour, 0) >
        category.max_total_hour,
    [items]
  )

  return (
    <>
      <Typography level="h5">{name}</Typography>

      {explanation && <Explanation explanation={explanation} />}

      <Stack spacing={1}>
        <Stack spacing={1}>
          {items.map((item) => (
            <ItemEditor
              key={'id' in item ? item.id : item.local_id}
              item={item}
              editable={editable}
              onRemove={onRemoveItem}
              onChange={onUpdateItem}
            />
          ))}
        </Stack>

        {editable && (
          <Button
            variant="soft"
            startDecorator={<AddIcon />}
            onClick={onAddItem}
          >
            添加项目
          </Button>
        )}
      </Stack>
      {overMaxHours && (
        <Alert startDecorator={<ErrorIcon />} color="danger">
          总学时不得超过 {category.max_total_hour} 小时
        </Alert>
      )}
    </>
  )
}
