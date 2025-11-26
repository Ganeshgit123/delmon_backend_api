
export default class CategoryDomain {
    public readonly id: number
    public readonly name: string
    public readonly enName: string
    public readonly arName: string
    public readonly image: string
    public readonly active: boolean
    public readonly createdAt: string
    public readonly updatedAt: string
    public readonly type: string
    public readonly colorCode: string
    public readonly parentId: number
    public readonly path: string
    public readonly vat: number
    public readonly userType: boolean
    public readonly employeeType: boolean

    private constructor(id: number, name: string, enName: string, arName: string, image: string, active: boolean, createdAt: string, updatedAt: string,
        type: string, colorCode: string, parentId: number, path: string, vat: number, userType: boolean,
        employeeType: boolean) {

        this.id = id
        this.name = name
        this.enName = enName
        this.arName = arName
        this.image = image
        this.active = active
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.type = type
        this.colorCode = colorCode
        this.parentId = parentId
        this.path = path
        this.vat = vat
        this.userType = userType
        this.employeeType = employeeType
    }

    public static createFromObject(data: any) {
        return new CategoryDomain(data.id, data.name, data.enName, data.arName, data.image, data.active, data.createdAt, data.updatedAt,
            data.type, data.colorCode, data.parentId, data.path, data.vat, data.userType, data.employeeType)
    }

    public static createFromArrOfObject(data: any) {
        return data.map((el) => {
            return new CategoryDomain(el.id, el.name, el.enName, el.arName, el.image, el.active, el.createdAt, el.updatedAt,
                el.type, el.colorCode, el.parentId, el.path, el.vat, el.userType, el.employeeType)
        })
    }
} 