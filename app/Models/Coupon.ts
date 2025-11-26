import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Coupon extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public couponName: string

  @column()
  public couponCode: string

  @column()
  public discountPercentage: string

  @column()
  public maximumDiscount: string

  @column()
  public active: boolean

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public enCouponName: string

  @column()
  public arCouponName: string

  @column()
  public enDescription: string

  @column()
  public arDescription: string

  @column()
  public expiryDate: string

  @column()
  public type: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
