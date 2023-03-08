import { Close } from '@mui/icons-material'
import { Box, Grid } from '@mui/joy'

export default function UploadedImage({
  onRemove,
  canBeRemoved,
  src,
  onClick,
}: {
  onRemove?: () => void
  canBeRemoved?: boolean
  src: string
  onClick?: () => void
}) {
  return (
    <Grid
      xs={1}
      sx={{
        position: 'relative',
      }}
    >
      <Box
        onClick={onClick}
        sx={{
          background: `url(${src})`,
          height: 0o160,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '8px',
        }}
      />
      {canBeRemoved && (
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
          <Close
            sx={{
              filter: 'drop-shadow(1px 1px 2px rgb(0 0 0 / 0.6))',
            }}
          />
        </Box>
      )}
    </Grid>
  )
}
