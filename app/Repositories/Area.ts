import Exceptions from '../Exceptions'
import Area from 'App/Models/Area'
import { FAILURE } from "../Data/language";

export default class ZoneRepo {
    static async create(data: any, language: string) {
        const result = await Area.create(data)
        if (!result) throw Exceptions.notFound(FAILURE.AREA_CREATE[language])
        return result
    }

    static async update(id: number, data: any, language: string) {
        try {
            const area = await Area.findOrFail(id)
            area.merge(data)
            await area.save()

            return area
        } catch (error) {
            throw Exceptions.conflict(FAILURE.AREA_CONFLICT[language])
        }
    }

    static async get(type) {
        const result = await Area.query().where('active', 1)
            .if(type, (query) =>
                query.where('type', type))
        return result
    }

    static async getArea(pinId) {
        const result = await Area.query().where('active', 1)
            .if(pinId, (query) =>
                query.where('type', pinId))
        return result
    }

    static async delete(data: any, Area, language: string) {
        Area.active = data.active
        await Area.save()
        if (!Area.$isPersisted)
            throw Exceptions.notFound(FAILURE.AREA_DELETE_CONFLICT[language])
        return Area
    }

    static async isEntryExist(id: number, language: string) {
        const result = await Area.query().where('id', id).first()
        if (!result) throw Exceptions.notFound(FAILURE.AREA_CONFLICT[language])
        return result
    }

    static async adminGet(active, orderBy, orderByValue, searchValue, offset, limit, zoneId) {
        const result = await Area.query()
            .if(active, (query) =>
                query.where('active', active))
            .if(searchValue, (query) =>
                query.whereILike('name', searchValue))
            .if(zoneId, (query) =>
                query.where('zone_id', zoneId))
            .if(offset && limit, (query) => {
                query.forPage(offset, limit)
            })
            .if(orderBy && orderByValue, (query) => {
                query.orderBy(orderBy, orderByValue)
            })
        return result
    }

}
