import { ComponentType, ComponentProps, lazy } from 'react'
import LoadingWrapper from '../components/LoadingWrapper'

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
