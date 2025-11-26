import Exceptions from '../Exceptions'
import Category from 'App/Models/Category'
import { FAILURE } from "../Data/language";

export default class CategoryRepo {
    static async create(data: any, language: string) {
        const result = await Category.create(data)
        if (!result) throw Exceptions.notFound(FAILURE.CATEGORY_CREATE[language])
        return result
    }

    static async update(id: number, data: any, language: string) {
        try {
            const category = await Category.findOrFail(id)
            category.merge(data)
            await category.save()

            return category
        } catch (error) {
            throw Exceptions.conflict(FAILURE.CATEGORY_CONFLICT[language])
        }
    }

    static async get(type, userType, employeeType) {
        const result = await Category.query().where('active', 1).where('parentId', 0)
            .if(type, (query) =>
                query.where('type', type))
            .if(userType, (query) =>
                query.where('user_type', userType))
            .if(employeeType, (query) =>
                query.where('employee_type', employeeType))
        return result
    }

    static async getSubCategory(type, categoryId) {
        const result = await Category.query().where('active', 1)
            .if(type, (query) =>
                query.where('type', type))
            .if(categoryId, (query) =>
                query.where('parentId', categoryId))
        return result
    }

    static async delete(data: any, Category, language: string) {
        Category.active = data.active
        await Category.save()
        if (!Category.$isPersisted)
            throw Exceptions.notFound(FAILURE.CATEGORY_DELETE_CONFLICT[language])
        return Category
    }

    static async isEntryExist(id: number, language: string) {
        const result = await Category.query().where('id', id).first()
        if (!result) throw Exceptions.notFound(FAILURE.CATEGORY_CONFLICT[language])
        return result
    }

    static async adminGet(active, type, orderBy, orderByValue, searchValue, offset, limit, parentId) {
        const result = await Category.query()
            .if(type, (query) =>
                query.where('type', type))
            .if(parentId, (query) =>
                query.where('parent_id', parentId))
            .if(active, (query) =>
                query.where('active', active))
            .if(searchValue, (query) =>
                query.whereILike('categories.en_name', searchValue))
            .if(offset && limit, (query) => {
                query.forPage(offset, limit)
            })
            .if(orderBy && orderByValue, (query) => {
                query.orderBy(orderBy, orderByValue)
            })
        return result
    }

}
