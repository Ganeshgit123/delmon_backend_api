
export default class SpinAndWinListDomain {
    public readonly id: number
    public readonly userId: number
    public readonly spinId: number
    public readonly createdAt: string
    public readonly updatedAt: string
    public readonly type: string
    public readonly title: string
    public readonly firstName: string
    public readonly lastName: string

    private constructor(id: number, userId: number, spinId: number, createdAt: string, updatedAt: string,
        type: string, title: string, firstName: string, lastName: string) {

        this.id = id
        this.userId = userId
        this.spinId = spinId
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.type = type
        this.title = title
        this.firstName = firstName
        this.lastName = lastName
    }

    public static createFromObject(data: any) {
        return new SpinAndWinListDomain(data.id, data.userId, data.spinId, data.createdAt, data.updatedAt,
            data.type, data.title, data.firstName, data.lastName)
    }

    public static createFromArrOfObject(data: any) {
        return data.map((el) => {
            return new SpinAndWinListDomain(el.id, el.userId, el.spinId, el.createdAt, el.updatedAt,
                el.$extras.type, el.$extras.title, el.$extras.firstName, el.$extras.lastName)
        })
    }
} 