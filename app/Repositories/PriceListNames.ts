import Exceptions from '../Exceptions'
import PriceListName from 'App/Models/PriceListName'
import { FAILURE } from "../Data/language";

export default class PriceListNamesRepo {
    static async create(data: any, language: string) {
        const result = await PriceListName.create(data)
        if (!result) throw Exceptions.notFound(FAILURE.PRICE_LIST_NAME_CREATE[language])
        return result
    }

    static async update(id: number, data: any, language: string) {
        try {
            const basket = await PriceListName.findOrFail(id)
            basket.merge(data)
            await basket.save()

            return basket
        } catch (error) {
            throw Exceptions.conflict(FAILURE.PRICE_LIST_NAME_CONFLICT[language])
        }
    }

    static async get(userId) {
        const result = await PriceListName.query()
            .if(userId, (query) =>
                query.where('userId', userId))
        return result
    }

    static async delete(data: any, Basket, language: string) {
        Basket.active = data.active
        await Basket.save()
        if (!Basket.$isPersisted)
            throw Exceptions.notFound(FAILURE.PRICE_LIST_NAME_DELETE_CONFLICT[language])
        return Basket
    }

    static async isEntryExist(id: number, language: string) {
        const result = await PriceListName.query().where('id', id).first()
        if (!result) throw Exceptions.notFound(FAILURE.PRICE_LIST_NAME_CONFLICT[language])
        return result
    }

    static async checkPriceListName(name: string, language: string) {
        const result = await PriceListName.query()
            .where('name', name)
        if (result.length == 0) {
            return result
        } else {
            throw Exceptions.notFound(FAILURE.PRICE_LIST_NAME_ALREADY_ADDED[language])
        }
    }

    static async adminGet(type, active, orderBy, orderByValue, searchValue, offset, limit) {
        const result = await PriceListName.query()
            .if(type, (query) =>
                query.where('type', type))
            .if(active, (query) =>
                query.where('active', active))
            .if(searchValue, (query) =>
                query.whereILike('name', searchValue))
            .if(offset && limit, (query) => {
                query.forPage(offset, limit)
            })
            .if(orderBy && orderByValue, (query) => {
                query.orderBy(orderBy, orderByValue)
            })
        return result
    }

}
