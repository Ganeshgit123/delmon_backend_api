import Exceptions from '../Exceptions'
import Recipy from 'App/Models/Recipy'
import { FAILURE } from "../Data/language";

export default class RecipiesRepo {
    static async create(data: any, language: string) {
        const result = await Recipy.create(data)
        if (!result) throw Exceptions.notFound(FAILURE.RECIPY_CREATE[language])
        return result
    }

    static async update(id: number, data: any, language: string) {
        try {
            const recipies = await Recipy.findOrFail(id)
            recipies.merge(data)
            await recipies.save()

            return recipies
        } catch (error) {
            throw Exceptions.conflict(FAILURE.RECIPY_CONFLICT[language])
        }
    }

    static async get(categoryId, recipiesId) {
        const result = await Recipy.query().where('active', 1)
            // .if(type, (query) =>
            //     query.where('type', type))
            .if(categoryId, (query) =>
                query.where('category_id', categoryId))
            .if(recipiesId, (query) =>
                query.whereIn('id', recipiesId))
        return result
    }

    static async getRecipy(categoryId) {
        const result = await Recipy.query().where('active', 1)
            // .if(type, (query) =>
            //     query.where('type', type))
            .if(categoryId, (query) =>
                query.where('category_id', categoryId))
        // .if(recipiesId, (query) =>
        //     query.where('id', recipiesId))
        return result
    }

    static async delete(data: any, Recipies, language: string) {
        Recipies.active = data.active
        await Recipies.save()
        if (!Recipies.$isPersisted)
            throw Exceptions.notFound(FAILURE.RECIPY_DELETE_CONFLICT[language])
        return Recipies
    }

    static async isEntryExist(id: number, language: string) {
        const result = await Recipy.query().where('id', id).first()
        if (!result) throw Exceptions.notFound(FAILURE.RECIPY_CONFLICT[language])
        return result
    }

    static async adminGet(type, active, orderBy, orderByValue, searchValue, offset, limit) {
        const result = await Recipy.query()
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
