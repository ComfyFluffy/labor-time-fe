import { Download } from '@mui/icons-material'
import { Button } from '@mui/joy'
import { useState } from 'react'
import { toastOnError } from '../utils/toast'

export interface DownloadButtonProps {
  text: string
  downloadFn: () => Promise<void>
}

export default function DownloadButton({
  text,
  downloadFn,
}: DownloadButtonProps) {
  const [downloading, setDownloading] = useState(false)
  return (
    <Button
      startDecorator={<Download />}
      onClick={async () => {
        try {
          setDownloading(true)
          await toastOnError(downloadFn, '导出')
        } finally {
          setDownloading(false)
        }
      }}
      loading={downloading}
      loadingPosition="start"
    >
      {text}
    </Button>
  )
}
