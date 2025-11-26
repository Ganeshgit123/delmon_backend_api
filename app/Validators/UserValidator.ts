import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserValidator {
  constructor(protected ctx: HttpContextContract) { }
  public get data() {
    return {
      ...this.ctx.request.all(),
    }
  }

  public schema = schema.create({
    firstName: schema.string.optional(),
    lastName: schema.string.optional(),
    userName: schema.string(),
    email: schema.string.optional(),
    address: schema.string.optional(),
    image: schema.string.optional(),
    gender: schema.string.optional(),
    os: schema.string.optional(),
    countryCode: schema.string.optional(),
    isNotification: schema.boolean.optional(),
    deviceToken: schema.string.optional(),
    isNewUser: schema.boolean.optional(),
    merchantType: schema.string.optional()
  })

  public messages = {
    'required': '{{ field }} is required',
    '*': (field, rule) => {
      return `${rule} validation error on ${field}`
    },
  }
  public cacheKey = this.ctx.routeKey

}
