import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ReportRepo } from "../../Repositories";
import Validators from "../../Validators";
import { SUCCESS } from "../../Data/language";
import ReportDomain from "../../Domain/Report";
import _ from "lodash"

export default class ReportsController {

    public async create({ request }: HttpContextContract) {
        const payload = await request.validate(Validators.ReportCreate);
        const language = request.header('language') || 'en'
        const userId: any = request.header('userId') || 0
        // const userId: any = request.ctx ? request.ctx['token'].decoded.id : 0
        payload.userId = userId

        await ReportRepo.create(payload, language);

        // const data = {
        //     "userId": payload.userId,
        //     "type": "REPORT"
        // }

        // await NotificationRepo.adminNotificationcreate(data, language)

        return {
            error: false,
            massage: SUCCESS.ADD_COMMENT[language]
        };
    }

    public async get({ request }: HttpContextContract) {

        // const language = request.header('language') || 'en'
        const payload = request.all()
        const offset = payload.offset ? Number(payload.offset) : 1;
        const limit = payload.offset ? Number(payload.limit) : 10;

        let result = ReportDomain.createFromArrOfObject(
            await ReportRepo.get(offset, limit)
        )

        if (result.length != 0) {
            return {
                error: false,
                data: result,
            };
        } else {
            return {
                error: false,
                data: [],
            };
        }
    }
}
