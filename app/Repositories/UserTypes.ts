import Exceptions from '../Exceptions'
import UserType from 'App/Models/UserType'
import { FAILURE } from "../Data/language";

export default class UserTypesRepo {
    static async create(data: any, language: string) {
        const result = await UserType.create(data)
        if (!result) throw Exceptions.notFound(FAILURE.USER_TYPE_CREATE[language])
        return result
    }

    static async update(id: number, data: any, language: string) {
        try {
            const userType = await UserType.findOrFail(id)
            userType.merge(data)
            await userType.save()

            return userType
        } catch (error) {
            throw Exceptions.conflict(FAILURE.USER_TYPE_CONFLICT[language])
        }
    }

    static async get(userId) {
        const result = await UserType.query()
            .select('Price_list_names.name as PriceListNames')
            .innerJoin('Price_list_names', 'Price_list_names.id', 'user_type.price_list_name_id')
            .if(userId, (query) =>
                query.where('userId', userId))
        return result
    }

    static async getUserType(userType) {
        const result = await UserType.query()
            .if(userType, (query) =>
                query.where('name', userType))
        return result.length != 0 ? result[0].priceListNameId : 7
    }

    static async delete(data: any, UserType, language: string) {
        UserType.active = data.active
        await UserType.save()
        if (!UserType.$isPersisted)
            throw Exceptions.notFound(FAILURE.USER_TYPE_DELETE_CONFLICT[language])
        return UserType
    }

    static async isEntryExist(id: number, language: string) {
        const result = await UserType.query().where('id', id).first()
        if (!result) throw Exceptions.notFound(FAILURE.USER_TYPE_CONFLICT[language])
        return result
    }

    static async checkUserType(name: string, language: string) {
        const result = await UserType.query()
            .where('name', name)
        if (result.length == 0) {
            return result
        } else {
            throw Exceptions.notFound(FAILURE.USER_TYPE_NAME_ALREADY_ADDED[language])
        }
    }

    static async adminGet(type, active, orderBy, orderByValue, searchValue, offset, limit) {
        const result = await UserType.query()
            .select('user_types.*')
            .select('price_list_names.name as priceListNames')
            .innerJoin('price_list_names', 'price_list_names.id', 'user_types.price_list_name_id')
            .if(type, (query) =>
                query.where('type', type))
            .if(active, (query) =>
                query.where('active', active))
            .if(searchValue, (query) =>
                query.whereILike('user_types.name', searchValue))
            .if(offset && limit, (query) => {
                query.forPage(offset, limit)
            })
            .if(orderBy && orderByValue, (query) => {
                query.orderBy(orderBy, orderByValue)
            })
        return result
    }

}
