
export default class CouponDomain {
    public readonly id: number
    public readonly couponName: string
    public readonly couponCode: string
    public readonly discountPercentage: string
    public readonly maximumDiscount: string
    public readonly active: boolean
    public readonly createdAt: string
    public readonly updatedAt: string
    public readonly title: string
    public readonly description: string
    public readonly enCouponName: string
    public readonly arCouponName: string
    public readonly enDescription: string
    public readonly arDescription: string
    public readonly expiryDate: string
    public readonly type: string

    private constructor(id: number, couponName: string, couponCode: string,
        discountPercentage: string, maximumDiscount: string, active: boolean, createdAt: string, updatedAt: string,
        title: string, description: string, enCouponName: string, arCouponName: string,
        enDescription: string, arDescription: string, expiryDate: string, type: string) {

        this.id = id
        this.couponName = couponName
        this.couponCode = couponCode
        this.discountPercentage = discountPercentage
        this.maximumDiscount = maximumDiscount
        this.active = active
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.title = title
        this.description = description
        this.enCouponName = enCouponName
        this.arCouponName = arCouponName
        this.enDescription = enDescription
        this.arDescription = arDescription
        this.expiryDate = expiryDate
        this.type = type
    }

    public static createFromObject(data: any) {
        return new CouponDomain(data.id, data.couponName, data.couponCode,
            data.discountPercentage, data.maximumDiscount, data.active, data.createdAt, data.updatedAt,
            data.title, data.description, data.enCouponName, data.arCouponName, data.enDescription,
            data.arDescription, data.expiryDate, data.type)
    }

    public static createFromArrOfObject(data: any) {
        return data.map((el) => {
            return new CouponDomain(el.id, el.couponName, el.couponCode,
                el.discountPercentage, el.maximumDiscount, el.active, el.createdAt, el.updatedAt,
                el.title, el.description, el.enCouponName, el.arCouponName, el.enDescription, el.arDescription,
                el.expiryDate, el.type)
        })
    }
} 