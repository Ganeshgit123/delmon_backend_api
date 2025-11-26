import Exceptions from '../Exceptions'
import SpinAndWin from 'App/Models/SpinAndWin'
import { FAILURE } from "../Data/language";

export default class SpinAndWinRepo {
    static async create(data: any, language: string) {
        const result = await SpinAndWin.create(data)
        if (!result) throw Exceptions.notFound(FAILURE.COUPON_CREATE[language])
        return result
    }

    static async update(id: number, data: any, language: string) {
        try {
            const coupon = await SpinAndWin.findOrFail(id)
            coupon.merge(data)
            await coupon.save()

            return coupon
        } catch (error) {
            throw Exceptions.conflict(FAILURE.COUPON_CONFLICT[language])
        }
    }

    static async get() {        
        const result = await SpinAndWin.query().where('active', 1)
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
        const result = await SpinAndWin.query().where('id', id).first()
        if (!result) throw Exceptions.notFound(FAILURE.COUPON_CONFLICT[language])
        return result
    }

    static async adminGet() {
        const result = await SpinAndWin.query()
        return result
    }

    static async getCoupon(couponCode) {
        const result = await SpinAndWin.query().where('couponCode', couponCode).where('active', 1).limit(1)
        return result
    }

}