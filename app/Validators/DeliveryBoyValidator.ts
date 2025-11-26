import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DeliveryBoyValidator {
  constructor(protected ctx: HttpContextContract) { }

  public get data() {
    return {
      ...this.ctx.request.all(),
    }
  }

  public schema = schema.create({
    userName: schema.string(),
    email: schema.string(),
    mobileNumber: schema.string(),
    password: schema.string(),
    image: schema.string.optional(),
    deviceToken: schema.string.optional(),
    employeeId: schema.number(),
    employeeCode: schema.string(),
    type: schema.string()
  })

  public messages = {
    'required': '{{ field }} is required',
    '*': (field, rule) => {
      return `${rule} validation error on ${field}`
    },
  }
  public cacheKey = this.ctx.routeKey

}
