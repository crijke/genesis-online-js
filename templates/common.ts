import { createClient } from 'soap'

export interface SoapInput {}

export const call = (url: string, method: string, input: SoapInput) =>
  new Promise((resolve, reject) => {
    createClient(url, (clientErr, client) => {
      if (clientErr) {
        return reject(clientErr)
      }
      if (!client[method]) {
        return reject(`method ${method} not found`)
      }
      return client[method](input, (callErr: string, result: any) => {
        if (callErr) {
          return reject(callErr)
        }
        return resolve(result[`${method}Return`])
      })
    })
  })
