
export default class ZoneDomain {
    public readonly id: number
    public readonly name: string
    public readonly arName: string
    public readonly deliveryCharge: number
    public readonly active: boolean
    public readonly createdAt: string
    public readonly updatedAt: string

    private constructor(id: number, name: string, arName: string, deliveryCharge: number, active: boolean, createdAt: string, updatedAt: string) {

        this.id = id
        this.name = name
        this.arName = arName
        this.deliveryCharge = deliveryCharge
        this.active = active
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }

    public static createFromObject(data: any) {
        return new ZoneDomain(data.id, data.name, data.arName, data.deliveryCharge, data.active, data.createdAt, data.updatedAt)
    }

    public static createFromArrOfObject(data: any) {
        return data.map((el) => {
            return new ZoneDomain(el.id, el.name, el.arName, el.deliveryCharge, el.active, el.createdAt, el.updatedAt)
        })
    }
} 