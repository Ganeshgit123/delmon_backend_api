import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AddressValidator {
  constructor(protected ctx: HttpContextContract) { }

  public get data() {
    return {
      ...this.ctx.request.all(),
    }
  }

  public schema = schema.create({
    // userId: schema.number(),
    blockNo: schema.string(),
    flat: schema.string.optional(),
    landmark: schema.string.optional(),
    notes: schema.string.optional(),
    saveAs: schema.string.optional(),
    latitude: schema.string.optional(),
    longitude: schema.string.optional(),
    addressName: schema.string.optional(),
    pin: schema.number.optional(),
    area: schema.string(),
    houseNo: schema.string(),
    roadNo: schema.string(),
    zoneName: schema.string.optional(),
    zoneId: schema.number()
  })

  public messages = {
    'required': '{{ field }} is required',
    '*': (field, rule) => {
      return `${rule} validation error on ${field}`
    },
  }
  public cacheKey = this.ctx.routeKey

}