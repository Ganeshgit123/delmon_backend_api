import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { NotificationRepo, UserRepo } from "../../Repositories";
// import Validators from "../../Validators";
import { SUCCESS, FAILURE } from "../../Data/language";
import { NotificationDomain, UserDomain } from "../../Domain";
import FcmNotification from "../../Listeners/Notification";
import Event from '@ioc:Adonis/Core/Event'
import JWT from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'
const JWT_SECRET_KEY = Env.get('JWT_SECRET_KEY')
import axios, { AxiosRequestConfig } from 'axios'


export default class NotificationsController {

    public async update({ request, params }: HttpContextContract) {
        const payload = request.all()

        const language = request.header('language') || 'es'
        await NotificationRepo.isEntryExist(params.id, language);

        const updateResult = NotificationDomain.createFromObject(
            await NotificationRepo.update(params.id, payload, language)
        );

        return {
            success: true,
            result: updateResult,
            massage: SUCCESS.NOTIFICATION_UPDATE[language]
        };
    }

    public async readAll({ request, response }: HttpContextContract) {
        // const payload = request.all()
        let token = request.headers().authorization || ''

        if (token && token.startsWith("Bearer ")) token = token.slice(7, token.length);
        let userId
        if (token) {
            const decoded = await JWT.verify(token, JWT_SECRET_KEY, async (err, decodedData) => {
                if (err) return false
                return decodedData
            })

            // if (!decoded) return response.status(422).send({
            //     msg: `JWT Expired`
            // })
            // userId = decoded.id
        }

        const language = request.header('language') || 'es'

        const updateResult = await NotificationRepo.readAll(userId, language)

        return {
            success: true,
            result: updateResult,
            massage: SUCCESS.NOTIFICATION_UPDATE[language]
        };
    }

    public async get({ request }: HttpContextContract) {

        const payload = request.all()
        const offset = payload.offset ? Number(payload.offset) : 1;
        const limit = payload.offset ? Number(payload.limit) : 1000;
        const userId = payload.userId || ''

        return {
            success: true,
            data: NotificationDomain.createFromArrOfObject(
                await NotificationRepo.get(offset, limit, userId)
            ),
        };
    }

    public async sendPushNotification({ request }: HttpContextContract) {
        const language = request.header('language') || 'es'

        const payload = request.all()
        let userData
        if (payload.userId) {
            userData = await UserRepo.getUserById(payload.userId)
        } else {
            userData = UserDomain.createFromArrOfObject(
                await UserRepo.getAll('', '', '', '', '', '', '', '')
            )
        }

        const title = payload.title
        const text = payload.message
        const massage = payload.message

        if (userData) {
            userData.map(async (data) => {
                const notification = FcmNotification.created({ title, text, massage, data })
                Event.emit('notification::created', notification)
                const notificationData = {
                    "productId": 0,
                    // "commentUserId": 0,
                    "userId": data.id,
                    "type": "ADMIN",
                    "message": payload.message
                }

                await NotificationRepo.create(notificationData, language)
            })
        }
        return {
            success: true,
            massage: 'Push notification send successfully.'
        };
    }

    public async delete({ request }: HttpContextContract) {

        const language = request.header('language') || 'en'

        const payload = request.all()

        if (payload.id && payload.id.length != 0) {

            await NotificationRepo.delete(payload.id)
            return {
                success: true,
                massage: SUCCESS.NOTIFICATION_DELETE[language]
            };
        } else {
            return {
                success: true,
                massage: SUCCESS.NOTIFICATION_ERROR[language]
            };
        }

    }

    // public async deleteAll({ request, response }: HttpContextContract) {

    //     const language = request.header('language') || 'en'
    //     let token = request.headers().authorization || ''

    //     if (token && token.startsWith("Bearer ")) token = token.slice(7, token.length);
    //     let userId
    //     if (token) {
    //         const decoded = await JWT.verify(token, JWT_SECRET_KEY, async (err, decodedData) => {
    //             if (err) return false
    //             return decodedData
    //         })

    //         if (!decoded) return response.status(422).send({
    //             msg: `JWT Expired`
    //         })
    //         userId = decoded.id
    //     }

    //     await NotificationRepo.deleteAll(userId)
    //     return {
    //         success: true,
    //         massage: SUCCESS.NOTIFICATION_DELETE[language]
    //     };
    // }

    // public async sendPushNotification({ request }: HttpContextContract) {
    //     const language = request.header('language') || 'es'

    //     const payload = request.all()
    //     let userData
    //     if (payload.userId) {
    //         userData = await UserRepo.getUserById(payload.userId)
    //     } else {
    //         userData = UserDomain.createFromArrOfObject(
    //             await UserRepo.getAll('', '', '', '', '', '','','')
    //         )
    //     }

    //     const title = payload.title
    //     const text = payload.message
    //     const massage = payload.message

    //     if (userData) {
    //         userData.map(async (data) => {
    //             const notification = FcmNotification.created({ title, text, massage, data })
    //             Event.emit('notification::created', notification)
    //             const notificationData = {
    //                 "postId": 0,
    //                 "commentUserId": 0,
    //                 "postUserId": data.id,
    //                 "type": "ADMIN",
    //                 "message": payload.message
    //             }

    //             await NotificationRepo.create(notificationData, language)
    //         })
    //     }
    //     return {
    //         success: true,
    //         massage: 'Push notification send successfully.'
    //     };
    // }

    public async smsNotification({ request }: HttpContextContract) {

        const payload = request.all()
        // I18n.locale('en').formatMessage('رمز التفعيل')

        // console.log(test,'test');
        // return

        const language = request.header('language') || 'es'
        const userData = await UserRepo.getUserById(payload.userId)

        if (userData) {
            await userData.map(async (data) => {

                let mobileNumber = data.mobileNumber
                let messageText
                if (language == 'es') {
                    messageText = payload.message
                } else {
                    // messageText = `رمز التفعيل: `
                    messageText = payload.message
                }

                console.log(`http://rest.gateway.sa/api/SendSMS?api_id=${Env.get('SMS_API_ID')}&api_password=${Env.get('SMS_API_PASSWORD')}&sms_type=O&encoding=T&sender_id=${Env.get('SMS_SEND_ID')}&phonenumber=${mobileNumber}&textmessage=${messageText}`);

                // const config: AxiosRequestConfig = {
                //     method: 'get',
                //     url: `http://rest.gateway.sa/api/SendSMS?api_id=${Env.get('SMS_API_ID')}&api_password=${Env.get('SMS_API_PASSWORD')}&sms_type=O&encoding=T&sender_id=${Env.get('SMS_SEND_ID')}&phonenumber=${mobileNumber}&textmessage=${messageText}`,
                // }

                const config: AxiosRequestConfig = {
                    method: 'get',
                    url: `http://www.bareedsms.com/RemoteAPI/SendSMS.aspx?username=dawajen&encoding=url&password=Sms@depco&messageData=${messageText}&receiver=+973${mobileNumber}`,
                }

                await axios(config)
                    .then(async function (response) {
                        if (response.status == 200) {
                            return true
                        } else {
                            return false
                        }
                    })
                    .catch(console.log)
            })
            return {
                success: true,
                massage: 'Message send successfully'
            };
        } else {
            return {
                success: true,
                massage: FAILURE.USER_CONFLICT[language]
            };
        }
    }
}
