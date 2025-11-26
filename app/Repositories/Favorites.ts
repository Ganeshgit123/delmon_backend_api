import Exceptions from '../Exceptions'
import Favorite from 'App/Models/Favorite'
import { FAILURE } from "../Data/language";
import Database from '@ioc:Adonis/Lucid/Database'

export default class FavoritesRepo {

    static async create(data: any, language) {
        await delete data.isFavorites

        const result = await Favorite.create(data)
        if (!result) throw Exceptions.notFound(FAILURE.FAQ_CREATE[language])
        return result
    }

    static async delete(postId: number, userId: number, language) {
        try {
            const result = await Favorite.query().where('productId', postId).where('userId', userId).delete()

            return result
        } catch (error) {
            throw Exceptions.conflict(FAILURE.FAVORITE_CONFLICT[language])
        }
    }

    static async get(userId, priceListNameId, type) {
        const result = await Favorite.query()
            .select('products.*')
            .select('categories.en_name as categoryName')
            .select('favorites.user_id as userId', 'favorites.product_id as productId')
            .select('product_price_lists.price')
            .innerJoin('products', 'products.id', 'favorites.product_id')
            .innerJoin('categories', 'products.category_id', 'categories.id')
            .innerJoin('product_price_lists', 'products.id', 'product_price_lists.product_id')
            .if(priceListNameId, (query) =>
                query.where('product_price_lists.price_list_name_id', priceListNameId))
            .where('favorites.user_id', userId)
            .if(type, (query) => query.where('favorites.type', type))
        return result
    }

    static async getFavorites(userId) {
        const result = await Favorite.query()
            .where('user_id', userId)
        return result
    }

    static async isEntryExist(userId: number, productId: number, language) {
        const result = await Favorite.query()
            .where('user_id', userId)
            .where('product_id', productId)
        if (!result) throw Exceptions.notFound(FAILURE.FAVORITE_CONFLICT[language])
        return result
    }

    static async mostFavoritesProduct(type) {
        const result = await Database.rawQuery(`SELECT p.en_product_name,p.ar_product_name,f.product_id AS productId, COUNT(f.product_id) AS productCount
        FROM favorites f
        JOIN products p ON p.id = f.product_id
        where f.type = '${type}'
        GROUP BY f.product_id
        ORDER BY productCount DESC;`)
        return result[0]
    }

    static async mostWantedAddress() {
        const result = await Database.rawQuery(`SELECT a.*, COUNT(o.delivery_address_id) AS addressCount
        FROM addresses a
        JOIN orders o ON o.delivery_address_id = a.id
        GROUP BY o.delivery_address_id
        ORDER BY addressCount DESC;`)
        return result[0]
    }
}
