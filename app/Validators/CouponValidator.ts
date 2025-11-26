import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CouponValidator {
  constructor(protected ctx: HttpContextContract) { }

  public get data() {
    return {
      ...this.ctx.request.all(),
    }
  }

  public schema = schema.create({
    enCouponName: schema.string(),
    arCouponName: schema.string(),
    couponCode: schema.string(),
    discountPercentage: schema.number(),
    maximumDiscount: schema.number(),
    title: schema.string(),
    enDescription: schema.string(),
    arDescription: schema.string(),
    expiryDate: schema.string(),
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