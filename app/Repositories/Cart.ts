import Exceptions from '../Exceptions'
import Cart from 'App/Models/Cart'
import { FAILURE } from "../Data/language";
import Database from '@ioc:Adonis/Lucid/Database'

export default class CartRepo {
    static async create(data: any, language: string) {
        const result = await Cart.create(data)
        if (!result) throw Exceptions.notFound(FAILURE.CART_CREATE[language])
        return result
    }

    static async update(id: number, data: any, language: string) {
        try {
            const banner = await Cart.findOrFail(id)
            banner.merge(data)
            await banner.save()

            return banner
        } catch (error) {
            throw Exceptions.conflict(FAILURE.CART_CONFLICT[language])
        }
    }

    static async get(userId, type, priceListNameId) {
        const result = await Cart.query()
            .select('carts.id as cartId', 'user_id as userId', 'carts.product_id as productId', 'carts.quantity', 'carts.price as price', 'carts.delivery_address_id as deliveryAddressId', 'carts.order_id as orderId')
            .select('products.*')
            .select('product_price_lists.offer_price as offerPrice', 'product_price_lists.stock',
                'product_price_lists.id as productPriceListId', 'product_price_lists.price as productPrice')
            .select('categories.en_name as categoryName', 'categories.vat')
            .innerJoin('products', 'products.id', 'carts.product_id')
            .innerJoin('product_price_lists', 'products.id', 'product_price_lists.product_id')
            .innerJoin('categories', 'products.category_id', 'categories.id')
            .if(priceListNameId, (query) =>
                query.where('product_price_lists.price_list_name_id', priceListNameId))
            .where('carts.type', type)
            .where('carts.user_id', userId)
            .where('carts.order_id', 0)
        return result
    }

    static async getCartForCancel(userId, type, priceListNameId, productId) {
        const result = await Cart.query()
            .select('carts.id as cartId', 'user_id as userId', 'carts.product_id as productId', 'carts.quantity', 'carts.price as price', 'carts.delivery_address_id as deliveryAddressId', 'carts.order_id as orderId')
            .select('products.*')
            .select('product_price_lists.price as productPrice', 'product_price_lists.stock',
                'product_price_lists.id as productPriceListId')
            .select('categories.en_name as categoryName', 'categories.vat')
            .innerJoin('products', 'products.id', 'carts.product_id')
            .innerJoin('product_price_lists', 'products.id', 'product_price_lists.product_id')
            .innerJoin('categories', 'products.category_id', 'categories.id')
            .if(priceListNameId, (query) =>
                query.where('product_price_lists.price_list_name_id', priceListNameId))
            .where('carts.type', type)
            .where('carts.user_id', userId)
            .where('carts.order_id', productId)
        return result
    }

    static async isEntryExist(id: number, language: string) {
        const result = await Cart.query().where('id', id).first()
        if (!result) throw Exceptions.notFound(FAILURE.CART_CONFLICT[language])
        return result
    }

    static async checkCart(userId: number, productId: number) {
        const result = await Cart.query().where('user_id', userId)
            .where('product_id', productId)
            .where('order_id', 0)
        return result
        // if (result.length == 0) {
        //     return result
        // } else {
        //     throw Exceptions.notFound(FAILURE.PRODUCT_ALREADY_ADDED[language])
        // }
    }


    static async delete(cardId: number, language) {
        try {
            const result = await Cart.query().where('id', cardId).delete()

            return result
        } catch (error) {
            throw Exceptions.conflict(FAILURE.FAVORITE_CONFLICT[language])
        }
    }

    static async getCartProductCount(userId, productId) {
        let result = await Cart.query()
            .select('product_id', 'quantity', 'id as cartId')
            .where('user_id', userId)
            .whereIn('product_id', productId)
            .where('order_id', 0)
        // .count('* as cartCount')

        return result
    }

    static async getCartCount(userId, type) {

        let result
        if (type == 1) {
            result = await Cart.query()
                .where('user_id', userId)
                .where('type', type)
                .where('order_id', 0)
                .sum('quantity as cartCount')

        } else {
            result = await Cart.query()
                .where('user_id', userId)
                .where('type', type)
                .where('order_id', 0)
                .sum('quantity as cartCount')

        }
        return result[0]['$extras'].cartCount
    }

    static async getCartInfo(userId) {
        const result = await Cart.query()
            .where('order_id', 0)
            .where('user_id', userId)
        return result
    }

    static async getCart(cartId) {
        const result = await Cart.query()
            .select('products.*')
            .select('carts.id as cartId', 'carts.order_id as orderId', 'user_id as userId', 'carts.product_id as productId', 'carts.quantity', 'carts.price', 'carts.delivery_address_id as deliveryAddressId')
            .innerJoin('products', 'products.id', 'carts.product_id')
            .whereIn('carts.id', JSON.parse((cartId)))

        return result
    }

    static async getReOrderCart(cartId) {
        const result = await Cart.query()
            .select('carts.id as cartId', 'user_id as userId', 'carts.product_id as productId', 'carts.quantity', 'carts.price', 'carts.type', 'carts.delivery_address_id as deliveryAddressId')
            .whereIn('carts.id', JSON.parse((cartId)))

        return result
    }

    static async cartUpdate(orderId, cardId) {
        // const result = await Database.rawQuery(`UPDATE carts
        // SET order_id = ${orderId} WHERE id  IN (${cardId});`)        
        const result = await Cart.query().whereIn('id', cardId).update({
            order_id: orderId
        })

        return result[0]
    }

    static async moveGustUserCartToUser(userId, guestUserId) {
        const result = await Cart.query().where('guest_user_id', guestUserId).update({
            user_id: userId
        })

        return result[0]
    }

    static async getMostOrderProduct(type) {
        const result = await Database.rawQuery(`SELECT p.en_product_name,p.ar_product_name,c.product_id AS productId, COUNT(c.product_id) AS productCount
        FROM carts c
        JOIN products p ON p.id = c.product_id
        where c.order_id !=0 AND c.type = '${type}'
        GROUP BY c.product_id
        ORDER BY productCount DESC;`)
        return result[0]
    }

}