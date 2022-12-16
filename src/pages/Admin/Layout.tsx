import {
  Box,
  Container,
  IconButton,
  IconButtonProps,
  Stack,
  Typography,
} from '@mui/joy'
import {
  Collapse,
  Drawer,
  DrawerProps,
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

const drawerWidth = 0o350

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean
}>(({ theme, open }) => ({
  flexGrow: 1,
  paddingBottom: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}))

interface NavBarProps {
  onMenuClick?: IconButtonProps['onClick']
  showMenuButton?: boolean
  noMenuTransition?: boolean
}

const NavBar = ({
  onMenuClick,
  showMenuButton,
  noMenuTransition,
}: NavBarProps) => {
  const menuButton = (
    <IconButton variant="plain" onClick={onMenuClick}>
      <MenuIcon />
    </IconButton>
  )

  return (
    <Stack
      spacing={2}
      direction="row"
      alignItems="center"
      sx={(theme) => ({
        height: 0o100,
        px: 2,
        borderColor: theme.vars.palette.neutral.outlinedBorder,
        borderWidth: '0px 0px thin',
        borderStyle: 'solid',
        backdropFilter: 'blur(8px)',
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,

        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        [theme.getColorSchemeSelector('dark')]: {
          backgroundColor: `rgba(${theme.vars.palette.neutral.darkChannel} / 0.8)`,
        },
      })}
    >
      {noMenuTransition ? (
        menuButton
      ) : (
        <Collapse
          in={showMenuButton}
          orientation="horizontal"
          timeout={225} // Match the drawer
        >
          {menuButton}
        </Collapse>
      )}

      <Typography level="h6">管理后台</Typography>
      <Box sx={{ flexGrow: 1 }} />
      <Stack direction="row" spacing={1}></Stack>
    </Stack>
  )
}
interface NavDrawerProps {
  open?: boolean
  setOpen: (open: boolean) => void
  variant: DrawerProps['variant']
}

const NavDrawer = ({ setOpen, open, variant }: NavDrawerProps) => {
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
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      open={open}
      onClose={() => setOpen(false)}
      variant={variant}
      anchor="left"
    >
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          height: 0o100,
          px: 2,
        }}
      >
        <IconButton variant="plain" onClick={() => setOpen(!open)}>
          <MenuIcon />
        </IconButton>
      </Stack>
    </Drawer>
  )
}

export const Layout = () => {
  const theme = useTheme()
  console.log(theme)

  const upLg = useMediaQuery(theme.breakpoints.up('lg'))

  const [drawerOpen, setDrawerOpen] = useState(upLg)

  useEffect(() => {
    setDrawerOpen(upLg)
  }, [upLg])

  return (
    <Stack direction="row">
      <NavDrawer
        open={drawerOpen}
        setOpen={setDrawerOpen}
        variant={upLg ? 'persistent' : 'temporary'}
      />
      <Main open={upLg ? drawerOpen : true}>
        <NavBar
          onMenuClick={() => setDrawerOpen(!drawerOpen)}
          showMenuButton={!drawerOpen}
          noMenuTransition={!upLg}
        />
        <Container
          maxWidth={false}
          sx={{
            pt: 1,
          }}
        >
          <Outlet />
        </Container>
      </Main>
    </Stack>
  )
}
