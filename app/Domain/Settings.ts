
export default class SettingsDomain {
    public readonly id: number
    public readonly key: string
    public readonly enValue: string
    public readonly arValue: string
    public readonly active: boolean
    public readonly createdAt: string
    public readonly updatedAt: string
    public readonly latitude: string
    public readonly longitude: string
    public readonly canCalendarShowForDelivery: string
    public readonly maxDeliveryDateCanChoose: string

    private constructor(id: number, key: string, enValue: string, arValue: string, active: boolean, createdAt: string, updatedAt: string,
        latitude: string, longitude: string, canCalendarShowForDelivery: string, maxDeliveryDateCanChoose: string) {

        this.id = id
        this.key = key
        this.enValue = enValue
        this.arValue = arValue
        this.active = active
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.latitude = latitude
        this.longitude = longitude
        this.canCalendarShowForDelivery = canCalendarShowForDelivery
        this.maxDeliveryDateCanChoose = maxDeliveryDateCanChoose
    }

    public static createFromObject(data: any) {
        return new SettingsDomain(data.id, data.key, data.enValue, data.arValue, data.active, data.createdAt, data.updatedAt,
            data.latitude, data.longitude, data.canCalendarShowForDelivery, data.maxDeliveryDateCanChoose)
    }

    public static createFromArrOfObject(data: any) {
        return data.map((el) => {
            return new SettingsDomain(el.id, el.key, el.enValue, el.arValue, el.active, el.createdAt, el.updatedAt,
                el.latitude, el.longitude, el.canCalendarShowForDelivery, el.maxDeliveryDateCanChoose)
        })
    }
} 