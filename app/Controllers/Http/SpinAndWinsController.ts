import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Validators from "../../Validators";
import { CouponDomain } from "../../Domain";
import { CouponRepo, SpinAndWinRepo } from "../../Repositories";
import { SUCCESS } from "../../Data/language";
import Coupon from 'App/Models/Coupon';

export default class SpinAndWinsController {

    public async get() {

        // const userId = request.header('userId') || ''
        // const language = request.header('language') || 'en'
        let spinAndWin = await SpinAndWinRepo.get()

        return {
            success: true,
            data: spinAndWin
        };
    }

    public async create({ request }: HttpContextContract) {
        const payload = await request.validate(Validators.SpinAndWinValidator);

        const language = request.header('language') || 'en'
        const couponDetails = await SpinAndWinRepo.create(payload, language);

        return {
            success: true,
            result: CouponDomain.createFromObject(couponDetails),
            massage: SUCCESS.COUPON_CREATE[language]
        };
    }

    public async update({ request, params }: HttpContextContract) {
        const UpdatePost = request.all()

        const language = request.header('language') || 'en'
        await SpinAndWinRepo.isEntryExist(params.id, language);

        const updateResult = CouponDomain.createFromObject(
            await SpinAndWinRepo.update(params.id, UpdatePost, language)
        );
        return {
            success: true,
            result: updateResult,
            massage: SUCCESS.COUPON_CREATE[language]
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

    public async adminGet() {
        let spinAndWin = await SpinAndWinRepo.get()

        return {
            success: true,
            data: spinAndWin,
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

    // public async getCoupon({ request }: HttpContextContract) {
    //     const payload = await request.validate(Validators.SpinAndWinValidator);
    //     const userId = request.header('userId') || ''
    //     let couponList = await OrderRepo.checkCoupon(payload.couponCode, userId)
    //     const language = request.header('language') || 'en'

    //     if (couponList.length != 0) {
    //         return {
    //             success: false,
    //             massage: SUCCESS.COUPON_ALREADY_APPLIED[language],
    //         };
    //     }

    //     const couponResult = CouponDomain.createFromArrOfObject(
    //         await CouponRepo.getCoupon(payload.couponCode)
    //     )
    //     if (couponResult.length != 0) {
    //         return {
    //             success: true,
    //             data: couponResult,
    //         };
    //     } else {
    //         return {
    //             success: false,
    //             massage: SUCCESS.INVALID_COUPON[language],
    //             data: [],
    //         };
    //     }
    // }
}