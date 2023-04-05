import { UnauthorizedError } from '@/application/errors'
export type HttpResponse = { statusCode: number, data: any }

export const badRequest = (error: Error): HttpResponse => {
  return {
    data: error,
    statusCode: 400
  }
}

export const unauthorized = (): HttpResponse => {
  return {
    data: new UnauthorizedError(),
    statusCode: 401
  }
}
