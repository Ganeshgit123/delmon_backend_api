import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class OrderValidator {
  constructor(protected ctx: HttpContextContract) { }

  public get data() {
    return {
      ...this.ctx.request.all(),
    }
  }

  public schema = schema.create({
    userId: schema.number.optional(),
    // productId: schema.number(),
    deliveryAddressId: schema.number.optional(),
    deliveryAddress: schema.string.optional(),
    deliveryAddressType: schema.string.optional(),
    addressType: schema.string.optional(),
    netAmount: schema.number(),
    discount: schema.number.optional(),
    couponName: schema.string.optional(),
    orderReferenceId: schema.string.optional(),
    paymentTypeId: schema.string(),
    orderStatus: schema.string.optional(),
    deliveryCharge: schema.number.optional(),
    addressName: schema.string.optional(),
    cartId: schema.string.optional(),
    vat: schema.number(),
    priceDetails: schema.string.optional(),
    order: schema.string(),
    latitude: schema.string.optional(),
    longitude: schema.string.optional(),
    pickupAddress: schema.string.optional(),
    deliveryType: schema.string(),
    deliveryDate: schema.string.optional(),
    deliveryNotes: schema.string.optional(),
    couponAmount: schema.number.optional(),
    couponId: schema.number.optional(),
    LoyaltyAmount: schema.number.optional(),
    isLoyaltyPointApply: schema.boolean.optional(),
    deliveryOrderDate: schema.string.optional(),
    isCartonDiscount: schema.boolean.optional(),
    cartonDiscount: schema.number.optional(),
    type: schema.string.optional(),
    maxCartonDiscountPerDay: schema.number.optional(),
    maxCartonDiscountPerDayUser: schema.number.optional(),
    userCartonDiscount: schema.number.optional(),
    employeeCartonDiscount: schema.number.optional()

  })

  public messages = {
    'required': '{{ field }} is required',
    '*': (field, rule) => {
      return `${rule} validation error on ${field}`
    },
  }
  public cacheKey = this.ctx.routeKey

}
