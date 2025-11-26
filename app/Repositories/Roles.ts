import Exceptions from '../Exceptions'
import Role from 'App/Models/Role'
// import { FAILURE } from "../Data/language";

export default class RoleRepo {
    static async create(data: any) {
        const result = await Role.create(data)
        if (!result) throw Exceptions.notFound('role created successfully')
        return result
    }

    static async update(id: number, data: any) {
        try {
            const role = await Role.findOrFail(id)
            role.merge(data)
            await role.save()

            return role
        } catch (error) {
            throw Exceptions.conflict('role not found.')
        }
    }

    static async get() {
        const result = await Role.query()
        // .where('active', 1)
        return result
    }

    static async delete(data: any, role) {
        role.active = data.active
        await role.save()
        if (!role.$isPersisted)
            throw Exceptions.notFound('role not found.')
        return role
    }

    static async isEntryExist(roleName: string) {
        const result = await Role.query().where('role_name', roleName).first()
        // if (!result) throw Exceptions.notFound('role already exist')
        return result
    }

    static async isRoleExist(id: number) {
        const result = await Role.query().where('id', id).first()
        if (!result) throw Exceptions.notFound('role not exist')
        return result
    }

}
