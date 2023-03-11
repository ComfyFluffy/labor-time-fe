import { KeyboardArrowRight } from '@mui/icons-material'
import { Box, Chip, IconButton } from '@mui/joy'
import { Collapse } from '@mui/material'
import { useState } from 'react'
import { TeacherWithClasses } from '../../../../../services/admin'
import TeacherEditor from './TeacherEditor'

export interface TeacherTableEditorRowProps {
  teacher: TeacherWithClasses
  isNew?: boolean
  onMutated: (teacher?: TeacherWithClasses) => void
}

export default function TeacherTableEditorRow({
  teacher,
  isNew,
  onMutated,
}: TeacherTableEditorRowProps) {
  const [open, setOpen] = useState(isNew) // open editor by default for new teacher

  return (
    <>
      <Box
        component="tr"
        sx={(theme) => ({
          background: isNew
            ? `rgba(${theme.vars.palette.success.lightChannel} / 0.1)`
            : undefined,
        })}
      >
        <td>
          <IconButton
            aria-label="expand row"
            size="sm"
            variant={open ? 'soft' : 'plain'}
            onClick={() => setOpen(!open)}
          >
            <KeyboardArrowRight
              sx={{
                transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s',
              }}
            />
          </IconButton>
        </td>
        <td scope="row">{teacher.name}</td>
        <td>{teacher.phone}</td>
        <td>
          <Chip size="sm" color={teacher.role_id === 2 ? 'primary' : 'neutral'}>
            {teacher.role_id === 2 ? '是' : '否'}
          </Chip>
        </td>
      </Box>

      <tr>
        <Box
          component="td"
          sx={{
            pb: 0,
            pt: 0,
            border: open ? undefined : 'unset',
          }}
          colSpan={5}
        >
          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit
            appear
            sx={{
              p: 1,
              maxWidth: 0o700,
            }}
          >
            <TeacherEditor
              teacher={teacher}
              onMutated={onMutated}
              isNew={isNew}
            />
          </Collapse>
        </Box>
      </tr>
    </>
  )
}
