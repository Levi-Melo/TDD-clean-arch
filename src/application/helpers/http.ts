import { ServerError, UnauthorizedError } from '@/application/errors'
export type HttpResponse<T = any> = { statusCode: number, data: T }

export const badRequest = (error: Error): HttpResponse => {
  return {
    data: error,
    statusCode: 400
  }
}

export const unauthorized = (): HttpResponse<Error> => {
  return {
    data: new UnauthorizedError(),
    statusCode: 401
  }
}

export const serverError = (error: Error): HttpResponse<Error> => {
  return {
    data: new ServerError(error),
    statusCode: 500
  }
}

export const ok = <T = any> (data: T): HttpResponse<T> => {
  return {
    data,
    statusCode: 200
  }
}
