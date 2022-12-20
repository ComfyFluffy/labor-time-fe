import { deepmerge } from '@mui/utils'
import { experimental_extendTheme as extendMuiTheme } from '@mui/material/styles'
import { extendTheme as extendJoyTheme } from '@mui/joy/styles'

const joyTheme = extendJoyTheme()

const muiTheme = extendMuiTheme()

export const theme = deepmerge(muiTheme, joyTheme)
