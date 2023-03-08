import { deepmerge } from '@mui/utils'
import { experimental_extendTheme as extendMuiTheme } from '@mui/material/styles'
import { extendTheme as extendJoyTheme } from '@mui/joy/styles'

const joyTheme = extendJoyTheme({
  components: {
    JoyAutocomplete: {
      defaultProps: {
        clearText: '清空',
        closeText: '关闭',
        loadingText: '加载中……',
        noOptionsText: '没有可用选项',
        openText: '打开',
      },
    },
  },
})

const muiTheme = extendMuiTheme({
  // Disable ripple effect
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
})

export const theme = deepmerge(muiTheme, joyTheme)
