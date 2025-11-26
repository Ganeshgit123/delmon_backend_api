import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public productId: number

  @column()
  public deliveryAddressId: number

  @column()
  public deliveryAddress: string

  @column()
  public deliveryAddressType: string

  @column()
  public addressType: string

  @column()
  public netAmount: number

  @column()
  public discount: number

  @column()
  public couponName: number

  @column()
  public orderReferenceId: number

  @column()
  public paymentTypeId: string

  @column()
  public orderStatus: string

  @column()
  public orderPlaceTime: number

  @column()
  public deliveredTime: number

  @column()
  public deliveryCharge: number

  @column()
  public addressName: string

  @column()
  public cartId: string
  
  @column()
  public vat: number

  @column()
  public priceDetails: string

  @column()
  public couponId: number

  @column()
  public latitude: string

  @column()
  public longitude: string

  @column()
  public refundStatus: boolean

  @column()
  public isReviewed: boolean

  @column()
  public isReturned: boolean

  @column()
  public order: string

  @column()
  public cancelTime: string

  @column()
  public pickupAddress: string

  @column()
  public deliveryBoyId: number

  @column()
  public unAvailableTime: string

  @column()
  public returnStatus: string

  @column()
  public outForDeliveryTime: string

  @column()
  public deliveryType: string

  @column()
  public deliveryDate: string

  @column()
  public newDeliveryDate: string

  @column()
  public deliveryNotes: string

  @column()
  public approveTime: string

  @column()
  public couponAmount: string

  @column()
  public userStatus: string

  @column()
  public isLoyaltyPointApply: boolean

  @column()
  public LoyaltyAmount: number

  @column()
  public deliveryOrderDate: string

  @column()
  public isCartonDiscount: boolean

  @column()
  public sonicNumber: number

  @column()
  public unAvailableNotes: string

  @column()
  public type: string

  @column()
  public isRechedule: boolean

  @column()
  public userCartonDiscount: number

  @column()
  public employeeCartonDiscount: number

  @column()
  public cartonDiscount: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
