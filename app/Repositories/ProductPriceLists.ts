import Exceptions from '../Exceptions'
import ProductPriceList from 'App/Models/ProductPriceList'
import { FAILURE } from "../Data/language";
import Database from '@ioc:Adonis/Lucid/Database';

export default class ProductPriceListsRepo {
    static async create(data: any, language: string) {
        const result = await ProductPriceList.create(data)
        if (!result) throw Exceptions.notFound(FAILURE.PRODUCT_PRICE_LIST_CREATE[language])
        return result
    }

    static async update(id: number, data: any, language: string) {
        try {
            const productPriceList = await ProductPriceList.findOrFail(id)
            productPriceList.merge(data)
            await productPriceList.save()

            return productPriceList
        } catch (error) {            
            throw Exceptions.conflict(FAILURE.PRODUCT_PRICE_LIST_CONFLICT[language])
        }
    }
    static async adminupdate(id: number, data: any, language: string) {
        try {
            const productresult = await Database.rawQuery(`SELECT * FROM product_price_lists where price_list_name_id = (${id}) and product_id=(${data.productId}) and id = (${data.id})`)
            if (productresult[0].length == 0) {
                const updateresults = await Database.rawQuery(`INSERT INTO product_price_lists (product_id,price,price_list_name_id, stock, offer_price) values ((${data.productId}),(${data.price}),(${id}), (${data.stock}), (${data.offerPrice}))`)
                // console.log(updateresults, "insert", `INSERT INTO product_price_lists (product_id,price,price_list_name_id) values ((${data.productId}),(${data.price}),(${id}))`);
            } else {
                const updateresult = await Database.rawQuery(`UPDATE product_price_lists SET stock=(${data.stock}), offer_price=(${data.offerPrice}), price=(${data.price}) where product_id = (${data.productId}) and price_list_name_id =(${id}) and id = (${data.id})`)
                // console.log(updateresult, "update", `UPDATE product_price_lists SET price=(${data.price}) where product_id = (${data.productId}) and price_list_name_id =(${id})`);
            }
            return productresult[0]
        } catch (error) {
            throw Exceptions.conflict(FAILURE.PRODUCT_PRICE_LIST_CONFLICT[language])
        }
    }

    static async get(userId) {
        const result = await ProductPriceList.query()
            .if(userId, (query) =>
                query.where('userId', userId))
        return result
    }

    static async delete(data: any, ProductPriceList, language: string) {
        ProductPriceList.active = data.active
        await ProductPriceList.save()
        if (!ProductPriceList.$isPersisted)
            throw Exceptions.notFound(FAILURE.PRODUCT_PRICE_LIST_DELETE_CONFLICT[language])
        return ProductPriceList
    }

    static async isEntryExist(id: number, language: string) {
        const result = await ProductPriceList.query().where('id', id).first()
        if (!result) throw Exceptions.notFound(FAILURE.PRODUCT_PRICE_LIST_CONFLICT[language])
        return result
    }

    static async checkProductPriceList(productId: number, priceListNameId: number, language: string) {
        const result = await ProductPriceList.query()
            .where('product_id', productId)
            .where('price_list_name_id', priceListNameId)
        if (result.length == 0) {
            return result
        } else {
            throw Exceptions.notFound(FAILURE.PRODUCT_PRICE_LIST_ALREADY_ADDED[language])
        }
    }

    static async adminGet(priceListId, type) {
        const result = await Database.rawQuery(`SELECT products.type,products.id as productId,products.is_basket as isBasket,products.en_product_name, products.ar_product_name, products.sold_type as soldType, products.name,products.weight,product_price_lists.id , product_price_lists.stock, product_price_lists.offer_price as offer_price ,product_price_lists.price_list_name_id as priceListNameId, COALESCE(product_price_lists.price,0 ) as price FROM products LEFT  JOIN product_price_lists ON products.id = product_price_lists.product_id and product_price_lists.price_list_name_id=(${priceListId}) where products.active=1 AND products.type="${type}"`)

        // .from('products')
        // .select('products.name')
        // .select('product_price_lists.id')
        // .innerJoin('product_price_lists', 'products.id', 'product_price_lists.product_id')
        // .if(priceListId, (query) =>
        //     query.where('product_price_lists.price_list_name_id', priceListId))
        // .if(type, (query) =>
        //     query.where('products.type', type))
        // .if(active, (query) =>
        //     query.where('products.active', active))
        // .if(searchValue, (query) =>
        //     query.whereILike('products.name', searchValue))
        // .if(offset && limit, (query) => {
        //     query.forPage(offset, limit)
        // })
        // .if(orderBy && orderByValue, (query) => {
        //     query.orderBy(orderBy, orderByValue)
        // })
        // .debug(true)
        return result[0]
    }

    static async stockUpdate(id: number, data: any, language: string) {
        try {
            const productPriceList = await ProductPriceList.findOrFail(id)
            productPriceList.merge(data)
            await productPriceList.save()

            return productPriceList
        } catch (error) {
            throw Exceptions.conflict(FAILURE.PRODUCT_PRICE_LIST_CONFLICT[language])
        }
    }

}
