import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Validators from "../../Validators";
import { PriceListDomain } from "../../Domain";
import { PriceListRepo } from "../../Repositories";
import { SUCCESS } from "../../Data/language";
import PriceList from 'App/Models/PriceList'

export default class PriceListsController {

    public async get({ request }: HttpContextContract) {
        const type = request.header('type') || ''
        const language = request.header('language') || 'en'

        let bannerList = PriceListDomain.createFromArrOfObject(
            await PriceListRepo.get(type)
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
        const payload = await request.validate(Validators.PriceListValidator);
        const language = request.header('language') || 'en'
        const bannerDetails = await PriceListRepo.create(payload, language);
        return {
            error: false,
            data: PriceListDomain.createFromObject(bannerDetails),
            message: SUCCESS.PRICE_LIST_CREATE[language]
        };
    }

    public async update({ request, params }: HttpContextContract) {
        const UpdatePost = request.all()

        const language = request.header('language') || 'en'
        await PriceListRepo.isEntryExist(params.id, language);

        const updateResult = PriceListDomain.createFromObject(
            await PriceListRepo.update(params.id, UpdatePost, language)
        );
        return {
            error: false,
            data: updateResult,
            message: SUCCESS.PRICE_LIST_UPDATE[language]
        };
    }

    public async delete({ request, params }: HttpContextContract) {
        const language = request.header('language') || 'en'
        const result = await PriceListRepo.isEntryExist(params.id, language);

        await PriceListRepo.delete({ active: 0 }, result, language);
        return {
            error: false,
            message: SUCCESS.PRICE_LIST_DELETE[language]
        };

    }

    public async adminGet({ request }: HttpContextContract) {
        const payload = request.all()
        return {
            error: false,
            data: PriceListDomain.createFromArrOfObject(
                await PriceListRepo.adminGet(payload.type, payload.active)
            ),
        };
    }

    public async bannerDelete({ request, params }: HttpContextContract) {
        const language = request.header('language') || 'en'

        const priceList = await PriceList.findOrFail(params.id)
        await priceList.delete()

        return {
            error: false,
            message: SUCCESS.PRICE_LIST_DELETE[language]
        };

    }
}
