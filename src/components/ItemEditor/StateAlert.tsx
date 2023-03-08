import { Alert, AlertProps, Box, Typography, typographyClasses } from '@mui/joy'
import { ComponentType } from 'react'

export interface StateAlertProps {
  color: AlertProps['color']
  Icon: ComponentType
  title: string
  reason?: string | undefined
}

export default function StateAlert({
  color,
  Icon,
  title,
  reason,
}: StateAlertProps) {
  return (
    <Alert
      color={color}
      startDecorator={<Icon />}
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
        <Typography>{title}</Typography>
        {reason && <Typography fontSize="sm">{reason}</Typography>}
      </Box>
    </Alert>
  )
}
