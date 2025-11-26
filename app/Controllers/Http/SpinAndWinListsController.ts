import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Validators from "../../Validators";
import { SpinAndWinListDomain } from "../../Domain";
import { SpinAndWinListRepo } from "../../Repositories";
import { SUCCESS } from "../../Data/language";

export default class SpinAndWinListsController {

    public async create({ request }: HttpContextContract) {
        const payload = await request.validate(Validators.SpinAndWinListValidator);

        const language = request.header('language') || 'en'
        const couponDetails = await SpinAndWinListRepo.create(payload, language);

        return {
            success: true,
            result: SpinAndWinListDomain.createFromObject(couponDetails),
            massage: SUCCESS.SPIN_USER_CREATE[language]
        };
    }

    public async adminGet() {
        return {
            success: true,
            // data: await SpinAndWinListRepo.adminGet()
            data: SpinAndWinListDomain.createFromArrOfObject(
                await SpinAndWinListRepo.adminGet()
            ),
        };
    }
}