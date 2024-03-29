import { Switch } from '@mui/joy'
import { Teacher } from '../../../../../services/model'

export interface RowProps {
  teacher: Teacher
  onChange: (newValue: boolean) => void
  switchDisabled?: boolean
}

export default function AdminEditorRow({
  teacher,
  onChange,
  switchDisabled,
}: RowProps) {
  const checked = switchDisabled || teacher.role_id === 2
  return (
    <tr>
      <td scope="row">{teacher.name}</td>
      <td>{teacher.phone}</td>
      <td>
        <Switch
          checked={checked}
          size="sm"
          color={checked ? 'success' : 'neutral'}
          onChange={(e) => onChange(e.target.checked)}
          disabled={switchDisabled}
        />
      </td>
    </tr>
  )
}
