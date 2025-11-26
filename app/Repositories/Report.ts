import Exceptions from '../Exceptions'
import Report from 'App/Models/Report'
import { FAILURE } from "../Data/language";

export default class ReportRepo {

    static async create(data: any, language) {
        await delete data.isFavorites

        const result = await Report.create(data)
        if (!result) throw Exceptions.notFound(FAILURE.REPORT_CREATE[language])
        return result
    }

    static async get(offset, limit) {
        const result = await Report.query()
            .select('reports.id as id', 'reports.comment', 'reports.user_id', 'users.user_name', 'users.email',
                'users.mobile_number', 'users.user_type')
            .innerJoin('users', 'reports.user_id', 'users.id')
            .if(offset && limit, (query) => {
                query.forPage(offset, limit)
            })
        return result
    }

    static async isEntryExist(id: number, language) {
        const result = await Report.query().where('id', id).first()
        if (!result) throw Exceptions.notFound(FAILURE.REPORT_CONFLICT[language])
        return result
    }

    static async update(id: number, data: any, language) {
        try {
            const post = await Report.findOrFail(id)
            post.merge(data)
            await post.save()

            return post
        } catch (error) {
            throw Exceptions.conflict(FAILURE.REPORT_CONFLICT[language])
        }
    }
}
