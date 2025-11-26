
export default class RolesDomain {
    public readonly id: number
    public readonly roleName: string
    public readonly permission: string
    public readonly active: boolean
    public readonly createdAt: string
    public readonly updatedAt: string

    private constructor(id: number, roleName: string, permission: string, active: boolean, createdAt: string, updatedAt: string) {

        this.id = id
        this.roleName = roleName
        this.permission = permission
        this.active = active
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }

    public static createFromObject(data: any) {
        return new RolesDomain(data.id, data.roleName, data.permission, data.active, data.createdAt, data.updatedAt)
    }

    public static createFromArrOfObject(data: any) {
        return data.map((el) => {
            return new RolesDomain(el.id, el.roleName, el.permission, el.active, el.createdAt, el.updatedAt)
        })
    }
} 