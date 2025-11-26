
export default class WalletDomain {
    public readonly id: number
    public readonly paymentType: string
    public readonly amount: number
    public readonly userId: boolean
    public readonly createdAt: string
    public readonly updatedAt: string
    public readonly type: string
    public readonly orderId: string
    public readonly productType: string
    public readonly paymentId: string
    public readonly transactionId: string

    private constructor(id: number, paymentType: string, amount: number, userId: boolean, createdAt: string, updatedAt: string, type: string,
        orderId: string, productType: string, paymentId: string, transactionId: string) {

        this.id = id
        this.paymentType = paymentType
        this.amount = amount
        this.userId = userId
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.type = type
        this.orderId = orderId
        this.productType = productType
        this.paymentId = paymentId
        this.transactionId = transactionId
    }

    public static createFromObject(data: any) {
        return new WalletDomain(data.id, data.paymentType, data.amount, data.userId, data.createdAt, data.updatedAt,
            data.type, data.orderId, data.productType, data.paymentId, data.transactionId)
    }

    public static createFromArrOfObject(data: any) {
        return data.map((el) => {
            return new WalletDomain(el.id, el.paymentType, el.amount, el.userId, el.createdAt, el.updatedAt,
                el.type, el.orderId, el.productType, el.paymentId, el.transactionId)
        })
    }
} 