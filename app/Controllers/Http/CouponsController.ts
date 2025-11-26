import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Validators from "../../Validators";
import { CouponDomain } from "../../Domain";
import { CouponRepo, ProductRepo, OrderRepo } from "../../Repositories";
import { SUCCESS } from "../../Data/language";
import Coupon from 'App/Models/Coupon'

export default class CouponsController {

    public async get({ request }: HttpContextContract) {

        const userId = request.header('userId') || ''
        const language = request.header('language') || 'en'        
        let couponList = await ProductRepo.getAppliedCouponId(userId)
        
        let couponId: any = []
        if (couponList.length != 0) {
            couponList.map(async (element) => {
                couponId.push(element.couponId)
            });
        }
        
        let couponResult = CouponDomain.createFromArrOfObject(
            await CouponRepo.get(couponId)
        )

        if (couponResult.length != 0) {
            couponResult.map(async (element) => {

                if (language == 'en') {
                    element.couponName = element.enCouponName
                    element.description = element.enDescription
                } else {
                    element.couponName = element.arCouponName
                    element.description = element.arDescription
                }
            })
        }

        return {
            success: true,
            data: couponResult
        };
    }

    public async create({ request }: HttpContextContract) {
        const payload = await request.validate(Validators.CouponValidator);

        const language = request.header('language') || 'en'
        const couponDetails = await CouponRepo.create(payload, language);

        return {
            success: true,
            result: CouponDomain.createFromObject(couponDetails),
            massage: SUCCESS.COUPON_CREATE[language]
        };
    }

    public async update({ request, params }: HttpContextContract) {
        const UpdatePost = request.all()

        const language = request.header('language') || 'en'
        await CouponRepo.isEntryExist(params.id, language);

        const updateResult = CouponDomain.createFromObject(
            await CouponRepo.update(params.id, UpdatePost, language)
        );
        return {
            success: true,
            result: updateResult,
            massage: SUCCESS.COUPON_UPDATE[language]
        };
    }

    public async delete({ request, params }: HttpContextContract) {
        const language = request.header('language') || 'en'
        const result = await CouponRepo.isEntryExist(params.id, language);

        await CouponRepo.delete({ active: 0 }, result, language);
        return {
            success: true,
            massage: SUCCESS.COUPON_DELETE[language]
        };

    }

    public async adminGet({ request }: HttpContextContract) {
        const type = request.header('type') || 'NORMAL'
        return {
            success: true,
            data: CouponDomain.createFromArrOfObject(
                await CouponRepo.adminGet(type)
            ),
        };
    }

    public async couponDelete({ request, params }: HttpContextContract) {
        const language = request.header('language') || 'en'

        const banner = await Coupon.findOrFail(params.id)
        await banner.delete()

        return {
            success: true,
            massage: SUCCESS.COUPON_DELETE[language]
        };

    }

    public async getCoupon({ request }: HttpContextContract) {
        const payload = await request.validate(Validators.SearchCouponValidator);
        const userId = request.header('userId') || ''
        let couponList = await OrderRepo.checkCoupon(payload.couponCode, userId)
        const language = request.header('language') || 'en'

        if (couponList.length != 0) {
            return {
                success: false,
                massage: SUCCESS.COUPON_ALREADY_APPLIED[language],
            };
        }

        const couponResult = CouponDomain.createFromArrOfObject(
            await CouponRepo.getCoupon(payload.couponCode)
        )
        if (couponResult.length != 0) {
            return {
                success: true,
                data: couponResult,
            };
        } else {
            return {
                success: false,
                massage: SUCCESS.INVALID_COUPON[language],
                data: [],
            };
        }
    }
}
