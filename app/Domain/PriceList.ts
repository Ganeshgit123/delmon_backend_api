
export default class PriceListDomain {
    public readonly id: number
    public readonly userPrice: string
    public readonly employeePrice: string
    // public readonly merchantPrice: boolean
    public readonly createdAt: string
    public readonly updatedAt: string
    public readonly goldPrice: string
    public readonly silverPrice: string
    public readonly platinumPrice: string
    public readonly productId: number
    public readonly active: boolean

    private constructor(id: number, userPrice: string, employeePrice: string, createdAt: string, updatedAt: string, goldPrice: string,
        silverPrice: string, platinumPrice: string, productId: number, active: boolean) {

        this.id = id
        this.userPrice = userPrice
        this.employeePrice = employeePrice
        // this.merchantPrice = merchantPrice
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.goldPrice = goldPrice
        this.silverPrice = silverPrice
        this.platinumPrice = platinumPrice
        this.productId = productId
        this.active = active
    }

    public static createFromObject(data: any) {
        return new PriceListDomain(data.id, data.userPrice, data.employeePrice, data.createdAt, data.updatedAt,
            data.goldPrice, data.silverPrice, data.platinumPrice, data.productId, data.active)
    }

    public static createFromArrOfObject(data: any) {
        return data.map((el) => {
            return new PriceListDomain(el.id, el.userPrice, el.employeePrice, el.createdAt, el.updatedAt,
                el.goldPrice, el.silverPrice, el.platinumPrice, el.productId, el.active)
        })
    }
} 