import Exceptions from '../Exceptions'
import BasketProductList from 'App/Models/BasketProductList'
import { FAILURE } from "../Data/language";
import Product from 'App/Models/Product';

export default class BasketProductListsRepo {
    static async create(data: any, language: string) {
        const result = await BasketProductList.create(data)
        if (!result) throw Exceptions.notFound(FAILURE.BASKET_PRODUCT_CREATE[language])
        return result
    }

    static async update(id: number, data: any, language: string) {
        try {
            const basket = await BasketProductList.findOrFail(id)
            basket.merge(data)
            await basket.save()

            return basket
        } catch (error) {
            throw Exceptions.conflict(FAILURE.BASKET_PRODUCT_CONFLICT[language])
        }
    }

    static async checkBasketProduct(basketId: number, productId: number, language: string) {
        const result = await BasketProductList.query()
            .where('basket_id', basketId)
            .where('product_id', productId)
        if (result.length == 0) {
            return result
        } else {
            throw Exceptions.notFound(FAILURE.BASKET_PRODUCT_ALREADY_ADDED[language])
        }
    }

    static async get(basketId, priceListNameId) {
        const result = await BasketProductList.query()
            .select('products.*')
            .select('product_price_lists.price')
            .select('baskets.name as basketName', 'baskets.id as basketId')
            .select('basket_product_lists.product_id as productId', 'basket_product_lists.id as basketProductListId')
            .select('categories.en_name as categoryName')
            .innerJoin('products', 'products.id', 'basket_product_lists.product_id')
            .innerJoin('categories', 'products.category_id', 'categories.id')
            .innerJoin('baskets', 'basket_product_lists.basket_id', 'baskets.id')
            .innerJoin('product_price_lists', 'products.id', 'product_price_lists.product_id')
            .if(priceListNameId, (query) =>
                query.where('product_price_lists.price_list_name_id', priceListNameId))
            .if(basketId, (query) =>
                query.where('basketId', basketId))
        return result
    }

    static async getBasketFromProduct(productId, priceListNameId) {        
        const result = await Product.query()
            .select('products.*')
            .select('product_price_lists.price')
            .select('categories.en_name as categoryName')
            .innerJoin('categories', 'products.category_id', 'categories.id')
            .innerJoin('product_price_lists', 'products.id', 'product_price_lists.product_id')
            .if(priceListNameId, (query) =>
                query.where('product_price_lists.price_list_name_id', priceListNameId))
            .if(productId, (query) =>
                query.whereIn('products.id', JSON.parse(productId)))
            .if(productId, (query) =>
                query.whereIn('product_price_lists.product_id', JSON.parse(productId)))
        return result
    }

    static async delete(data: any, Basket, language: string) {
        Basket.active = data.active
        await Basket.save()
        if (!Basket.$isPersisted)
            throw Exceptions.notFound(FAILURE.BASKET_PRODUCT_DELETE_CONFLICT[language])
        return Basket
    }

    static async isEntryExist(id: number, language: string) {
        const result = await BasketProductList.query().where('id', id).first()
        if (!result) throw Exceptions.notFound(FAILURE.BASKET_PRODUCT_CONFLICT[language])
        return result
    }

    static async adminGet(type, active, orderBy, orderByValue, searchValue, offset, limit) {
        const result = await BasketProductList.query()
            .if(type, (query) =>
                query.where('type', type))
            .if(active, (query) =>
                query.where('active', active))
            .if(searchValue, (query) =>
                query.whereILike('banners.name', searchValue))
            .if(offset && limit, (query) => {
                query.forPage(offset, limit)
            })
            .if(orderBy && orderByValue, (query) => {
                query.orderBy(orderBy, orderByValue)
            })
        return result
    }

}
