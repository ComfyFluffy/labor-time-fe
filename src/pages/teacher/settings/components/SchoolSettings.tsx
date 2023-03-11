import { Box, Button, Stack } from '@mui/joy'
import { useState } from 'react'
import InputWithLabel from '../../../../components/ItemEditor/InputWithLabel'

export default function SchoolSettings() {
  const [hoursThreshold, setHoursThreshold] = useState()

  const handleSubmission = () => {
    console.log(hoursThreshold)
  }

  return (
    <Stack spacing={3}>
      <InputWithLabel
        sx={{
          maxWidth: 0o500,
        }}
        label="通过学时阈值"
        helperText="所需通过学时。当学生的总学时超过该值时，该学生被记为通过。"
      />
      <Box>
        <Button variant="solid" onClick={handleSubmission}>
          保存
        </Button>
      </Box>
    </Stack>
  )
}
