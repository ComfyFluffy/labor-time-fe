import { PieChart, Settings, SupervisorAccount } from '@mui/icons-material'
import { Alert, List, ListDivider, ListItem } from '@mui/joy'
import { useMatch } from 'react-router-dom'
import { service } from '../../../../services/service'
import { usePreferences } from '../../../../utils/store'
import CollapseList from './CollapseList'
import NavListButton, { NavListButtonProps } from './NavListButton'
import TeacherCard from './TeacherCard'

export default function NavList() {
  const selectedSchoolYear = usePreferences((state) => state.selectedSchoolYear)
  const { data: teacherData, error: teacherError } =
    service.teacher.useSelfInfo()
  const { data: classesData, error: classesError } =
    service.teacher.useManagedClasses(
      selectedSchoolYear,
      teacherData === undefined ? null : teacherData.college_id
    )

  const classRouteMatch = useMatch('/teacher/class/:classId')

  const links: NavListButtonProps[] = [
    {
      to: '/teacher/overview',
      title: '数据总览',
      Icon: PieChart,
    },
  ]

  const adminLinks: NavListButtonProps[] = [
    {
      to: '/teacher/user-management',
      title: '教师用户管理',
      Icon: SupervisorAccount,
    },

    {
      to: '/teacher/system-management',
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

      {teacherData && <TeacherCard {...teacherData} />}

      <ListDivider />

      {links.map((item) => (
        <ListItem key={item.to}>
          <NavListButton {...item} />
        </ListItem>
      ))}

      {teacherData && teacherData.role_id <= 2 && (
        <CollapseList
          emptyText="暂无班级"
          title="班级列表"
          items={
            classesData?.map((item) => ({
              name: item.name,
              to: `/teacher/class/${item.id}`,
              id: item.id,
            })) || []
          }
          itemSelected={(item) =>
            classRouteMatch?.params.classId === item.id.toString()
          }
        />
      )}

      {teacherData && teacherData.role_id >= 1 && (
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
