import Exceptions from '../Exceptions'
import Setting from 'App/Models/Setting'
import { FAILURE } from "../Data/language";

export default class BannerRepo {
    static async create(data: any, language: string) {
        const result = await Setting.create(data)
        if (!result) throw Exceptions.notFound(FAILURE.BANNER_CREATE[language])
        return result
    }

    static async update(id: number, data: any, language: string) {
        try {
            const setting = await Setting.findOrFail(id)
            setting.merge(data)
            await setting.save()

            return setting
        } catch (error) {
            throw Exceptions.conflict(FAILURE.BANNER_CONFLICT[language])
        }
    }

    static async get() {
        const result = await Setting.query().where('active', 1)
        return result
    }

    static async getById(id?: number) {
        if (typeof id !== 'undefined' && id !== null) {
            const result = await Setting.query()
                .where('id', id)
                .andWhere('active', 1)
                .first()
            return result
        }
    }

    static async delete(data: any, Setting, language: string) {
        Setting.active = data.active
        await Setting.save()
        if (!Setting.$isPersisted)
            throw Exceptions.notFound(FAILURE.BANNER_DELETE_CONFLICT[language])
        return Setting
    }

    static async isEntryExist(id: number, language: string) {
        const result = await Setting.query().where('id', id).first()
        if (!result) throw Exceptions.notFound(FAILURE.BANNER_CONFLICT[language])
        return result
    }

    static async adminGet(active) {
        const result = await Setting.query()
            .if(active, (query) =>
                query.where('active', active))
        return result
    }

}
