
export default class CartDomain {
    public readonly id: number
    public readonly userId: string
    public readonly productId: string
    public readonly quantity: boolean
    public readonly deliveryAddressId: number
    public readonly orderId: number
    public readonly createdAt: string
    public readonly updatedAt: string
    public readonly name: string
    public readonly image: string
    public readonly price: number
    public readonly isStock: number
    public readonly categoryId: string
    public readonly subCategoryId: boolean
    public readonly type: string
    public readonly parentId: number
    public readonly weight: string
    public readonly enProductName: string
    public readonly arProductName: string
    public readonly categoryName: string
    public readonly vat: number
    public readonly cartonActive: boolean
    public readonly piecesActive: boolean
    public readonly noOfPieces: number
    public readonly stock: number
    public readonly productPriceListId: number

    private constructor(id: number, userId: string, productId: string, quantity: boolean,
        deliveryAddressId: number, orderId: number, createdAt: string, updatedAt: string,
        name: string, image: string, price: number, isStock: number, categoryId: string, subCategoryId: boolean,
        type: string, parentId: number, weight: string, enProductName: string, arProductName: string,
        categoryName: string, vat: number, cartonActive: boolean, piecesActive: boolean,
        noOfPieces: number, stock: number, productPriceListId: number) {

        this.id = id
        this.userId = userId
        this.productId = productId
        this.quantity = quantity
        this.deliveryAddressId = deliveryAddressId
        this.orderId = orderId
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.name = name
        this.image = image
        this.price = price
        this.isStock = isStock
        this.categoryId = categoryId
        this.subCategoryId = subCategoryId
        this.type = type
        this.parentId = parentId
        this.weight = weight
        this.enProductName = enProductName
        this.arProductName = arProductName
        this.categoryName = categoryName
        this.vat = vat
        this.cartonActive = cartonActive
        this.piecesActive = piecesActive
        this.noOfPieces = noOfPieces
        this.stock = stock
        this.productPriceListId = productPriceListId
    }

    public static createFromObject(data: any) {
        return new CartDomain(data.id, data.userId, data.productId, data.quantity,
            data.deliveryAddressId, data.orderId, data.createdAt, data.updatedAt,
            data.$extras ? data.$extras.name : '', data.$extras ? data.$extras.image ? JSON.parse(data.$extras.image) : '' : '', data.$extras ? data.$extras.price : data.price,
            data.$extras ? data.$extras.isStock : '', data.$extras ? data.$extras.category_id : '', data.$extras ? data.$extras.sub_category_id : '', data.type,
            data.parentId, data.weight, data.$extras ? data.$extras.en_product_name : '', data.$extras ? data.$extras.ar_product_name : '',
            data.categoryName, data.vat, data.$extras ? data.$extras.cartonActive : '', data.$extras ? data.$extras.piecesActive : '',
            data.$extras.no_of_pieces, data.stock, data.productPriceListId)
    }

    public static createFromArrOfObject(data: any) {
        return data.map((el) => {
                let price = el.$extras.offerPrice == 0 ? el.$extras.productPrice : el.$extras.offerPrice
            return new CartDomain(el.$extras.cartId, el.$extras.userId, el.$extras.productId, el.quantity,
                el.$extras ? el.deliveryAddressId : '', el.$extras.orderId, el.createdAt, el.updatedAt,
                el.$extras ? el.$extras.name : '', el.$extras ? el.$extras.image : "", price,
                el.$extras ? el.$extras.isStock : '', el.$extras ? el.$extras.category_id : '', el.$extras ? el.$extras.sub_category_id : '', el.type,
                el.parentId, el.$extras ? el.$extras.weight : '', el.$extras ? el.$extras.en_product_name : '', el.$extras ? el.$extras.ar_product_name : '',
                el.$extras ? el.$extras.categoryName : '', el.$extras ? el.$extras.vat : '', el.$extras ? el.$extras.carton_active : '', el.$extras ? el.$extras.pieces_active : '',
                el.$extras.no_of_pieces, el.$extras.stock, el.$extras.productPriceListId)
  
        })
    }
} 