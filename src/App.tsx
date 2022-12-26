import { CssBaseline, CssVarsProvider } from '@mui/joy'
import { useMediaQuery } from '@mui/material'
import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { router } from './router'
import { theme } from './theme'

export const App = () => {
  const isDark = useMediaQuery('(prefers-color-scheme: dark)')

  return (
    <CssVarsProvider defaultMode="system" theme={theme}>
      <CssBaseline />

      <RouterProvider router={router} />
      <ToastContainer theme={isDark ? 'colored' : 'light'} />
    </CssVarsProvider>
  )
}
