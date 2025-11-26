import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Validators from "../../Validators";
import { BannerDomain } from "../../Domain";
import { BannerRepo } from "../../Repositories";
import { SUCCESS } from "../../Data/language";
import Banner from 'App/Models/Banner';
import AuthController from 'App/Controllers/Http/AuthController'

export default class BannersController {

    //user API
    public async get({ request }: HttpContextContract) {
        await AuthController.checkHeader(request)

        const type = request.header('type') || ''
        const language = request.header('language') || 'en'

        let bannerList = BannerDomain.createFromArrOfObject(
            await BannerRepo.get(type)
        )
        if (bannerList.length != 0) {
            bannerList.map((el) => {
                el.image = language == 'en' ? el.enImage : el.arImage
            })
        }

        return {
            error: false,
            data: bannerList,
        };
    }

    public async create({ request }: HttpContextContract) {
        const payload = await request.validate(Validators.BannerValidator);

        const language = request.header('language') || 'en'
        const bannerDetails = await BannerRepo.create(payload, language);

        return {
            error: false,
            data: BannerDomain.createFromObject(bannerDetails),
            message: SUCCESS.BANNER_CREATE[language]
        };
    }

    public async update({ request, params }: HttpContextContract) {
        const UpdatePost = request.all()

        const language = request.header('language') || 'en'
        await BannerRepo.isEntryExist(params.id, language);

        const updateResult = BannerDomain.createFromObject(
            await BannerRepo.update(params.id, UpdatePost, language)
        );
        return {
            error: false,
            data: updateResult,
            message: SUCCESS.BANNER_UPDATE[language]
        };
    }

    public async delete({ request, params }: HttpContextContract) {
        const language = request.header('language') || 'en'
        const result = await BannerRepo.isEntryExist(params.id, language);

        await BannerRepo.delete({ active: 0 }, result, language);
        return {
            error: false,
            message: SUCCESS.BANNER_DELETE[language]
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
            data: BannerDomain.createFromArrOfObject(
                await BannerRepo.adminGet(payload.type, payload.active, orderBy, orderByValue, searchValue, offset, limit)
            ),
        };
    }

    public async bannerDelete({ request, params }: HttpContextContract) {
        // const result = await BannerRepo.isEntryExist(params.id);
        const language = request.header('language') || 'en'

        const banner = await Banner.findOrFail(params.id)
        await banner.delete()

        return {
            error: false,
            message: SUCCESS.BANNER_DELETE[language]
        };

    }
}
