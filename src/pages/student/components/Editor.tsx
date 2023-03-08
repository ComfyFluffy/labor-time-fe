import { Alert, Button, Stack, Typography } from '@mui/joy'
import ErrorIcon from '@mui/icons-material/Error'
import AddIcon from '@mui/icons-material/Add'
import { LaborItem } from '../../../services/model'
import { useMemo } from 'react'
import Explanation from './Explanation'
import { CategoryWithNewItem, NewLaborItem } from '../Student'
import ItemEditor from '../../../components/ItemEditor'

export interface EditorProps {
  category: CategoryWithNewItem
  onAddItem: () => void
  onRemoveItem: (item: LaborItem | NewLaborItem) => void
  onUpdateItem: (item: LaborItem | NewLaborItem) => void
}

export default function Editor({
  category,
  onUpdateItem,
  onRemoveItem,
  onAddItem,
}: EditorProps) {
  const { name, explanation, items } = category

  const overMaxHours = useMemo(
    () =>
      category.max_hour &&
      items.reduce((acc, item) => acc + (item.duration_hour || 0), 0) >
        category.max_hour,
    [items]
  )

  return (
    <>
      <Typography level="h5">{name}</Typography>

      {explanation && <Explanation explanation={explanation} />}

      <Stack spacing={1}>
        <Stack spacing={1}>
          {items.map((item) => (
            <ItemEditor
              key={'id' in item ? item.id : item.local_id}
              item={item}
              onRemove={onRemoveItem}
              onChange={onUpdateItem}
            />
          ))}
        </Stack>

        <Button variant="soft" startDecorator={<AddIcon />} onClick={onAddItem}>
          添加项目
        </Button>
      </Stack>
      {overMaxHours && (
        <Alert startDecorator={<ErrorIcon />} color="danger">
          总学时不得超过 {category.max_hour} 小时
        </Alert>
      )}
    </>
  )
}
