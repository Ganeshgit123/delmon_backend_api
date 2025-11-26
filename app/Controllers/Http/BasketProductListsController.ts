import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Validators from "../../Validators";
import { BasketProductListDomain } from "../../Domain";
import { BasketProductListsRepo, UserTypesRepo } from "../../Repositories";
import { SUCCESS } from "../../Data/language";
import BasketProductList from 'App/Models/BasketProductList';
import AuthController from 'App/Controllers/Http/AuthController'
import Env from '@ioc:Adonis/Core/Env'
import JWT from 'jsonwebtoken'
const JWT_SECRET_KEY = Env.get('JWT_SECRET_KEY')

export default class BasketProductListsController {

    //user API
    public async get({ request }: HttpContextContract) {
        await AuthController.checkHeader(request)
        let payload = request.all()
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
        let basketList = BasketProductListDomain.createFromArrOfObject(await BasketProductListsRepo.get(payload.basketId, priceListNameId))
        if (basketList.length != 0) {
            basketList.map(async (el) => {
                if (language == 'en') {
                    el.name = el.enProductName
                } else {
                    el.name = el.enProductName
                }
            })
        }
        return {
            error: false,
            data: basketList,
        };
    }

    public async create({ request }: HttpContextContract) {
        const payload = await request.validate(Validators.BasketProductListValidator);

        //need valitation for same product
        const language = request.header('language') || 'en'
        await BasketProductListsRepo.checkBasketProduct(payload.basketId, payload.productId, language);

        const basketDetails = await BasketProductListsRepo.create(payload, language);

        return {
            error: false,
            data: BasketProductListDomain.createFromObject(basketDetails),
            message: SUCCESS.BASKET_PRODUCT_CREATE[language]
        };
    }

    public async update({ request, params }: HttpContextContract) {
        const UpdatePost = request.all()

        const language = request.header('language') || 'en'
        await BasketProductListsRepo.isEntryExist(params.id, language);

        const updateResult = BasketProductListDomain.createFromObject(
            await BasketProductListsRepo.update(params.id, UpdatePost, language)
        );
        return {
            error: false,
            data: updateResult,
            message: SUCCESS.BASKET_PRODUCT_UPDATE[language]
        };
    }

    public async delete({ request, params }: HttpContextContract) {
        const language = request.header('language') || 'en'
        const result = await BasketProductListsRepo.isEntryExist(params.id, language);

        await BasketProductListsRepo.delete({ active: 0 }, result, language);
        return {
            error: false,
            message: SUCCESS.BASKET_PRODUCT_DELETE[language]
        };

    }

    //admin API
    public async adminGet({ request }: HttpContextContract) {
        await AuthController.checkHeader(request)

        const payload = request.all()
        const orderBy = payload.orderBy || "created_at";
        const orderByValue = payload.orderByValue ? payload.orderByValue.toLowerCase() : "Desc";

        const searchValue = payload.searchValue ? `%${payload.searchValue}%` : "";

        const offset = payload.offset ? Number(payload.offset) : 1;
        const limit = payload.offset ? Number(payload.limit) : 100;

        return {
            error: false,
            data: BasketProductListDomain.createFromArrOfObject(
                await BasketProductListsRepo.adminGet(payload.type, payload.active, orderBy, orderByValue, searchValue, offset, limit)
            ),
        };
    }

    public async BasketProductListDelete({ request, params }: HttpContextContract) {
        const language = request.header('language') || 'en'

        const basket = await BasketProductList.findOrFail(params.id)
        await basket.delete()

        return {
            error: false,
            message: SUCCESS.BASKET_PRODUCT_DELETE[language]
        };

    }
}
