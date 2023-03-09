import { Theme } from '@mui/joy'

export const rowOnHover = (theme: Theme) => ({
  '&:hover': {
    backgroundColor: theme.vars.palette.primary.softBg,
  },
  transition: 'background-color 0.25s',
})
