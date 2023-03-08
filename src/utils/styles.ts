import { SxProps as MuiSxProps, Theme as MuiTheme } from '@mui/material'

export const rowOnHover: MuiSxProps<MuiTheme> = (theme) => ({
  '&:hover': {
    backgroundColor: theme.vars.palette.primary.softBg,
  },
  transition: 'background-color 0.25s',
})
