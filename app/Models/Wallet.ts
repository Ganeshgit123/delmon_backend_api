import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Wallet extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public paymentType: string

  @column()
  public amount: number

  @column()
  public userId: number

  @column()
  public type: boolean

  @column()
  public orderId: number

  @column()
  public productType: number

  @column()
  public paymentId: string

  @column()
  public transactionId: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
