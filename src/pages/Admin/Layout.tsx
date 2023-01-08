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
import { ComponentType, useEffect, useState } from 'react'
import { Outlet, useMatch, useNavigate } from 'react-router-dom'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import GroupsIcon from '@mui/icons-material/Groups'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'
import ImportExportIcon from '@mui/icons-material/ImportExport'
import { http } from '../../http'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { SxProps } from '@mui/joy/styles/types'
import { usePreferences } from '../../store'
import shallow from 'zustand/shallow'
import SettingsIcon from '@mui/icons-material/Settings'
import PieChartIcon from '@mui/icons-material/PieChart'

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
  const { data } = http.useSchoolYears()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const [selectedSchoolYear, setSelectedSchoolYear] = usePreferences(
    (state) => [state.selectedSchoolYear, state.setSelectedSchoolYear],
    shallow
  )
  useEffect(() => {
    if (
      data &&
      (selectedSchoolYear === null ||
        !data.school_years.includes(selectedSchoolYear))
    ) {
      setSelectedSchoolYear(data.current_school_year || null)
    }
  }, [data, selectedSchoolYear, setSelectedSchoolYear])

  return data ? (
    <Box>
      <Button
        endDecorator={<ArrowDropDownIcon />}
        variant="soft"
        onClick={(event) => {
          setAnchorEl(event.currentTarget)
        }}
      >
        {selectedSchoolYear + ' 学年'}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => {
          setAnchorEl(null)
        }}
      >
        {data.school_years.map((year) => (
          <MenuItem
            key={year}
            selected={year === selectedSchoolYear}
            variant={year === selectedSchoolYear ? 'soft' : undefined}
            onClick={() => {
              setSelectedSchoolYear(year)
              setAnchorEl(null)
            }}
          >
            {year}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  ) : null
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
        zIndex: 100,

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
          }} // Match with the drawer
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

interface NavListButtonProps {
  to: string
  title: string
  Icon: ComponentType
}

const NavListButton = ({ to, title, Icon }: NavListButtonProps) => {
  const match = useMatch(to)
  const nav = useNavigate()
  return (
    <ListItemButton
      selected={!!match}
      variant={match ? 'soft' : undefined}
      onClick={() => {
        nav(to)
      }}
    >
      <ListItemDecorator>
        <Icon />
      </ListItemDecorator>
      <ListItemContent>{title}</ListItemContent>
    </ListItemButton>
  )
}

const NavDrawerList = () => {
  const [classListOpen, setClassListOpen] = usePreferences(
    (state) => [state.classListOpen, state.setClassListOpen],
    shallow
  )
  const { data: teacherData, error: teacherError } = http.useTeacherInfo()
  const { data: classesData, error: classesError } = http.useClasses()
  const nav = useNavigate()

  const classRouteMatch = useMatch('/admin/class/:classId')

  const links: NavListButtonProps[] = [
    {
      to: '/admin/overview',
      title: '数据总览',
      Icon: PieChartIcon,
    },
    {
      to: '/admin/data-manage',
      title: '数据导入 / 导出',
      Icon: ImportExportIcon,
    },
  ]

  const adminLinks: NavListButtonProps[] = [
    {
      to: '/admin/user-manage',
      title: '教师用户管理',
      Icon: SupervisorAccountIcon,
    },

    {
      to: '/admin/system-manage',
      title: '系统管理',
      Icon: SettingsIcon,
    },
  ]

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

      {links.map((item) => (
        <ListItem key={item.to}>
          <NavListButton {...item} />
        </ListItem>
      ))}

      <ListItem
        nested
        sx={{
          my: '6px',
        }}
      >
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

        <Collapse in={classListOpen} unmountOnExit timeout="auto">
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

      {teacherData?.is_admin && (
        <>
          <ListDivider />
          {adminLinks.map((item) => (
            <ListItem key={item.to}>
              <NavListButton {...item} />
            </ListItem>
          ))}
        </>
      )}
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
          sx={{
            py: 2,
          }}
        >
          <Outlet />
        </Container>
      </Main>
    </Stack>
  )
}
