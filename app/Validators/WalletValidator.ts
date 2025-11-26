import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class WalletValidator {
  constructor(protected ctx: HttpContextContract) { }

  public get data() {
    return {
      ...this.ctx.request.all(),
    }
  }

  public schema = schema.create({
    paymentType: schema.string(),
    amount: schema.number(),
    type: schema.string(),
    userId: schema.number.optional(),
    orderId: schema.number.optional(),
    productType: schema.string.optional(),
    paymentId: schema.string.optional(),
    transactionId: schema.string.optional()
  })

  public messages = {
    'required': '{{ field }} is required',
    '*': (field, rule) => {
      return `${rule} validation error on ${field}`
    },
  }
  public cacheKey = this.ctx.routeKey

}
