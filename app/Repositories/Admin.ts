import Exceptions from '../Exceptions'
import User from '../Models/User'
import Admin from '../Models/Admin'
import { FAILURE } from "../Data/language";

export default class AdminRepo {
    static async create(data: any, language: string) {
        const result = await User.create(data)
        if (!result) throw Exceptions.notFound(FAILURE.USER_CREATE[language])
        return result
    }

    static async checkOtp(id: number, otp: number, language: string) {
        const result = await User.query().where('mobile_number', id).where('otp', otp).first()
        if (!result) throw Exceptions.notFound(FAILURE.OTP_NOT_MATCH[language])
        return result
    }

    static async update(id: number, data: any, language: string) {
        try {
            const userResult = await User.findOrFail(id)
            userResult.merge(data)
            await userResult.save()

            return userResult
        } catch (error) {
            throw Exceptions.conflict(FAILURE.USER_CONFLICT[language])
        }
    }

    static async isEntryExist(id) {
        const result = await Admin.query()
            .where('id', id)
            .first()
        return result
    }

    static async checkAdmin(email, password) {
        const result = await Admin.query()
            .where('email', email)
            .where('password', password)
            .first()
        return result
    }

    static async isEmailExist(email) {
        const result = await User.query()
            .where('email', email)
            .first()
        return result
    }

    static async getAdmin(id) {
        const result = await Admin.query()
            // .whereNotIn('user_type', [0])
            .whereNotIn('id', [id])
            .where('active', 1)

        return result
    }

    static async delete(data: any, User, language: string) {
        User.active = data.active
        await User.save()
        if (!User.$isPersisted)
            throw Exceptions.notFound(FAILURE.ADMIN_DELETE_CONFLICT[language])
        return User
    }

    static async isIdExist(id) {
        const result = await Admin.query()
            .where('id', id)
            .first()
        return result
    }

    static async updateAdmin(id: number, data: any, language: string) {
        try {

            const userResult = await Admin.findOrFail(id)
            userResult.merge(data)
            await userResult.save()

            return userResult
        } catch (error) {
            throw Exceptions.conflict(FAILURE.USER_CONFLICT[language])
        }
    }

    static async createAdmin(data: any, language: string) {
        const result = await Admin.create(data)
        if (!result) throw Exceptions.notFound(FAILURE.USER_CREATE[language])
        return result
    }

    static async deleteAdmin(data: any, Admin, language: string) {
        Admin.active = data.active
        await Admin.save()
        if (!Admin.$isPersisted)
            throw Exceptions.notFound(FAILURE.ADMIN_DELETE_CONFLICT[language])
        return Admin
    }

}
