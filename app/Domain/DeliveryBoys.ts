export default class DeliveryBoysDomain {
    public readonly id: number
    public readonly userName: string
    public readonly image: string
    public readonly email: string
    public readonly createdAt: string
    public readonly updatedAt: string
    public readonly deviceToken: string
    public readonly mobileNumber: string
    public readonly active: boolean
    public readonly password: string
    public readonly employeeId: number
    public readonly employeeCode: string
    public readonly type: string

    private constructor(id: number, userName: string, image: string, email: string, createdAt: string, updatedAt: string, deviceToken: string,
        mobileNumber: string, active: boolean, password: string, employeeId: number,
        employeeCode: string, type: string) {

        this.id = id
        this.userName = userName
        this.image = image
        this.email = email
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.deviceToken = deviceToken
        this.mobileNumber = mobileNumber
        this.active = active
        this.password = password
        this.employeeId = employeeId
        this.employeeCode = employeeCode
        this.type = type
    }

    public static createFromObject(data: any) {
        if (data = data) {
           return new DeliveryBoysDomain(data.id, data.userName, data.image, data.email, data.createdAt, data.updatedAt, data.deviceToken,
            data.mobileNumber, data.active, data.password, data.employeeId, data.employeeCode, data.type)
        }else {
           return []
        }
        
    }

    public static createFromArrOfObject(data: any) {
        return data.map((el) => {
            return new DeliveryBoysDomain(el.id, el.userName, el.image, el.email, el.createdAt, el.updatedAt, el.deviceToken,
                el.mobileNumber, el.active, el.password, el.employeeId, el.employeeCode, el.type)
        })
    }
} 