import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CategoryValidator {
  constructor(protected ctx: HttpContextContract) { }

  public get data() {
    return {
      ...this.ctx.request.all(),
    }
  }

  public schema = schema.create({
    name: schema.string.optional(),
    arName: schema.string(),
    enName: schema.string(),
    image: schema.string.optional(),
    type: schema.string(),
    colorCode: schema.string(),
    parentId: schema.number.optional(),
    path: schema.string.optional(),
    vat: schema.number.optional(),
    userType: schema.number(),
    employeeType: schema.number()
  })

  public messages = {
    'required': '{{ field }} is required',
    '*': (field, rule) => {
      return `${rule} validation error on ${field}`
    },
  }
  public cacheKey = this.ctx.routeKey

}