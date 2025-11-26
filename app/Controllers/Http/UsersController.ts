import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UserDomain, SettingsDomain } from "../../Domain";
import { UserRepo, SettingsRepo } from "../../Repositories";
import Validators from "../../Validators";
import { SUCCESS } from "../../Data/language";

export default class UsersController {

    // User API
    public async get({ request }: HttpContextContract) {

        const language = request.header('language') || 'en'
        // const userId: any = request.ctx ? request.ctx['token'].decoded.id : 0
        const userId: any = request.header('userId') || 0
        let result = UserDomain.createFromArrOfObject(
            await UserRepo.get(userId, language)
        )
        return {
            error: false,
            data: result.length != 0 ? result[0] : [],
        };
    }

    public async getUserById({ request }: HttpContextContract) {

        // const language = request.header('language') || 'en'
        const userId: any = request.header('userId') || 0
        return {
            error: false,
            userDetails: UserDomain.createFromArrOfObject(
                await UserRepo.getUserById([userId])
            ),
        };
    }

    public async create({ request }: HttpContextContract) {
        const userId: any = request.header('userId') || 0
        let payload: any = await request.validate(Validators.UserValidator);

        const language = request.header('language') || 'en'
        await UserRepo.isEntryExist(userId, language);
        let setting = SettingsDomain.createFromArrOfObject(
            await SettingsRepo.adminGet(1)
        )

        let max_carton_discount_per_day_user
        let max_carton_discount_per_day

        if (setting.length != 0) {
            await setting.map((data) => {
                if (data.key == 'max_carton_discount_per_day') {
                    max_carton_discount_per_day_user = data.enValue
                } else if (data.key == 'max_carton_discount_per_day_employee') {
                    max_carton_discount_per_day = data.enValue
                }
            })
        }


        if (payload.userType == 'EMPLOYEE') {
            let maxCartonDiscountPerDay = max_carton_discount_per_day
            payload['maxCartonDiscountPerDay'] = maxCartonDiscountPerDay
        } else {
            let maxCartonDiscountPerDayUser = max_carton_discount_per_day_user
            payload['maxCartonDiscountPerDayUser'] = maxCartonDiscountPerDayUser
        }

        payload.isNewUser = false
        const updateResult = UserDomain.createFromObject(
            await UserRepo.update(userId, payload, language)
        );

        return {
            error: false,
            data: updateResult,
            message: SUCCESS.USER_CREATE[language]
        };
    }

    public async update({ request }: HttpContextContract) {
        // const updateProposal = await request.validate(Validators.UpdatePost);
        const userDetails = request.all()
        const language = request.header('language') || 'en'
        const userId: any = request.ctx ? request.ctx['token'].decoded.id : 0

        if (!userId) {
            return {
                error: false,
                message: SUCCESS.USER_Id_NOTEXIST[language]
            };
        }

        await UserRepo.isEntryExist(userId, language);

        const updateResult = UserDomain.createFromObject(
            await UserRepo.update(userId, userDetails, language)
        );

        return {
            error: false,
            data: userDetails.active == 0 ? {} : updateResult,
            massage: userDetails.active == 0 ? SUCCESS.USER_DELETE[language] : SUCCESS.USER_UPDATE[language]
        };
    }

    // Admin API

    public async getAllUser({ request }: HttpContextContract) {

        const payload = request.all()
        const userType = payload.userType || ''
        const offset = payload.offset ? Number(payload.offset) : '';
        const limit = payload.offset ? Number(payload.limit) : '10';

        const startDate = payload.startDate ? payload.startDate : '';
        const endDate = payload.endDate ? payload.endDate : '';
        const searchValue = payload.searchValue ? `%${payload.searchValue}%` : "";

        let orderBy = payload.orderBy || 'id'

        orderBy = `users.${orderBy}`;

        const orderByValue = payload.orderByValue ? payload.orderByValue.toLowerCase() : "asc";

        return {
            error: false,
            data: UserDomain.createFromArrOfObject(
                await UserRepo.getAll(offset, limit, startDate, endDate, orderBy, orderByValue, userType, searchValue)
            ),
        };
    }

    public async userDetails({ params, request }: HttpContextContract) {

        const language = request.header('language') || 'en'
        return {
            error: false,
            userDetails: UserDomain.createFromArrOfObject(
                await UserRepo.get(params.id, language)
            ),
        };
    }

    public async adminUpdate({ params, request }: HttpContextContract) {
        const userDetails = request.all()
        const language = request.header('language') || 'en'
        const userId: any = params.id || ''

        if (!userId) {
            return {
                error: false,
                message: SUCCESS.USER_Id_NOTEXIST[language]
            };
        }

        await UserRepo.isEntryExist(userId, language);

        let setting = SettingsDomain.createFromArrOfObject(
            await SettingsRepo.adminGet(1)
        )

        let max_carton_discount_per_day_user
        let max_carton_discount_per_day

        if (setting.length != 0) {
            await setting.map((data) => {
                if (data.key == 'max_carton_discount_per_day') {
                    max_carton_discount_per_day_user = data.enValue
                } else if (data.key == 'max_carton_discount_per_day_employee') {
                    max_carton_discount_per_day = data.enValue
                }
            })
        }


        if (userDetails.userType == 'EMPLOYEE') {
            let maxCartonDiscountPerDay = max_carton_discount_per_day
            userDetails['maxCartonDiscountPerDay'] = maxCartonDiscountPerDay
        } else {
            let maxCartonDiscountPerDayUser = max_carton_discount_per_day_user
            userDetails['maxCartonDiscountPerDayUser'] = maxCartonDiscountPerDayUser
        }


        const updateResult = UserDomain.createFromObject(
            await UserRepo.update(userId, userDetails, language)
        );

        return {
            error: false,
            data: updateResult,
            message: SUCCESS.USER_UPDATE[language]
        };
    }

    public async multiUserSpinUpdate({ request }: HttpContextContract) {
        const payload = request.all()

        const language = request.header('language') || 'en'
        const updateResult = UserDomain.createFromObject(
            await UserRepo.multiUpdate(payload.id, language)
        );

        return {
            success: true,
            result: updateResult,
            massage: SUCCESS.USER_UPDATE[language]
        };
    }
}
