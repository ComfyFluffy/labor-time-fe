import { ComponentType, ComponentProps, lazy } from 'react'
import LoadingWrapper from '../components/LoadingWrapper'

// We use the same parameter types as React.lazy
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const makeLazy = <T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) => {
  const Lazy = lazy(factory)
  const WrappedLazy = (props: ComponentProps<T>) => (
    <LoadingWrapper>
      <Lazy {...props} />
    </LoadingWrapper>
  )
  return WrappedLazy
}
