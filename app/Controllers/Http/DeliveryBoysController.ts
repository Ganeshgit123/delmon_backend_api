import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Validators from "../../Validators";
import JWT from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'
const JWT_SECRET_KEY = Env.get('JWT_SECRET_KEY')
import { DeliveryBoysRepo, OrderRepo, CartRepo } from "../../Repositories";
import { SUCCESS, FAILURE } from "../../Data/language";
import { DeliveryBoysDomain, OrderDomain, CartDomain } from "../../Domain";

export default class DeliveryBoysController {

    public async login({ request }: HttpContextContract) {
        const { employeeId, password } = await request.validate(Validators.DeliveryBoyAuthValidator);
        const language = request.header('language') || 'en'

        const maybeAdmin = await DeliveryBoysRepo.checkDeliveryBoys(employeeId, password);

        if (maybeAdmin) {

            let data = {
                id: maybeAdmin.id,
                // userType: maybeAdmin.userType,
            }
            var token = JWT.sign(data, JWT_SECRET_KEY);

            return {
                success: true,
                token: token,
                id: maybeAdmin.id,
                image: maybeAdmin.image,
                userName: maybeAdmin.userName,
                firstName: maybeAdmin.$extras.first_name,
                lastName: maybeAdmin.$extras.last_name,
                email: maybeAdmin.email,
                active: maybeAdmin.active,
                deviceToken: maybeAdmin.deviceToken,
                massage: SUCCESS.ADMIN_LOGIN[language]
            };
        } else {
            return {
                success: false,
                massage: FAILURE.DELIVERYBOYS_CONFLICT_LOGIN[language]
            };
        }
    }

    public async changePassword({ request }: HttpContextContract) {
        const { email, oldPassword, newPassword } = await request.validate(Validators.ChangePassword);

        const maybeAdmin = await DeliveryBoysRepo.checkDeliveryBoys(email, oldPassword);

        const data = {
            password: newPassword
        }
        const language = request.header('language') || 'en'

        if (maybeAdmin) {
            await DeliveryBoysRepo.updateDeliveryBoys(maybeAdmin.id, data, language)
            return {
                success: true,
                massage: SUCCESS.DELIVERYBOYS_PASSWOD_UPDATE[language]
            };

        } else {
            return {
                success: false,
                massage: FAILURE.DELIVERYBOYS_CONFLICT[language]
            };
        }
    }

    public async getDeliveryBoysList({ request }: HttpContextContract) {
        const payload = request.all()
        const type = request.header('type') || ''

        return {
            success: true,
            data: DeliveryBoysDomain.createFromArrOfObject(
                await DeliveryBoysRepo.getDeliveryBoys(payload.active, type)
            ),
        };
    }

    public async createDeliveryBoys({ request }: HttpContextContract) {
        const payload = await request.validate(Validators.DeliveryBoyValidator);

        const language = request.header('language') || 'en'

        const adminResult = await DeliveryBoysRepo.createDeliveryBoys(payload, language);

        return {
            success: true,
            result: DeliveryBoysDomain.createFromObject(adminResult),
            massage: SUCCESS.DELIVERYBOYS_CREATE[language]
        };
    }

    public async updateDeliveryBoys({ request, params }: HttpContextContract) {
        const updateAdmin = request.all()

        await DeliveryBoysRepo.isEntryExist(params.id);
        const language = request.header('language') || 'en'

        const updateResult = DeliveryBoysDomain.createFromObject(
            await DeliveryBoysRepo.updateDeliveryBoys(params.id, updateAdmin, language)
        );
        return {
            success: true,
            result: updateResult,
            massage: SUCCESS.DELIVERYBOYS_UPDATE[language]
        };
    }

    public async deleteDeliveryBoys({ request, params }: HttpContextContract) {
        const result = await DeliveryBoysRepo.isIdExist(params.id);
        const language = request.header('language') || 'en'

        await DeliveryBoysRepo.deleteDeliveryBoys({ active: 0 }, result, language);
        return {
            success: true,
            massage: SUCCESS.DELIVERYBOYS_DELETE[language]
        };

    }

    async logout({ request, response }) {
        let token = request.headers().authorization || '';
        const language = request.header('language') || 'en';
        if (token && token.startsWith("Bearer "))
            token = token.slice(7, token.length);
        if (token) {
            const decoded = await JWT.verify(token, JWT_SECRET_KEY, async (err, decodedData) => {
                if (err)
                    return false;
                return decodedData;
            });
            if (!decoded)
                return response.status(422).send({
                    msg: `JWT Expired`
                });
        }
        return {
            success: true,
            massage: SUCCESS.LOGOUT[language],
        };
    }

    public async getDeliveryBoyDetails({ params, request }: HttpContextContract) {
        const payload = request.all()
        const orderStatus = payload.orderStatus || ''
        const deliveryBoyDetails = DeliveryBoysDomain.createFromObject(
            await DeliveryBoysRepo.isIdExist(params.id)
        )
        const deliveryBoyOrderList = OrderDomain.createFromArrOfObject(
            await OrderRepo.deliveryBoyGetOrder(params.id, orderStatus)
        )
        return {
            success: true,
            deliveryBoyDetails,
            deliveryBoyOrderList
        };
    }

    public async getDriverReport({ request }: HttpContextContract) {
        const payload = request.all()
        // const orderStatus = payload.orderStatus || ''
        const deliveryBoyId = payload.deliveryBoyId || ''
        const startDate = payload.startDate || ''
        const endDate = payload.endDate || ''
        const type = request.header('type') || ''
        let orderStatus = payload.orderStatus ? payload.orderStatus.split(",") : ''
        

        let deliveryBoyOrderList = OrderDomain.createFromArrOfObject(
            await OrderRepo.getDriverReport(orderStatus, deliveryBoyId, startDate, endDate, type)
        )

        if (deliveryBoyOrderList) {

            const promises  =deliveryBoyOrderList.map(async (element) => {
                element.orderId = `DELMON-ORDER-${element.id}`
                element.cartDetails = CartDomain.createFromArrOfObject(await CartRepo.getCart(element.cartId))
                return element
            });
            return Promise.all(promises).then((values) => {
                return {
                    success: true,
                    deliveryBoyOrderList: values,
                };
            });
        }

        return {
            success: true,
            deliveryBoyOrderList
        };
    }
}
