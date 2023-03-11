import { Menu } from '@mui/icons-material'
import { Box, Button, IconButton, IconButtonProps, Stack } from '@mui/joy'
import { service } from '../../../services/service'
import SchoolYearSwitch from './SchoolYearSwitch'

interface NavBarProps {
  onMenuClick?: IconButtonProps['onClick']
  showMenuButton?: boolean
}

export default function AppBar({ onMenuClick, showMenuButton }: NavBarProps) {
  return (
    <Stack
      spacing={2}
      direction="row"
      alignItems="center"
      sx={(theme) => ({
        height: 0o100,
        px: 2,
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,

        backdropFilter: 'blur(8px) saturate(180%)',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        [theme.getColorSchemeSelector('dark')]: {
          backgroundColor: `rgba(${theme.vars.palette.neutral.darkChannel} / 0.8)`,
        },
        borderColor: theme.vars.palette.neutral.outlinedBorder,
        borderWidth: '0px 0px thin',
        borderStyle: 'solid',
      })}
    >
      {showMenuButton && (
        <IconButton variant="plain" onClick={onMenuClick} size="sm">
          <Menu />
        </IconButton>
      )}

      <SchoolYearSwitch />
      <Box sx={{ flexGrow: 1 }} />
      <Stack direction="row" alignItems="center" spacing={1}>
        <Button onClick={() => service.logout()} variant="soft" color="neutral">
          登出
        </Button>
      </Stack>
    </Stack>
  )
}
