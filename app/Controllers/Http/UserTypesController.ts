import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Validators from "../../Validators";
import { UserTypesDomain } from "../../Domain";
import { UserTypesRepo } from "../../Repositories";
import { SUCCESS } from "../../Data/language";
import UserType from 'App/Models/UserType';
import AuthController from 'App/Controllers/Http/AuthController'

export default class UserTypesController {

    //user API
    public async get({ request }: HttpContextContract) {
        await AuthController.checkHeader(request)
        const userId: any = request.ctx ? request.ctx['token'].decoded.id : 0

        let userTypeList = UserTypesDomain.createFromArrOfObject(await UserTypesRepo.get(userId))
        return {
            error: false,
            data: userTypeList,
        };
    }

    public async create({ request }: HttpContextContract) {
        const payload = await request.validate(Validators.UserTypeValidator);

        const language = request.header('language') || 'en'
        await UserTypesRepo.checkUserType(payload.name, language);

        const userTypeListDetails = await UserTypesRepo.create(payload, language);

        return {
            error: false,
            data: UserTypesDomain.createFromObject(userTypeListDetails),
            message: SUCCESS.USER_TYPE_CREATE[language]
        };
    }

    public async update({ request, params }: HttpContextContract) {
        const UpdatePost = request.all()

        const language = request.header('language') || 'en'
        await UserTypesRepo.isEntryExist(params.id, language);

        const updateResult = UserTypesDomain.createFromObject(
            await UserTypesRepo.update(params.id, UpdatePost, language)
        );
        return {
            error: false,
            data: updateResult,
            message: SUCCESS.USER_TYPE_UPDATE[language]
        };
    }

    public async delete({ request, params }: HttpContextContract) {
        const language = request.header('language') || 'en'
        const result = await UserTypesRepo.isEntryExist(params.id, language);

        await UserTypesRepo.delete({ active: 0 }, result, language);
        return {
            error: false,
            message: SUCCESS.USER_TYPE_DELETE[language]
        };

    }

    //admin API
    public async adminGet({ request }: HttpContextContract) {
        await AuthController.checkHeader(request)

        const payload = request.all()
        const orderBy = payload.orderBy || "user_types.created_at";
        const orderByValue = payload.orderByValue ? payload.orderByValue.toLowerCase() : "Desc";

        const searchValue = payload.searchValue ? `%${payload.searchValue}%` : "";

        const offset = payload.offset ? Number(payload.offset) : 1;
        const limit = payload.offset ? Number(payload.limit) : 100;

        return {
            error: false,
            data: UserTypesDomain.createFromArrOfObject(
                await UserTypesRepo.adminGet(payload.type, payload.active, orderBy, orderByValue, searchValue, offset, limit)
            ),
        };
    }

    public async userTypeDelete({ request, params }: HttpContextContract) {
        const language = request.header('language') || 'en'

        const userType = await UserType.findOrFail(params.id)
        await userType.delete()

        return {
            error: false,
            message: SUCCESS.USER_TYPE_DELETE[language]
        };

    }
}
