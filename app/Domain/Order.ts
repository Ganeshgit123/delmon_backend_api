
export default class OrderDomain {
    public readonly id: number
    public readonly userId: string
    public readonly productId: string
    public readonly deliveryAddressId: number
    public readonly deliveryAddress: boolean
    public readonly deliveryAddressType: number
    public readonly netAmount: number
    public readonly discount: number
    public readonly couponName: string
    public readonly orderReferenceId: string
    public readonly paymentTypeId: string
    public readonly orderStatus: string
    public readonly orderPlaceTime: string
    public readonly deliveredTime: string
    public readonly deliveryCharge: number
    public readonly createdAt: string
    public readonly updatedAt: string
    public readonly name: string
    public readonly image: string
    public readonly price: number
    public readonly originalPrice: number
    public readonly isStock: number
    public readonly colour: string
    public readonly capacity: string
    public readonly warrenty: number
    public readonly isPod: boolean
    public readonly returnpolicy: number
    public readonly sellCount: number
    public readonly categoryId: string
    public readonly subCategoryId: boolean
    public readonly productRating: boolean
    public readonly brandId: number
    public readonly specification: string
    public readonly addressName: string
    public readonly cartId: string
    public readonly vat: number
    public readonly addressType: string
    public readonly priceDetails: string
    public readonly isReturned: string
    public readonly outForDeliveryTime: string
    public readonly couponId: number
    public readonly latitude: string
    public readonly longitude: string
    public readonly refundStatus: boolean
    public readonly isReviewed: boolean
    public readonly order: string
    public readonly cancelTime: string
    public readonly pickupAddress: string
    public readonly deliveryBoyId: number
    public readonly unAvailableTime: string
    public readonly firstName: string
    public readonly lastName: string
    public readonly userName: string
    public readonly mobileNumber: string
    public readonly countryCode: string
    public readonly returnStatus: string
    public readonly deliveryType: string
    public readonly deliveryDate: string
    public readonly deliveryNotes: string
    public readonly approveTime: string
    public readonly couponAmount: number
    public readonly userStatus: string
    public readonly isLoyaltyPointApply: boolean
    public readonly LoyaltyAmount: number
    public readonly newDeliveryDate: string
    public readonly deliveryOrderDate: string
    public readonly isCartonDiscount: boolean
    public readonly sonicNumber: string
    public readonly unAvailableNotes: string
    public readonly type: string
    public readonly driverName: string
    public readonly driverEmail: string
    public readonly driverMobileNumber: string
    public readonly employeeId: number
    public readonly employeeCode: string
    public readonly userType: string
    public readonly isRechedule: boolean
    public readonly cartonDiscount: number


    private constructor(id: number, userId: string, productId: string, deliveryAddressId: number, deliveryAddress: boolean,
        deliveryAddressType: number, netAmount: number, discount: number,
        couponName: string, orderReferenceId: string, paymentTypeId: string, orderStatus: string,
        orderPlaceTime: string, deliveredTime: string, deliveryCharge: number, createdAt: string, updatedAt: string,
        name: string, image: string, price: number, originalPrice: number, isStock: number, colour: string,
        capacity: string, warrenty: number, isPod: boolean, returnpolicy: number,
        sellCount: number, categoryId: string, subCategoryId: boolean, productRating: boolean,
        brandId: number, specification: string, addressName: string, cartId: string,
        vat: number, addressType: string, priceDetails: string, isReturned: string, outForDeliveryTime: string, couponId: number,
        latitude: string, longitude: string, refundStatus: boolean, isReviewed: boolean, order: string,
        cancelTime: string, pickupAddress: string, deliveryBoyId: number, unAvailableTime: string,
        firstName: string, lastName: string, userName: string, mobileNumber: string, countryCode: string,
        returnStatus: string, deliveryType: string, deliveryDate: string, deliveryNotes: string,
        approveTime: string, couponAmount: number, userStatus: string, isLoyaltyPointApply: boolean,
        LoyaltyAmount: number, newDeliveryDate: string, deliveryOrderDate: string, isCartonDiscount: boolean,
        sonicNumber: string, unAvailableNotes: string, type: string, driverName: string, driverEmail: string,
        driverMobileNumber: string,employeeId: number, employeeCode: string, userType: string, isRechedule: boolean,
        cartonDiscount: number) {

        this.id = id
        this.userId = userId
        this.productId = productId
        this.deliveryAddressId = deliveryAddressId
        this.deliveryAddress = deliveryAddress
        this.deliveryAddressType = deliveryAddressType
        this.netAmount = netAmount
        this.discount = discount
        this.couponName = couponName
        this.orderReferenceId = orderReferenceId
        this.paymentTypeId = paymentTypeId
        this.orderStatus = orderStatus
        this.orderPlaceTime = orderPlaceTime
        this.deliveredTime = deliveredTime
        this.deliveryCharge = deliveryCharge
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.name = name
        this.image = image
        this.price = price
        this.originalPrice = originalPrice
        this.isStock = isStock
        this.colour = colour
        this.capacity = capacity
        this.warrenty = warrenty
        this.isPod = isPod
        this.returnpolicy = returnpolicy
        this.sellCount = sellCount
        this.categoryId = categoryId
        this.subCategoryId = subCategoryId
        this.productRating = productRating
        this.brandId = brandId
        this.specification = specification
        this.addressName = addressName
        this.cartId = cartId
        this.vat = vat
        this.addressType = addressType
        this.priceDetails = priceDetails
        this.isReturned = isReturned
        this.outForDeliveryTime = outForDeliveryTime
        this.couponId = couponId
        this.latitude = latitude
        this.longitude = longitude
        this.refundStatus = refundStatus
        this.isReviewed = isReviewed
        this.order = order
        this.cancelTime = cancelTime
        this.pickupAddress = pickupAddress
        this.deliveryBoyId = deliveryBoyId
        this.unAvailableTime = unAvailableTime
        this.firstName = firstName
        this.lastName = lastName
        this.userName = userName
        this.mobileNumber = mobileNumber
        this.countryCode = countryCode
        this.returnStatus = returnStatus
        this.deliveryType = deliveryType
        this.deliveryDate = deliveryDate
        this.deliveryNotes = deliveryNotes
        this.approveTime = approveTime
        this.couponAmount = couponAmount
        this.userStatus = userStatus
        this.isLoyaltyPointApply = isLoyaltyPointApply
        this.LoyaltyAmount = LoyaltyAmount
        this.newDeliveryDate = newDeliveryDate
        this.deliveryOrderDate = deliveryOrderDate
        this.isCartonDiscount = isCartonDiscount
        this.sonicNumber = sonicNumber
        this.unAvailableNotes = unAvailableNotes
        this.type = type
        this.driverName = driverName
        this.driverEmail = driverEmail
        this.driverMobileNumber = driverMobileNumber
        this.employeeId = employeeId
        this.employeeCode = employeeCode
        this.userType = userType
        this.isRechedule = isRechedule
        this.cartonDiscount = cartonDiscount
    }

    public static createFromObject(data: any) {
        return new OrderDomain(data.id, data.userId, data.productId, data.deliveryAddressId, data.deliveryAddress,
            data.deliveryAddressType, data.netAmount, data.discount,
            data.couponName, data.orderReferenceId, data.paymentTypeId, data.orderStatus,
            data.orderPlaceTime, data.deliveredTime, data.deliveryCharge, data.createdAt, data.updatedAt,
            data.$extras ? data.$extras.name : '', data.$extras ? data.$extras.image ? JSON.parse(data.$extras.image) : '' : '', data.$extras ? data.$extras.price : '', data.$extras ? data.$extras.original_price : '',
            data.$extras ? data.$extras.is_stock : '', data.$extras ? data.$extras.colour : '', data.$extras ? data.$extras.capacity : '',
            data.$extras ? data.$extras.warrenty : '', data.$extras ? data.$extras.isPod : '', data.$extras ? data.$extras.return_policy : '', data.$extras ? data.$extras.sellCount : '', data.$extras ? data.$extras.category_id : '',
            data.$extras ? data.$extras.sub_category_id : '', data.$extras ? data.$extras.product_rating : '', data.$extras ? data.$extras.brand_id : '', data.$extras ? data.$extras.specification : '',
            data.addressName, data.cartId, data.vat, data.addressType, data.priceDetails, data.is_returned, data.outForDeliveryTime, data.couponId,
            data.latitude, data.longitude, data.refundStatus, data.isReviewed, data.order, data.cancelTime,
            data.pickupAddress, data.deliveryBoyId, data.unAvailableTime, data.$extras ? data.$extras.first_name : '',
            data.$extras ? data.$extras.last_name : '', data.$extras ? data.$extras.user_name : '',
            data.$extras ? data.$extras.mobile_number : '', data.$extras ? data.$extras.country_code : '', data.returnStatus,
            data.deliveryType, data.deliveryDate, data.deliveryNotes, data.approveTime, data.couponAmount,
            data.userStatus, data.isLoyaltyPointApply, data.LoyaltyAmount, data.newDeliveryDate, data.deliveryOrderDate,
            data.isCartonDiscount, data.sonicNumber, data.unAvailableNotes, data.type, data.driverName, data.driverEmail,
            data.driverMobileNumber, data.employeeId, data.employeeCode, data.userType, data.isRechedule, data.cartonDiscount)
    }

    public static createFromArrOfObject(data: any) {
        return data.map((el) => {
            return new OrderDomain(el.id, el.userId, el.productId, el.deliveryAddressId, el.deliveryAddress,
                el.deliveryAddressType, el.netAmount, el.discount, el.couponName, el.orderReferenceId, el.paymentTypeId, el.orderStatus,
                el.orderPlaceTime, el.deliveredTime, el.deliveryCharge, el.createdAt, el.updatedAt,
                el.$extras ? el.$extras.name : '', el.$extras ? el.$extras.image : "", el.$extras ? el.$extras.price : '', el.$extras ? el.$extras.original_price : '',
                el.$extras ? el.$extras.is_stock : '', el.$extras ? el.$extras.colour : '', el.$extras ? el.$extras.capacity : '',
                el.$extras ? el.$extras.warrenty : '', el.$extras ? el.$extras.is_pod : '', el.$extras ? el.$extras.return_policy : '', el.$extras ? el.$extras.sell_count : '', el.$extras ? el.$extras.category_id : '',
                el.$extras ? el.$extras.sub_category_id : '', el.$extras ? el.$extras.product_rating : '', el.$extras ? el.$extras.brand_id : '', el.$extras ? el.$extras.specification : '',
                el.addressName, el.cartId, el.vat, el.addressType, el.priceDetails, el.$extras.is_returned, el.outForDeliveryTime, el.couponId,
                el.latitude, el.longitude, el.refundStatus, el.isReviewed, el.order, el.cancelTime,
                el.pickupAddress, el.deliveryBoyId, el.unAvailableTime, el.$extras ? el.$extras.first_name : '',
                el.$extras ? el.$extras.last_name : '', el.$extras ? el.$extras.user_name : '',
                el.$extras ? el.$extras.mobile_number : '', el.$extras ? el.$extras.country_code : '', el.returnStatus,
                el.deliveryType, el.deliveryDate, el.deliveryNotes, el.approveTime, el.couponAmount,
                el.userStatus, el.isLoyaltyPointApply, el.LoyaltyAmount, el.newDeliveryDate, el.deliveryOrderDate,
                el.isCartonDiscount, el.sonicNumber, el.unAvailableNotes, el.type, el.$extras ? el.$extras.driverName : '',
                el.$extras.driverEmail, el.$extras.driverMobileNumber, el.$extras.employeeId, el.$extras.employeeCode,
                el.$extras.user_type, el.isRechedule, el.cartonDiscount)
        })
    }
} 