import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public blockNo: string

  @column()
  public flat: string
  
  @column()
  public active: boolean

  @column()
  public landmark: boolean

  @column()
  public notes: boolean

  @column()
  public saveAs: boolean

  @column()
  public userId: number

  @column()
  public latitude: string

  @column()
  public longitude: string
  
  @column()
  public addressName: string

  @column()
  public pin: number

  @column()
  public area: number

  @column()
  public houseNo: string

  @column()
  public roadNo: string

  @column()
  public zoneName: string

  @column()
  public zoneId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
