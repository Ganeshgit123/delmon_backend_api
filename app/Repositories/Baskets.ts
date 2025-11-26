import Exceptions from '../Exceptions'
import Basket from 'App/Models/Basket'
import { FAILURE } from "../Data/language";

export default class BasketsRepo {
    static async create(data: any, language: string) {
        const result = await Basket.create(data)
        if (!result) throw Exceptions.notFound(FAILURE.BASKET_CREATE[language])
        return result
    }

    static async update(id: number, data: any, language: string) {
        try {
            const basket = await Basket.findOrFail(id)
            basket.merge(data)
            await basket.save()

            return basket
        } catch (error) {
            throw Exceptions.conflict(FAILURE.BASKET_CONFLICT[language])
        }
    }

    static async get(userId) {
        const result = await Basket.query()
            .if(userId, (query) =>
                query.where('userId', userId))
        return result
    }

    static async delete(data: any, Basket, language: string) {
        Basket.active = data.active
        await Basket.save()
        if (!Basket.$isPersisted)
            throw Exceptions.notFound(FAILURE.BASKET_DELETE_CONFLICT[language])
        return Basket
    }

    static async isEntryExist(id: number, language: string) {
        const result = await Basket.query().where('id', id).first()
        if (!result) throw Exceptions.notFound(FAILURE.BASKET_CONFLICT[language])
        return result
    }

    static async checkBasketName(userId: number, enName: string, arName: string, language: string, name) {
        const result = await Basket.query().where('user_id', userId)
            .where('name', name)
            .where('en_name', enName)
            .where('ar_name', arName)
        if (result.length == 0) {
            return result
        } else {
            throw Exceptions.notFound(FAILURE.BASKET_NAME_ALREADY_ADDED[language])
        }
    }

    static async adminGet(type, active, orderBy, orderByValue, searchValue, offset, limit, isBasket) {
        const result = await Basket.query()
            .if(type, (query) =>
                query.where('type', type))
            .if(active, (query) =>
                query.where('active', active))
            .if(isBasket, (query) =>
                query.where('baskets.is_basket', isBasket))
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
