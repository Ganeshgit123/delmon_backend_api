import Exceptions from '../Exceptions'
import Wallet from 'App/Models/Wallet'
import { FAILURE } from "../Data/language";

export default class WalletRepo {
    static async create(data: any, language: string) {
        const result = await Wallet.create(data)
        if (!result) throw Exceptions.notFound(FAILURE.WALLET_CREATE[language])
        return result
    }

    static async get(userId) {
        const result = await Wallet.query()
            .orderBy('id', 'desc')
            .if(userId, (query) =>
                query.where('user_id', userId))
        return result
    }

}