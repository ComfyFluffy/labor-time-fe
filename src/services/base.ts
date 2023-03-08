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

  private fetcher = async <T>(url: string) => {
    const { data } = await this.axios.get<T>(url)
    return data
  }

  protected useGet = <T>(
    url: string | null,
    query?: Record<string, string | number | undefined>
  ) => {
    if (url === null) {
      return useSWR<T, ApiError>(null, this.fetcher)
    }
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
      this.fetcher
    )
  }
}
