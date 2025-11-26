import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Validators from "../../Validators";
import { WalletDomain, UserDomain } from "../../Domain";
import { WalletRepo, UserRepo } from "../../Repositories";
import { SUCCESS } from "../../Data/language";
import AuthController from 'App/Controllers/Http/AuthController'

export default class WalletsController {

    //user API
    public async get({ request }: HttpContextContract) {
        await AuthController.checkHeader(request)

        const userId: any = request.header('userId') || 0
        const language = request.header('language') || 'en'
        // const type = request.header('type') || ''
        let result = UserDomain.createFromArrOfObject(
            await UserRepo.get(userId, language)
        )        

        let walletList = WalletDomain.createFromArrOfObject(
            await WalletRepo.get(userId)
        )

        return {
            error: false,
            data: walletList,
            walletAmount: result[0] ? result[0].walletAmount : 0
        };
    }

    public async create({ request }: HttpContextContract) {
        const payload = await request.validate(Validators.WalletValidator);

        const language = request.header('language') || 'en'
        const userId: any = request.header('userId') || 0

        payload.userId = userId
        const walletDetails = await WalletRepo.create(payload, language);

        let userList = UserDomain.createFromArrOfObject(
            await UserRepo.getUserById([userId])
        )        
        
        let wallet = Number.parseFloat(userList[0].walletAmount) + walletDetails.amount
        let userDetails = {
            walletAmount: wallet
        }
        let result = UserDomain.createFromObject(
            await UserRepo.update(userId, userDetails, language)
        );
        
        return {
            error: false,
            walletAmount: result ? result.walletAmount : 0,
            data: WalletDomain.createFromObject(walletDetails),
            message: SUCCESS.WALLET_CREATE[language]
        };
    }
}
