
export default class ProductPriceListDomain {
    public readonly id: number
    public readonly productId: number
    public readonly price: number
    public readonly priceListNameId: number
    public readonly name: string
    public readonly createdAt: string
    public readonly updatedAt: string
    public readonly stock: number
    public readonly offerPrice: number

    private constructor(id: number, productId: number,
        price: number, priceListNameId: number, name: string, stock: number, offerPrice: number) {

        this.id = id
        this.productId = productId
        this.price = price
        this.priceListNameId = priceListNameId
        this.name = name
        this.stock = stock
        this.offerPrice = offerPrice
      
    }

    public static createFromObject(data: any) {
        return new ProductPriceListDomain(data.id, data.productId,
            data.price, data.priceListNameId, data.name,data.stock, data.offerPrice)
    }

    public static createFromArrOfObject(data: any) {
        return data.map((el) => {
            return new ProductPriceListDomain(el.id, el.productId,
                el.price, el.priceListNameId, el.$extras ? el.$extras.name : '', el.stock, el.offerPrice)
        })
    }
} 