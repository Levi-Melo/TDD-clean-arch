import { HttpGetClient } from '@/infra/http'
import axios from 'axios'
export class AxiosHttpClient {
  async get <T = any>({ params, url }: HttpGetClient.Params): Promise<T> {
    return (await axios.get(url, { params })).data
  }
}
