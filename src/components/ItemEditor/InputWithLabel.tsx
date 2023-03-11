import {
  FormControl,
  FormHelperText,
  FormLabel,
  formLabelClasses,
  Input,
  inputClasses,
  styled,
} from '@mui/joy'

const StyledInput = styled(Input)(({ theme, color }) => ({
  [`& .${inputClasses.disabled}`]: {
    color: theme.vars.palette[color || 'info']?.outlinedColor,
  },

  [`& .${formLabelClasses.root}`]: {
    color: theme.vars.palette.text.secondary,
  },
}))

export default function InputWithLabel({
  label,
  helperText,
  ...props
}: {
  label: string
  helperText?: string
} & React.ComponentProps<typeof StyledInput>) {
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <StyledInput {...props} />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}
