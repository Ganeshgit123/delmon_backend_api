import Exceptions from '../Exceptions'
import Coupon from 'App/Models/Coupon'
import { FAILURE } from "../Data/language";

export default class CouponRepo {
    static async create(data: any, language: string) {
        const result = await Coupon.create(data)
        if (!result) throw Exceptions.notFound(FAILURE.COUPON_CREATE[language])
        return result
    }

    static async update(id: number, data: any, language: string) {
        try {
            const coupon = await Coupon.findOrFail(id)
            coupon.merge(data)
            await coupon.save()

            return coupon
        } catch (error) {
            throw Exceptions.conflict(FAILURE.COUPON_CONFLICT[language])
        }
    }

    static async get(couponId) {        
        const result = await Coupon.query().where('active', 1)
            .if(couponId.length != 0, (query) => query.whereNotIn('id', couponId))
        return result
    }

    static async delete(data: any, Coupon, language: string) {
        Coupon.active = data.active
        await Coupon.save()
        if (!Coupon.$isPersisted)
            throw Exceptions.notFound(FAILURE.COUPON_DELETE_CONFLICT[language])
        return Coupon
    }

    static async isEntryExist(id: number, language: string) {
        const result = await Coupon.query().where('id', id).first()
        if (!result) throw Exceptions.notFound(FAILURE.COUPON_CONFLICT[language])
        return result
    }

    static async adminGet(type) {
        const result = await Coupon.query()
        .if(type, (query) =>
        query.where('type', type))
        return result
    }

    static async getCoupon(couponCode) {
        const result = await Coupon.query().where('couponCode', couponCode).where('active', 1).limit(1)
        return result
    }

}
