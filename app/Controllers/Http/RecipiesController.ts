import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Validators from "../../Validators";
import { RecipiesDomain } from "../../Domain";
import { RecipiesRepo } from "../../Repositories";
import { SUCCESS } from "../../Data/language";
import Recipy from 'App/Models/Recipy';
import AuthController from 'App/Controllers/Http/AuthController'


export default class RecipiesController {

    public async get({ request }: HttpContextContract) {
        await AuthController.checkHeader(request)

        const payload = request.all()
        const language = request.header('language') || 'en'
        // const type = request.header('type') || ''
        const categoryId = payload.categoryId ? payload.categoryId == 0 ? "" : payload.categoryId : ''

        let recipiesList = RecipiesDomain.createFromArrOfObject(
            await RecipiesRepo.getRecipy(categoryId)
        )

        if (recipiesList.length != 0) {
            recipiesList.map(async (el) => {
                if (language == 'en') {
                    el.name = el.name
                    el.ingredients = el.ingredients
                    el.steps = el.steps
                } else {
                    el.name = el.arName
                    el.ingredients = el.arIngredients
                    el.steps = el.arSteps
                }
            })
        }

        return {
            error: false,
            data: recipiesList,
        };
    }

    public async create({ request }: HttpContextContract) {
        const payload = await request.validate(Validators.RecipyValidator);

        const language = request.header('language') || 'en'
        const recipiesDetails = await RecipiesRepo.create(payload, language);

        return {
            error: false,
            data: RecipiesDomain.createFromObject(recipiesDetails),
            message: SUCCESS.RECIPY_CREATE[language]
        };
    }

    public async update({ request, params }: HttpContextContract) {
        const UpdatePost = request.all()

        const language = request.header('language') || 'en'
        await RecipiesRepo.isEntryExist(params.id, language);

        const updateResult = RecipiesDomain.createFromObject(
            await RecipiesRepo.update(params.id, UpdatePost, language)
        );
        return {
            error: false,
            data: updateResult,
            message: SUCCESS.RECIPY_UPDATE[language]
        };
    }

    public async delete({ request, params }: HttpContextContract) {
        const language = request.header('language') || 'en'
        const result = await RecipiesRepo.isEntryExist(params.id, language);

        await RecipiesRepo.delete({ active: 0 }, result, language);
        return {
            error: false,
            message: SUCCESS.RECIPY_DELETE[language]
        };

    }

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
            data: RecipiesDomain.createFromArrOfObject(
                await RecipiesRepo.adminGet(payload.type, payload.active, orderBy, orderByValue, searchValue, offset, limit)
            ),
        };
    }

    public async recipiesDelete({ request, params }: HttpContextContract) {
        // const result = await RecipiesRepo.isEntryExist(params.id);
        const language = request.header('language') || 'en'

        const banner = await Recipy.findOrFail(params.id)
        await banner.delete()

        return {
            error: false,
            message: SUCCESS.RECIPY_DELETE[language]
        };

    }
}
