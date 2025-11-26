import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) { }

  public get data() {
    return {
      ...this.ctx.request.all(),
    }
  }

  public schema = schema.create({
    mobileNumber: schema.number(),
    countryCode: schema.string.optional(),
    userName: schema.string.optional(),
    email: schema.string.optional(),
    userType: schema.enum(['USER', 'EMPLOYEE', 'MERCHANT']),
    crNumber: schema.string.optional(),
    employeeNumber: schema.string.optional(),
  })

  public messages = {
    'required': '{{ field }} is required',
    '*': (field, rule) => {
      return `${rule} validation error on ${field}`
    },
  }
  public cacheKey = this.ctx.routeKey

}
