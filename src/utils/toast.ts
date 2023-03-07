import { toast } from 'react-toastify'
import { messageFromErr } from './error'

export const toastProcess = <T>(
  promise: Promise<T> | (() => Promise<T>),
  text = '提交'
) => {
  return toast.promise(promise, {
    pending: '正在' + text + '…',
    success: text + '成功',
    error: {
      render: ({ data }) => {
        return text + '失败：' + messageFromErr(data)
      },
    },
  })
}

export const toastOnError = async <T>(
  promise: Promise<T> | (() => Promise<T>),
  text = '提交'
) => {
  try {
    if (typeof promise === 'function') {
      return await promise()
    }
    return await promise
  } catch (e) {
    toast.error(text + '失败：' + messageFromErr(e))
    throw e
  }
}
