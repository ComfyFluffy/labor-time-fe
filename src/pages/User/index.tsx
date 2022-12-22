import {
  Button,
  Container,
  Divider,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
  Typography,
} from '@mui/joy'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import { Editor } from './Editor'
import { Category, Item } from '../../model'
import PublishIcon from '@mui/icons-material/Publish'
import { useEffect, useMemo, useState } from 'react'
import produce from 'immer'
import { usePreferences } from '../../store'
import shallow from 'zustand/shallow'
import { StudentInfo } from '../../components/StudentInfo'

let itemLocalId = 0

export type NewItem = Pick<Item, 'description' | 'picture_urls'> & {
  duration_hour: number
  local_id: number
  category_id: number
}
export type CategoryWithNewItem = Omit<Category, 'items'> & {
  items: (NewItem | Item)[]
}
type UpdateItem = Pick<
  Item,
  'id' | 'description' | 'duration_hour' | 'picture_urls'
>

const data: Category[] = [
  {
    id: 1,
    name: '一级课堂',
    editable: true,
    explanation: {
      title: '志愿服务类学时认定说明',
      text: '参加学院组织的勤工助学岗位、学生助理岗位并积极完成工作者，按每学期可申报 5 个学时（需勤工岗位部门认定）；在校期间参与志愿服务，志愿服务时长 2 小时计劳动实践 1 学时（志愿服务工作，按所在服务单位开具的加盖部门公章证明为参考，由院团委核定为准，10 学时封顶）。',
    },
    max_total_hour: 30,
    items: [
      {
        id: 123,
        description: '优秀寝室',
        duration_hour: 6,
        state: 'approved',
        picture_urls: ['/1.jpg', '/2.jpg'],
      },
      {
        id: 1234,
        description: '优秀寝室',
        duration_hour: 6,
        state: 'rejected',
        rejected_reason: '证据无效',
        picture_urls: ['/3.jpg', '/4.jpg'],
      },
      {
        id: 12345,
        description: '优秀寝室',
        duration_hour: 6,
        state: 'pending',
        picture_urls: ['/5.jpg', '/6.jpg'],
      },
      {
        id: 123245,
        description: '优秀寝室',
        duration_hour: 6,
        picture_urls: ['/7.jpg'],
      } as any,
    ],
  },
  {
    id: 2,
    name: '二三级课堂',
    max_total_hour: 20,
    editable: true,
    items: [
      {
        id: 234,
        description: 'whatever',
        duration_hour: 6,
        state: 'rejected',
        picture_urls: [
          'https://picsum.photos/400/300',
          'https://picsum.photos/400/300',
        ],
      },
    ],
  },
  {
    id: 3,
    name: '志愿服务类',
    explanation: {
      title: '志愿服务类学时认定说明',
      text: '参加学院组织的勤工助学岗位、学生助理岗位并积极完成工作者，按每学期可申报 5 个学时（需勤工岗位部门认定）；在校期间参与志愿服务，志愿服务时长 2 小时计劳动实践 1 学时（志愿服务工作，按所在服务单位开具的加盖部门公章证明为参考，由院团委核定为准，10 学时封顶）。',
    },
    editable: true,
    items: [
      {
        id: 3,
        description: '志愿服务类',
        duration_hour: 6,
        picture_urls: [
          'https://picsum.photos/400/300',
          'https://picsum.photos/400/300',
        ],
        state: 'pending',
      },
    ],
  },
  {
    id: 5,
    name: '社会实践类',
    editable: true,
    items: [
      {
        id: 45,
        state: 'pending',
        description: '社会实践类',
        duration_hour: 6,
        picture_urls: [
          'https://picsum.photos/400/300',
          'https://picsum.photos/400/300',
        ],
      },
    ],
  },
]

const ConfirmPersonalInfo = () => {
  const { confirmPersonalInfo, personalInfoConfirmed } = usePreferences(
    (state) => ({
      confirmPersonalInfo: state.confirmPersonalInfo,
      personalInfoConfirmed: state.personalInfoConfirmed,
    }),
    shallow
  )

  return (
    <Modal open={!personalInfoConfirmed}>
      <ModalDialog>
        <Stack spacing={2}>
          <Stack spacing={1}>
            <Typography level="h4">个人信息</Typography>
            <Typography>请确认你的个人信息，如有错误请联系辅导员</Typography>
          </Stack>

          <StudentInfo student={null} />

          <Button variant="solid" onClick={() => confirmPersonalInfo()}>
            确认
          </Button>
        </Stack>
      </ModalDialog>
    </Modal>
  )
}

export const User = () => {
  const [categories, setCategories] = useState(data)

  const [currentItemIndex, setCurrentItemIndex] = useState(0)

  const [itemsActions, setItemsActions] = useState<{
    added: Map<number, NewItem> // local id -> item
    updated: Map<number, UpdateItem> // item id -> item
    removedIds: Set<number>
  }>(() => ({
    added: new Map(),
    updated: new Map(),
    removedIds: new Set(),
  }))

  const localCategories: CategoryWithNewItem[] = useMemo(
    () =>
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

  const currentCategory = localCategories[currentItemIndex]

  useEffect(() => {
    console.log(itemsActions)
  }, [itemsActions])

  return (
    <Container
      maxWidth="md"
      sx={{
        py: 2,
      }}
    >
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
                  duration_hour: '' as any,
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
            categories.length
          }`}</Typography>

          {currentItemIndex + 1 !== categories.length ? (
            <Button
              endDecorator={<KeyboardArrowRight />}
              onClick={() => {
                setCurrentItemIndex((index) => index + 1)
              }}
            >
              下一页
            </Button>
          ) : (
            <Button endDecorator={<PublishIcon />} color="success">
              提交
            </Button>
          )}
        </Stack>
      </Stack>
    </Container>
  )
}
