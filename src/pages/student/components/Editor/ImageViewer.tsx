import { Box } from '@mui/joy'
import { Portal } from '@mui/material'
import ReactSimpleImageViewer from 'react-simple-image-viewer'

export default function ImageViewer({
  src,
  onClose,
  currentIndex,
}: {
  src: string[]
  onClose: () => void
  currentIndex: number
}) {
  return (
    <Portal>
      <Box
        sx={{
          zIndex: 30000,
          position: 'fixed',
        }}
      >
        <ReactSimpleImageViewer
          src={src}
          currentIndex={currentIndex}
          closeOnClickOutside
          onClose={onClose}
        />
      </Box>
    </Portal>
  )
}
