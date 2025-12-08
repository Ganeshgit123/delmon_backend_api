import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Validators from "../../Validators";
import { LoyaltyPointsDomain, UserDomain, SettingsDomain } from "../../Domain";
import { LoyaltyPointsRepo, UserRepo, SettingsRepo } from "../../Repositories";
import { SUCCESS } from "../../Data/language";
import AuthController from 'App/Controllers/Http/AuthController'

export default class LoyaltyPointsController {

    //user API
    public async get({ request }: HttpContextContract) {
        await AuthController.checkHeader(request)

        const type = request.header('type') || ''
        const userId: any = request.ctx ? request.ctx['token'].decoded.id : 0

        let LoyaltyPointsList = LoyaltyPointsDomain.createFromArrOfObject(
            await LoyaltyPointsRepo.get(type, userId)
        )
        const language = request.header('language') || 'en'
        // const type = request.header('type') || ''
        let result = UserDomain.createFromArrOfObject(
            await UserRepo.get(userId, language)
        )

        return {
            error: false,
            loyaltyPoint: result[0] ? result[0].loyaltyPoint : 0,
            data: LoyaltyPointsList,
        };
    }

    public async create({ request }: HttpContextContract) {
        const payload = await request.validate(Validators.BannerValidator);

        const language = request.header('language') || 'en'
        const LoyaltyPointsDetails = await LoyaltyPointsRepo.create(payload, language);

        return {
            error: false,
            data: LoyaltyPointsDomain.createFromObject(LoyaltyPointsDetails),
            message: SUCCESS.LOYALTY_POINT_CREATE[language]
        };
    }

    public async applyLoyaltyPoints({ request }: HttpContextContract) {
        await AuthController.checkHeader(request)
        let payload = request.all()
        const language = request.header('language') || 'en'
        // let totalLoyaltyPoint = payload.totalLoyaltyPoint
        let setting = SettingsDomain.createFromArrOfObject(
            await SettingsRepo.adminGet(1)
        )
        let enLoyaltyPointDiscount

        if (setting.length != 0) {
            await setting.map((data) => {
                if (data.key == 'loyalty_point_per_order') {
                    enLoyaltyPointDiscount = data.enValue
                }
            })
        }
        let loyaltyPointDiscount = enLoyaltyPointDiscount

        let totalAmount = payload.totalAmount
        let loyaltyPoint = Math.round((totalAmount / 100) * 10)

        if (loyaltyPointDiscount != 0) {
            // if (totalLoyaltyPoint >= loyaltyPoint) {
            let massage
            if (loyaltyPoint == 0) {
                massage = language == 'en' ? `max order value is 100 to apply loyalty Points` : 'الحد الأقصى لقيمة الطلب هو 100 نقطة لتطبيق نقاط الولاء'
                return {
                    error: false,
                    massage: massage,
                    data: loyaltyPoint,
                };
            } else {
                massage = language == 'en' ? `You have save ${loyaltyPoint} in this order.` : `لقد قمت بحفظ ${loyaltyPoint} بهذا الترتيب.`
                return {
                    error: false,
                    massage: massage,
                    data: loyaltyPoint,
                };
            }
        }
        else {
            return {
                error: true,
                massage: `You have No loyaltyPoint.`,
            };
        }
    }
}
