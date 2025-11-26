
export default class AddressDomain {
    public readonly id: number
    public readonly userId: number
    public readonly blockNo: string
    public readonly flat: string
    public readonly landmark: string
    public readonly notes: string
    public readonly saveAs: string
    public readonly active: boolean
    public readonly createdAt: string
    public readonly updatedAt: string
    public readonly latitude: string
    public readonly longitude: string
    public readonly addressName: string
    public readonly pin: number
    public readonly deliveryCharge: number
    public readonly area: string
    public readonly houseNo: string
    public readonly roadNo: string
    public readonly zoneName: string
    public readonly zoneId: number

    private constructor(id: number, userId: number, blockNo: string, flat: string,
        landmark: string, notes: string, saveAs: string,
        active: boolean, createdAt: string, updatedAt: string, latitude: string, longitude: string,
        addressName: string, pin: number, deliveryCharge: number, area: string, houseNo: string,
        roadNo: string, zoneName: string, zoneId: number) {

        this.id = id
        this.userId = userId
        this.blockNo = blockNo
        this.flat = flat
        this.landmark = landmark
        this.notes = notes
        this.saveAs = saveAs
        this.active = active
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.latitude = latitude
        this.longitude = longitude
        this.addressName = addressName
        this.pin = pin
        this.deliveryCharge = deliveryCharge
        this.area = area
        this.houseNo = houseNo
        this.roadNo = roadNo
        this.zoneName = zoneName
        this.zoneId = zoneId
    }

    public static createFromObject(data: any) {
        return new AddressDomain(data.id, data.userId, data.blockNo, data.flat,
            data.landmark, data.notes, data.saveAs,
            data.active, data.createdAt, data.updatedAt, data.latitude, data.longitude,
            data.addressName, data.pin, data.deliveryCharge, data.area, data.houseNo, data.roadNo, data.zoneName, data.zoneId)
    }

    public static createFromArrOfObject(data: any) {        
        return data.map((el) => {
            return new AddressDomain(el.id, el.userId, el.blockNo, el.flat,
                el.landmark, el.notes, el.saveAs,
                el.active, el.createdAt, el.updatedAt, el.latitude, el.longitude,
                el.addressName, el.pin, el.$extras.deliveryCharge, el.area, el.houseNo, el.roadNo, el.zoneName, el.zoneId)
        })
    }
} 