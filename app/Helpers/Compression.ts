import * as zlib from 'zlib'
import * as utf8 from 'utf8'
import { ResponseContract } from '@ioc:Adonis/Core/Response'

export default class Compression {
  public static zipResponse(response: ResponseContract) {
    return new Promise(async (resolve, reject) => {
      response.header('Content-Encoding', 'gzip')
      response.header('Content-Type', 'application/json; charset=utf-8')
      // response.header('Content-Type', 'text/plain; charset=utf-8')
      const encoded = await utf8.encode(JSON.stringify(response.getBody()))
      zlib.gzip(encoded, (err: any, result: any) => {
        if (err) reject(err)
        resolve(result)
      })
    })
  }
}
