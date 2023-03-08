import { Add } from '@mui/icons-material'
import { Box, Sheet, Theme, Typography } from '@mui/joy'
import { alpha } from '@mui/material'

const transparentBackground = (theme: Theme) =>
  theme.palette.mode === 'dark'
    ? alpha(theme.palette.common.black, 0.8)
    : alpha(theme.palette.common.white, 0.8)

export default function UploadButton({
  onUpload,
}: {
  onUpload: (file: File) => void
}) {
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
        <Add
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
      <input
        type="file"
        accept="image/*"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0,
        }}
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) {
            onUpload(file)
          }
        }}
      />
    </Sheet>
  )
}
