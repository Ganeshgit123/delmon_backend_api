
export default class BannerDomain {
    public readonly id: number
    public readonly name: string
    public readonly image: string
    public readonly active: boolean
    public readonly createdAt: string
    public readonly updatedAt: string
    public readonly type: string
    public readonly enImage: string
    public readonly arImage: string

    private constructor(id: number, name: string, image: string, active: boolean, createdAt: string, updatedAt: string, type: string,
        enImage: string, arImage: string) {

        this.id = id
        this.name = name
        this.image = image
        this.active = active
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.type = type
        this.enImage = enImage
        this.arImage = arImage
    }

    public static createFromObject(data: any) {
        return new BannerDomain(data.id, data.name, data.image, data.active, data.createdAt, data.updatedAt,
            data.type, data.enImage, data.arImage)
    }

    public static createFromArrOfObject(data: any) {
        return data.map((el) => {
            return new BannerDomain(el.id, el.name, el.image, el.active, el.createdAt, el.updatedAt,
                el.type, el.enImage, el.arImage)
        })
    }
} 