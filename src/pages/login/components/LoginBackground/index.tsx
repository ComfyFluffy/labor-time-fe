import { Box, useColorScheme } from '@mui/joy'
import { cyan, pink, purple } from '@mui/material/colors'
import { alpha } from '@mui/material'
import noise from './noise.svg'

export default function LoginBackground() {
  const fixed = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }
  const { colorScheme } = useColorScheme()
  return (
    <>
      <Box
        sx={(theme) => ({
          ...fixed,
          zIndex: -5,

          backgroundImage: `
            linear-gradient(
              180deg,
              rgba(${theme.vars.palette.neutral.mainChannel} / 0.01),
              rgba(${theme.vars.palette.primary.mainChannel} / 0.15) 100%
            ),
            radial-gradient(
              ellipse at top left,
              rgba(${theme.vars.palette.primary.mainChannel} / 0.3),
              transparent 50%
            ),
            radial-gradient(
              ellipse at top right,
              ${alpha(cyan[300], 0.3)},
              transparent 50%
            ),
            radial-gradient(
              ellipse at center right,
              ${alpha(purple[300], 0.3)},
              transparent 55%
            ),
            radial-gradient(
              ellipse at center left,
              ${alpha(pink[300], 0.2)},
              transparent 50%
            )`,
        })}
      />
      <Box
        sx={{
          ...fixed,
          zIndex: -4,
          backdropFilter: 'blur(48px)',
        }}
      />
      {colorScheme === 'dark' && (
        // Noise layer to reduce banding
        // In the dark mode, the banding is more obvious
        <Box
          sx={{
            ...fixed,
            zIndex: -3,
            background: `
              url(${noise})
            `,
            mixBlendMode: 'multiply',
          }}
        />
      )}
    </>
  )
}
