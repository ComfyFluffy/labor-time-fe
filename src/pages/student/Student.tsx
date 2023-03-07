import {
  Alert,
  Button,
  Container,
  Modal,
  ModalDialog,
  Stack,
  Typography,
} from '@mui/joy'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import { Editor } from './Editor'
import { Category, LaborItem } from '../../services/model'
import PublishIcon from '@mui/icons-material/Publish'
import { useMemo, useState } from 'react'
import produce from 'immer'
import { usePreferences } from '../../store'
import { shallow } from 'zustand/shallow'
import {
  AddItemRequest,
  service,
  UpdateItemRequest,
} from '../../services/service'
import { Me } from './Me'
import StudentInfo from '../../components/StudentInfo'

let itemLocalId = 0

export type NewItem = Pick<
  LaborItem,
  'description' | 'picture_urls' | 'duration_hour'
> & {
  local_id: number
  category_id: number
}
export type CategoryWithNewItem = Omit<Category, 'items'> & {
  items: (NewItem | LaborItem)[]
}
type UpdateItem = Pick<
  LaborItem,
  'id' | 'description' | 'duration_hour' | 'picture_urls'
>

const ConfirmPersonalInfo = () => {
  const { confirmPersonalInfo, personalInfoConfirmed } = usePreferences(
    (state) => ({
      confirmPersonalInfo: state.confirmPersonalInfo,
      personalInfoConfirmed: state.personalInfoConfirmed,
    }),
    shallow
  )

  const { data, error } = service.useStudentSelf()

  return (
    <Modal open={!personalInfoConfirmed}>
      <ModalDialog>
        <Stack spacing={2}>
          <Stack spacing={1}>
            <Typography level="h4">个人信息</Typography>
            <Typography>请确认你的个人信息，如有错误请联系辅导员</Typography>
          </Stack>

          {error && <Alert color="danger">获取个人信息失败</Alert>}
          {data && <StudentInfo student={data} />}

          <Button variant="solid" onClick={() => confirmPersonalInfo()}>
            确认
          </Button>
        </Stack>
      </ModalDialog>
    </Modal>
  )
}

export default function Student() {
  const [currentItemIndex, setCurrentItemIndex] = useState(0)

  const emptyItemsActions = () =>
    ({
      added: new Map(),
      updated: new Map(),
      removedIds: new Set(),
    } as {
      added: Map<number, NewItem> // local id -> item
      updated: Map<number, UpdateItem> // item id -> item
      removedIds: Set<number>
    })
  const [itemsActions, setItemsActions] = useState(emptyItemsActions)

  const { data: categories, error, mutate } = service.useCategories()

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
    service.toast(async () => {
      const addedItems: AddItemRequest = Array.from(
        itemsActions.added.values()
      ).map((item) => ({
        id: item.category_id,
        items: [
          {
            description: item.description,
            duration_hour: +item.duration_hour,
            picture_urls: item.picture_urls,
          },
        ],
      }))
      const updatedItems: UpdateItemRequest = Array.from(
        itemsActions.updated.values()
      ).map((item) => ({
        id: item.id,
        description: item.description,
        duration_hour: +item.duration_hour,
        picture_urls: item.picture_urls,
      }))
      const removedIds = Array.from(itemsActions.removedIds.values())

      await service.updateItems(addedItems, updatedItems, removedIds)
      setItemsActions(emptyItemsActions())
      mutate()
    })
  }

  let content = null

  if (localCategories) {
    const currentCategory = localCategories[currentItemIndex]
    content = (
      <>
        <ConfirmPersonalInfo />
        <Stack spacing={2}>
          <Typography level="h4">学生劳动实践学时认定</Typography>

          <Editor
            category={currentCategory}
            onRemoveItem={(item) => {
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
            }}
            onAddItem={() => {
              setItemsActions((actions) =>
                produce(actions, (draft) => {
                  const newItem: NewItem = {
                    category_id: currentCategory.id,
                    description: '',
                    duration_hour: '',
                    picture_urls: [],
                    local_id: itemLocalId++,
                  }
                  draft.added.set(newItem.local_id, newItem)
                })
              )
            }}
            onUpdateItem={(item) => {
              setItemsActions((actions) =>
                produce(actions, (draft) => {
                  if ('id' in item) {
                    draft.updated.set(item.id, item)
                  } else if ('local_id' in item) {
                    draft.added.set(item.local_id, item)
                  }
                })
              )
            }}
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

            {currentItemIndex + 1 !== localCategories.length ? (
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
      <Me />
      {error && (
        <Alert color="danger" sx={{ my: 2 }}>
          获取数据失败：{String(error)}
        </Alert>
      )}
      {content}
    </Container>
  )
}
