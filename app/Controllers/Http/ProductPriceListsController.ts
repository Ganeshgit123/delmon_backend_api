import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Validators from "../../Validators";
import { ProductPriceListDomain } from "../../Domain";
import { ProductPriceListsRepo } from "../../Repositories";
import { SUCCESS } from "../../Data/language";
import ProductPriceList from 'App/Models/ProductPriceList';
import AuthController from 'App/Controllers/Http/AuthController'

export default class ProductPriceListsController {

    //user API
    public async get({ request }: HttpContextContract) {
        await AuthController.checkHeader(request)
        const userId: any = request.ctx ? request.ctx['token'].decoded.id : 0

        let productPriceList = ProductPriceListDomain.createFromArrOfObject(await ProductPriceListsRepo.get(userId))
        return {
            error: false,
            data: productPriceList,
        };
    }

    public async create({ request }: HttpContextContract) {
        const payload = await request.validate(Validators.ProductPriceListValidator);

        const language = request.header('language') || 'en'
        await ProductPriceListsRepo.checkProductPriceList(payload.productId, payload.priceListNameId, language);

        const priceListNameDetails = await ProductPriceListsRepo.create(payload, language);

        return {
            error: false,
            data: ProductPriceListDomain.createFromObject(priceListNameDetails),
            message: SUCCESS.PRODUCT_PRICE_LIST_CREATE[language]
        };
    }

    public async update({ request, params }: HttpContextContract) {
        const UpdatePost = request.all()

        const language = request.header('language') || 'en'
        // await ProductPriceListsRepo.isEntryExist(params.id, language);

        const updateResult = ProductPriceListDomain.createFromObject(
            await ProductPriceListsRepo.adminupdate(params.id, UpdatePost, language)
        );
        return {
            error: false,
            data: updateResult,
            message: SUCCESS.PRODUCT_PRICE_LIST_UPDATE[language]
        };
    }

    public async delete({ request, params }: HttpContextContract) {
        const language = request.header('language') || 'en'
        const result = await ProductPriceListsRepo.isEntryExist(params.id, language);

        await ProductPriceListsRepo.delete({ active: 0 }, result, language);
        return {
            error: false,
            message: SUCCESS.PRODUCT_PRICE_LIST_DELETE[language]
        };

    }

    //admin API
    public async adminGet({ request }: HttpContextContract) {
        await AuthController.checkHeader(request)
        // console.log("adsfssdf")

        const payload = request.all()
        const language = request.header('language') || 'en'
        const type = request.header('type') || ''
        // const orderBy = payload.orderBy || "product_price_lists.created_at";
        // const orderByValue = payload.orderByValue ? payload.orderByValue.toLowerCase() : "Desc";

        // const searchValue = payload.searchValue ? `%${payload.searchValue}%` : "";

        // const offset = payload.offset ? Number(payload.offset) : 1;
        // const limit = payload.offset ? Number(payload.limit) : 100;

        let productList = await ProductPriceListsRepo.adminGet(payload.priceListId, type)
        if (productList.length != 0) {
            productList.map(async (el) => {
                if (language == 'en') {
                    el.name = el.en_product_name
                } else {
                    el.name = el.ar_product_name
                }
            })
        }

        return {
            error: false,
            data: productList
        };
    }

    public async priceListNameDelete({ request, params }: HttpContextContract) {
        const language = request.header('language') || 'en'

        const priceListName = await ProductPriceList.findOrFail(params.id)
        await priceListName.delete()

        return {
            error: false,
            message: SUCCESS.PRODUCT_PRICE_LIST_DELETE[language]
        };

    }
}
