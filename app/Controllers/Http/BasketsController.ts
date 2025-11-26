import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Validators from "../../Validators";
import { BasketDomain, BasketProductListDomain } from "../../Domain";
import { BasketsRepo, UserTypesRepo, BasketProductListsRepo, CartRepo } from "../../Repositories";
import { SUCCESS } from "../../Data/language";
import Basket from 'App/Models/Basket';
import AuthController from 'App/Controllers/Http/AuthController'
import Env from '@ioc:Adonis/Core/Env'
import JWT from 'jsonwebtoken'

const JWT_SECRET_KEY = Env.get('JWT_SECRET_KEY')

export default class BasketsController {

    //user API
    public async get({ request }: HttpContextContract) {
        await AuthController.checkHeader(request)
        const userId: any = request.ctx ? request.ctx['token'].decoded.id : 0
        // const language = request.header('language') || 'en'

        let basketList = BasketDomain.createFromArrOfObject(await BasketsRepo.get(userId))
        // if (basketList.length != 0) {
        //     basketList.map(async (el) => {
        //         if (language == 'en') {
        //             el.name = el.enName
        //         } else {
        //             el.name = el.arName
        //         }
        //     })
        // }
        return {
            error: false,
            data: basketList,
        };
    }

    public async basketToCart({ params, request }: HttpContextContract) {
        await AuthController.checkHeader(request)
        const userId: any = request.ctx ? request.ctx['token'].decoded.id : 0
        let authHeader = request.header('authorization') || ''
        const language = request.header('language') || 'en'

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
        let basketList = BasketProductListDomain.createFromArrOfObject(await BasketProductListsRepo.get(params.id, priceListNameId))

        if (basketList.length != 0) {
            basketList.map(async (el) => {
                let data = {
                    userId: userId,
                    quantity: 1,
                    productId: el.productId,
                    price: el.price,
                    type: 'POULTRY'
                }
                let cart = await CartRepo.checkCart(userId, el.productId);

                if (cart.length == 0) {
                    await CartRepo.create(data, language);
                } else {
                    let data = {
                        quantity: 1 + cart[0].quantity
                    }
                    await CartRepo.update(cart[0].id, data, language)
                }
            })
        }
        return {
            error: false,
            message: SUCCESS.CART_CREATE[language]
        };
    }

    public async create({ request }: HttpContextContract) {
        const payload = await request.validate(Validators.BasketValidator);

        const language = request.header('language') || 'en'
        const userId: any = request.ctx ? request.ctx['token'].decoded.id : 0
        payload.userId = userId
        await BasketsRepo.checkBasketName(userId, payload.enName || '', payload.arName || '', language, payload.name);

        const basketDetails = await BasketsRepo.create(payload, language);

        return {
            error: false,
            data: BasketDomain.createFromObject(basketDetails),
            message: SUCCESS.BASKET_CREATE[language]
        };
    }

    public async update({ request, params }: HttpContextContract) {
        const UpdatePost = request.all()

        const language = request.header('language') || 'en'
        await BasketsRepo.isEntryExist(params.id, language);

        const updateResult = BasketDomain.createFromObject(
            await BasketsRepo.update(params.id, UpdatePost, language)
        );
        return {
            error: false,
            data: updateResult,
            message: SUCCESS.BASKET_UPDATE[language]
        };
    }

    public async delete({ request, params }: HttpContextContract) {
        const language = request.header('language') || 'en'
        const result = await BasketsRepo.isEntryExist(params.id, language);

        await BasketsRepo.delete({ active: 0 }, result, language);
        return {
            error: false,
            message: SUCCESS.BASKET_DELETE[language]
        };

    }

    //admin API
    public async adminGet({ request }: HttpContextContract) {
        await AuthController.checkHeader(request)

        const payload = request.all()
        const orderBy = payload.orderBy || "created_at";
        const orderByValue = payload.orderByValue ? payload.orderByValue.toLowerCase() : "Desc";
        const language = request.header('language') || 'en'
        const isBasket = payload.isBasket || '';

        const searchValue = payload.searchValue ? `%${payload.searchValue}%` : "";

        const offset = payload.offset ? Number(payload.offset) : 1;
        const limit = payload.offset ? Number(payload.limit) : 100;
        let basketList = BasketDomain.createFromArrOfObject(
            await BasketsRepo.adminGet(payload.type, payload.active, orderBy, orderByValue, searchValue, offset, limit, isBasket)
        )
        if (basketList.length != 0) {
            basketList.map(async (el) => {
                if (language == 'en') {
                    el.name = el.enName
                } else {
                    el.name = el.arName
                }
            })
        }

        return {
            error: false,
            data: basketList,
        };
    }

    public async basketDelete({ request, params }: HttpContextContract) {
        const language = request.header('language') || 'en'

        const basket = await Basket.findOrFail(params.id)
        await basket.delete()

        return {
            error: false,
            message: SUCCESS.BASKET_DELETE[language]
        };

    }

    public async adminBasketToCart({ request }: HttpContextContract) {
        const payload = request.all()
        await AuthController.checkHeader(request)
        const userId: any = request.ctx ? request.ctx['token'].decoded.id : 0
        // let authHeader = request.header('authorization') || ''
        const language = request.header('language') || 'en'
        const type = request.header('type') || ''

        // let decoded
        // if (authHeader && authHeader.startsWith('Bearer ')) {
        //     authHeader = authHeader.slice(7, authHeader.length)
        //     decoded = JWT.verify(authHeader, JWT_SECRET_KEY)
        // }

        // const userType: any = decoded ? decoded.userType : null
        // const merchantType: any = decoded ? decoded.merchantType : null

        // let typeOfUser = ''
        // if (merchantType == null) {
        //     typeOfUser = userType
        // } else {
        //     typeOfUser = merchantType
        // }

        let cart = await CartRepo.checkCart(userId, payload.productId);

        if (cart.length == 0) {
            payload["userId"] = userId
            payload["type"] = type
            payload["price"] = 0
            payload["quantity"] = 1
            await CartRepo.create(payload, language);

        } else {
            payload["userId"] = userId
            payload["type"] = type
            payload["price"] = 0
            let data = {
                quantity: 1 + cart[0].quantity
            }
            await CartRepo.update(cart[0].id, data, language)
        }

        // let priceListNameId = await UserTypesRepo.getUserType(typeOfUser)
        // let basketList = await BasketProductListsRepo.getBasketFromProduct(payload.productId, priceListNameId)

        // if (basketList.length != 0) {
        //     basketList.map(async (el) => {
        //         let data = {
        //             userId: userId,
        //             quantity: 1,
        //             productId: el.id,
        //             price: el.price,
        //             type: 'POULTRY'
        //         }
        //         let cart = await CartRepo.checkCart(userId, el.id);

        //         if (cart.length == 0) {
        //             await CartRepo.create(data, language);
        //         } else {
        //             let data = {
        //                 quantity: 1 + cart[0].quantity
        //             }
        //             await CartRepo.update(cart[0].id, data, language)
        //         }
        //     })
        // }
        return {
            error: false,
            message: SUCCESS.CART_CREATE[language]
        };
    }
}
