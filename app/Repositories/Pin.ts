import Exceptions from '../Exceptions'
import Pin from 'App/Models/Pin'
import { FAILURE } from "../Data/language";

export default class ZoneRepo {
    static async create(data: any, language: string) {
        const result = await Pin.create(data)
        if (!result) throw Exceptions.notFound(FAILURE.PIN_CREATE[language])
        return result
    }

    static async update(id: number, data: any, language: string) {
        try {
            const pin = await Pin.findOrFail(id)
            pin.merge(data)
            await pin.save()

            return pin
        } catch (error) {
            throw Exceptions.conflict(FAILURE.PIN_CONFLICT[language])
        }
    }

    static async get(type) {
        const result = await Pin.query().where('active', 1)
            .if(type, (query) =>
                query.where('type', type))
        return result
    }

    static async delete(data: any, Pin, language: string) {
        Pin.active = data.active
        await Pin.save()
        if (!Pin.$isPersisted)
            throw Exceptions.notFound(FAILURE.PIN_DELETE_CONFLICT[language])
        return Pin
    }

    static async isEntryExist(id: number, language: string) {
        const result = await Pin.query().where('id', id).first()
        if (!result) throw Exceptions.notFound(FAILURE.PIN_CONFLICT[language])
        return result
    }

    static async adminGet(active, orderBy, orderByValue, searchValue, offset, limit, areaId) {
        const result = await Pin.query()
            .if(active, (query) =>
                query.where('active', active))
            .if(searchValue, (query) =>
                query.whereILike('name', searchValue))
            .if(areaId, (query) =>
                query.whereILike('areaId', areaId))
            .if(offset && limit, (query) => {
                query.forPage(offset, limit)
            })
            .if(orderBy && orderByValue, (query) => {
                query.orderBy(orderBy, orderByValue)
            })
        return result
    }

}
