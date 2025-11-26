import Exceptions from '../Exceptions'
import Zone from 'App/Models/Zone'
import { FAILURE } from "../Data/language";

export default class ZoneRepo {
    static async create(data: any, language: string) {
        const result = await Zone.create(data)
        if (!result) throw Exceptions.notFound(FAILURE.ZONE_CREATE[language])
        return result
    }

    static async update(id: number, data: any, language: string) {
        try {
            const zone = await Zone.findOrFail(id)
            zone.merge(data)
            await zone.save()

            return zone
        } catch (error) {
            throw Exceptions.conflict(FAILURE.ZONE_CONFLICT[language])
        }
    }

    static async get(type) {
        const result = await Zone.query().where('active', 1)
            .if(type, (query) =>
                query.where('type', type))
        return result
    }

    static async delete(data: any, Zone, language: string) {
        Zone.active = data.active
        await Zone.save()
        if (!Zone.$isPersisted)
            throw Exceptions.notFound(FAILURE.ZONE_DELETE_CONFLICT[language])
        return Zone
    }

    static async isEntryExist(id: number, language: string) {
        const result = await Zone.query().where('id', id).first()
        if (!result) throw Exceptions.notFound(FAILURE.ZONE_CONFLICT[language])
        return result
    }

    static async adminGet(active, orderBy, orderByValue, searchValue, offset, limit) {
        const result = await Zone.query()
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
