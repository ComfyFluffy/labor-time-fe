import { CssBaseline, useColorScheme } from '@mui/joy'
import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { rootRouter } from './pages/router'

export const App = () => {
  const { colorScheme } = useColorScheme()

  return (
    <>
      <CssBaseline />

      <RouterProvider router={rootRouter} />

      <ToastContainer theme={colorScheme === 'dark' ? 'colored' : 'light'} />
    </>
  )
}
