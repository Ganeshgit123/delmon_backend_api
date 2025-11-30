import Exceptions from '../Exceptions'
import Order from 'App/Models/Order'
import { FAILURE } from "../Data/language";
import { format } from 'date-fns'
import Database from '@ioc:Adonis/Lucid/Database'

export default class OrderRepo {

    static async isEntryExist(id: number, language: string) {
        const result = await Order.query().where('id', id).first()
        if (!result) throw Exceptions.notFound(FAILURE.ORDER_CONFLICT[language])
        return result
    }

    static async create(data: any, language: string) {
        // if (data.cartonDiscount == '0') {
        //     await delete data.cartonDiscount
        // } else {
        //     await delete data.cartonDiscount
        // }
        if (data.maxCartonDiscountPerDay == 0) {
            await delete data.maxCartonDiscountPerDay
        } else {
            await delete data.maxCartonDiscountPerDay
        }
        const result = await Order.create(data)
        if (!result) throw Exceptions.notFound(FAILURE.CART_CREATE[language])
        return result
    }

    static async update(id: number, data: any, language: string) {
        try {
            const product = await Order.findOrFail(id)
            product.merge(data)
            await product.save()

            return product
        } catch (error) {
            throw Exceptions.conflict(FAILURE.ORDER_CONFLICT[language])
        }
    }

    static async multiUpdate(orderId, UpdatePost, language) {
        try {
            if (UpdatePost.orderStatus === 'DRIVERASSIGNED') {
                const result = await Order.query().whereIn('id', orderId).update({
                    delivery_boy_id: UpdatePost.deliveryBoyId,
                    delivery_order_date: UpdatePost.deliveryOrderDate,
                    delivered_time: UpdatePost.deliveredTime,
                    order_status: UpdatePost.orderStatus
                })
                return result[0]
            } else {
                const result = await Order.query().whereIn('id', orderId).update({
                    approve_time: UpdatePost.approveTime,
                    order_status: UpdatePost.orderStatus,
                    out_for_delivery_time: UpdatePost.outForDeliveryTime
                })
                return result[0]
            }
        } catch (error) {
            throw Exceptions.conflict(FAILURE.ORDER_CONFLICT[language])
        }

    }

    static async get(userId, status, isReturn, type) {
        const result = await Order.query()
            // .innerJoin('products', 'products.id', 'orders.product_id')
            .if(userId, (query) => query.where('orders.user_id', userId))
            .if(status, (query) => query.whereIn('orders.order_status', status))
            .if(isReturn, (query) => query.where('orders.is_returned', isReturn))
            .if(type, (query) => query.where('orders.type', type))
            // .if(orderType, (query) => query.where('orders.order_status', orderType))
            .orderBy('id', 'desc')
        return result
    }

    static async getOrderDetails(userId, orderId) {
        const result = await Order.query()
            // .innerJoin('products', 'products.id', 'orders.product_id')
            .if(userId, (query) => query.where('orders.user_id', userId))
            .if(orderId, (query) => query.where('orders.id', orderId))
        return result
    }

    static async getAppliedCouponId(userId) {
        const result = await Order.query()
            .select('coupon_id')
            // .whereNot('couponId', 'NULL')
            .if(userId, (query) => query.where('orders.user_id', userId))
        return result
    }

    static async adminGetOrder(startDate, endDate, orderType, orderStatus, orderBy, orderByValue, userId, deliveryType, orderId, userType, type) {
        const result = await Order.query()
            .select('orders.*')
            .select('users.first_name', 'users.mobile_number', 'users.user_type', 'users.user_name')
            .innerJoin('users', 'orders.user_id', 'users.id')
            .if(startDate && endDate, (query) => {
                query.whereBetween('orders.created_at', [`${startDate} 00:00:00`, `${endDate} 23:59:00`])
            })
            .if(userType, (query) => query.where('users.user_type', userType))
            .if(orderType, (query) => query.where('orders.address_type', orderType))
            .if(orderStatus, (query) => query.whereIn('orders.order_status', orderStatus))
            .if(userId, (query) => query.where('orders.user_id', userId))
            .if(deliveryType, (query) => query.where('orders.delivery_type', deliveryType))
            .if(orderId, (query) => query.where('orders.id', orderId))
            .if(type, (query) => query.where('orders.type', type))
            .if(orderBy && orderByValue, (query) => {
                query.orderBy(orderBy, orderByValue)
            })
        // .if(active, (query) =>
        //     query.where('active', active))
        return result
    }

    static async checkCoupon(couponCode, userId) {
        const result = await Order.query()
            .select('coupon_id')
            .where('orders.user_id', userId)
            // .whereNot('couponId', 'NULL')
            .if(couponCode, (query) => query.where('orders.coupon_name', couponCode))
        return result
    }

    static async deliveryBoyGetOrder(deliveryBoyId, orderStatus) {
        let startDate: any = new Date()
        startDate = format(startDate, 'dd/MM/yyyy')

        const result = await Order.query()
            .select('orders.*')
            .select('users.mobile_number', 'users.country_code', 'users.user_name', 'users.first_name', 'users.last_name', 'users.user_type')
            .innerJoin('users', 'orders.user_id', 'users.id')
            // .if(startDate, (query) => {
            //     query.whereBetween('orders.new_delivery_date', [`${startDate} 00:00:00`, `${startDate} 23:59:00`])
            // })
            .if(orderStatus, (query) =>
                query.whereIn('orderStatus', orderStatus))
            .if(deliveryBoyId, (query) =>
                query.where('delivery_boy_id', deliveryBoyId))
            .if(startDate, (query) =>
                query.where('delivery_order_date', startDate))
            .if(startDate, (query) =>
                query.orWhere('new_delivery_date', startDate))
        return result
    }

    static async getInvoice(orderId) {
        const result = await Order.query()
            // .innerJoin('products', 'products.id', 'orders.product_id')
            // .if(userId, (query) => query.where('orders.user_id', userId))
            .if(orderId, (query) => query.where('orders.id', orderId))
        return result
    }

    static async getDriverReport(orderStatus, deliveryBoyId, startDate, endDate, type) {

        const result = await Order.query()
            .select('orders.*')
            .select('delivery_boys.user_name as driverName', 'delivery_boys.email as driverEmail', 'delivery_boys.mobile_number as driverMobileNumber', 'delivery_boys.employee_id as employeeId', 'delivery_boys.employee_code as employeeCode')
            .select('users.mobile_number', 'users.country_code', 'users.user_name', 'users.first_name', 'users.last_name', 'users.user_type')
            .innerJoin('users', 'orders.user_id', 'users.id')
            .innerJoin('delivery_boys', 'orders.delivery_boy_id', 'delivery_boys.id')
            .if(type, (query) => query.where('orders.type', type))
            .if(startDate && endDate, (query) => {
                query.whereRaw(
                    `STR_TO_DATE(delivery_order_date, '%d/%m/%Y')
                     BETWEEN STR_TO_DATE(?, '%d/%m/%Y')
                     AND STR_TO_DATE(?, '%d/%m/%Y')`,
                    [startDate, endDate]
                );
            })
            // .if(startDate, (query) =>
            //     query.where('delivery_order_date', startDate))
            .if(orderStatus, (query) =>
                query.whereIn('orderStatus', orderStatus))
            .if(deliveryBoyId, (query) =>
                query.where('delivery_boy_id', deliveryBoyId))
        return result
    }

    static async adminGetOrderWithSum(startDate, endDate) {
        console.log(`SELECT
        orders.user_id AS userID,
        SUM(orders.net_amount) AS dailySalesCount,
        users.first_name,
        users.mobile_number,
        users.user_name
        FROM orders JOIN users  ON orders.user_id = users.id
    WHERE orders.created_at BETWEEN '${startDate} 00:00:00' AND '${endDate} 23:59:00'
    GROUP BY orders.user_id;`)
        const result = await Database.rawQuery(`SELECT orders.user_id AS userID,
        SUM(orders.net_amount) AS totalAmount,
        users.first_name,
        users.mobile_number,
        users.user_name
    FROM orders JOIN users  ON orders.user_id = users.id
    WHERE orders.created_at BETWEEN '${startDate} 00:00:00' AND '${endDate} 23:59:00'
    GROUP BY orders.user_id;`)
        return result[0]
    }

}
