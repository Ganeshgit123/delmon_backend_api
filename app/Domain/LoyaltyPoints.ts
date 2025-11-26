
export default class LoyaltyPointsDomain {
    public readonly id: number
    public readonly userId: number
    public readonly usedLoyaltyPoint: number
    public readonly orderId: number
    public readonly createdAt: string
    public readonly updatedAt: string
    public readonly type: string
    public readonly loyaltyType: string

    private constructor(id: number, userId: number, usedLoyaltyPoint: number, orderId: number, createdAt: string, updatedAt: string,
        type: string, loyaltyType: string) {

        this.id = id
        this.userId = userId
        this.usedLoyaltyPoint = usedLoyaltyPoint
        this.orderId = orderId
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.type = type
        this.loyaltyType = loyaltyType
    }

    public static createFromObject(data: any) {
        return new LoyaltyPointsDomain(data.id, data.userId, data.usedLoyaltyPoint, data.orderId, data.createdAt, data.updatedAt,
            data.type, data.loyaltyType)
    }

    public static createFromArrOfObject(data: any) {
        return data.map((el) => {
            return new LoyaltyPointsDomain(el.id, el.userId, el.usedLoyaltyPoint, el.orderId, el.createdAt, el.updatedAt,
                el.type, el.loyaltyType)
        })
    }
} 