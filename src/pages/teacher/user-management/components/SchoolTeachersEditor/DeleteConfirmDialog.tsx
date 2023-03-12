import { WarningRounded } from '@mui/icons-material'
import { Box, Button, Divider, Modal, ModalDialog, Typography } from '@mui/joy'

export default function DeleteConfirmDialog({
  open,
  setOpen,
  onConfirm,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  onConfirm: () => void
}) {
  return (
    <Modal
      aria-labelledby="alert-dialog-modal-title"
      aria-describedby="alert-dialog-modal-description"
      open={open}
      onClose={() => setOpen(false)}
    >
      <ModalDialog variant="outlined" role="alertdialog">
        <Typography
          id="alert-dialog-modal-title"
          component="h2"
          level="inherit"
          fontSize="1.25em"
          mb="0.25em"
          startDecorator={<WarningRounded />}
        >
          删除用户
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography
          id="alert-dialog-modal-description"
          textColor="text.tertiary"
          mb={3}
        >
          确定要删除用户吗？
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button
            variant="plain"
            color="neutral"
            onClick={() => setOpen(false)}
          >
            取消
          </Button>
          <Button
            variant="solid"
            color="danger"
            onClick={() => {
              onConfirm()
              setOpen(false)
            }}
          >
            删除
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  )
}
