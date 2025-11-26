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
        let result = SettingsDomain.createFromObject(
            await SettingsRepo.getById(20)
        )

        // Decide flow:
        // - If client provided totalLoyaltyPoint, compute discount from points using admin percentage (enValue).
        // - Otherwise keep previous behavior (compute based on totalAmount) to avoid breaking existing clients.
        const totalLoyaltyPoint = Number(payload.totalLoyaltyPoint || 0)
        const totalAmount = Number(payload.totalAmount || 0)

        // admin percentage stored in enValue (string), default to 0
        const adminPercent = Number(result?.enValue) || 0

        // localized messages helper
        const msg = (en: string, ar: string) => (language === 'en' ? en : ar)

        // If client provided points, use points-based calculation
        if (totalLoyaltyPoint > 0) {
            if (adminPercent <= 0) {
                return {
                    error: false,
                    massage: msg(
                        'Loyalty redemption is disabled by admin.',
                        'قام المسؤول بتعطيل استرداد نقاط الولاء.'
                    ),
                    data: 0,
                }
            }

            // 100 points = 1 BD
            const pointsToBD = totalLoyaltyPoint / 100
            // raw discount in BD before capping to cart total
            let discount = +(pointsToBD * (adminPercent / 100))
            // round to 3 decimals
            discount = Math.round(discount * 1000) / 1000

            // cap discount so it cannot exceed the cart total (3 decimals)
            const cappedDiscount = Math.round(Math.min(discount, totalAmount) * 1000) / 1000
            const remainingAmount = Math.round(Math.max(totalAmount - cappedDiscount, 0) * 1000) / 1000

            if (discount <= 0) {
                return {
                    error: false,
                    massage: msg(
                        'You need more loyalty points to get a discount.',
                        'تحتاج إلى المزيد من نقاط الولاء للحصول على خصم.'
                    ),
                    data: 0,
                }
            }

            return {
                error: false,
                massage: msg(
                    `You have saved ${cappedDiscount} in this order. Remaining to pay: ${remainingAmount}`,
                    `لقد قمت بحفظ ${cappedDiscount} بهذا الترتيب. المتبقي للدفع: ${remainingAmount}`
                ),
                data: cappedDiscount,
                remainingAmount,
            }
        }

        // Fallback: preserve original behavior (compute based on totalAmount)
        const loyaltyPoint = Math.round((totalAmount / 100) * 10)
        const massage = loyaltyPoint === 0
            ? msg(
                `max order value is 100 to apply loyalty Points`,
                'الحد الأقصى لقيمة الطلب هو 100 نقطة لتطبيق نقاط الولاء'
            )
            : msg(
                `You have save ${loyaltyPoint} in this order.`,
                `لقد قمت بحفظ ${loyaltyPoint} بهذا الترتيب.`
            )

        return {
            error: false,
            massage,
            data: loyaltyPoint,
        }
    }
}
