import { CssBaseline, CssVarsProvider } from '@mui/joy'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { theme } from './theme'

export const App = () => {
  return (
    <CssVarsProvider defaultMode="system" theme={theme}>
      <CssBaseline />

      <RouterProvider router={router} />
    </CssVarsProvider>
  )
}
