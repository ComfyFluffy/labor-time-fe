import { ListItemButton, ListItemContent, ListItemDecorator } from '@mui/joy'
import { ComponentType } from 'react'
import { Link, useMatch } from 'react-router-dom'

export interface NavListButtonProps {
  to: string
  title: string
  Icon: ComponentType
}

export default function NavListButton({ to, title, Icon }: NavListButtonProps) {
  const match = useMatch(to)
  return (
    <ListItemButton
      selected={!!match}
      variant={match ? 'soft' : undefined}
      component={Link}
      to={to}
    >
      <ListItemDecorator>
        <Icon />
      </ListItemDecorator>
      <ListItemContent>{title}</ListItemContent>
    </ListItemButton>
  )
}
