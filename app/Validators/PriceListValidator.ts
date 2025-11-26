import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PriceListValidator {
  constructor(protected ctx: HttpContextContract) { }

  public get data() {
    return {
      ...this.ctx.request.all(),
    }
  }

  public schema = schema.create({
    userPrice: schema.number(),
    employeePrice: schema.number(),
    // merchantPrice: schema.number(),
    goldPrice: schema.number(),
    silverPrice: schema.number(),
    platinumPrice: schema.number(),
    productId: schema.number(),
  })

  public messages = {
    'required': '{{ field }} is required',
    '*': (field, rule) => {
      return `${rule} validation error on ${field}`
    },
  }
  public cacheKey = this.ctx.routeKey

}
