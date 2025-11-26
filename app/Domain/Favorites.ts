import { da } from "date-fns/locale"

export default class FavoritesDomain {
    public readonly id: number
    public readonly productId: string
    public readonly userId: string
    public readonly name: string
    public readonly image: string
    public readonly active: boolean
    public readonly createdAt: string
    public readonly updatedAt: string
    public readonly description: string
    public readonly isStock: number
    public readonly categoryId: number
    public readonly price: number
    public readonly noOfPieces: number
    public readonly serves: string
    public readonly type: string
    public readonly categoryName: string
    public readonly parentId: number
    public readonly weight: string
    public readonly arProductName: string
    public readonly arDescription: string

    private constructor(id: number, productId: string, userId: string, name: string, image: string, active: boolean,
        createdAt: string, updatedAt: string, description: string, isStock: number, categoryId: number, price: number,
        noOfPieces: number, serves: string, type: string, categoryName: string, parentId: number, weight: string, arProductName: string, arDescription: string) {

        this.id = id
        this.productId = productId
        this.userId = userId
        this.name = name
        this.image = image
        this.active = active
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.description = description
        this.isStock = isStock
        this.categoryId = categoryId
        this.price = price
        this.noOfPieces = noOfPieces
        this.serves = serves
        this.type = type
        this.categoryName = categoryName
        this.parentId = parentId
        this.weight = weight
        this.arProductName = arProductName
        this.arDescription = arDescription
    }

    public static createFromObject(data: any) {
        return new FavoritesDomain(data.id, data.productId, data.userId, data.$extras ? data.$extras.name : '', data.$extras ? data.$extras.image : '', data.$extras ? data.$extras.active : '', data.createdAt, data.updatedAt,
            data.$extras ? data.$extras.description : '', data.$extras ? data.$extras.is_stock : '', data.$extras ? data.$extras.category_id : '', data.$extras ? data.$extras.price : '', data.$extras ? data.$extras.no_of_pieces : '',
            data.$extras ? data.$extras.serves : '', data.$extras ? data.$extras.type : '', data.$extras ? data.$extras.categoryName : '',
            data.$extras ? data.$extras.parent_id : '', data.$extras ? data.$extras.weight : '', data.$extras ? data.$extras.ar_product_name : '', data.$extras ? data.$extras.ar_description : '')
    }

    public static createFromArrOfObject(data: any) {
        // console.log("data=?",data)
        return data.map((el) => {
            return new FavoritesDomain(el.id, el.productId, el.userId, el.$extras ? el.$extras.name : '', el.$extras ? el.$extras.image : '', el.$extras ? el.$extras.active : '', el.createdAt, el.updatedAt,
                el.$extras ? el.$extras.description : '', el.$extras ? el.$extras.is_stock : '', el.$extras ? el.$extras.category_id : '', el.$extras ? el.$extras.price : '', el.$extras ? el.$extras.no_of_pieces : '',
                el.$extras ? el.$extras.serves : '', el.$extras ? el.$extras.type : '', el.$extras ? el.$extras.categoryName : '', el.$extras ? el.$extras.parent_id : '', el.$extras ? el.$extras.weight : '', el.$extras ? el.$extras.ar_product_name : '', el.$extras ? el.$extras.ar_description : '')
        })
    }
} 