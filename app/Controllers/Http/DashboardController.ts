// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DashboardRepo } from "../../Repositories";

export default class DashboardController {

    public async get() {

        const deliveryCount = await DashboardRepo.getDeliveryCount()
        const categoriesCount = await DashboardRepo.getPoultryCategoriesCount()
        const feedingCount = await DashboardRepo.getFeedingCount()
        const ordersCount = await DashboardRepo.getOrdersCount()
        const feedingOrdersCount = await DashboardRepo.getFeedingOrdersCount()
        const userCount = await DashboardRepo.getUserCount()
        // const adminCount = await DashboardRepo.getAdminCount()
        const areaCount = await DashboardRepo.getAreaCount()


        const getDailySalesCount: any = await DashboardRepo.getDailySalesCount()
        const getWeekSalesCount: any = await DashboardRepo.getWeekSalesCount()
        const getYearSalesCount: any = await DashboardRepo.getYearSalesCount()
        const getMonthSalesCount: any = await DashboardRepo.getMonthSalesCount()

        return {
            success: true,
            data: [{
                deliveryCount: deliveryCount[0],
                userCount: userCount[0],
                poultryCategoriesCount: categoriesCount[0],
                feedingCount: feedingCount[0],
                ordersCount: ordersCount[0],
                feedingOrdersCount: feedingOrdersCount[0],
                areaCount: areaCount[0],

                dailySalesCount: { "dailySalesCount": getDailySalesCount[0].dailySalesCount == null ? 0 : getDailySalesCount[0].dailySalesCount },
                weekSalesCount: { "weekSalesCount": getWeekSalesCount[0].weekSalesCount == null ? 0 : getWeekSalesCount[0].weekSalesCount },
                yearSalesCount: { "yearSalesCount": getYearSalesCount[0].yearSalesCount == null ? 0 : getYearSalesCount[0].yearSalesCount },
                monthSalesCount: { "monthSalesCount": getMonthSalesCount[0].monthSalesCount == null ? 0 : getMonthSalesCount[0].monthSalesCount }
            }]
        };
    }
}
