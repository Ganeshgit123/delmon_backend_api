import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class PriceList extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userPrice: number

  @column()
  public employeePrice: number

  // @column()
  // public merchantPrice: number

  @column()
  public goldPrice: number

  @column()
  public silverPrice: number

  @column()
  public platinumPrice: number

  @column()
  public productId: number

  @column()
  public active: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
