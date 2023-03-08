import {
  Groups,
  KeyboardArrowRight,
  PieChart,
  Settings,
  SupervisorAccount,
} from '@mui/icons-material'
import {
  Alert,
  Chip,
  List,
  ListDivider,
  ListItem,
  ListItemButton,
  listItemButtonClasses,
  ListItemContent,
  ListItemDecorator,
  Stack,
  Typography,
} from '@mui/joy'
import { Collapse } from '@mui/material'
import { Link, useMatch } from 'react-router-dom'
import { shallow } from 'zustand/shallow'
import { roleIdToRole } from '../../../../services/model'
import { service } from '../../../../services/service'
import { usePreferences } from '../../../../utils/store'
import NavListButton, { NavListButtonProps } from './NavListButton'

export default function NavList() {
  const { classListOpen, setClassListOpen, selectedSchoolYear } =
    usePreferences(
      ({ classListOpen, setClassListOpen, selectedSchoolYear }) => ({
        classListOpen,
        setClassListOpen,
        selectedSchoolYear,
      }),
      shallow
    )
  const { data: teacherData, error: teacherError } =
    service.teacher.useSelfInfo()
  const { data: classesData, error: classesError } =
    service.teacher.useManagedClasses(
      selectedSchoolYear,
      teacherData === undefined ? null : teacherData.college_id
    )

  const classRouteMatch = useMatch('/admin/class/:classId')

  const links: NavListButtonProps[] = [
    {
      to: '/admin/overview',
      title: '数据总览',
      Icon: PieChart,
    },
  ]

  const adminLinks: NavListButtonProps[] = [
    {
      to: '/admin/user-management',
      title: '教师用户管理',
      Icon: SupervisorAccount,
    },

    {
      to: '/admin/system-management',
      title: '系统管理',
      Icon: Settings,
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
            <Chip size="sm">{roleIdToRole.get(teacherData.role_id)}</Chip>
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
            <Groups />
          </ListItemDecorator>
          <ListItemContent>班级列表</ListItemContent>
          <KeyboardArrowRight
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
                      component={Link}
                      to={`/admin/class/${item.id}`}
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

      {teacherData?.role_id >= 1 && (
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
