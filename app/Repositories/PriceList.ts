import Exceptions from '../Exceptions'
import PriceList from 'App/Models/PriceList'
import { FAILURE } from "../Data/language";

export default class PriceListRepo {
    static async create(data: any, language: string) {
        const result = await PriceList.create(data)
        if (!result) throw Exceptions.notFound(FAILURE.PRICE_LIST_CREATE[language])
        return result
    }

    static async update(id: number, data: any, language: string) {
        try {
            const priceList = await PriceList.findOrFail(id)
            priceList.merge(data)
            await priceList.save()

            return priceList
        } catch (error) {
            throw Exceptions.conflict(FAILURE.PRICE_LIST_CONFLICT[language])
        }
    }

    static async get(type) {
        const result = await PriceList.query().where('active', 1)
            .if(type, (query) =>
                query.where('type', type))
        return result
    }

    static async delete(data: any, PriceList, language: string) {
        PriceList.active = data.active
        await PriceList.save()
        if (!PriceList.$isPersisted)
            throw Exceptions.notFound(FAILURE.PRICE_LIST_DELETE_CONFLICT[language])
        return PriceList
    }

    static async isEntryExist(id: number, language: string) {
        const result = await PriceList.query().where('id', id).first()
        if (!result) throw Exceptions.notFound(FAILURE.PRICE_LIST_CONFLICT[language])
        return result
    }

    static async adminGet(type, active) {
        const result = await PriceList.query()
            .if(type, (query) =>
                query.where('type', type))
            .if(active, (query) =>
                query.where('active', active))
        return result
    }

}
