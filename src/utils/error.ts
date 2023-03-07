import { AxiosError } from 'axios'

export const messageFromErr = (err: unknown) => {
  if (err instanceof AxiosError && err.response) {
    return err.response.data.type || err.message
  }
  if (err instanceof Error) {
    return err.message
  }
  return String(err)
}
