import { ArrowDropDown } from '@mui/icons-material'
import { Box, BoxProps, Button, ButtonProps, Menu, MenuItem } from '@mui/joy'
import { useState } from 'react'

export type MenuButtonProps<T> = {
  selectedItem: T | null
  items: T[]
  onChange: (item: T) => void
  display: (item: T) => string
  itemId: (item: T) => string | number
  size?: ButtonProps['size']
} & Omit<BoxProps, 'display' | 'id' | 'onChange'>

export default function MenuButton<T>({
  selectedItem,
  items,
  onChange,
  display,
  itemId,
  size,
  ...rest
}: MenuButtonProps<T>) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  return (
    <Box {...rest}>
      <Button
        endDecorator={<ArrowDropDown />}
        variant="soft"
        onClick={(event) => {
          setAnchorEl(event.currentTarget)
        }}
        size={size}
        sx={{ width: 1 }}
      >
        {selectedItem && display(selectedItem)}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => {
          setAnchorEl(null)
        }}
      >
        {items.map((item) => {
          const k = itemId(item)
          const selected = !!(selectedItem && itemId(selectedItem) === k)
          return (
            <MenuItem
              key={k}
              selected={selected}
              variant={selected ? 'soft' : undefined}
              onClick={() => {
                onChange(item)
                setAnchorEl(null)
              }}
            >
              {display(item)}
            </MenuItem>
          )
        })}
      </Menu>
    </Box>
  )
}
