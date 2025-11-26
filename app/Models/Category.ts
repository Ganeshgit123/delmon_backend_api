import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public enName: string

  @column()
  public arName: string

  @column()
  public image: string

  @column()
  public active: boolean

  @column()
  public type: boolean

  @column()
  public colorCode: string

  @column()
  public parentId: number

  @column()
  public path: string

  @column()
  public vat: number

  @column()
  public userType: boolean

  @column()
  public employeeType: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
