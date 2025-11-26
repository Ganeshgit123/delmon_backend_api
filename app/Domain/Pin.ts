
export default class PinDomain {
    public readonly id: number
    public readonly pin: number
    public readonly areaId: number
    public readonly active: boolean
    public readonly createdAt: string
    public readonly updatedAt: string

    private constructor(id: number, pin: number, areaId: number, active: boolean, createdAt: string, updatedAt: string) {

        this.id = id
        this.pin = pin
        this.areaId = areaId
        this.active = active
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }

    public static createFromObject(data: any) {
        return new PinDomain(data.id, data.pin, data.areaId, data.active, data.createdAt, data.updatedAt)
    }

    public static createFromArrOfObject(data: any) {
        return data.map((el) => {
            return new PinDomain(el.id, el.pin, el.areaId, el.active, el.createdAt, el.updatedAt)
        })
    }
} 