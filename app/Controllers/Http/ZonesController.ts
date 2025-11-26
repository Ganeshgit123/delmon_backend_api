import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Validators from "../../Validators";
import { ZoneDomain } from "../../Domain";
import { ZoneRepo } from "../../Repositories";
import { SUCCESS } from "../../Data/language";
import Address from 'App/Models/Address'
import AuthController from 'App/Controllers/Http/AuthController'

export default class ZonesController {

    public async get({ request }: HttpContextContract) {
        await AuthController.checkHeader(request)

        const userId = request.header('userId') || ''

        return {
            error: false,
            data: ZoneDomain.createFromArrOfObject(
                await ZoneRepo.get(userId)
            ),
        };
    }

    public async create({ request }: HttpContextContract) {
        await AuthController.checkHeader(request)

        let payload = await request.validate(Validators.ZoneValidator);

        const language = request.header('language') || 'en'
        const addressDetails = await ZoneRepo.create(payload, language);

        return {
            error: false,
            data: ZoneDomain.createFromObject(addressDetails),
            message: SUCCESS.ZONE_CREATE[language]
        };
    }

    public async update({ request, params }: HttpContextContract) {
        await AuthController.checkHeader(request)

        const UpdatePost = request.all()

        const language = request.header('language') || 'en'
        await ZoneRepo.isEntryExist(params.id, language);

        const updateResult = ZoneDomain.createFromObject(
            await ZoneRepo.update(params.id, UpdatePost, language)
        );
        return {
            error: false,
            data: updateResult,
            message: SUCCESS.ZONE_UPDATE[language]
        };
    }

    public async delete({ request, params }: HttpContextContract) {
        await AuthController.checkHeader(request)

        const language = request.header('language') || 'en'
        const result = await ZoneRepo.isEntryExist(params.id, language);

        await ZoneRepo.delete({ active: 0 }, result, language);
        return {
            error: false,
            message: SUCCESS.ZONE_DELETE[language]
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
            data: ZoneDomain.createFromArrOfObject(
                await ZoneRepo.adminGet(active, orderBy, orderByValue, searchValue, offset, limit)
            ),
        };
    }

    public async addressDelete({ request, params }: HttpContextContract) {
        const language = request.header('language') || 'en'

        const address = await Address.findOrFail(params.id)
        await address.delete()

        return {
            error: false,
            message: SUCCESS.ZONE_DELETE[language]
        };

    }
}
