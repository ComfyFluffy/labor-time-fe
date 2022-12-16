import { deepmerge } from '@mui/utils'
import { experimental_extendTheme as extendMuiTheme } from '@mui/material/styles'
import { extendTheme as extendJoyTheme } from '@mui/joy/styles'

const joyTheme = extendJoyTheme({
  colorSchemes: {
    light: {
      palette: {
        background: {
          body: '#f9f9f9',
        },
      },
    },
  },
})

const muiTheme = extendMuiTheme()

export const theme = deepmerge(muiTheme, joyTheme)
