
export default class AreaDomain {
    public readonly id: number
    public readonly areaName: string
    public readonly arAreaName: string
    public readonly zoneId: number
    public readonly active: boolean
    public readonly createdAt: string
    public readonly updatedAt: string

    private constructor(id: number, areaName: string, arAreaName: string, zoneId: number, active: boolean, createdAt: string, updatedAt: string) {

        this.id = id
        this.areaName = areaName
        this.arAreaName = arAreaName
        this.zoneId = zoneId
        this.active = active
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }

    public static createFromObject(data: any) {
        return new AreaDomain(data.id, data.areaName, data.arAreaName, data.zoneId, data.active, data.createdAt, data.updatedAt)
    }

    public static createFromArrOfObject(data: any) {
        return data.map((el) => {
            return new AreaDomain(el.id, el.areaName, el.arAreaName, el.zoneId, el.active, el.createdAt, el.updatedAt)
        })
    }
} 