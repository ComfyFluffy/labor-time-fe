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
            backgroundColor: 'rgba(0, 0, 0, 0)',
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
