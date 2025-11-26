// import Exceptions from '../Exceptions'
// import Post from 'App/Models/Post'
import Database from '@ioc:Adonis/Lucid/Database'
import { format, subYears, subMonths } from 'date-fns'

export default class DashboardRepo {

    static async getDeliveryCount() {
        const result = await Database.rawQuery(`SELECT count(id) as deliveryCount, sum(case when active = "1" then 1 else 0 end) as active,
        sum(case when active = "0" then 1 else 0 end) as inActive FROM delivery_boys`)
        return result[0]
    }

    static async getUserCount() {
        const result = await Database.rawQuery(`
        SELECT 
            count(id) as userCount, 
            sum(case when active = "1" then 1 else 0 end) as active,
            sum(case when active = "0" then 1 else 0 end) as inActive,
            sum(case when user_type = "USER" then 1 else 0 end) as totalUserCount,
            sum(case when user_type = "EMPLOYEE" then 1 else 0 end) as totalEmployeeCount,
            sum(case when user_type = "MERCHANT" then 1 else 0 end) as totalMerchantCount
        FROM users
    `)
        return result[0]
    }

    static async getPoultryCategoriesCount() {
        const result = await Database.rawQuery(`SELECT count(id) as categoriesCount, sum(case when active = "1" then 1 else 0 end) as active,
        sum(case when active = "0" then 1 else 0 end) as inActive FROM categories where type = "POULTRY"`)
        return result[0]
    }

    static async getFeedingCount() {
        const result = await Database.rawQuery(`SELECT count(id) as categoriesCount, sum(case when active = "1" then 1 else 0 end) as active,
        sum(case when active = "0" then 1 else 0 end) as inActive FROM categories where type = "FEEDING"`)
        return result[0]
    }

    static async getOrdersCount() {
        const result = await Database.rawQuery(`
        SELECT 
            count(id) as orderCount, 
            sum(case when order_status IN ("CANCELLED", "USERREJECTED") then 1 else 0 end) as cancelledOrder,
            sum(case when order_status = "COMPLETED" then 1 else 0 end) as completedOrder 
        FROM orders 
        WHERE type ='POULTRY'
    `)
        return result[0]
    }

    static async getFeedingOrdersCount() {
        const result = await Database.rawQuery(`
        SELECT 
            count(id) as orderCount, 
            sum(case when order_status IN ("CANCELLED", "USERREJECTED") then 1 else 0 end) as cancelledOrder,
            sum(case when order_status = "COMPLETED" then 1 else 0 end) as completedOrder 
        FROM orders 
        WHERE type ='FEEDING'
    `)
        return result[0]
    }

    static async getAreaCount() {
        const result = await Database.rawQuery(`SELECT count(id) as areaCount FROM areas`)
        return result[0]
    }

    static async getDailySalesCount() {
        var datetime: any = new Date();
        datetime = format(datetime, 'yyyy-MM-dd')
        const startDate: any = datetime

        const result = await Database.rawQuery(`SELECT  SUM(net_amount) as dailySalesCount from orders where
         (created_at BETWEEN '${startDate} 00:00:00' AND '${startDate} 23:59:00')`)
        return result[0]
    }

    static async getWeekSalesCount() {
        var datetime: any = new Date();
        var startDate: any = format(datetime, 'yyyy-MM-dd')

        var endDate: any = subMonths(datetime, 1);
        endDate = format(endDate, 'yyyy-MM-dd')

        const result = await Database.rawQuery(`SELECT  SUM(net_amount) as weekSalesCount from orders where
        (created_at BETWEEN '${endDate} 00:00:00' AND '${startDate} 23:59:00')`)
        return result[0]
    }

    static async getYearSalesCount() {
        var datetime: any = new Date();
        var startDate: any = format(datetime, 'yyyy-MM-dd')

        var endDate: any = subYears(datetime, 1);
        endDate = format(endDate, 'yyyy-MM-dd')

        const result = await Database.rawQuery(`SELECT SUM(net_amount) as yearSalesCount from orders where
        (created_at BETWEEN '${endDate} 00:00:00' AND '${startDate} 23:59:00')`)
        return result[0]
    }

}
