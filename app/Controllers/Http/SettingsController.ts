import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { SettingsDomain } from "../../Domain";
import { SettingsRepo } from "../../Repositories";
import Validators from "../../Validators";
import { SUCCESS } from "../../Data/language";
// import Setting from 'App/Models/Setting'
import Database from '@ioc:Adonis/Lucid/Database'
const cron = require('node-cron');

cron.schedule('0 22 * * *', async () => {

    console.log('Daily cron job running at midnight!');

    // Your daily task logic here
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

    console.log(max_carton_discount_per_day_user, 'max_carton_discount_per_day_user')
    console.log(max_carton_discount_per_day, 'max_carton_discount_per_day')
    //const test = await Database.rawQuery(`SET SQL_SAFE_UPDATES = 0;`)

    const result1 = await Database.rawQuery(`update users set max_carton_discount_per_day_user = '${max_carton_discount_per_day_user}', max_carton_discount_per_day = '${max_carton_discount_per_day}'`)
    console.log(result1, 'result1')


});

// Cron job: Reset carton_discount for all users at the start of every month
cron.schedule('0 0 1 * *', async () => {
    try {
        console.log('Monthly cron job running: Resetting carton_discount for all users');
        const result = await Database.rawQuery(`UPDATE users SET carton_discount = 2`);
        console.log(result, 'carton_discount reset result');
    } catch (error) {
        console.error('Cron job error:', error);
    }
});

export default class SettingsController {

    public async get() {

        return {
            success: true,
            data: SettingsDomain.createFromArrOfObject(
                await SettingsRepo.get()
            ),
        };
    }

    public async create({ request }: HttpContextContract) {
        const payload = await request.validate(Validators.SettingValidator);

        const language = request.header('language') || 'en'
        const proposalDetails = await SettingsRepo.create(payload, language);

        return {
            success: true,
            result: SettingsDomain.createFromObject(proposalDetails),
            massage: SUCCESS.SETTING_CREATE[language]
        };
    }

    public async update({ request, params }: HttpContextContract) {
        const UpdatePost = request.all()

        const language = request.header('language') || 'en'
        await SettingsRepo.isEntryExist(params.id, language);

        const updateResult = SettingsDomain.createFromObject(
            await SettingsRepo.update(params.id, UpdatePost, language)
        );

        if (UpdatePost.key == 'max_carton_discount_per_day') {

            const result1 = await Database.rawQuery(`update users set max_carton_discount_per_day_user = '${UpdatePost.enValue}'`)
            console.log(result1, 'result1')

        }

        if (UpdatePost.key == 'max_carton_discount_per_day_employee') {

            const result1 = await Database.rawQuery(`update users set max_carton_discount_per_day = '${UpdatePost.enValue}'`)
            console.log(result1, 'result1')

        }
        return {
            success: true,
            result: updateResult,
            massage: SUCCESS.SETTING_CREATE[language]
        };
    }

    public async delete({ request, params }: HttpContextContract) {
        // const { postId } = await request.validate(
        //     Validators.DeletePost
        // );
        const language = request.header('language') || 'en'
        const result = await SettingsRepo.isEntryExist(params.id, language);

        await SettingsRepo.delete({ active: 0 }, result, language);
        return {
            success: true,
            massage: SUCCESS.SETTING_DELETE[language]
        }
    }

    public async getUrl({ request }: HttpContextContract) {

        const language = request.header('language') || 'en'
        let setting = SettingsDomain.createFromArrOfObject(
            await SettingsRepo.adminGet(1)
        )

        let whatsAppNumber
        let countryCode
        let enSupportUrl
        let arSupportUrl
        let enAbout
        let arAbout
        let enTermsAndCondition
        let arTermsAndCondition
        let enPrivacyPolicy
        let arPrivacyPolicy
        let enFaq
        let arFaq
        let enEmail
        let arEmail
        let enCall
        let arCall
        let enPopupAdvertisement
        let arPopupAdvertisement

        if (setting.length != 0) {
            await setting.map((data) => {
                if (data.key == 'whatsAppNumber') {
                    whatsAppNumber = data.enValue
                } else if (data.key == 'countryCode') {
                    countryCode = data.enValue

                } else if (data.key == 'supportUrl') {
                    enSupportUrl = data.enValue
                    arSupportUrl = data.enValue

                } else if (data.key == 'about') {
                    enAbout = data.enValue
                    arAbout = data.enValue

                } else if (data.key == 'termsAndCondition') {
                    enTermsAndCondition = data.enValue
                    arTermsAndCondition = data.enValue

                } else if (data.key == 'privacyPolicy') {
                    enPrivacyPolicy = data.enValue
                    arPrivacyPolicy = data.enValue

                } else if (data.key == 'faq') {
                    enFaq = data.enValue
                    arFaq = data.enValue

                } else if (data.key == 'email') {
                    enEmail = data.enValue
                    arEmail = data.enValue

                } else if (data.key == 'call') {
                    enCall = data.enValue
                    arCall = data.enValue

                } else if (data.key == 'popupAdvertisement') {
                    enPopupAdvertisement = data.enValue
                    arPopupAdvertisement = data.enValue

                }
            })
        }

        return {
            success: true,
            // result: result,
            data: {
                support: language == 'en' ? enSupportUrl : arSupportUrl,
                about: language == 'en' ? enAbout : arAbout,
                termsAndCondition: language == 'en' ? enTermsAndCondition : arTermsAndCondition,
                termsAndCondition_ar: 'https://www.google.com',
                privacyPolicy: language == 'en' ? enPrivacyPolicy : arPrivacyPolicy,
                privacyPolicy_ar: 'https://www.google.com',
                faq: language == 'en' ? enFaq : arFaq,
                whatsAppNumber: whatsAppNumber,
                countryCode: countryCode,
                email: language == 'en' ? enEmail : arEmail,
                call: language == 'en' ? enCall : arCall,
                popupAdvertisement: language == 'en' ? enPopupAdvertisement : arPopupAdvertisement,
            },
        };
    }

    public async adminGet({ request }: HttpContextContract) {
        const payload = request.all()

        return {
            success: true,
            data: SettingsDomain.createFromArrOfObject(
                await SettingsRepo.adminGet(payload.active)
            ),
        };
    }

    public async cronUpdate() {

        let setting = SettingsDomain.createFromArrOfObject(
            await SettingsRepo.adminGet(1)
        )

        let max_carton_discount_per_day_user
        let max_carton_discount_per_day
        let carton_discount

        if (setting.length != 0) {
            await setting.map((data) => {
                if (data.key == 'max_carton_discount_per_day') {
                    max_carton_discount_per_day_user = data.enValue
                } else if (data.key == 'max_carton_discount_per_day_employee') {
                    max_carton_discount_per_day = data.enValue

                } else if (data.key == 'carton_discount') {
                    carton_discount = data.enValue
                }
            })
        }

        console.log(max_carton_discount_per_day_user, 'max_carton_discount_per_day_user')
        console.log(max_carton_discount_per_day, 'max_carton_discount_per_day')
        console.log(carton_discount, 'carton_discount')
        //const test = await Database.rawQuery(`SET SQL_SAFE_UPDATES = 0;`)

        const result1 = await Database.rawQuery(`update users set max_carton_discount_per_day_user = '${max_carton_discount_per_day_user}', max_carton_discount_per_day = '${max_carton_discount_per_day}', carton_discount = '${carton_discount}'`)
        console.log(result1, 'result1')


        return {
            success: true,
            // result: updateResult,
            massage: 'completed'
        };
    }
}
