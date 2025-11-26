
export default class PriceListNamesDomain {
    public readonly id: number
    public readonly name: string
    public readonly createdAt: string
    public readonly updatedAt: string

    private constructor(id: number, name: string, createdAt: string, updatedAt: string) {

        this.id = id
        this.name = name
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }

    public static createFromObject(data: any) {
        return new PriceListNamesDomain(data.id, data.name, data.createdAt, data.updatedAt)
    }

    public static createFromArrOfObject(data: any) {
        return data.map((el) => {
            return new PriceListNamesDomain(el.id, el.name, el.createdAt, el.updatedAt)
        })
    }
} 