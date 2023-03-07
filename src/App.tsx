import { CssBaseline, useColorScheme } from '@mui/joy'
import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { router } from './router'

export const App = () => {
  const { colorScheme } = useColorScheme()

  return (
    <>
      <CssBaseline />

      <RouterProvider router={router} />

      <ToastContainer theme={colorScheme === 'dark' ? 'colored' : 'light'} />
    </>
  )
}
