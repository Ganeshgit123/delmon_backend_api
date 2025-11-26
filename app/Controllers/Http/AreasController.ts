import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Validators from "../../Validators";
import { AreaDomain } from "../../Domain";
import { AreaRepo } from "../../Repositories";
import { SUCCESS } from "../../Data/language";
import Address from 'App/Models/Address'
import AuthController from 'App/Controllers/Http/AuthController'

export default class ZonesController {

    public async get({ request }: HttpContextContract) {
        await AuthController.checkHeader(request)

        const userId = request.header('userId') || ''

        return {
            error: false,
            data: AreaDomain.createFromArrOfObject(
                await AreaRepo.get(userId)
            ),
        };
    }

    public async userGet({ request }: HttpContextContract) {
        await AuthController.checkHeader(request)

        const payload = request.all()
        const orderBy = payload.orderBy || "created_at";
        const orderByValue = payload.orderByValue ? payload.orderByValue.toLowerCase() : "desc";
        const searchValue = payload.searchValue ? `%${payload.searchValue}%` : "";
        const offset = payload.offset ? Number(payload.offset) : 1;
        const limit = payload.offset ? Number(payload.limit) : 100;
        const active = payload.active || "";

        return {
            error: false,
            data: AreaDomain.createFromArrOfObject(
                await AreaRepo.adminGet(active, orderBy, orderByValue, searchValue, offset, limit, payload.zoneId)
            ),
        };
    }

    public async getArea({ request }: HttpContextContract) {
        await AuthController.checkHeader(request)

        // const userId = request.header('userId') || ''
        const payload = request.all()
        const pinId = payload.pinId || ''

        return {
            error: false,
            data: AreaDomain.createFromArrOfObject(
                await AreaRepo.getArea(pinId)
            ),
        };
    }

    public async create({ request }: HttpContextContract) {
        await AuthController.checkHeader(request)

        let payload = await request.validate(Validators.AreaValidator);

        const language = request.header('language') || 'en'
        const addressDetails = await AreaRepo.create(payload, language);

        return {
            error: false,
            data: AreaDomain.createFromObject(addressDetails),
            message: SUCCESS.AREA_CREATE[language]
        };
    }

    public async update({ request, params }: HttpContextContract) {
        await AuthController.checkHeader(request)

        const UpdatePost = request.all()

        const language = request.header('language') || 'en'
        await AreaRepo.isEntryExist(params.id, language);

        const updateResult = AreaDomain.createFromObject(
            await AreaRepo.update(params.id, UpdatePost, language)
        );
        return {
            error: false,
            data: updateResult,
            message: SUCCESS.AREA_UPDATE[language]
        };
    }

    public async delete({ request, params }: HttpContextContract) {
        await AuthController.checkHeader(request)

        const language = request.header('language') || 'en'
        const result = await AreaRepo.isEntryExist(params.id, language);

        await AreaRepo.delete({ active: 0 }, result, language);
        return {
            error: false,
            message: SUCCESS.AREA_DELETE[language]
        };

    }

    public async adminGet({ request }: HttpContextContract) {
        await AuthController.checkHeader(request)

        const payload = request.all()
        const orderBy = payload.orderBy || "created_at";
        const orderByValue = payload.orderByValue ? payload.orderByValue.toLowerCase() : "desc";
        const searchValue = payload.searchValue ? `%${payload.searchValue}%` : "";
        const offset = payload.offset ? Number(payload.offset) : 1;
        const limit = payload.offset ? Number(payload.limit) : 100;
        const active = payload.active || "";

        return {
            error: false,
            data: AreaDomain.createFromArrOfObject(
                await AreaRepo.adminGet(active, orderBy, orderByValue, searchValue, offset, limit, payload.zoneId)
            ),
        };
    }

    public async addressDelete({ request, params }: HttpContextContract) {
        const language = request.header('language') || 'en'

        const address = await Address.findOrFail(params.id)
        await address.delete()

        return {
            error: false,
            message: SUCCESS.AREA_DELETE[language]
        };

    }
}
