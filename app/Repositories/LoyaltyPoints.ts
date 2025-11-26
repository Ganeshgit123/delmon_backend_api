import Exceptions from '../Exceptions'
import LoyaltyPoint from 'App/Models/LoyaltyPoint'
import { FAILURE } from "../Data/language";

export default class LoyaltyPointsRepo {
    static async create(data: any, language: string) {
        const result = await LoyaltyPoint.create(data)
        if (!result) throw Exceptions.notFound(FAILURE.LOYALTY_POINT_CREATE[language])
        return result
    }

    static async get(type, userId) {
        const result = await LoyaltyPoint.query()
            .orderBy('id', 'desc')
            .if(type, (query) =>
                query.where('type', type))
            .if(userId, (query) =>
                query.where('user_id', userId))
        return result
    }

}
