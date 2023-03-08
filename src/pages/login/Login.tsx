import {
  Alert,
  Button,
  Card,
  Container,
  Link,
  Stack,
  Input,
  Typography,
  FormControl,
  FormLabel,
} from '@mui/joy'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginBackground from './components/LoginBackground'
import { UserType } from '../../services/model'
import { service } from '../../services/service'

export default function Login() {
  const [credentials, setCredentials] = useState({
    account: '',
    password: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [userType, setUserType] = useState<UserType>('student')

  const navigate = useNavigate()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    ;(async () => {
      try {
        setSubmitting(true)

        await service.login(credentials, userType)
        navigate(userType === 'student' ? '/student' : '/admin')
      } catch (err) {
        if (err instanceof AxiosError) {
          let message: string | undefined = err.response?.data.type
          if (message?.includes('账号不存在')) {
            message += '，请检查账号类型'
          }
          setErrorMessage(message || err.message)
        } else if (err instanceof Error) {
          setErrorMessage(err.message)
        }
      } finally {
        setSubmitting(false)
      }
    })()
  }

  return (
    <>
      <LoginBackground />
      <Container
        maxWidth={false}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '95vh',
        }}
      >
        <Card
          sx={(theme) => ({
            p: 5,
            width: 0o600,
            maxWidth: 1,
            background:
              theme.palette.mode === 'dark'
                ? 'rgba(0, 0, 0, 0.5)'
                : 'rgba(255, 255, 255, 0.7)',
          })}
        >
          <Stack
            spacing={4}
            sx={{
              width: 1,
            }}
            component="form"
            alignItems="center"
            onSubmit={handleSubmit}
          >
            <Stack alignItems="center" spacing={1}>
              <Typography level="h4">学生劳动实践学时认定</Typography>
            </Stack>
            <Stack
              spacing={3}
              sx={{
                width: 1,
                maxWidth: 0o450,
              }}
            >
              <FormControl>
                <FormLabel>
                  {userType === 'student' ? '学号' : '教师手机号'}
                </FormLabel>
                <Input
                  color="primary"
                  fullWidth
                  required
                  value={credentials.account}
                  onChange={(event) => {
                    setCredentials({
                      ...credentials,
                      account: event.target.value,
                    })
                    if (!event.target.value && !credentials.password) {
                      setErrorMessage('')
                    }
                  }}
                  error={!!errorMessage}
                />
              </FormControl>
              <FormControl>
                <FormLabel>密码</FormLabel>
                <Input
                  type="password"
                  color="primary"
                  autoComplete="current-password"
                  fullWidth
                  required
                  value={credentials.password}
                  onChange={(event) => {
                    setCredentials({
                      ...credentials,
                      password: event.target.value,
                    })
                    if (!credentials.account && !event.target.value) {
                      setErrorMessage('')
                    }
                  }}
                  error={!!errorMessage}
                />
              </FormControl>
              {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
            </Stack>

            <Link
              onClick={() =>
                setUserType((userType) =>
                  userType === 'student' ? 'teacher' : 'student'
                )
              }
            >
              {userType === 'teacher' ? '学生登录' : '教师登录'}
            </Link>

            <Button
              type="submit"
              sx={{
                width: 0o160,
              }}
              variant="soft"
              size="lg"
              disabled={submitting}
            >
              登录
            </Button>
          </Stack>
        </Card>
      </Container>
    </>
  )
}
