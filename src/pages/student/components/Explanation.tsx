import { Alert, Stack, Typography } from '@mui/joy'
import { Category } from '../../../services/model'

export default function Explanation({
  explanation: { text, title },
}: Pick<Category, 'explanation'>) {
  return (
    <Alert color="info">
      <Stack spacing={1}>
        <Typography>{title}</Typography>
        <Typography level="body2">{text}</Typography>
      </Stack>
    </Alert>
  )
}
