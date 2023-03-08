import { Drawer, drawerClasses, DrawerProps } from '@mui/material'
import NavList from './NavList'

export interface NavDrawerProps {
  open?: boolean
  setOpen: (open: boolean) => void
  variant: DrawerProps['variant']
}

const drawerWidth = 0o420

export default function NavDrawer({ setOpen, open, variant }: NavDrawerProps) {
  return (
    <Drawer
      PaperProps={{
        sx: (theme) => ({
          background:
            variant === 'temporary'
              ? theme.vars.palette.background.popup
              : theme.vars.palette.background.body,
        }),
      }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .${drawerClasses.paper}`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      open={open}
      onClose={() => setOpen(false)}
      variant={variant}
      anchor="left"
    >
      <NavList />
    </Drawer>
  )
}
