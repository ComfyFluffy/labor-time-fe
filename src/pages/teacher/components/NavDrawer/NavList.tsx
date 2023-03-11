import { PieChart, Settings, SupervisorAccount } from '@mui/icons-material'
import { List, ListDivider, ListItem } from '@mui/joy'
import ApiErrorAlert from '../../../../components/ApiErrorAlert'
import { service } from '../../../../services/service'
import { usePreferences } from '../../../../utils/store'
import ClassNavList from './ClassNavList'
import NavListButton, { NavListButtonProps } from './NavListButton'
import TeacherCard from './TeacherCard'

export default function NavList() {
  const selectedSchoolYear = usePreferences((state) => state.selectedSchoolYear)
  const { data: user, error } = service.teacher.useSelfInfo()

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
  ]

  return (
    <List
      sx={{
        fontWeight: '500',
        userSelect: 'none',
      }}
    >
      <ApiErrorAlert error={error} />

      {user && <TeacherCard {...user} />}

      <ListDivider />

      {links.map((item) => (
        <ListItem key={item.to}>
          <NavListButton {...item} />
        </ListItem>
      ))}

      {user && selectedSchoolYear && (
        <ClassNavList
          schoolId={user.college_id}
          schoolYear={selectedSchoolYear}
        />
      )}

      {user && user.role_id >= 1 && (
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
