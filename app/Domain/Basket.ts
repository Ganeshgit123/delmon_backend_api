
export default class BasketDomain {
    public readonly id: number
    public readonly name: string
    public readonly userId: number
    public readonly createdAt: string
    public readonly updatedAt: string
    public readonly enName: string
    public readonly arName: string

    private constructor(id: number, name: string, userId: number, createdAt: string, updatedAt: string,
        enName: string, arName: string) {

        this.id = id
        this.name = name
        this.userId = userId
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.enName = enName
        this.arName = arName
    }

    public static createFromObject(data: any) {
        return new BasketDomain(data.id, data.name, data.userId, data.createdAt, data.updatedAt,
            data.enName, data.arName)
    }

    public static createFromArrOfObject(data: any) {
        return data.map((el) => {
            return new BasketDomain(el.id, el.name, el.userId, el.createdAt, el.updatedAt,
                el.enName, el.arName)
        })
    }
} 