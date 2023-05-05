import { Button, Container, Stack, Typography } from '@mui/joy'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import PublishIcon from '@mui/icons-material/Publish'
import { useMemo, useState } from 'react'
import produce from 'immer'
import { service } from '../../services/service'
import { toastProcess } from '../../utils/toast'
import {
  AddLaborItemsRequest,
  ModifyLaborItemsRequest,
} from '../../services/student'
import Header from './components/Header'
import ConfirmInfo from './components/ConfirmInfo'
import Editor from './components/Editor'
import {
  CategoryWithNewItem,
  NewLaborItem,
  UpdateLaborItem,
} from '../../utils/types'
import { LaborItem } from '../../services/model'
import MenuButton from '../../components/MenuButton'
import ApiErrorAlert from '../../components/ApiErrorAlert'

type LocalId = number
let itemLocalId: LocalId = 0

export default function Student() {
  const [currentItemIndex, setCurrentItemIndex] = useState(0)

  const emptyItemsActions = () => ({
    added: new Map<LocalId, NewLaborItem>(),
    updated: new Map<UpdateLaborItem['id'], UpdateLaborItem>(),
    removedIds: new Set<number>(),
  })
  const [itemsActions, setItemsActions] = useState({
    added: new Map<LocalId, NewLaborItem>(),
    updated: new Map<UpdateLaborItem['id'], UpdateLaborItem>(),
    removedIds: new Set<number>(),
  })

  const { data: categories, error, mutate } = service.student.useCategories()

  const localCategories: CategoryWithNewItem[] | undefined = useMemo(
    () =>
      categories &&
      produce(categories, (draft) => {
        for (const category of draft) {
          category.items = category.items
            .filter((item) => !itemsActions.removedIds.has(item.id))
            .map((item) => {
              const updatedItem = itemsActions.updated.get(item.id)
              return {
                ...item,
                ...updatedItem,
              }
            })

          for (const item of itemsActions.added.values()) {
            if (item.category_id === category.id) {
              ;(category as CategoryWithNewItem).items.push(item)
            }
          }
        }
      }),
    [categories, itemsActions]
  )

  const onSubmit = () => {
    toastProcess(async () => {
      const addRequest: AddLaborItemsRequest = Array.from(
        itemsActions.added.values()
      ).map(({ category_id, description, duration_hour, evidence_urls }) => ({
        id: category_id,
        items: [
          {
            description,
            duration_hour: duration_hour || 0,
            evidence_urls,
          },
        ],
      }))
      const modifyRequest: ModifyLaborItemsRequest = Array.from(
        itemsActions.updated.values()
      ).map(({ id, description, duration_hour, evidence_urls }) => ({
        id,
        description,
        duration_hour,
        evidence_urls,
      }))
      const deleteIds = Array.from(itemsActions.removedIds.values())

      await service.student.updateLaborItems(
        addRequest,
        modifyRequest,
        deleteIds
      )
      setItemsActions(emptyItemsActions())
      mutate()
    })
  }

  let content = null

  if (localCategories) {
    const currentCategory = localCategories[currentItemIndex]

    const handleRemoveItem = (item: LaborItem | NewLaborItem): void => {
      if ('id' in item) {
        setItemsActions((actions) =>
          produce(actions, (draft) => {
            draft.removedIds.add(item.id)
          })
        )
      } else if ('local_id' in item) {
        setItemsActions((actions) =>
          produce(actions, (draft) => {
            draft.added.delete(item.local_id)
          })
        )
      }
    }
    const handleAddItem = () => {
      setItemsActions((actions) =>
        produce(actions, (draft) => {
          const newItem: NewLaborItem = {
            category_id: currentCategory.id,
            description: '',
            evidence_urls: [],
            local_id: itemLocalId++,
          }
          draft.added.set(newItem.local_id, newItem)
        })
      )
    }
    const handleUpdateItem = (item: LaborItem | NewLaborItem): void => {
      setItemsActions((actions) =>
        produce(actions, (draft) => {
          if ('id' in item) {
            draft.updated.set(item.id, item)
          } else if ('local_id' in item) {
            draft.added.set(item.local_id, item)
          }
        })
      )
    }

    content = (
      <>
        <ConfirmInfo />
        <Stack spacing={2}>
          <Typography level="h4">学生劳动实践学时认定</Typography>

          <MenuButton
            size="lg"
            items={localCategories}
            display={(item) => item.name}
            itemId={(item) => item.id}
            selectedItem={currentCategory}
            onChange={(selectedItem) =>
              setCurrentItemIndex(
                localCategories.findIndex((item) => item.id === selectedItem.id)
              )
            }
            sx={{ width: 1, display: 'flex' }}
          />

          <Editor
            category={currentCategory}
            onRemoveItem={handleRemoveItem}
            onAddItem={handleAddItem}
            onUpdateItem={handleUpdateItem}
          />

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button
              startDecorator={<KeyboardArrowLeft />}
              variant="soft"
              onClick={() => {
                setCurrentItemIndex((index) => index - 1)
              }}
              disabled={currentItemIndex === 0}
            >
              上一页
            </Button>

            <Typography color="neutral">{`${currentItemIndex + 1} / ${
              localCategories.length
            }`}</Typography>

            {currentItemIndex < localCategories.length - 1 ? (
              <Button
                endDecorator={<KeyboardArrowRight />}
                onClick={() => {
                  setCurrentItemIndex((index) => index + 1)
                }}
              >
                下一页
              </Button>
            ) : (
              <Button
                endDecorator={<PublishIcon />}
                color="success"
                onClick={onSubmit}
              >
                提交
              </Button>
            )}
          </Stack>
        </Stack>
      </>
    )
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        py: 2,
      }}
    >
      <Header />
      <ApiErrorAlert
        error={error}
        sx={{
          mt: 2,
          mb: 1,
        }}
      />
      {content}
    </Container>
  )
}
