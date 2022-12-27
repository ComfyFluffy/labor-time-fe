import {
  Alert,
  Box,
  Container,
  inputClasses,
  Link,
  Stack,
  Typography,
} from '@mui/joy'
import { Button, TextField } from '@mui/material'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { http, UserType } from '../../http'
const Circle = ({
  size,
  color,
  top,
  left,
  blur = 3,
}: {
  size: number
  color: string
  top: number
  left: number
  blur?: number
}) => {
  const sizeCss = `${size}vh`
  return (
    <Box
      sx={{
        position: 'fixed',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: color,
        width: sizeCss,
        height: sizeCss,
        top: `${top}vh`,
        left: `${left}vh`,
        filter: `blur(${blur}px)`,
      }}
    />
  )
}

const Background = () => {
  const circles = [
    {
      color: 'rgba(255, 255, 255, 0.05)',
      left: 30,
      size: 70,
      top: 30,
    },
    {
      color: 'rgba(255, 255, 255, 0.02)',
      left: 5,
      size: 65,
      top: 90,
    },
  ]
  return (
    <div>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          background:
            'linear-gradient(168deg, rgba(51,57,77,1) 0%, rgba(28,79,62,1) 100%)',
        }}
      />
      {circles.map((circle) => (
        <Circle {...circle} key={JSON.stringify(circle)} />
      ))}
    </div>
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
        await http.login(credentials, 'student')
        nav(userType === 'student' ? '/student' : '/teacher')
      } catch (err) {
        if (err instanceof AxiosError) {
          setErrorMessage(err.response?.data.type)
        }
      } finally {
        setSubmitting(false)
      }
    })()
  }

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '80vh',
      }}
    >
      <Background />

      <Stack
        spacing={5}
        sx={{
          width: 1,
          [`& .${inputClasses.root}`]: {
            background: 'rgba(255, 255, 255, 0.5)',
          },
        }}
        component="form"
        alignItems="center"
        onSubmit={handleSubmit}
      >
        <Typography level="h3">
          {userType === 'student'
            ? '学生劳动实践学时认定'
            : '学生劳动实践学时认定管理系统'}
        </Typography>
        <Stack
          spacing={3}
          sx={{
            width: 1,
            maxWidth: 0o450,
          }}
        >
          <TextField
            label={userType === 'student' ? '学号' : '手机号'}
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
          sx={{
            color: 'rgb(230, 230, 100, 0.8)',
          }}
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
          variant="outlined"
          color="inherit"
          size="large"
          disabled={submitting}
        >
          登录
        </Button>
      </Stack>
    </Container>
  )
}
