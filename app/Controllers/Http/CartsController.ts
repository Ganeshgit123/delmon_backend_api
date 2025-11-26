import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Validators from "../../Validators";
import { CartDomain, UserDomain, SettingsDomain } from "../../Domain";
import { CartRepo, ProductRepo, UserTypesRepo, UserRepo, SettingsRepo, FavoritesRepo } from "../../Repositories";
import { SUCCESS } from "../../Data/language";
import Env from '@ioc:Adonis/Core/Env'
import JWT from 'jsonwebtoken'
const JWT_SECRET_KEY = Env.get('JWT_SECRET_KEY')

export default class CartsController {

    public async get({ request }: HttpContextContract) {
        const userId = request.header('userId') || ''
        // const userId: any = request.ctx ? request.ctx['token'].decoded.id : 0
        const type = request.header('type') || ''
        let authHeader = request.header('authorization') || ''
        const language = request.header('language') || 'en'
        let userDetail = UserDomain.createFromArrOfObject(
            await UserRepo.getUserById([userId])
        )
        // console.log(userDetail, 'userDetail[0]')

        let loyaltyPoint = userDetail.length != 0 ? userDetail[0].loyaltyPoint : ''
        let walletAmount = userDetail.length != 0 ? userDetail[0].walletAmount : ''
        let cartonDiscount = userDetail.length != 0 ? userDetail[0].cartonDiscount : ''
        let maxCartonDiscountPerDay = userDetail.length != 0 ? userDetail[0].maxCartonDiscountPerDay : ''
        let maxCartonDiscountPerDayUser = userDetail.length != 0 ? userDetail[0].maxCartonDiscountPerDayUser : ''
        // console.log(maxCartonDiscountPerDayUser, 'maxCartonDiscountPerDayUser')

        let decoded
        if (authHeader && authHeader.startsWith('Bearer ')) {
            authHeader = authHeader.slice(7, authHeader.length)
            decoded = JWT.verify(authHeader, JWT_SECRET_KEY)
        }

        const userType: any = decoded ? decoded.userType : null
        const merchantType: any = decoded ? decoded.merchantType : null

        let typeOfUser = ''
        if (merchantType == null) {
            typeOfUser = userType
        } else {
            typeOfUser = merchantType
        }

        let priceListNameId = await UserTypesRepo.getUserType(typeOfUser)
        let cartList = CartDomain.createFromArrOfObject(
            await CartRepo.get(userId, type, priceListNameId)
        )
        if (cartList.length != 0) {
            cartList.map(async (el) => {
                if (language == 'en') {
                    el.name = el.enProductName
                } else {
                    el.name = el.arProductName
                }
            })
        }

        // var totalCartCount = await CartRepo.getCartCount(userId, type);

        let setting = SettingsDomain.createFromArrOfObject(
            await SettingsRepo.adminGet(1)
        )

        let address
        let deliveryTime
        let vat
        let canCalendarShowForDelivery
        let maxDeliveryDateCanChoose
        let holidayList = []
        let isCardPayment
        let isCod
        let isSelfPickup
        let isDelivery
        let defaultCartonDiscount
        let defaultMaxCartonDiscountPerDayEmployee
        let defaultMaxCartonDiscountPerDayUser
        if (setting.length != 0) {
            await setting.map((data) => {

                if (data.key == 'address') {
                    address = data.enValue
                } else if (data.key == 'deliveryTime') {
                    deliveryTime = data.enValue

                } else if (data.key == 'vat') {
                    vat = data.enValue

                } else if (data.key == 'can_calendar_show_for_delivery') {
                    canCalendarShowForDelivery = data.enValue

                } else if (data.key == 'max_delivery_date_can_choose') {
                    maxDeliveryDateCanChoose = data.enValue

                } else if (data.key == 'holidayList') {
                    holidayList = data.enValue ? JSON.parse(data.enValue) : []

                } else if (data.key == 'is_card_payment') {
                    isCardPayment = data.enValue ? JSON.parse(data.enValue) : []

                } else if (data.key == 'is_cod') {
                    isCod = data.enValue ? JSON.parse(data.enValue) : []

                } else if (data.key == 'is_self_pickup') {
                    isSelfPickup = data.enValue ? JSON.parse(data.enValue) : []

                } else if (data.key == 'is_delivery') {
                    isDelivery = data.enValue ? JSON.parse(data.enValue) : []

                } else if (data.key == 'carton_discount') {
                    defaultCartonDiscount = data.enValue ? JSON.parse(data.enValue) : []

                } else if (data.key == 'max_carton_discount_per_day_employee') {
                    defaultMaxCartonDiscountPerDayEmployee = data.enValue ? JSON.parse(data.enValue) : []

                } else if (data.key == 'max_carton_discount_per_day') {
                    defaultMaxCartonDiscountPerDayUser = data.enValue ? JSON.parse(data.enValue) : []

                }
            })
        }
        // console.log(defaultCartonDiscount, 'defaultCartonDiscount')
        // console.log(defaultMaxCartonDiscountPerDayEmployee, 'defaultMaxCartonDiscountPerDayEmployee')
        // console.log(defaultMaxCartonDiscountPerDayUser, 'defaultMaxCartonDiscountPerDayUser')

        // console.log(address, 'address');

        return {
            error: false,
            totalCartCount: 0,
            loyaltyPoint: loyaltyPoint,
            loyaltyPointDiscount: 10,
            data: cartList,
            cartonDiscount,
            maxCartonDiscountPerDay,
            maxCartonDiscountPerDayUser,
            vat: vat,
            address: {
                "buildingName": "light house",
                "landmark": "near A2B",
                "address": "Delmon Poultry Company (B.S.C)",
                "pin": 607,
                "latitude": "20.11",
                "longitude": "19.22",
            },
            walletBalance: walletAmount,
            adminDate: deliveryTime,
            canCalendarShowForDelivery: canCalendarShowForDelivery,
            maxDeliveryDateCanChoose: maxDeliveryDateCanChoose,
            holidayList,
            isCardPayment,
            isCod,
            isSelfPickup,
            isDelivery,
            defaultCartonDiscount,
            defaultMaxCartonDiscountPerDayEmployee,
            defaultMaxCartonDiscountPerDayUser
        };
    }

    public async create({ request }: HttpContextContract) {
        const payload = await request.validate(Validators.CartValidator);
        const userId: any = request.header('userId') || ''
        // const userId: any = request.ctx ? request.ctx['token'].decoded.id : 0
        const language = request.header('language') || 'en'

        await ProductRepo.isEntryExist(payload.productId, language);
        const type = request.header('type') || ''
        let cart = await CartRepo.checkCart(userId, payload.productId);

        if (cart.length == 0) {

            payload["userId"] = userId
            payload["type"] = type
            payload["quantity"] = 1

            const cartDetails = await CartRepo.create(payload, language);
            var totalCartCount = await CartRepo.getCartCount(userId, type);

            return {
                error: false,
                data: CartDomain.createFromObject(cartDetails),
                totalCartCount: totalCartCount,
                message: SUCCESS.CART_CREATE[language]
            };

        } else {
            payload["userId"] = userId
            payload["type"] = type
            let data = {
                quantity: 1 + cart[0].quantity
            }

            const cartDetails = await CartRepo.update(cart[0].id, data, language)
            var totalCartCount = await CartRepo.getCartCount(userId, type)
            return {
                error: false,
                data: CartDomain.createFromObject(cartDetails),
                totalCartCount: totalCartCount,
                message: SUCCESS.CART_CREATE[language]
            };
        }

    }

    public async update({ request, params }: HttpContextContract) {
        const UpdatePost = request.all()
        const userId = request.header('userId') || ''
        // const userId: any = request.ctx ? request.ctx['token'].decoded.id : 0
        const language = request.header('language') || 'en'
        const type = request.header('type') || ''

        await CartRepo.isEntryExist(params.id, language);
        let updateResult: any = {}
        if (UpdatePost.quantity != 0) {
            updateResult = CartDomain.createFromObject(
                await CartRepo.update(params.id, UpdatePost, language)
            );
        } else {
            await CartRepo.delete(params.id, language);
        }
        var totalCartCount = await CartRepo.getCartCount(userId, type);

        return {
            error: false,
            data: updateResult,
            totalCartCount: totalCartCount,
            message: SUCCESS.CART_UPDATE[language]
        };
    }

    public async delete({ request, params }: HttpContextContract) {
        const language = request.header('language') || 'en'

        await CartRepo.delete(params.id, language);

        return {
            error: false,
            message: SUCCESS.CART_DELETE[language]
        };

    }

    public async mostOrderProduct({ request }: HttpContextContract) {

        const payload = request.all()
        const type = payload.type || 'POULTRY'
        return {
            success: true,
            data: await CartRepo.getMostOrderProduct(type),
        };
    }

    public async mostFavoritesProduct({ request }: HttpContextContract) {

        const payload = request.all()
        const type = payload.type || 'POULTRY'
        return {
            success: true,
            data: await FavoritesRepo.mostFavoritesProduct(type),
        };
    }

    public async mostWantedAddress() {

        return {
            success: true,
            data: await FavoritesRepo.mostWantedAddress(),
        };
    }

}
