import { Category, LaborItem, Student } from './model'
import { BaseService } from './base'
import imageCompression from 'browser-image-compression'
import axios from 'axios'

export interface SignOssRequest {
  filename: string
}
export interface SignOssResponse {
  upload_url: string
  download_url: string
  expire_seconds: number
}

export type AddLaborItemsRequest = (Pick<Category, 'id'> & {
  items: Pick<LaborItem, 'description' | 'duration_hour' | 'evidence_urls'>[]
})[]

export type ModifyLaborItemsRequest = Pick<
  LaborItem,
  'id' | 'description' | 'duration_hour' | 'evidence_urls'
>[]

export class StudentService extends BaseService {
  useSelfInfo = () => {
    return {
      data: {
        name: '张三',
        id: 1,
        uid: '2018000000',
      },
    }
    return this.useGet<Student>('/v2/student/info')
  }

  useCategories = () => {
    const mock: Category[] = [
      {
        id: 1,
        name: '学术科技类',
        explanation: {
          title: '学术科技类',
          text: '123',
        },
        items: [
          {
            id: 1,
            approved_hour: 3,
            description: '1233',
            duration_hour: 3,
            evidence_urls: [
              // test images
              'https://picsum.photos/200/300',
              'https://picsum.photos/200/300',
            ],
            state: 'approved',
          },
        ],
        max_hour: 10,
        min_hour: 1,
      },
    ]
    return {
      data: mock,
    }
    return this.useGet<Category[]>('/v2/student/labor')
  }

  private signFileUploadUrl = async (
    filename: string
  ): Promise<SignOssResponse> => {
    const { data } = await this.axios.post<SignOssResponse>(
      '/v2/student/labor/evidence',
      {
        filename,
      }
    )
    return data
  }

  uploadImage = async (file: File): Promise<string> => {
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    })
    const { upload_url, download_url } = await this.signFileUploadUrl(file.name)
    // Global axios instance is used here.
    await axios.put(upload_url, compressedFile, {
      headers: {
        'Content-Type': '', // Empty string to remove default header to satisfy OSS
      },
    })
    return download_url
  }

  private addLaborItems = async (request: AddLaborItemsRequest) => {
    await this.axios.post('/v2/student/labor', request)
  }

  private modifyLaborItems = async (request: ModifyLaborItemsRequest) => {
    await this.axios.put('/v2/student/labor', request)
  }

  private deleteLaborItems = async (ids: number[]) => {
    await this.axios.post('/v2/student/labor/delete', ids)
  }

  updateLaborItems = async (
    addRequest: AddLaborItemsRequest,
    modifyRequest: ModifyLaborItemsRequest,
    deleteIds: number[]
  ) => {
    await Promise.all([
      addRequest.length && this.addLaborItems(addRequest),
      modifyRequest.length && this.modifyLaborItems(modifyRequest),
      deleteIds.length && this.deleteLaborItems(deleteIds),
    ])
  }
}
