import Exceptions from '../Exceptions'
import SpinAndWinList from 'App/Models/SpinAndWinList'
import { SUCCESS, FAILURE } from "../Data/language";

export default class SpinAndWinListRepo {
    static async create(data: any, language: string) {
        const result = await SpinAndWinList.create(data)
        if (!result) throw Exceptions.notFound(SUCCESS.SPIN_USER_CREATE[language])
        return result
    }

    static async update(id: number, data: any, language: string) {
        try {
            const coupon = await SpinAndWinList.findOrFail(id)
            coupon.merge(data)
            await coupon.save()

            return coupon
        } catch (error) {
            throw Exceptions.conflict(FAILURE.COUPON_CONFLICT[language])
        }
    }

    static async get() {
        const result = await SpinAndWinList.query().where('active', 1)
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
        const result = await SpinAndWinList.query().where('id', id).first()
        if (!result) throw Exceptions.notFound(FAILURE.COUPON_CONFLICT[language])
        return result
    }

    static async adminGet() {
        const result = await SpinAndWinList.query()
            .select('spin_and_win_lists.*')
            .select('spin_and_wins.type', 'spin_and_wins.title')
            .select('users.first_name as firstName', 'users.last_name as lastName')
            .innerJoin('spin_and_wins', 'spin_and_win_lists.spin_id', 'spin_and_wins.id')
            .innerJoin('users', 'spin_and_win_lists.user_id', 'users.id')
            console.log(result,'result');
            
        return result
    }

    static async getCoupon(couponCode) {
        const result = await SpinAndWinList.query().where('couponCode', couponCode).where('active', 1).limit(1)
        return result
    }

}