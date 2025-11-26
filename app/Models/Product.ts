import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public image: string

  @column()
  public name: string

  @column()
  public active: boolean

  @column()
  public description: string

  @column()
  public isStock: number

  @column()
  public categoryId: number

  @column()
  public price: number

  @column()
  public noOfPieces: string

  @column()
  public serves: string

  @column()
  public type: string

  @column()
  public parentId: number

  @column()
  public weight: string

  @column()
  public recipiesId: string

  @column()
  public isBasket: boolean

  @column()
  public basketProductList: string

  @column()
  public enProductName: string

  @column()
  public arProductName: string

  @column()
  public soldType: number

  @column()
  public mostWantedProduct: boolean

  @column()
  public offers: boolean

  @column()
  public newProduct: boolean

  @column()
  public cartonActive: boolean

  @column()
  public piecesActive: boolean

  @column()
  public subDescription: boolean

  @column()
  public arDescription: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
