import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  Link,
  Stack,
  TextField,
  Typography,
  useColorScheme,
} from '@mui/joy'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { http, UserType } from '../../http'
import { cyan, pink, purple } from '@mui/material/colors'
import { alpha } from '@mui/material'
import noise from './noise.svg'

const Background = () => {
  const fixed = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }
  const { colorScheme } = useColorScheme()
  return (
    <>
      <Box
        sx={(theme) => ({
          ...fixed,
          zIndex: -5,

          backgroundImage: `
            linear-gradient(
              180deg,
              rgba(${theme.vars.palette.neutral.mainChannel} / 0.01),
              rgba(${theme.vars.palette.primary.mainChannel} / 0.15) 100%
            ),
            radial-gradient(
              ellipse at top left,
              rgba(${theme.vars.palette.primary.mainChannel} / 0.3),
              transparent 50%
            ),
            radial-gradient(
              ellipse at top right,
              ${alpha(cyan[300], 0.3)},
              transparent 50%
            ),
            radial-gradient(
              ellipse at center right,
              ${alpha(purple[300], 0.3)},
              transparent 55%
            ),
            radial-gradient(
              ellipse at center left,
              ${alpha(pink[300], 0.2)},
              transparent 50%
            )`,
        })}
      />
      <Box
        sx={{
          ...fixed,
          zIndex: -4,
          backdropFilter: 'blur(48px)',
        }}
      />
      {colorScheme === 'dark' && (
        // Noise layer to reduce banding
        // In the dark mode, the banding is more obvious
        <Box
          sx={{
            ...fixed,
            zIndex: -3,
            background: `
              url(${noise})
            `,
            mixBlendMode: 'multiply',
          }}
        />
      )}
    </>
  )
}

export const Login = () => {
  const [credentials, setCredentials] = useState({
    account: '',
    password: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [userType, setUserType] = useState<UserType>('student')

  const nav = useNavigate()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    ;(async () => {
      try {
        setSubmitting(true)

        await http.login(credentials, userType)
        nav(userType === 'student' ? '/student' : '/admin')
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
      <Background />
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
              <TextField
                label={userType === 'student' ? '学号' : '教师手机号'}
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
              <TextField
                type="password"
                label="密码"
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
