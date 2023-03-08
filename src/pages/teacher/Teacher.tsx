import { Container, Stack } from '@mui/joy'
import { useMediaQuery, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import AppBar from './components/AppBar'
import NavDrawer from './components/NavDrawer'

export default function Admin() {
  const theme = useTheme()

  const upLg = useMediaQuery(theme.breakpoints.up('lg'))

  const [temporaryDrawerOpen, setTemporaryDrawerOpen] = useState(upLg)

  const drawerOpen = upLg || temporaryDrawerOpen

  useEffect(() => {
    setTemporaryDrawerOpen(false)
  }, [upLg])

  return (
    <Stack direction="row">
      <NavDrawer
        open={drawerOpen}
        setOpen={setTemporaryDrawerOpen}
        variant={upLg ? 'permanent' : 'temporary'}
      />
      <Stack component="main" flex={1}>
        <AppBar
          onMenuClick={() => setTemporaryDrawerOpen((v) => !v)}
          showMenuButton={!upLg}
        />
        <Container
          sx={{
            py: 2,
          }}
        >
          <Outlet />
        </Container>
      </Stack>
    </Stack>
  )
}
