// app/Middleware/Auth.ts
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import JWT from 'jsonwebtoken'
import { gzip } from 'zlib'
import { promisify } from 'util'

const gzipAsync = promisify(gzip)
const JWT_SECRET_KEY = Env.get('JWT_SECRET_KEY')

export default class Auth {
  public async handle(
    { request, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    let authHeader = request.header('authorization') || ''
    const language = request.header('language') || ''
    const type = request.header('type') || ''

    // Basic header checks
    if (!authHeader) {
      response.header('Content-Type', 'application/json; charset=utf-8')
      return response.unauthorized({
        error: false,
        message: 'Missing JWT Token',
      })
    }

    if (!language) {
      response.header('Content-Type', 'application/json; charset=utf-8')
      return response.unauthorized({
        error: false,
        message: 'language key is Missing',
      })
    }

    if (!type) {
      response.header('Content-Type', 'application/json; charset=utf-8')
      return response.unauthorized({
        error: false,
        message: 'type key is Missing',
      })
    }

    try {
      if (authHeader.startsWith('Bearer ')) {
        authHeader = authHeader.slice(7)
      }

      const decoded = JWT.verify(authHeader, JWT_SECRET_KEY)

      if (!decoded) {
        response.header('Content-Type', 'application/json; charset=utf-8')
        return response.unauthorized({
          error: false,
          message: 'User not verified',
        })
      }

      // Stash token info for downstream handlers
      if ((request as any).ctx) {
        ;(request as any).ctx.token = { decoded, parsed: decoded, base64: authHeader }
      }
    } catch (err: any) {
      response.header('Content-Type', 'application/json; charset=utf-8')
      return response.unauthorized({
        error: false,
        message: `Error verifying JWT Token: ${err.message}`,
      })
    }

    // Run downstream (controller / other middleware)
    await next()

    // If response already ended (stream/file), do nothing
    // @ts-ignore accessing Node res
    if (response.response.writableEnded) return

    // Always ensure UTF-8 content type for JSON responses
    // (If you return non-JSON elsewhere, feel free to guard this)
    const currentType = response.getHeader('content-type')
    if (!currentType) {
      response.header('Content-Type', 'application/json; charset=utf-8')
    } else if (typeof currentType === 'string' && currentType.includes('application/json') && !currentType.includes('charset')) {
      response.header('Content-Type', `${currentType}; charset=utf-8`)
    }

    // ---- Optional compression (safe) ----
    // Only compress if client accepts gzip and body exists and is JSON-like
    const acceptsGzip =
      (request.header('accept-encoding') || '').toLowerCase().includes('gzip')

    const body = response.getBody() // object | string | Buffer | null

    if (!acceptsGzip || body == null) {
      // Do nothing more — the controller already set the body.
      return
    }

    // If already encoded/compressed, don't double-compress
    const alreadyEncoded = String(response.getHeader('content-encoding') || '').length > 0
    if (alreadyEncoded) return

    // Prepare bytes correctly (no mojibake):
    // - If it's a Buffer, keep it.
    // - If it's a string, interpret as UTF-8.
    // - If it's an object, JSON.stringify once.
    let buf: Buffer
    if (Buffer.isBuffer(body)) {
      buf = body
    } else if (typeof body === 'string') {
      buf = Buffer.from(body, 'utf8')
    } else {
      // assumes JSON; if you return other types, adjust accordingly
      const json = JSON.stringify(body)
      buf = Buffer.from(json, 'utf8')
    }

    // Gzip and send raw bytes with proper headers
    const gz = await gzipAsync(buf)

    response.header('Content-Encoding', 'gzip')
    response.header('Vary', 'Accept-Encoding')
    response.header('Content-Length', String(gz.length))

    // IMPORTANT: send Buffer, not string
    response.send(gz)
  }
}
