import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Recipy extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public ingredients: string

  @column()
  public arIngredients: string

  @column()
  public steps: string

  @column()
  public arSteps: string

  @column()
  public categoryId: number

  @column()
  public videos: string

  @column()
  public thumbnailImage: string

  @column()
  public active: string

  @column()
  public arName: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
