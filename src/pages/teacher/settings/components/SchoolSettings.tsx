import { Box, Button, Stack } from '@mui/joy'
import { useState } from 'react'
import ApiErrorAlert from '../../../../components/ApiErrorAlert'
import InputWithLabel from '../../../../components/ItemEditor/InputWithLabel'
import { service } from '../../../../services/service'
import { toastOnError } from '../../../../utils/toast'

const ModifyPassHourThreshold = ({
  hoursThreshold,
  onSuccess,
}: {
  hoursThreshold: number
  onSuccess: () => void
}) => {
  const [inputHours, setInputHours] = useState(hoursThreshold.toString())

  const handleSubmission = async () => {
    try {
      setSubmitting(true)
      await toastOnError(
        service.schoolAdmin.setPassHourThreshold(hoursThreshold)
      )
      onSuccess()
    } finally {
      setSubmitting(false)
    }
  }

  const [submitting, setSubmitting] = useState(false)

  return (
    <Stack spacing={3}>
      <InputWithLabel
        sx={{
          maxWidth: 0o500,
        }}
        label="通过学时阈值"
        helperText="所需通过学时。当学生的总学时超过该值时，该学生被记为通过。"
        type="number"
        value={inputHours}
        onChange={(e) => setInputHours(e.target.value)}
      />
      <Box>
        <Button
          variant="solid"
          onClick={handleSubmission}
          disabled={submitting}
        >
          保存
        </Button>
      </Box>
    </Stack>
  )
}

export default function SchoolSettings() {
  const { data, error, mutate } = service.teacher.usePassHourThreshold()
  return (
    <Stack spacing={2}>
      <ApiErrorAlert error={error} />

      {data && (
        <ModifyPassHourThreshold
          hoursThreshold={data.pass_hour}
          onSuccess={() => mutate()}
        />
      )}
    </Stack>
  )
}
