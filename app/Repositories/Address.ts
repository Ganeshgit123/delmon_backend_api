import Exceptions from '../Exceptions'
import Address from 'App/Models/Address'
import { FAILURE } from "../Data/language";

export default class AddressRepo {
    static async create(data: any, language: string) {
        const result = await Address.create(data)
        if (!result) throw Exceptions.notFound(FAILURE.ADDRESS_CREATE[language])
        return result
    }

    static async update(id: number, data: any, language: string) {
        try {
            const address = await Address.findOrFail(id)
            address.merge(data)
            await address.save()

            return address
        } catch (error) {
            throw Exceptions.conflict(FAILURE.ADDRESS_CONFLICT[language])
        }
    }

    static async get(id) {
        const result = await Address.query()
            .select('addresses.*')
            .select('zones.delivery_charge as deliveryCharge')
            .innerJoin('zones', 'addresses.zone_id', 'zones.id')
            .where('addresses.user_id', id)
            .where('addresses.active', 1)
        return result
    }

    static async delete(data: any, Address, language: string) {
        Address.active = data.active
        await Address.save()
        if (!Address.$isPersisted)
            throw Exceptions.notFound(FAILURE.ADDRESS_DELETE_CONFLICT[language])
        return Address
    }

    static async isEntryExist(id: number, language: string) {
        const result = await Address.query().where('id', id).first()
        if (!result) throw Exceptions.notFound(FAILURE.ADDRESS_CONFLICT[language])
        return result
    }

    static async adminGet() {
        const result = await Address.query()
        return result
    }

}
