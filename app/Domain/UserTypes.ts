
export default class UserTypesDomain {
    public readonly id: number
    public readonly name: string
    public readonly priceListNameId: number
    public readonly active: boolean
    public readonly createdAt: string
    public readonly updatedAt: string
    public readonly priceListNames: string

    private constructor(id: number, name: string, priceListNameId: number,
        active: boolean, createdAt: string, updatedAt: string, priceListNames: string) {

        this.id = id
        this.name = name
        this.priceListNameId = priceListNameId
        this.active = active
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.priceListNames = priceListNames
    }

    public static createFromObject(data: any) {
        return new UserTypesDomain(data.id, data.name, data.priceListNameId,
            data.active, data.createdAt, data.updatedAt, data.priceListNames)
    }

    public static createFromArrOfObject(data: any) {
        return data.map((el) => {
            return new UserTypesDomain(el.id, el.name, el.priceListNameId,
                el.active, el.createdAt, el.updatedAt, el.$extras ? el.$extras.priceListNames : '')
        })
    }
} 