export type HttpResponse = { statusCode: number, data: any }

export const badRequest = (error: Error): HttpResponse => {
  return {
    data: error,
    statusCode: 400
  }
}
