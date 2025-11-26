import Exceptions from '../Exceptions'
import Banner from 'App/Models/Banner'
import { FAILURE } from "../Data/language";

export default class BannerRepo {
    static async create(data: any, language: string) {
        const result = await Banner.create(data)
        if (!result) throw Exceptions.notFound(FAILURE.BANNER_CREATE[language])
        return result
    }

    static async update(id: number, data: any, language: string) {
        try {
            const banner = await Banner.findOrFail(id)
            banner.merge(data)
            await banner.save()

            return banner
        } catch (error) {
            throw Exceptions.conflict(FAILURE.BANNER_CONFLICT[language])
        }
    }

    static async get(type) {
        const result = await Banner.query().where('active', 1)
            .if(type, (query) =>
                query.where('type', type))
        return result
    }

    static async delete(data: any, Banner, language: string) {
        Banner.active = data.active
        await Banner.save()
        if (!Banner.$isPersisted)
            throw Exceptions.notFound(FAILURE.BANNER_DELETE_CONFLICT[language])
        return Banner
    }

    static async isEntryExist(id: number, language: string) {
        const result = await Banner.query().where('id', id).first()
        if (!result) throw Exceptions.notFound(FAILURE.BANNER_CONFLICT[language])
        return result
    }

    static async adminGet(type, active, orderBy, orderByValue, searchValue, offset, limit) {
        const result = await Banner.query()
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
