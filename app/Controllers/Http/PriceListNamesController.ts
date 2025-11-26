import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Validators from "../../Validators";
import { PriceListNamesDomain } from "../../Domain";
import { PriceListNamesRepo } from "../../Repositories";
import { SUCCESS } from "../../Data/language";
import PriceListName from 'App/Models/PriceListName';
import AuthController from 'App/Controllers/Http/AuthController'

export default class PriceListNamesController {

    //user API
    public async get({ request }: HttpContextContract) {
        await AuthController.checkHeader(request)
        const userId: any = request.ctx ? request.ctx['token'].decoded.id : 0

        let priceListName = PriceListNamesDomain.createFromArrOfObject(await PriceListNamesRepo.get(userId))
        return {
            error: false,
            data: priceListName,
        };
    }

    public async create({ request }: HttpContextContract) {
        const payload = await request.validate(Validators.PriceListNameValidator);

        const language = request.header('language') || 'en'
        await PriceListNamesRepo.checkPriceListName(payload.name, language);

        const priceListNameDetails = await PriceListNamesRepo.create(payload, language);

        return {
            error: false,
            data: PriceListNamesDomain.createFromObject(priceListNameDetails),
            message: SUCCESS.PRICE_LIST_NAME_CREATE[language]
        };
    }

    public async update({ request, params }: HttpContextContract) {
        const UpdatePost = request.all()

        const language = request.header('language') || 'en'
        await PriceListNamesRepo.isEntryExist(params.id, language);

        const updateResult = PriceListNamesDomain.createFromObject(
            await PriceListNamesRepo.update(params.id, UpdatePost, language)
        );
        return {
            error: false,
            data: updateResult,
            message: SUCCESS.PRICE_LIST_NAME_UPDATE[language]
        };
    }

    public async delete({ request, params }: HttpContextContract) {
        const language = request.header('language') || 'en'
        const result = await PriceListNamesRepo.isEntryExist(params.id, language);

        await PriceListNamesRepo.delete({ active: 0 }, result, language);
        return {
            error: false,
            message: SUCCESS.PRICE_LIST_NAME_DELETE[language]
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
            data: PriceListNamesDomain.createFromArrOfObject(
                await PriceListNamesRepo.adminGet(payload.type, payload.active, orderBy, orderByValue, searchValue, offset, limit)
            ),
        };
    }

    public async priceListNameDelete({ request, params }: HttpContextContract) {
        const language = request.header('language') || 'en'

        const priceListName = await PriceListName.findOrFail(params.id)
        await priceListName.delete()

        return {
            error: false,
            message: SUCCESS.PRICE_LIST_NAME_DELETE[language]
        };

    }
}
