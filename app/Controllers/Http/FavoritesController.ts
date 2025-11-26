import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Validators from "../../Validators";
import { FavoritesDomain } from "../../Domain";
import { FavoritesRepo, UserTypesRepo } from "../../Repositories";
import { SUCCESS } from "../../Data/language";
import Env from '@ioc:Adonis/Core/Env'
import JWT from 'jsonwebtoken'
const JWT_SECRET_KEY = Env.get('JWT_SECRET_KEY')

export default class FavoritesController {

    public async favorites({ request }: HttpContextContract) {
        const payload = await request.validate(Validators.CreateFavorites);
        const type = request.header('type') || ''
        payload["type"] = type
        
        let userId: any = request.ctx ? request.ctx['token'].decoded.id : 0
        payload.userId = userId

        const language = request.header('language') || 'es'

        const isEntryExist = await FavoritesRepo.isEntryExist(userId, payload.productId, language)

        if (isEntryExist.length == 0) {

            if (payload.isFavorites == true) {

                const FavoritesDetails = await FavoritesRepo.create(payload, language);
                
                return {
                    error: false,
                    data: FavoritesDomain.createFromObject(FavoritesDetails),
                    message: " تمت الإضافة الى المفضلة بنجاح"
                };

            } else {
                return {
                    error: true,
                    message: SUCCESS.FAVORITES_NOT_EXITS[language]
                };
            }
        } else {

            if (payload.isFavorites == false) {

                FavoritesDomain.createFromObject(
                    await FavoritesRepo.delete(payload.productId, userId, language)
                );
                return {
                    error: false,
                    message: SUCCESS.UNFAVORITES[language]
                };
            } else {
                return {
                    error: true,
                    message: SUCCESS.ALREADY_FAVORITES[language]
                };
            }
        }
    }

    public async get({ request }: HttpContextContract) {
        let authHeader = request.header('authorization') || ''
        const type = request.header('type') || ''

        let decoded
        if (authHeader && authHeader.startsWith('Bearer ')) {
            authHeader = authHeader.slice(7, authHeader.length)
            decoded = JWT.verify(authHeader, JWT_SECRET_KEY)
        }

        const userId: any = decoded ? decoded.id : 0
        
        const userType: any = decoded ? decoded.userType : null
        const merchantType: any = decoded ? decoded.merchantType : null

        let typeOfUser = ''
        if (merchantType == null) {
            typeOfUser = userType
        } else {
            typeOfUser = merchantType
        }

        let priceListNameId = await UserTypesRepo.getUserType(typeOfUser)

        let result = FavoritesDomain.createFromArrOfObject(
            await FavoritesRepo.get(userId, priceListNameId, type)
        )

        return {
            error: false,
            data: result,
        };
    }
}
