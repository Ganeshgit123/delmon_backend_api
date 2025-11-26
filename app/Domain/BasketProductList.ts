
export default class BasketProductListDomain {
    public readonly id: number
    public readonly basketId: number
    public readonly basketName: string
    public readonly productId: number
    public readonly createdAt: string
    public readonly updatedAt: string
    public readonly userId: string
    public readonly name: string
    public readonly image: string
    public readonly active: boolean
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
    public readonly enProductName: string
    public readonly arProductName: string

    private constructor(id: number, basketId: number, basketName: string, productId: number, createdAt: string, updatedAt: string,
        userId: string, name: string, image: string, active: boolean,
        description: string, isStock: number, categoryId: number, price: number,
        noOfPieces: number, serves: string, type: string, categoryName: string, parentId: number, weight: string,
        enProductName: string, arProductName: string) {

        this.id = id
        this.basketId = basketId
        this.basketName = basketName
        this.productId = productId
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.userId = userId
        this.name = name
        this.image = image
        this.active = active
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
        this.enProductName = enProductName
        this.arProductName = arProductName
    }

    public static createFromObject(data: any) {
        return new BasketProductListDomain(data.id, data.$extras ? data.$extras.basketId : '', data.$extras ? data.$extras.basketName : '', data.productId, data.createdAt, data.updatedAt,
            data.userId, data.$extras ? data.$extras.name : '', data.$extras ? data.$extras.image : '', data.$extras ? data.$extras.active : '',
            data.$extras ? data.$extras.description : '', data.$extras ? data.$extras.is_stock : '', data.$extras ? data.$extras.category_id : '', data.$extras ? data.$extras.price : '', data.$extras ? data.$extras.no_of_pieces : '',
            data.$extras ? data.$extras.serves : '', data.$extras ? data.$extras.type : '', data.$extras ? data.$extras.categoryName : '', data.$extras ? data.$extras.parent_id : '', data.$extras ? data.$extras.weight : '',
            data.$extras ? data.$extras.en_product_name : '', data.$extras ? data.$extras.ar_product_mame : '')
    }

    public static createFromArrOfObject(data: any) {        
        return data.map((el) => {
            return new BasketProductListDomain(el.$extras ? el.$extras.basketProductListId : el.id, el.basketId, el.$extras ? el.$extras.basketName : '', el.$extras ? el.$extras.productId : '', el.createdAt, el.updatedAt,
                el.userId, el.$extras ? el.$extras.name : '', el.$extras ? el.$extras.image : '', el.$extras ? el.$extras.active : '',
                el.$extras ? el.$extras.description : '', el.$extras ? el.$extras.is_stock : '', el.$extras ? el.$extras.category_id : '', el.$extras ? el.$extras.price : '', el.$extras ? el.$extras.no_of_pieces : '',
                el.$extras ? el.$extras.serves : '', el.$extras ? el.$extras.type : '', el.$extras ? el.$extras.categoryName : '', el.$extras ? el.$extras.parent_id : '', el.$extras ? el.$extras.weight : '',
                el.$extras ? el.$extras.en_product_name : '', el.$extras ? el.$extras.ar_product_name : '')
        })
    }
} 