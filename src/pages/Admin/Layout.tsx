import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  IconButtonProps,
  List,
  ListDivider,
  ListItem,
  ListItemButton,
  listItemButtonClasses,
  ListItemContent,
  ListItemDecorator,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/joy'
import {
  Collapse,
  Drawer,
  drawerClasses,
  DrawerProps,
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useEffect, useState } from 'react'
import { Outlet, useMatch, useNavigate } from 'react-router-dom'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import GroupsIcon from '@mui/icons-material/Groups'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'
import ImportExportIcon from '@mui/icons-material/ImportExport'
import { http } from '../../http'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { SxProps } from '@mui/joy/styles/types'

const drawerWidth = 0o420

const barBorderStyles: SxProps = (theme) => ({
  borderColor: theme.vars.palette.neutral.outlinedBorder,
  borderWidth: '0px 0px thin',
  borderStyle: 'solid',
})

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

const SchoolYearSwitcher = () => {
  const years = ['2021-2022']
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  return (
    <>
      <Button
        endDecorator={<ArrowDropDownIcon />}
        variant="soft"
        onClick={(event) => {
          setAnchorEl(event.currentTarget)
        }}
      >
        {years[selectedIndex] + ' 学年'}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => {
          setAnchorEl(null)
        }}
      >
        {years.map((year, index) => (
          <MenuItem
            key={year}
            selected={index === selectedIndex}
            onClick={() => {
              setSelectedIndex(index)
              setAnchorEl(null)
            }}
          >
            {year}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
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

  const theme = useTheme()
  const { data } = http.useTeacherInfo()

  return (
    <Stack
      spacing={2}
      direction="row"
      alignItems="center"
      sx={(theme) => ({
        height: 0o100,
        px: 2,
        backdropFilter: 'blur(8px)',
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,

        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        [theme.getColorSchemeSelector('dark')]: {
          backgroundColor: `rgba(${theme.vars.palette.neutral.darkChannel} / 0.8)`,
        },
        ...barBorderStyles(theme),
      })}
    >
      {noMenuTransition ? (
        menuButton
      ) : (
        <Collapse
          in={showMenuButton}
          orientation="horizontal"
          timeout={{
            enter: theme.transitions.duration.enteringScreen,
            exit: theme.transitions.duration.leavingScreen,
          }} // Match the drawer
        >
          {menuButton}
        </Collapse>
      )}

      <SchoolYearSwitcher />
      <Box sx={{ flexGrow: 1 }} />
      <Stack direction="row" alignItems="center" spacing={1}>
        {data && <Typography color="neutral">{data.name}</Typography>}
        <Button onClick={() => http.logout()} variant="soft" color="neutral">
          登出
        </Button>
      </Stack>
    </Stack>
  )
}

const NavDrawerList = () => {
  const [classListOpen, setClassListOpen] = useState(true)
  const { data: teacherData, error: teacherError } = http.useTeacherInfo()
  const { data: classesData, error: classesError } = http.useTeacherClasses()
  const nav = useNavigate()

  const classRouteMatch = useMatch('/admin/class/:classId')

  return (
    <List
      sx={{
        fontWeight: '500',
        userSelect: 'none',
      }}
    >
      {(teacherError || classesError) && (
        <Alert
          color="danger"
          sx={{
            mx: 1,
          }}
        >
          获取用户信息失败
        </Alert>
      )}

      {teacherData && (
        <ListItem>
          <ListItemButton>
            <Stack
              sx={{
                pl: 2,
              }}
              spacing={1}
              alignItems="start"
            >
              <Stack direction="row" alignItems="baseline" spacing={1}>
                <Typography fontSize="xl">{teacherData.name}</Typography>
                <Typography fontSize="xs">{teacherData.phone}</Typography>
              </Stack>
              <Chip size="sm">{teacherData.is_admin ? '管理员' : '教师'}</Chip>
            </Stack>
          </ListItemButton>
        </ListItem>
      )}

      <ListDivider />

      <ListItem nested>
        <ListItemButton onClick={() => setClassListOpen(!classListOpen)}>
          <ListItemDecorator>
            <GroupsIcon />
          </ListItemDecorator>
          <ListItemContent>班级列表</ListItemContent>
          <KeyboardArrowRightIcon
            sx={{
              transform: classListOpen ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s',
            }}
          />
        </ListItemButton>

        <Collapse in={classListOpen}>
          {classesData && (
            <List
              sx={{
                [`& .${listItemButtonClasses.root}`]: {
                  pl: 7,
                },
                [`& .${listItemButtonClasses.selected}`]: {
                  fontWeight: 'inherit',
                },
              }}
            >
              {classesData.map((item) => {
                const match =
                  classRouteMatch?.params.classId === String(item.id)
                return (
                  <ListItem key={item.id}>
                    <ListItemButton
                      selected={match}
                      variant={match ? 'soft' : undefined}
                      onClick={() => nav(`/admin/class/${item.id}`)}
                    >
                      {item.name}
                    </ListItemButton>
                  </ListItem>
                )
              })}
              {!classesData.length && (
                <ListItem>
                  <ListItemButton disabled>暂无班级</ListItemButton>
                </ListItem>
              )}
            </List>
          )}
        </Collapse>
      </ListItem>

      <ListDivider />

      <ListItem>
        <ListItemButton>
          <ListItemDecorator>
            <SupervisorAccountIcon />
          </ListItemDecorator>
          <ListItemContent>用户管理</ListItemContent>
        </ListItemButton>
      </ListItem>

      <ListItem>
        <ListItemButton>
          <ListItemDecorator>
            <ImportExportIcon />
          </ListItemDecorator>
          <ListItemContent>数据导入 / 导出</ListItemContent>
        </ListItemButton>
      </ListItem>
    </List>
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
      <Stack>
        <Stack
          direction="row"
          alignItems="center"
          sx={(theme) => ({
            height: 0o100,
            px: 2,
            position: 'sticky',
            top: 0,
            zIndex: 1,
            background: theme.vars.palette.background.body,
            ...barBorderStyles(theme),
          })}
        >
          <IconButton variant="plain" onClick={() => setOpen(!open)}>
            <MenuIcon />
          </IconButton>
        </Stack>

        <NavDrawerList />
      </Stack>
    </Drawer>
  )
}

export const Layout = () => {
  const theme = useTheme()

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
            py: 1,
          }}
        >
          <Outlet />
        </Container>
      </Main>
    </Stack>
  )
}
