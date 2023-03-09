import { Groups, KeyboardArrowRight } from '@mui/icons-material'
import {
  List,
  ListItem,
  ListItemButton,
  listItemButtonClasses,
  ListItemContent,
  ListItemDecorator,
} from '@mui/joy'
import { Collapse } from '@mui/material'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export interface LinkItem {
  name: string
  to: string
}
export interface CollapseListProps<T> {
  items: T[]
  title: string
  emptyText: string
  itemSelected: (item: T) => boolean
}
export default function CollapseList<T extends LinkItem>({
  items,
  title,
  emptyText,
  itemSelected,
}: CollapseListProps<T>) {
  const [open, setOpen] = useState(false)

  return (
    <ListItem
      nested
      sx={{
        my: '6px',
      }}
    >
      <ListItemButton onClick={() => setOpen(!open)}>
        <ListItemDecorator>
          <Groups />
        </ListItemDecorator>
        <ListItemContent>{title}</ListItemContent>
        <KeyboardArrowRight
          sx={{
            transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s',
          }}
        />
      </ListItemButton>

      <Collapse in={open} unmountOnExit timeout="auto">
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
          {items.map((item) => {
            const selected = itemSelected(item)
            return (
              <ListItem key={item.to}>
                <ListItemButton
                  selected={selected}
                  variant={selected ? 'soft' : undefined}
                  component={Link}
                  to={item.to}
                >
                  {item.name}
                </ListItemButton>
              </ListItem>
            )
          })}
          {!items.length && (
            <ListItem>
              <ListItemButton disabled>{emptyText}</ListItemButton>
            </ListItem>
          )}
        </List>
      </Collapse>
    </ListItem>
  )
}
