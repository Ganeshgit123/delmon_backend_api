
export default class ProductDomain {
    public readonly id: number
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
    public readonly recipiesId: string
    public readonly isBasket: boolean
    public readonly basketProductList: string
    public readonly isFavorites: number
    public readonly enProductName: string
    public readonly arProductName: string
    public readonly soldType: number
    public readonly mostWantedProduct: boolean
    public readonly offers: boolean
    public readonly newProduct: boolean
    public readonly cartonActive: boolean
    public readonly piecesActive: boolean
    public readonly subDescription: string
    public readonly enName: string
    public readonly arName: string
    public readonly vat: number
    public readonly arDescription: string
    public readonly offerPrice: number
    public readonly normalPrice: number
    public readonly stock: number


    private constructor(id: number, name: string, image: string, active: boolean, createdAt: string, updatedAt: string, description: string,
        isStock: number, categoryId: number, price: number, noOfPieces: number, serves: string, type: string,
        categoryName: string, parentId: number, weight: string, recipiesId: string, isBasket: boolean,
        basketProductList: string, isFavorites: number, enProductName: string, arProductName: string, soldType: number,
        mostWantedProduct: boolean, offers: boolean, newProduct: boolean, cartonActive: boolean, piecesActive: boolean,
        subDescription: string, enName: string, arName: string, vat: number, arDescription: string,
        offerPrice: number, normalPrice: number, stock: number) {

        this.id = id
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
        this.recipiesId = recipiesId
        this.isBasket = isBasket
        this.basketProductList = basketProductList
        this.isFavorites = isFavorites
        this.enProductName = enProductName
        this.arProductName = arProductName
        this.soldType = soldType
        this.mostWantedProduct = mostWantedProduct
        this.offers = offers
        this.newProduct = newProduct
        this.cartonActive = cartonActive
        this.piecesActive = piecesActive
        this.subDescription = subDescription
        this.enName = enName
        this.arName = arName
        this.vat = vat
        this.arDescription = arDescription
        this.offerPrice = offerPrice
        this.normalPrice = normalPrice
        this.stock = stock
    }

    public static createFromObject(data: any) {
        return new ProductDomain(data.id, data.name, data.image, data.active, data.createdAt, data.updatedAt,
            data.description, data.isStock, data.categoryId, data.$extras ? data.$extras.productPrice : '', data.noOfPieces, data.serves, data.type,
            data.$extras ? data.$extras.categoryName : '', data.parentId, data.weight, data.recipiesId,
            data.isBasket, data.basketProductList, 0, data.enProductName, data.arProductName, data.soldType,
            data.mostWantedProduct, data.offers, data.newProduct, data.cartonActive, data.piecesActive,
            data.subDescription, data.$extras ? data.$extras.enName : '', data.$extras ? data.$extras.arName : '',
            data.$extras ? data.$extras.vat : '', data.arDescription, data.$extras.offerPrice, data.$extras ? data.$extras.productPrice : '',
            data.$extras.stockCount
        )
    }

    public static createFromArrOfObject(data: any) {

        return data.map((el) => {
            let price = el.offerPrice == 0 ? el.$extras.productPrice : el.$extras.offerPrice
            let isFavorites = el.$extras.favId == null ? 0 : 1
            // console.log("el=>",isFavorites)
            return new ProductDomain(el.id, el.name, el.image, el.active, el.createdAt, el.updatedAt,
                el.description, el.isStock, el.categoryId, el.$extras.cartPrice, el.noOfPieces, el.serves, el.type,
                el.$extras ? el.$extras.categoryName : '', el.parentId, el.weight, el.recipiesId,
                el.isBasket, el.basketProductList, isFavorites, el.enProductName, el.arProductName, el.soldType,
                el.mostWantedProduct, el.offers, el.newProduct, el.cartonActive, el.piecesActive,
                el.subDescription, el.$extras ? el.$extras.enName : '', el.$extras ? el.$extras.arName : '',
                el.$extras ? el.$extras.vat : '', el.arDescription, el.$extras.offerPrice, el.$extras ? el.$extras.productPrice : '',
                el.$extras.stockCount
            )
        })
    }
} 