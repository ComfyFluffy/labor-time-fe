import { Alert, Button, Stack, Typography } from '@mui/joy'
import ErrorIcon from '@mui/icons-material/Error'
import AddIcon from '@mui/icons-material/Add'
import { LaborItem } from '../../../services/model'
import { useMemo } from 'react'
import ItemEditor from '../../../components/ItemEditor'
import Explanation from './Explanation'
import { CategoryWithNewItem, NewLaborItem } from '../../../utils/types'
import { Info } from '@mui/icons-material'

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
  const { explanation, items } = category

  const overMaxHours = useMemo(
    () =>
      category.max_hour &&
      items.reduce((acc, item) => acc + (item.duration_hour || 0), 0) >
        category.max_hour,
    [items]
  )

  return (
    <>
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
          {!items.length && (
            <Alert startDecorator={<Info />} color="neutral">
              <Typography>当前类别没有项目。</Typography>
              <Typography>你可以点击下方按钮添加项目。</Typography>
            </Alert>
          )}
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
