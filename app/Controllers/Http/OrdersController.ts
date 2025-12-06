import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Validators from "../../Validators";
import {
    OrderDomain, CartDomain, ProductDomain, UserDomain, DeliveryBoysDomain,
    ProductPriceListDomain, SettingsDomain
} from "../../Domain";
import {
    OrderRepo, CartRepo, UserTypesRepo, UserRepo, ProductRepo, LoyaltyPointsRepo,
    WalletRepo, DeliveryBoysRepo, ProductPriceListsRepo, NotificationRepo, SettingsRepo
} from "../../Repositories";
import { SUCCESS } from "../../Data/language";
import FcmNotification from "../../Listeners/Notification";
import Event from '@ioc:Adonis/Core/Event'
import Env from '@ioc:Adonis/Core/Env'
import JWT from 'jsonwebtoken'
const JWT_SECRET_KEY = Env.get('JWT_SECRET_KEY')
import { DateTime } from "luxon";
import { Puppeteer } from 'App/Services'
var path = require("path");
import fs from 'fs';
import { format } from 'date-fns'
import axios, { AxiosRequestConfig } from 'axios'

import { sendEmail, getOrderConfirmationEmailBody, getOrderCancelledEmailBody, getOrderDeliveredEmailBody } from 'App/utils/EmailHelper'


export default class OrdersController {

    public async get({ request }: HttpContextContract) {
        const payload = request.all()
        // const userId: any = request.header('userId') || ''
        const type = request.header('type') || ''
        let authHeader = request.header('authorization') || ''

        let decoded
        if (authHeader && authHeader.startsWith('Bearer ')) {
            authHeader = authHeader.slice(7, authHeader.length)
            decoded = JWT.verify(authHeader, JWT_SECRET_KEY)
        }
        const userId: any = decoded ? decoded.id : 0

        // const orderType = payload.orderType || ''

        let isReturn = Number(payload.isReturn) || 0
        // let orderStatus = payload.orderStatus ? payload.orderStatus.split(",") : ''
        let orderType = payload.orderType ? payload.orderType.split(",") : []
        let orderStatus: any = orderType
        if (orderType.length === 1 && orderType[0] === "PLACED") {
            orderStatus = ['PLACED', 'ADMINAPPROVED']
        }
        if (orderType.length === 1 && orderType[0] === "USERREJECTED") {
            orderStatus = ['USERREJECTED', 'CANCELLED']
        }
        let orderList = OrderDomain.createFromArrOfObject(
            await OrderRepo.get(userId, orderStatus, isReturn, type)
        )

        const promises = orderList.map(async (element) => {
            element.cartDetails = CartDomain.createFromArrOfObject(await CartRepo.getCart(element.cartId))
            element.orderId = `DELMON-ORDER-${element.id}`
            return element
        });

        return Promise.all(promises).then((values) => {
            return {
                success: true,
                deliveryTime: Number(Env.get('DELIVERY_TIME')) || 3,
                currentTime: new Date(),
                data: values,
            };
        });
    }

    //orderDetails
    public async getOrderDetails({ request }: HttpContextContract) {
        const payload = request.all()
        const userId: any = request.header('userId') || ''
        const language = request.header('language') || 'en'
        let authHeader = request.header('authorization') || ''

        let decoded
        if (authHeader && authHeader.startsWith('Bearer ')) {
            authHeader = authHeader.slice(7, authHeader.length)
            decoded = JWT.verify(authHeader, JWT_SECRET_KEY)
        }

        const userType: any = decoded ? decoded.userType : null
        const merchantType: any = decoded ? decoded.merchantType : null

        let typeOfUser = ''
        if (merchantType == null) {
            typeOfUser = userType
        } else {
            typeOfUser = merchantType
        }

        let orderList = OrderDomain.createFromArrOfObject(
            await OrderRepo.getOrderDetails(userId, payload.orderId)
        )

        let productId: any = []
        let orderId: any = []

        let cartDetails
        const promises = await orderList.map(async (element) => {

            cartDetails = CartDomain.createFromArrOfObject(await CartRepo.getCart(element.cartId))

            element.cartDetails = cartDetails
            element.orderId = `DELMON-ORDER-${element.id}`
            return element
        });


        return Promise.all(promises).then(async (values: any) => {

            await cartDetails.map(async (element) => {
                productId.push(element.productId),
                    orderId.push(element.orderId)
            });
            console.log("orderId", orderId)
            let priceListNameId = await UserTypesRepo.getUserType(typeOfUser)
            let productDetails = await ProductDomain.createFromArrOfObject(await ProductRepo.getProductForPastOrder(orderId[0], productId, language, priceListNameId))

            values.productDetails = productDetails
            let billDetails: any = []

            await productDetails.map(async (element) => {

                element.name = language == 'en' ? element.enProductName : element.arProductName
                element.vat = element.vat || 0
                let obj = {
                    "title": language == 'en' ? element.enProductName : element.arProductName,
                    "price": element.price
                }
                billDetails.push(obj)
            });

            if (orderList[0].couponName != null) {
                let obj = {
                    "title": orderList[0].couponName,
                    "price": orderList[0].discount
                }
                billDetails.push(obj)
            }

            if (orderList[0].isLoyaltyPointApply == 1) {
                let obj = {
                    "title": "Loyality",
                    "price": orderList[0].LoyaltyAmount || 0
                }
                billDetails.push(obj)
            }
            let vat = {
                "title": "VAT",
                "price": orderList[0].vat
            }
            billDetails.push(vat)
            let total = {
                "title": "Total",
                "price": orderList[0].netAmount
            }
            billDetails.push(total)

            return {
                success: true,
                currentTime: new Date(),
                data: values,
                productDetails,
                billDetails
            };
        });
    }

    public async create({ request }: HttpContextContract) {
        const payload = await request.validate(Validators.OrderValidator);
        const cartonDiscount: any = payload.cartonDiscount || 0
        const maxCartonDiscountPerDay = payload.maxCartonDiscountPerDay || 0
        const maxCartonDiscountPerDayUser = payload.maxCartonDiscountPerDayUser || 0

        if (payload.maxCartonDiscountPerDay) {
            await delete payload.maxCartonDiscountPerDay
        } else {
            await delete payload.maxCartonDiscountPerDay
        }
        // if (payload.cartonDiscount) {
        //     await delete payload.cartonDiscount
        // } else {
        //     await delete payload.cartonDiscount
        // }

        if (payload.maxCartonDiscountPerDayUser) {
            await delete payload.maxCartonDiscountPerDayUser
        } else {
            await delete payload.maxCartonDiscountPerDayUser
        }
        let loyaltyPoint = (payload.netAmount / 100) * 10

        const userId: any = request.header('userId') || ''
        // const userId: any = request.ctx ? request.ctx['token'].decoded.id : 0

        payload["userId"] = userId
        let authHeader = request.header('authorization') || ''
        const language = request.header('language') || 'en'
        const type = request.header('type') || ''
        payload["type"] = type
        let decoded
        if (authHeader && authHeader.startsWith('Bearer ')) {
            authHeader = authHeader.slice(7, authHeader.length)
            decoded = JWT.verify(authHeader, JWT_SECRET_KEY)
        }

        const userType: any = decoded ? decoded.userType : null
        const merchantType: any = decoded ? decoded.merchantType : null

        let typeOfUser = ''
        if (merchantType == null) {
            typeOfUser = userType
        } else {
            typeOfUser = merchantType
        }

        let priceListNameId = await UserTypesRepo.getUserType(typeOfUser)

        let cartList = CartDomain.createFromArrOfObject(
            await CartRepo.get(userId, type, priceListNameId)
        )

        let cartIds: any = []
        if (cartList.length != 0) {
            await cartList.map(async (element) => {
                cartIds.push(element.id)
                let UpdatePost = {
                    stock: element.stock - element.quantity
                }

                const updateResult = ProductPriceListDomain.createFromObject(
                    await ProductPriceListsRepo.stockUpdate(element.productPriceListId, UpdatePost, language)
                );
                console.log(updateResult, 'updateResult');

            })
        }

        if (cartIds.length == 0) {
            return {
                success: true,
                massage: "Cart is empty"
            };
        }
        payload.cartId = JSON.stringify(cartIds)
        console.log(payload, 'payload');

        let userList = UserDomain.createFromArrOfObject(
            await UserRepo.getUserById([userId])
        )
        console.log(userList[0], 'llll');
        console.log(userList[0].cartonDiscount, 'userList');
        console.log(payload.cartonDiscount, 'ddd');
        if (payload.cartonDiscount) {
            payload.cartonDiscount = userList[0].cartonDiscount - payload.cartonDiscount
        }
        if (userList[0].userType == 'USER') {
            await delete payload.employeeCartonDiscount

        } else {
            await delete payload.userCartonDiscount

        }

        let cartDetails = await OrderRepo.create(payload, language);

        //let userCartonDiscount = userList[0].cartonDiscount

        // if(userCartonDiscount == 0) {
        //   return {
        //     success: false,
        //     massage: 'you already used two discount for this month'
        //    };
        // } 
        let wallet = userList[0].walletAmount - payload.netAmount

        // let userDetails = {
        //     loyaltyPoint: userList[0].loyaltyPoint - loyaltyPoint
        // }
        // console.log(userDetails, 'userDetails');

        if (payload.paymentTypeId == "WALLET") {
            let walletDetails = {
                walletAmount: wallet
            }

            await UserRepo.walletUpdate(userId, walletDetails, language);

            let walletUpdateDate = {
                userId: userId,
                orderId: cartDetails.$attributes.id,
                amount: payload.netAmount,
                paymentType: "ORDER",
                type: "SUB",
            }
            await WalletRepo.create(walletUpdateDate, language);
        }

        let LoyaltyAmount = payload.LoyaltyAmount ? payload.LoyaltyAmount : 0
        await CartRepo.cartUpdate(cartDetails.$attributes.id, cartIds);

        if (payload.isLoyaltyPointApply == true) {
            let LoyaltyAmountSub = userList[0].loyaltyPoint - LoyaltyAmount
            let LoyaltyAmountAdd = LoyaltyAmountSub + loyaltyPoint
            await UserRepo.loyaltyPointUpdate(userId, LoyaltyAmountAdd, language);

            let LoyaltyPointSubPayload = {
                userId: userId,
                orderId: cartDetails.$attributes.id,
                usedLoyaltyPoint: payload.LoyaltyAmount,
                type: type,
                loyaltyType: "DEBIT"
            }
            await LoyaltyPointsRepo.create(LoyaltyPointSubPayload, language);
        }

        // let LoyaltyPointsPayload = {
        //     userId: userId,
        //     orderId: cartDetails.$attributes.id,
        //     usedLoyaltyPoint: loyaltyPoint,
        //     type: type,
        //     loyaltyType: "CREDIT"
        // }
        // await LoyaltyPointsRepo.create(LoyaltyPointsPayload, language);

        if (cartonDiscount) {
            let userUpdate = {
                cartonDiscount: cartonDiscount,
                maxCartonDiscountPerDay: maxCartonDiscountPerDay,
                maxCartonDiscountPerDayUser: maxCartonDiscountPerDayUser
            }
            await UserRepo.update(userId, userUpdate, language);
        } else if (cartonDiscount == 0) {
            let userUpdate = {
                cartonDiscount: cartonDiscount,
                maxCartonDiscountPerDay: maxCartonDiscountPerDay,
                maxCartonDiscountPerDayUser: maxCartonDiscountPerDayUser
            }
            await UserRepo.update(userId, userUpdate, language);
        } else if (cartonDiscount == '') {
            let userUpdate = {
                cartonDiscount: cartonDiscount,
                maxCartonDiscountPerDay: maxCartonDiscountPerDay,
                maxCartonDiscountPerDayUser: maxCartonDiscountPerDayUser
            }
            await UserRepo.update(userId, userUpdate, language);
        }
        else {
            let userUpdate = {
                cartonDiscount: cartonDiscount,
                maxCartonDiscountPerDay: maxCartonDiscountPerDay,
                maxCartonDiscountPerDayUser: maxCartonDiscountPerDayUser
            }
            await UserRepo.update(userId, userUpdate, language);

        }

        return {
            success: true,
            massage: SUCCESS.ORDER_CREATED[language]
        };
    }

    public async update({ request, params }: HttpContextContract) {
        const UpdatePost = request.all()
        // const userId: any = request.header('userId') || ''
        const type = request.header('type') || ''

        let defaultTime
        let message = ''
        switch (UpdatePost.orderStatus) {
            case "APPROVE":
                UpdatePost.approveTime = new Date();
                message = 'order approved.'
                break;
            case "ARRIVED":
                UpdatePost.bookingArrivedTime = new Date();
                message = 'Delivery boy arrived at your location.'
                break;
            case "OUTFORDELIVERY":
                UpdatePost.outForDeliveryTime = new Date();
                message = UpdatePost.isRechedule == 0 ? 'your order is an out for delivery.' : 'your order is Rechedule and out for delivery.'
                break;
            case "CANCELLED":
                UpdatePost.cancelTime = new Date();
                message = 'your order is cancelled.'
                break;
            case "COMPLETED":
                UpdatePost.deliveredTime = new Date();
                message = 'your order is completed.'
                break;
            case "UNAVAILABLE":
                UpdatePost.unAvailableTime = new Date();
                message = 'your order is unavailable.'
                break;
            default:
                defaultTime = new Date();
        }
        console.log(defaultTime, 'defaultTime', message);

        const language = request.header('language') || 'en'
        let orderDetail = await OrderRepo.isEntryExist(params.id, language);
        // let userList = UserDomain.createFromArrOfObject(
        //     await UserRepo.getUserById([userId])
        // )
        let setting = SettingsDomain.createFromArrOfObject(
            await SettingsRepo.adminGet(1)
        )
        let enLoyaltyPointDiscount

        if (setting.length != 0) {
            await setting.map((data) => {
                if (data.key == 'loyalty_point_per_order') {
                    enLoyaltyPointDiscount = data.enValue
                }
            })
        }
        let loyaltyPointDiscount = enLoyaltyPointDiscount

        if (UpdatePost.orderStatus == 'USERREJECTED' || UpdatePost.orderStatus == 'CANCELLED') {
            if (orderDetail.isLoyaltyPointApply == true) {
                let loyaltyPoint = (orderDetail.netAmount / 100) * 10

                let LoyaltyPointsPayload = {
                    userId: orderDetail.userId,
                    orderId: params.id,
                    usedLoyaltyPoint: loyaltyPoint,
                    type: type,
                    loyaltyType: "CREDIT"
                }

                await UserRepo.loyaltyPointUpdate(orderDetail.userId, loyaltyPoint, language);

                await LoyaltyPointsRepo.create(LoyaltyPointsPayload, language);
            }
        }

        if (UpdatePost.orderStatus == 'COMPLETED') {
            // Only calculate and persist loyalty points when discount is enabled (non-zero)
            if (loyaltyPointDiscount != 0) {
                const loyaltyPoint = (orderDetail.netAmount / 100) * loyaltyPointDiscount
                const LoyaltyPointsPayload = {
                    userId: orderDetail.userId,
                    orderId: params.id,
                    usedLoyaltyPoint: loyaltyPoint,
                    type: type,
                    loyaltyType: "CREDIT"
                }

                await UserRepo.loyaltyPointUpdate(orderDetail.userId, loyaltyPoint, language);
                await LoyaltyPointsRepo.create(LoyaltyPointsPayload, language);
            }
        }

        if (UpdatePost.orderStatus == 'USERREJECTED' || UpdatePost.orderStatus == 'CANCELLED') {

            let result = UserDomain.createFromArrOfObject(
                await UserRepo.get(orderDetail.userId, language)
            )

            let typeOfUser = result[0].userType

            let priceListNameId = await UserTypesRepo.getUserType(typeOfUser)


            let cartList = CartDomain.createFromArrOfObject(
                await CartRepo.getCartForCancel(orderDetail.userId, type, priceListNameId, params.id)
            )

            let cartIds: any = []
            if (cartList.length != 0) {
                await cartList.map(async (element) => {
                    cartIds.push(element.id)
                    let UpdatePost = {
                        stock: element.stock + element.quantity
                    }

                    const updateResult = ProductPriceListDomain.createFromObject(
                        await ProductPriceListsRepo.stockUpdate(element.productPriceListId, UpdatePost, language)
                    );
                    console.log(updateResult, 'updateResult');

                })
            }

        }

        const updateResult: any = OrderDomain.createFromObject(
            await OrderRepo.update(params.id, UpdatePost, language)
        );

        let userData = await UserRepo.get(orderDetail.userId, language)

        // Email Notification for order approval
        if (UpdatePost.orderStatus == 'APPROVE' || UpdatePost.orderStatus == 'USERACCEPTED') {
            const orderNumber = updateResult.id;
            const customerName = userData[0].userName;

            const emailBody = getOrderConfirmationEmailBody(customerName, orderNumber);

            await sendEmail(
                userData[0].email,
                `Order Confirmation - Delmon Order-${orderNumber}`,
                emailBody
            );
        }

        // Email Notification for order cancellation
        if (UpdatePost.orderStatus == 'USERREJECTED' || UpdatePost.orderStatus == 'CANCELLED') {
            const orderNumber = updateResult.id;
            const customerName = userData[0].userName;

            const emailBody = getOrderCancelledEmailBody(customerName, orderNumber);

            await sendEmail(
                userData[0].email,
                `Order Cancelled - Delmon Order-${orderNumber}`,
                emailBody
            );
        }

        // Email Notification for order delivery
        if (UpdatePost.orderStatus == 'COMPLETED') {
            const orderNumber = updateResult.id;
            const customerName = userData[0].userName;

            const emailBody = getOrderDeliveredEmailBody(customerName, orderNumber);

            await sendEmail(
                userData[0].email,
                `Order Delivered - Delmon Order-${orderNumber}`,
                emailBody
            );
        }

        const data = userData
        const title = 'order'
        const text = message
        const massage = message

        const notification = FcmNotification.created({ title, text, massage, data })
        Event.emit('notification::created', notification)

        // const info = await transporter.sendMail({
        //     from: 'dawajenbahrain@gmail.com',
        //     to: userData[0].email,
        //     subject: `Delmon Order-${updateResult.id}`,
        //     text: text, // plain‑text body
        //     //html: "<b>Hello world?</b>", // HTML body
        // });

        // console.log("Message sent:", info.messageId);

        const notificationData = {
            "orderId": updateResult.id,
            "userId": updateResult.userId,
            "type": "ORDER",
            "message": message
        }

        await NotificationRepo.create(notificationData, language)

        // console.log(`http://www.bareedsms.com/RemoteAPI/SendSMS.aspx?username=dawajen&encoding=url&password=Sms@depco&messageData=${message}&receiver=+973${data[0].mobileNumber}`)
        // const config: AxiosRequestConfig = {
        //     method: 'get',
        //     url: `http://www.bareedsms.com/RemoteAPI/SendSMS.aspx?username=dawajen&encoding=url&password=Sms@depco&messageData=${message}&receiver=+973${data[0].mobileNumber}`,
        // }

        // let otpResult = await axios(config)
        //     .then(async function (response) {

        //         if (response.status == 200) {
        //             return true
        //         } else {
        //             return false
        //         }
        //     })
        //     .catch(console.log)
        // console.log(otpResult)
        // if (orderDetail.userCartonDiscount || orderDetail.employeeCartonDiscount) {

        //     let userUpdate = {
        //         maxCartonDiscountPerDay: userData[0].maxCartonDiscountPerDay + orderDetail.employeeCartonDiscount || 0,
        //         maxCartonDiscountPerDayUser: userData[0].maxCartonDiscountPerDayUser + orderDetail.userCartonDiscount || 0
        //     }
        //     console.log(userUpdate, 'userUpdate')
        //     await UserRepo.update(updateResult.userId, userUpdate, language);
        // }

        if (UpdatePost.orderStatus == 'CANCELLED' || UpdatePost.orderStatus == 'USERREJECTED') {

            let userUpdate = {
                maxCartonDiscountPerDay: userData[0].maxCartonDiscountPerDay + orderDetail.employeeCartonDiscount || 0,
                maxCartonDiscountPerDayUser: userData[0].maxCartonDiscountPerDayUser + orderDetail.userCartonDiscount || 0,
                cartonDiscount: userData[0].cartonDiscount + orderDetail.cartonDiscount || 0
            }
            console.log(userUpdate, 'userUpdate')
            await UserRepo.update(updateResult.userId, userUpdate, language);
        }

        return {
            success: true,
            result: updateResult,
            massage: SUCCESS.ORDER_UPDATE[language]
        };
    }

    public async multiUpdate({ request }: HttpContextContract) {
        const UpdatePost = request.all()

        let defaultTime
        let message = ''
        switch (UpdatePost.orderStatus) {
            case "APPROVE":
                UpdatePost.approveTime = new Date();
                message = 'order approved.'
                break;
            case "ARRIVED":
                UpdatePost.bookingArrivedTime = new Date();
                message = 'Delivery boy arrived at your location.'
                break;
            case "OUTFORDELIVERY":
                UpdatePost.outForDeliveryTime = new Date();
                message = 'your order is an out for delivery.'
                break;
            case "CANCELLED":
                UpdatePost.cancelTime = new Date();
                message = 'your order is cancelled.'
                break;
            case "COMPLETED":
                UpdatePost.deliveredTime = new Date();
                message = 'your order is completed.'
                break;
            case "DRIVERASSIGNED":
                UpdatePost.deliveredTime = new Date();
                message = 'Driver assigned.'
                break;
            case "UNAVAILABLE":
                UpdatePost.unAvailableTime = new Date();
                message = 'your order is unavailable.'
                break;
            default:
                defaultTime = new Date();
        }
        console.log(defaultTime, 'defaultTime', message);

        const language = request.header('language') || 'en'
        // await OrderRepo.isEntryExist(params.id, language);
        let id = UpdatePost.id

        await delete UpdatePost.id

        const parsedIds = (() => {
            try {
                return JSON.parse(id)
            } catch (e) {
                // if id is already an array or a single numeric id
                return Array.isArray(id) ? id : [id]
            }
        })()

        const updateResult = OrderDomain.createFromObject(
            await OrderRepo.multiUpdate(parsedIds, UpdatePost, language)
        );

        // For multi updates we must fetch each order individually (avoid passing array to .where)
        if (UpdatePost.orderStatus == 'APPROVE' || UpdatePost.orderStatus == 'USERACCEPTED') {
            for (const singleId of parsedIds) {
                try {
                    const orderDetail = await OrderRepo.isEntryExist(Number(singleId), language)
                    const userData = await UserRepo.get(orderDetail.userId, language)

                    const orderNumber = Number(singleId)
                    const customerName = userData[0].userName
                    const emailBody = getOrderConfirmationEmailBody(customerName, orderNumber)

                    await sendEmail(
                        userData[0].email,
                        `Order Confirmation - Delmon Order-${orderNumber}`,
                        emailBody
                    )
                } catch (err) {
                    // log and continue with next id (don't throw to avoid aborting the entire batch)
                    console.log('multiUpdate: email/send error for id', singleId, err)
                }
            }
        }

        return {
            success: true,
            result: updateResult,
            massage: SUCCESS.ORDER_UPDATE[language]
        };
    }

    public async adminGetOrder({ request }: HttpContextContract) {

        const payload = request.all()
        const orderType = payload.orderType || ''
        // const orderStatus = payload.orderStatus || ''
        let orderStatus = payload.orderStatus ? payload.orderStatus.split(",") : ''
        const orderId = payload.orderId || ''
        const userType = payload.userType || ''
        const type = request.header('type') || ''

        const startDate = payload.startDate || "";
        const endDate = payload.endDate || "";
        let orderBy = payload.orderBy || 'id'
        orderBy = `orders.${orderBy}`;
        let deliveryType = payload.deliveryType || ''
        if (deliveryType == 1) {
            deliveryType = "DELIVERY"
        } else if (deliveryType == 0) {
            deliveryType = "PICKUP"
        }

        const orderByValue = payload.orderByValue ? payload.orderByValue.toLowerCase() : "desc";

        let orderList = OrderDomain.createFromArrOfObject(await OrderRepo.adminGetOrder(startDate, endDate, orderType, orderStatus, orderBy, orderByValue, '', deliveryType, orderId, userType, type))

        const promises = orderList.map(async (element) => {
            element.orderId = `DELMON-ORDER-${element.id}`
            element.cartDetails = CartDomain.createFromArrOfObject(await CartRepo.getCart(element.cartId))

            if (element.deliveryBoyId != null) {
                let test = DeliveryBoysDomain.createFromObject(await DeliveryBoysRepo.isEntryExist(element.deliveryBoyId))
                element.deliveryBoyDetail = test
            } else {
                element.deliveryBoyDetail = []
            }
            return element
        });

        return Promise.all(promises).then((values) => {
            return {
                success: true,
                data: values,
            };
        });
    }

    public async deliveryBoyGetOrder({ request }: HttpContextContract) {
        let payload = request.all()
        const deliveryBoyId: any = request.header('deliveryBoyId') || ''

        let orderStatus = payload.orderStatus ? payload.orderStatus.split(",") : ''


        let orderList = OrderDomain.createFromArrOfObject(await OrderRepo.deliveryBoyGetOrder(deliveryBoyId, orderStatus))

        const promises = orderList.map(async (element) => {
            element.orderId = `DEL-ORDER-${element.id}`
            element.cartDetails = CartDomain.createFromArrOfObject(await CartRepo.getCart(element.cartId))
            return element
        });

        return Promise.all(promises).then((values) => {
            return {
                success: true,
                data: values,
            };
        });
    }

    public async getInvoice({ response, params, view }: HttpContextContract) {
        // const payload = request.all()

        let orderDetail = OrderDomain.createFromArrOfObject(
            await OrderRepo.getInvoice(params.id)
        )

        let cartDetails
        if (orderDetail.length != 0) {
            cartDetails = CartDomain.createFromArrOfObject(await CartRepo.getCart(orderDetail[0].cartId))

        }

        orderDetail[0].cartDetails = cartDetails

        const fileName = `DELMON_INVOICE_${DateTime.utc().toFormat(
            "yyyy-MM-dd_HH-mm-ss"
        )}`

        let orderPlaceTime = `${format(
            new Date(orderDetail[0].orderPlaceTime),
            `do 'of' MMMM yyyy`
        )}`
        orderDetail[0].orderPlaceTime = orderPlaceTime

        const html1 = await view.render('invoice', {
            orderDetail
        })
        const htmlPath = path.resolve(
            __dirname,
            `../../pdf/${fileName}.html`
        );
        const pdfPathTwoTrial = `./app/pdf/${fileName}_2_trial.pdf`

        await Puppeteer.generateTrialPdf(html1, pdfPathTwoTrial)

        fs.writeFileSync(htmlPath, html1)
        // delete generated pdf,html files
        setTimeout(() => {
            fs.unlink(htmlPath, (err) => { err ? console.log(`File unlink failed: ${htmlPath}`) : '' })
            fs.unlink(pdfPathTwoTrial, (err) => { err ? console.log(`File unlink failed: ${pdfPathTwoTrial}`) : '' })


        }, 1000 * 60)

        response.header('Content-Disposition', `attachment; filename=${fileName}.pdf`); // comment this if you want to display on the browser
        response.type('.pdf')
        return response.send(fs.readFileSync(pdfPathTwoTrial))
        return {
            success: true,
            data: orderDetail,
        };
    }

    public async reOrder({ request }: HttpContextContract) {
        const payload = request.all()
        const userId: any = request.header('userId') || ''
        const language = request.header('language') || 'en'

        let orderList = OrderDomain.createFromArrOfObject(
            await OrderRepo.getOrderDetails(userId, payload.orderId)
        )

        let cartDetails
        let res = await orderList.map(async (element) => {
            cartDetails = CartDomain.createFromArrOfObject(await CartRepo.getReOrderCart(element.cartId))
        });

        return Promise.all(res).then(async (values: any) => {

            await cartDetails.map(async (element) => {

                let data = {
                    userId: element.userId,
                    productId: element.productId,
                    quantity: element.quantity,
                    type: element.type,
                    price: element.price
                }

                const cartDetails = await CartRepo.create(data, language);
                return cartDetails
            });

            return {
                success: true,
                massage: SUCCESS.CART_CREATE[language],
                deliveryTime: Number(Env.get('DELIVERY_TIME')) || 3,
                currentTime: new Date(),
                data: orderList,
                values
            };
        });

    }

    public async adminGetOrderWithSum({ request }: HttpContextContract) {

        const payload = request.all()
        //const orderType = payload.orderType || ''
        // const orderStatus = payload.orderStatus || ''
        //let orderStatus = payload.orderStatus ? payload.orderStatus.split(",") : ''
        //const orderId = payload.orderId || ''
        //const userType = payload.userType || ''
        //const type = request.header('type') || ''

        const startDate = payload.startDate || "";
        const endDate = payload.endDate || "";
        const amount = payload.amount || "";
        let orderBy = payload.orderBy || 'id'
        orderBy = `orders.${orderBy}`;
        let deliveryType = payload.deliveryType || ''
        if (deliveryType == 1) {
            deliveryType = "DELIVERY"
        } else if (deliveryType == 0) {
            deliveryType = "PICKUP"
        }

        let orderList = await OrderRepo.adminGetOrderWithSum(startDate, endDate)
        let res = []
        if (orderList) {
            res = orderList.filter(item => parseFloat(item.totalAmount) > amount);

        }
        return {
            success: true,
            data: res,
        };
    }
}
