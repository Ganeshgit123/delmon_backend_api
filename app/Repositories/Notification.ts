import Exceptions from '../Exceptions'
import Notification from 'App/Models/Notification'
import { FAILURE } from "../Data/language";
import Database from '@ioc:Adonis/Lucid/Database'

export default class NotificationRepo {


    static async isEntryExist(id: number, language) {
        const result = await Notification.query().where('id', id).first()
        if (!result) throw Exceptions.notFound(FAILURE.NOTIFICATION_CONFLICT[language])
        return result
    }

    static async create(data: any, language) {

        const result = await Notification.create(data)

        if (!result) throw Exceptions.notFound(FAILURE.NOTIFICATION_CREATE[language])
        return result
    }

    static async get(offset, limit, userId) {
        const result = await Notification.query()
            .select('notifications.id as id', 'notifications.type as type', 'notifications.user_id', 'notifications.message',
                'notifications.product_id', 'notifications.created_at', 'notifications.updated_at', 'notifications.booking_id', 'notifications.order_id', 'users.first_name', 'users.last_name', 'users.image')
            .innerJoin('users', 'users.id', 'notifications.user_id')
            .if(userId, (query) => query.where('notifications.user_id', userId))
            .if(offset && limit, (query) => {
                query.forPage(offset, limit)
            })
            .orderBy('id', 'desc')


        return result
    }

    static async update(id: number, data: any, language) {
        try {
            const notification = await Notification.findOrFail(id)
            notification.merge(data)
            await notification.save()

            return notification
        } catch (error) {
            throw Exceptions.conflict(FAILURE.NOTIFICATION_CONFLICT[language])
        }
    }

    static async readAll(userId: number, language) {
        try {
            const result = await Database.rawQuery(`UPDATE notifications SET is_readed = 1 WHERE post_user_id = ${userId};`)
            return result[0]
        } catch (error) {
            throw Exceptions.conflict(FAILURE.NOTIFICATION_CONFLICT[language])
        }
    }

    static async delete(id: any) {
        let result = Database
            .from('notifications')
            .whereIn('id', id)
            .delete()
        return result
    }

    static async deleteAll(id: any) {
        let result = Database
            .from('notifications')
            .where('user_id', id)
            .delete()
        return result
    }

}
