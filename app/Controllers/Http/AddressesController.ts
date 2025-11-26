import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Validators from "../../Validators";
import { AddressDomain } from "../../Domain";
import { AddressRepo } from "../../Repositories";
import { SUCCESS } from "../../Data/language";
import Address from 'App/Models/Address'
import AuthController from 'App/Controllers/Http/AuthController'
import Env from '@ioc:Adonis/Core/Env'
import JWT from 'jsonwebtoken'
const JWT_SECRET_KEY = Env.get('JWT_SECRET_KEY')

export default class AddressesController {

    public async get({ request }: HttpContextContract) {
        await AuthController.checkHeader(request)
        let authHeader = request.header('authorization') || ''

        let decoded
        if (authHeader && authHeader.startsWith('Bearer ')) {
            authHeader = authHeader.slice(7, authHeader.length)
            decoded = JWT.verify(authHeader, JWT_SECRET_KEY)
        }
        const userId: any = decoded ? decoded.id : 0

        return {
            error: false,
            data: AddressDomain.createFromArrOfObject(
                await AddressRepo.get(userId)
            ),
        };
    }

    public async create({ request }: HttpContextContract) {
        await AuthController.checkHeader(request)
        let authHeader = request.header('authorization') || ''

        let decoded
        if (authHeader && authHeader.startsWith('Bearer ')) {
            authHeader = authHeader.slice(7, authHeader.length)
            decoded = JWT.verify(authHeader, JWT_SECRET_KEY)
        }
        const userId: any = decoded ? decoded.id : 0

        let payload = await request.validate(Validators.AddressValidator);

        payload["userId"] = userId
        const language = request.header('language') || 'en'
        const addressDetails = await AddressRepo.create(payload, language);

        return {
            error: false,
            data: AddressDomain.createFromObject(addressDetails),
            message: SUCCESS.ADDRESS_CREATE[language]
        };
    }

    public async update({ request, params }: HttpContextContract) {
        await AuthController.checkHeader(request)

        const UpdatePost = request.all()

        const language = request.header('language') || 'en'
        await AddressRepo.isEntryExist(params.id, language);

        const updateResult = AddressDomain.createFromObject(
            await AddressRepo.update(params.id, UpdatePost, language)
        );
        return {
            error: false,
            data: updateResult,
            message: SUCCESS.ADDRESS_UPDATE[language]
        };
    }

    public async delete({ request, params }: HttpContextContract) {
        await AuthController.checkHeader(request)

        const language = request.header('language') || 'en'
        const result = await AddressRepo.isEntryExist(params.id, language);

        await AddressRepo.delete({ active: 0 }, result, language);
        return {
            error: false,
            message: SUCCESS.ADDRESS_DELETE[language]
        };

    }

    public async adminGet() {
        return {
            error: false,
            data: AddressDomain.createFromArrOfObject(
                await AddressRepo.adminGet()
            ),
        };
    }

    public async addressDelete({ request, params }: HttpContextContract) {
        const language = request.header('language') || 'en'

        const address = await Address.findOrFail(params.id)
        await address.delete()

        return {
            error: false,
            message: SUCCESS.ADDRESS_DELETE[language]
        };

    }
}
