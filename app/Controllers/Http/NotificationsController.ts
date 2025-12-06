import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { NotificationRepo, UserRepo } from "../../Repositories";
// import Validators from "../../Validators";
import { SUCCESS } from "../../Data/language";
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

        // Validate payload
        if (!payload || !payload.recipientType) {
            return {
                success: false,
                message: 'recipientType is required'
            }
        }

        // Helper to normalize results into an array of user objects
        const normalizeUsers = (usersAny: any) => {
            if (!usersAny) return []
            if (Array.isArray(usersAny)) return usersAny
            // If a domain mapper was returned earlier, it might already be an array
            return [usersAny]
        }

        try {
            let users: any[] = []

            if (payload.recipientType === 'single') {
                if (payload.userId) {
                    const userData = await UserRepo.getUserById(payload.userId)
                    users = normalizeUsers(userData)
                } else {
                    // fetch all users and map to domain objects (keeps original behavior)
                    const allRaw = await UserRepo.getAll('', '', '', '', '', '', '', '')
                    users = UserDomain.createFromArrOfObject(allRaw) || []
                }
            } else if (payload.recipientType === 'group') {
                if (!payload.groupId) {
                    return {
                        success: false,
                        message: 'groupId is required for group recipientType'
                    }
                }
                const groupUsers = await UserRepo.getUserByUserType(payload.groupId)
                users = normalizeUsers(groupUsers)
            } else {
                return {
                    success: false,
                    message: `Unsupported recipientType: ${payload.recipientType}`
                }
            }

            if (!users || users.length === 0) {
                return {
                    success: false,
                    message: 'No users found for the given recipient criteria'
                }
            }

            const title = payload.title || ''
            const text = payload.message || ''
            const message = payload.message || ''

            // Create per-user tasks and await them all so caller knows when all work finished
            const results = await Promise.all(users.map(async (user) => {
                try {
                    const notification = FcmNotification.created({ title, text, message, data: user })
                    Event.emit('notification::created', notification)

                    const notificationData = {
                        productId: 0,
                        userId: user.id,
                        type: 'ADMIN',
                        message: payload.message
                    }

                    await NotificationRepo.create(notificationData, language)
                    return { id: user.id, success: true }
                } catch (err) {
                    // capture failure for this user but continue others
                    return { id: user.id, success: false, error: err?.message || String(err) }
                }
            }))

            const attempted = results.length
            const succeeded = results.filter(r => r.success).length
            const failed = results.filter(r => !r.success).map(r => ({ id: r.id, error: r.error }))

            return {
                success: true,
                message: 'Push notification send completed.',
                summary: { attempted, succeeded, failedCount: failed.length, failed }
            }
        } catch (err) {
            return {
                success: false,
                message: 'Failed to send push notifications',
                error: err?.message || String(err)
            }
        }
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

    public async smsNotification({ request }: HttpContextContract) {

        const payload = request.all()

        const language = request.header('language') || 'es'

        // Validate payload
        if (!payload || !payload.recipientType) {
            return {
                success: false,
                message: 'recipientType is required'
            }
        }

        // Helper to normalize results into an array of user objects
        const normalizeUsers = (usersAny: any) => {
            if (!usersAny) return []
            if (Array.isArray(usersAny)) return usersAny
            return [usersAny]
        }

        try {
            let users: any[] = []

            if (payload.recipientType === 'single') {
                if (payload.userId) {
                    const userData = await UserRepo.getUserById(payload.userId)
                    users = normalizeUsers(userData)
                } else {
                    // fetch all users and map to domain objects
                    const allRaw = await UserRepo.getAll('', '', '', '', '', '', '', '')
                    users = UserDomain.createFromArrOfObject(allRaw) || []
                }
            } else if (payload.recipientType === 'group') {
                if (!payload.groupId) {
                    return {
                        success: false,
                        message: 'groupId is required for group recipientType'
                    }
                }
                const groupUsers = await UserRepo.getUserByUserType(payload.groupId)
                users = normalizeUsers(groupUsers)
            } else {
                return {
                    success: false,
                    message: `Unsupported recipientType: ${payload.recipientType}`
                }
            }

            if (!users || users.length === 0) {
                return {
                    success: false,
                    message: 'No users found for the given recipient criteria'
                }
            }

            const messageTextRaw = payload.message || ''
            const messageText = language === 'es' ? messageTextRaw : messageTextRaw

            // Send SMSes in parallel and collect results
            const results = await Promise.all(users.map(async (user) => {
                try {
                    const mobileNumber = user.mobileNumber || ''
                    if (!mobileNumber) {
                        return { id: user.id, success: false, error: 'missing mobileNumber' }
                    }

                    const encodedMessage = encodeURIComponent(messageText)
                    const url = `http://www.bareedsms.com/RemoteAPI/SendSMS.aspx?username=dawajen&encoding=url&password=Sms@depco&messageData=${encodedMessage}&receiver=+973${mobileNumber}`

                    const config: AxiosRequestConfig = {
                        method: 'get',
                        url,
                    }

                    const response = await axios(config)

                    if (response && response.status === 200) {
                        // persist notification record (same behavior as push)
                        await NotificationRepo.create({
                            productId: 0,
                            userId: user.id,
                            type: 'ADMIN',
                            message: messageText
                        }, language)

                        return { id: user.id, success: true }
                    } else {
                        return { id: user.id, success: false, error: `http_status_${response?.status || 'unknown'}` }
                    }
                } catch (err) {
                    return { id: user.id, success: false, error: err?.message || String(err) }
                }
            }))

            const attempted = results.length
            const succeeded = results.filter(r => r.success).length
            const failed = results.filter(r => !r.success).map(r => ({ id: r.id, error: r.error }))

            return {
                success: true,
                message: 'SMS send completed.',
                summary: { attempted, succeeded, failedCount: failed.length, failed }
            }
        } catch (err) {
            return {
                success: false,
                message: 'Failed to send SMS notifications',
                error: err?.message || String(err)
            }
        }
    }
}
