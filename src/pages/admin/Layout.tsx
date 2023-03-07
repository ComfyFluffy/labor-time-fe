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
  useMediaQuery,
  useTheme,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { ComponentType, useEffect, useState } from 'react'
import { Outlet, useMatch, useNavigate } from 'react-router-dom'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import GroupsIcon from '@mui/icons-material/Groups'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'
import { service } from '../../service'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { usePreferences } from '../../store'
import { shallow } from 'zustand/shallow'
import SettingsIcon from '@mui/icons-material/Settings'
import PieChartIcon from '@mui/icons-material/PieChart'

interface NavBarProps {
  onMenuClick?: IconButtonProps['onClick']
  showMenuButton?: boolean
}

const SchoolYearSwitcher = () => {
  const { data } = service.useSchoolYears()
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

const NavBar = ({ onMenuClick, showMenuButton }: NavBarProps) => {
  const { data } = service.useTeacherInfo()

  return (
    <Stack
      spacing={2}
      direction="row"
      alignItems="center"
      sx={(theme) => ({
        height: 0o100,
        px: 2,
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,

        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        [theme.getColorSchemeSelector('dark')]: {
          backgroundColor: `rgba(${theme.vars.palette.neutral.darkChannel} / 0.8)`,
        },
        borderColor: theme.vars.palette.neutral.outlinedBorder,
        borderWidth: '0px 0px thin',
        borderStyle: 'solid',
      })}
    >
      {showMenuButton && (
        <IconButton variant="plain" onClick={onMenuClick} size="sm">
          <MenuIcon />
        </IconButton>
      )}

      <SchoolYearSwitcher />
      <Box sx={{ flexGrow: 1 }} />
      <Stack direction="row" alignItems="center" spacing={1}>
        {data && <Typography color="neutral">{data.name}</Typography>}
        <Button onClick={() => service.logout()} variant="soft" color="neutral">
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
  const { data: teacherData, error: teacherError } = service.useTeacherInfo()
  const { data: classesData, error: classesError } = service.useClasses()
  const nav = useNavigate()

  const classRouteMatch = useMatch('/admin/class/:classId')

  const links: NavListButtonProps[] = [
    {
      to: '/admin/overview',
      title: '数据总览',
      Icon: PieChartIcon,
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
          <Stack
            sx={{
              px: 2,
              py: 1,
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
        </ListItem>
      )}

      <ListDivider />

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

const drawerWidth = 0o420

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
      <NavDrawerList />
    </Drawer>
  )
}

export default function Layout() {
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
        <NavBar
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