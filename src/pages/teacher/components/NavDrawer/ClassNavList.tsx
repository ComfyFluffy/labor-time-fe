import { useMatch } from 'react-router-dom'
import { service } from '../../../../services/service'
import CollapseList from './CollapseList'

export interface ClassNavListProps {
  schoolYear: string
  schoolId: number
}

export default function ClassNavList({
  schoolYear,
  schoolId,
}: ClassNavListProps) {
  const { data } = service.teacher.useManagedClasses(schoolYear, schoolId)

  const classRouteMatch = useMatch('/teacher/class/:classId')

  return (
    <CollapseList
      emptyText="暂无班级"
      title="班级列表"
      items={
        data?.map((item) => ({
          name: item.name,
          to: `/teacher/class/${item.id}`,
          id: item.id,
        })) || []
      }
      itemSelected={(item) =>
        classRouteMatch?.params.classId === item.id.toString()
      }
    />
  )
}
