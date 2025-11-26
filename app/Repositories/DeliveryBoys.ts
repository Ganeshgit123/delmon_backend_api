import Exceptions from '../Exceptions'
import DeliveryBoy from '../Models/DeliveryBoy'
import { FAILURE } from "../Data/language";

export default class DeliveryBoysRepo {
    static async create(data: any, language: string) {
        const result = await DeliveryBoy.create(data)
        if (!result) throw Exceptions.notFound(FAILURE.DELIVERYBOYS_CREATE[language])
        return result
    }

    static async update(id: number, data: any, language: string) {
        try {
            const deliveryBoysResult = await DeliveryBoy.findOrFail(id)
            deliveryBoysResult.merge(data)
            await deliveryBoysResult.save()

            return deliveryBoysResult
        } catch (error) {
            throw Exceptions.conflict(FAILURE.DELIVERYBOYS_CONFLICT[language])
        }
    }

    static async isEntryExist(id) {
        const result = await DeliveryBoy.query()
            .where('id', id)
            .first()
        return result
    }

    static async checkDeliveryBoys(employeeId, password) {
        const result = await DeliveryBoy.query()
            .where('employee_id', employeeId)
            .where('password', password)
            .first()
        return result
    }

    static async isEmailExist(email) {
        const result = await DeliveryBoy.query()
            .where('email', email)
            .first()
        return result
    }

    static async getDeliveryBoys(active, type) {
        const result = await DeliveryBoy.query()
            .if(active, (query) =>
                query.where('active', active))
            .if(type, (query) =>
                query.where('type', type))
        return result
    }

    static async delete(data: any, User, language: string) {
        User.active = data.active
        await User.save()
        if (!User.$isPersisted)
            throw Exceptions.notFound(FAILURE.DELIVERYBOYS_CONFLICT[language])
        return User
    }

    static async isIdExist(id) {
        const result = await DeliveryBoy.query()
            .where('id', id)
            .first()
        return result
    }

    static async updateDeliveryBoys(id: number, data: any, language: string) {
        try {

            const deliveryBoysResult = await DeliveryBoy.findOrFail(id)
            deliveryBoysResult.merge(data)
            await deliveryBoysResult.save()

            return deliveryBoysResult
        } catch (error) {
            throw Exceptions.conflict(FAILURE.DELIVERYBOYS_CONFLICT[language])
        }
    }

    static async createDeliveryBoys(data: any, language: string) {
        const result = await DeliveryBoy.create(data)
        if (!result) throw Exceptions.notFound(FAILURE.DELIVERYBOYS_CREATE[language])
        return result
    }

    static async deleteDeliveryBoys(data: any, Admin, language: string) {
        Admin.active = data.active
        await Admin.save()
        if (!Admin.$isPersisted)
            throw Exceptions.notFound(FAILURE.DELIVERYBOYS_CONFLICT[language])
        return Admin
    }

}
