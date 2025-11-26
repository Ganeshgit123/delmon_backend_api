
export default class AdminDomain {
    public readonly id: number
    public readonly email: string
    public readonly password: string
    public readonly userType: boolean
    public readonly roles: string
    public readonly active: boolean
    public readonly createdAt: string
    public readonly updatedAt: string

    private constructor(id: number, email: string, password: string, userType: boolean,
        roles: string, active: boolean, createdAt: string, updatedAt: string) {

        this.id = id
        this.email = email
        this.password = password
        this.userType = userType
        this.roles = roles
        this.active = active
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }

    public static createFromObject(data: any) {
        return new AdminDomain(data.id, data.email, data.password, data.userType,
            data.roles, data.active, data.createdAt, data.updatedAt)
    }

    public static createFromArrOfObject(data: any) {
        return data.map((el) => {
            return new AdminDomain(el.id, el.email, el.password, el.userType,
                el.roles, el.active, el.createdAt, el.updatedAt)
        })
    }
} 