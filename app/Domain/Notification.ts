
export default class NotificationDomain {
    public readonly id: number
    public readonly productId: string
    public readonly userId: string
    public readonly type: string
    public readonly isReaded: boolean
    public readonly createdAt: string
    public readonly updatedAt: string
    public readonly firstName: string
    public readonly lastName: string
    public readonly image: string
    public readonly message: string
    public readonly bookingId: number
    public readonly orderId: number

    private constructor(id: number, productId: string, userId: string, type: string, isReaded: boolean, createdAt: string, updatedAt: string,
        firstName: string, lastName: string, image: string, message: string, bookingId: number,
        orderId: number) {

        this.id = id
        this.productId = productId
        this.userId = userId
        this.type = type
        this.isReaded = isReaded
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.firstName = firstName
        this.lastName = lastName
        this.image = image
        this.message = message
        this.bookingId = bookingId
        this.orderId = orderId
    }

    public static createFromObject(data: any) {
        return new NotificationDomain(data.id, data.productId, data.userId, data.type, data.isReaded, data.createdAt, data.updatedAt,
            data.$extras.first_name, data.$extras.last_name, data.$extras.image, data.message, data.bookingId,
            data.orderId)
    }

    public static createFromArrOfObject(data: any) {
        return data.map((el) => {
            return new NotificationDomain(el.id, el.productId, el.userId, el.type, data.isReaded, el.createdAt, el.updatedAt,
                el.$extras.first_name, el.$extras.last_name, el.$extras.image, el.message, el.bookingId,
                el.orderId)
        })
    }
} 