import { Alert, AlertProps } from '@mui/joy'
import { ApiError } from '../services/base'

export type ApiErrorAlertProps = {
  error?: ApiError
  typeText?: string
} & AlertProps

export default function ApiErrorAlert({
  error,
  typeText = '',
  ...rest
}: ApiErrorAlertProps) {
  if (!error) {
    return null
  }

  return (
    <Alert color="danger" {...rest}>
      获取{typeText}数据失败：{error.message}
    </Alert>
  )
}
