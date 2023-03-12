import { Autocomplete, Button, Stack, Typography } from '@mui/joy'
import { useState } from 'react'
import InputWithLabel from '../../../../components/ItemEditor/InputWithLabel'
import { service } from '../../../../services/service'
import { toastOnError } from '../../../../utils/toast'

type AskProps = {
  onSuccess: () => void
  itemId: number
}

export const AskReject = ({ onSuccess, itemId }: AskProps) => {
  const [reason, setReason] = useState<string | null>(null)
  const [reasonInput, setReasonInput] = useState('')

  const [submitting, setSubmitting] = useState(false)

  const autocompleteReasons = ['证据无效', '证据不符合要求', '证据不完整']

  return (
    <Stack
      spacing={2}
      component="form"
      onSubmit={async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
          await toastOnError(
            service.teacher.rejectLaborItem({
              id: itemId,
              reason: reasonInput || '',
            })
          )
          onSuccess()
        } finally {
          setSubmitting(false)
        }
      }}
    >
      <Typography level="h5">打回项目</Typography>
      <Autocomplete
        placeholder="请选择或输入打回原因（可选）"
        options={autocompleteReasons}
        value={reason}
        onChange={(e, value) => setReason(value)}
        inputValue={reasonInput}
        onInputChange={(e, value) => setReasonInput(value)}
        autoFocus
        slotProps={{
          listbox: {
            disablePortal: true, // disable portal to fix the bug that the listbox is not visible
          },
        }}
        freeSolo
      />
      <Stack direction="row" spacing={1} justifyContent="end">
        <Button
          color="danger"
          variant="soft"
          type="submit"
          loading={submitting}
        >
          打回
        </Button>
      </Stack>
    </Stack>
  )
}

export const AskPass = ({
  onSuccess,
  itemId,
  hours,
  description,
}: AskProps & {
  hours: number
  description: string
}) => {
  const [reason, setReason] = useState('')
  const [inputHours, setInputHours] = useState(String(hours))
  const [submitting, setSubmitting] = useState(false)
  const [inputDescription, setInputDescription] = useState(description)

  return (
    <Stack
      spacing={2}
      component="form"
      onSubmit={async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
          await toastOnError(
            service.teacher.passLaborItem({
              id: itemId,
              reason,
              approved_hour: Number(inputHours),
              description: inputDescription,
            })
          )
          onSuccess()
        } finally {
          setSubmitting(false)
        }
      }}
    >
      <Typography level="h5">通过项目</Typography>

      <InputWithLabel
        label="评论"
        placeholder="请输入评论（可选）"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
      <InputWithLabel
        label="审核时长"
        value={inputHours}
        onChange={(e) => setInputHours(e.target.value)}
        type="number"
        helperText="审核时长决定最终的计算时长。"
      />
      <InputWithLabel
        label="项目描述"
        value={inputDescription}
        onChange={(e) => setInputDescription(e.target.value)}
        helperText="可对学生提交的项目描述进行修改。"
      />

      <Stack direction="row" spacing={1} justifyContent="end">
        <Button
          color="danger"
          variant="soft"
          type="submit"
          loading={submitting}
        >
          通过
        </Button>
      </Stack>
    </Stack>
  )
}
