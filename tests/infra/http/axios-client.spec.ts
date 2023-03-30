import { HttpGetClient } from '@/infra/http'
import axios from 'axios'

jest.mock('axios')

class AxiosHttpClient {
  async get ({ params, url }: HttpGetClient.Params): Promise<void> {
    await axios.get(url, { params })
  }
}
describe('AxiosHttpClient', () => {
  describe('AxiosHttpClient', () => {
    it('should call get with correct params', async () => {
      const sut = new AxiosHttpClient()
      const fakeAxios = axios as jest.Mocked<typeof axios>
      await sut.get({
        url: 'any_url',
        params: {
          any: 'any'
        }
      })

      expect(fakeAxios.get).toHaveBeenCalledWith('any_url', {
        params: {
          any: 'any'
        }
      })

      expect(fakeAxios.get).toHaveBeenCalledTimes(1)
    })
  })
})
