
export default class ReportDomain {
    public readonly id: number
    public readonly userId: string
    public readonly comment: string
    public readonly createdAt: string
    public readonly updatedAt: string
    public readonly userName: string
    public readonly email: string
    public readonly mobileNumber: string
    public readonly userType: string

    private constructor(id: number, userId: string, comment: string, createdAt: string, updatedAt: string,
        userName: string, email: string, mobileNumber: string, userType: string) {

        this.id = id
        this.userId = userId
        this.comment = comment
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.userName = userName
        this.email = email
        this.mobileNumber = mobileNumber
        this.userType = userType
    }

    public static createFromObject(data: any) {
        return new ReportDomain(data.id, data.userId, data.comment, data.$extras ? data.createdAt : '', data.$extras ? data.updatedAt : '',
        data.$extras ? data.$extras.user_name: '', data.$extras ? data.$extras.email : '', data.$extras ? data.$extras.mobile_number : '',
        data.$extras ? data.$extras.user_type : '')
    }

    public static createFromArrOfObject(data: any) {        
        return data.map((el) => {
            return new ReportDomain(el.id, el.userId, el.comment, el.$extras ? el.$extras.createdAt : '', el.$extras ? el.$extras.updatedAt : '',
            el.$extras ? el.$extras.user_name: '', el.$extras ? el.$extras.email : '', el.$extras ? el.$extras.mobile_number : '',
            el.$extras ? el.$extras.user_type : '')
        })
    }
} 