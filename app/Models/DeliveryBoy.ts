import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class DeliveryBoy extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userName: string

  @column()
  public mobileNumber: string

  @column()
  public email: string

  @column()
  public active: boolean

  @column()
  public image: boolean

  @column()
  public password: string

  @column()
  public deviceToken: string

  @column()
  public employeeId: number

  @column()
  public employeeCode: string

  @column()
  public type: string


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
