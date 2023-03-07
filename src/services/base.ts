import { AxiosError, AxiosInstance } from 'axios'
import useSWR from 'swr'

export type ApiError = AxiosError<{
  code: number
  message: string
}>

export class BaseService {
  protected axios: AxiosInstance

  constructor(axios: AxiosInstance) {
    this.axios = axios
  }

  protected useGet = <T>(
    url: string,
    query?: Record<string, string | number | undefined>
  ) => {
    const filteredQuery =
      query &&
      (Object.fromEntries(
        Object.entries(query)
          .filter(([, value]) => value !== undefined)
          .map(([key, value]) => [key, String(value)])
      ) as Record<string, string>)

    return useSWR<T, ApiError>(
      url +
        (filteredQuery ? `?${String(new URLSearchParams(filteredQuery))}` : ''),
      async (url) => {
        const { data } = await this.axios.get<T>(url)
        return data
      }
    )
  }
}
