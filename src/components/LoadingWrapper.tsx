import { CircularProgress } from '@mui/joy'
import { Suspense } from 'react'

export interface LoadingWrapperProps {
  children: React.ReactNode
}

export default function LoadingWrapper({ children }: LoadingWrapperProps) {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80vh',
          }}
        >
          <CircularProgress />
        </div>
      }
    >
      {children}
    </Suspense>
  )
}
