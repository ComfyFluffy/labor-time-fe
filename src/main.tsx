import { enableMapSet } from 'immer'
import React from 'react'
import ReactDOM from 'react-dom/client'
import 'react-toastify/dist/ReactToastify.css'
import { CssVarsProvider } from '@mui/joy'

import { theme } from './theme'
import { App } from './App'
import './index.css'

enableMapSet()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <CssVarsProvider defaultMode="system" theme={theme}>
      <App />
    </CssVarsProvider>
  </React.StrictMode>
)
