import Exceptions from '../Exceptions'
import User from 'App/Models/User'
import { FAILURE } from "../Data/language";
import Database from '@ioc:Adonis/Lucid/Database'

export default class UserRepo {

    static async isEntryExist(id: number, language) {
        const result = await User.query().where('id', id).first()
        if (!result) throw Exceptions.notFound(FAILURE.USER_CONFLICT[language])
        return result
    }

    static async create(data: any, language) {
        const result = await User.create(data)
        if (!result) throw Exceptions.notFound(FAILURE.USER_CREATE[language])
        return result
    }

    static async update(id: number, data: any, language) {
        try {
            const user = await User.findOrFail(id)
            user.merge(data)
            await user.save()

            return user
        } catch (error) {
            console.log(error, 'error')
            throw Exceptions.conflict(FAILURE.USER_CONFLICT[language])
        }
    }

    static async get(id, language) {
        const result = await User.query().where('id', id)
        if (result.length == 0) throw Exceptions.notFound(FAILURE.USER_CONFLICT[language])
        return result
    }

    static async getAll(offset, limit, startDate, endDate, orderBy, orderByValue, userType, searchValue) {
        const result = await User.query()
            .if(userType, (query) => {
                query.where('user_type', userType)
            })
            .if(searchValue, (query) =>
                query.whereILike('users.user_name', searchValue))
            .if(offset && limit, (query) => {
                query.forPage(offset, limit)
            })
            .if(startDate && endDate, (query) => {
                query.whereBetween('created_at', [`${startDate} 00:00:00`, `${endDate} 23:59:00`])
            })
            .if(orderBy && orderByValue, (query) => {
                query.orderBy(orderBy, orderByValue)
            })
        return result
    }

    static async getUserById(userId) {
        const result = await User.query()
            .whereIn('id', userId)
        return result
    }

    static async getUserByUserType(userType) {
        // only fetch active users
        const query = User.query().where('active', 1)
        if (Array.isArray(userType)) {
            query.whereIn('user_type', userType)
        } else {
            query.where('user_type', userType)
        }
        const result = await query
        return result
    }

    static async getUserDetails(ids, language) {
        const result = await User.query().whereIn('id', ids)
        if (result.length == 0) throw Exceptions.notFound(FAILURE.USER_CONFLICT[language])
        return result
    }

    static async userDetails(ids, language) {
        const result = await Database.rawQuery(`SELECT id as uId, first_name as firstName, last_name as lastName  FROM users where id in (${ids})`)
        if (result.length == 0) throw Exceptions.notFound(FAILURE.USER_CONFLICT[language])
        return result[0]
    }

    static async reportUserDetails(ids, language) {
        const result = await Database.rawQuery(`SELECT id as uId, first_name as postUserFirstName, last_name as postUserLastName  FROM users where id in (${ids})`)
        if (result.length == 0) throw Exceptions.notFound(FAILURE.USER_CONFLICT[language])
        return result[0]
    }

    static async checkUser(id: number) {
        const result = await User.query().where('id', id).first()
        if (!result) throw Exceptions.notFound('userId not found')
        return result
    }

    static async loyaltyPointUpdate(userId, loyaltyPoint, language) {
        try {
            const result = await Database.rawQuery(`UPDATE users SET loyalty_point = loyalty_point + ${loyaltyPoint} WHERE id = ${userId}`)

            return result
        } catch (error) {
            throw Exceptions.conflict(FAILURE.USER_CONFLICT[language])
        }
    }

    static async walletUpdate(userId, walletDetails, language) {
        try {
            const result = await Database.rawQuery(`UPDATE users SET wallet_amount = ${walletDetails.walletAmount} WHERE id = ${userId}`)

            return result
        } catch (error) {
            throw Exceptions.conflict(FAILURE.USER_CONFLICT[language])
        }
    }

    static async multiUpdate(userId, language) {
        try {
            const result = await Database.rawQuery(`UPDATE users SET spin_count = spin_count + 1 WHERE id in (${JSON.parse(userId)})`)
            return result[0]
        } catch (error) {
            throw Exceptions.conflict(FAILURE.ORDER_CONFLICT[language])
        }

    }
}
