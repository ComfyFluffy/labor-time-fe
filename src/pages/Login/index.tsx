import {
  Alert,
  Button,
  Card,
  Container,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/joy'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { http, UserType } from '../../http'
import { cyan, pink, purple } from '@mui/material/colors'
import { alpha } from '@mui/material'

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
          setErrorMessage(err.response?.data.type || err.message)
        } else if (err instanceof Error) {
          setErrorMessage(err.message)
        }
      } finally {
        setSubmitting(false)
      }
    })()
  }

  return (
    <Container
      maxWidth={false}
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundImage: `linear-gradient(
            180deg,
            rgba(${theme.vars.palette.neutral.mainChannel} / 0.01),
            rgba(${theme.vars.palette.primary.mainChannel} / 0.1) 100%
          ),
          radial-gradient(
            ellipse at top left,
            rgba(${theme.vars.palette.primary.mainChannel} / 0.2),
            transparent 50%
          ),
          radial-gradient(
            ellipse at top right,
            ${alpha(cyan[300], 0.2)},
            transparent 50%
          ),
          radial-gradient(
            ellipse at center right,
            ${alpha(purple[300], 0.2)},
            transparent 55%
          ),
          radial-gradient(
            ellipse at center left,
            ${alpha(pink[300], 0.2)},
            transparent 50%
          )`,
      })}
    >
      <Card
        sx={(theme) => ({
          p: 5,
          mb: 2,
          backdropFilter: 'blur(10px)',
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
            <Typography level="h3">学生劳动实践学时认定</Typography>
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
              onChange={(event) =>
                setCredentials({
                  ...credentials,
                  account: event.target.value,
                })
              }
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
              onChange={(event) =>
                setCredentials({
                  ...credentials,
                  password: event.target.value,
                })
              }
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
            {userType === 'teacher' ? '学生登录' : '管理员登录'}
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
  )
}
