import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Validators from "../../Validators";
import { AuthRepo, UserRepo } from "../../Repositories";
import JWT from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'
const JWT_SECRET_KEY = Env.get('JWT_SECRET_KEY')
import { SUCCESS } from "../../Data/language";
import { UserDomain } from "../../Domain";
import Exceptions from '../../Exceptions';
import { FAILURE } from "../../Data/language";
import axios, { AxiosRequestConfig } from 'axios'

export default class AuthController {

    static async checkHeader(request) {
        let language = request.header('language') || ''
        let type = request.header('type') || ''

        if (!language)
            throw Exceptions.notFound(language ? FAILURE.LANGUAGE_ERROR[language] : FAILURE.LANGUAGE_ERROR['en'])

        if (!type)
            throw Exceptions.notFound(language ? FAILURE.TYPE_ERROR[language] : FAILURE.TYPE_ERROR['en'])
    }

    public inCheckHeader = async (request) => {
        let language = request.header('language') || ''
        let type = request.header('type') || ''

        if (!language)
            throw Exceptions.notFound(language ? FAILURE.LANGUAGE_ERROR[language] : FAILURE.LANGUAGE_ERROR['en'])

        if (!type)
            throw Exceptions.notFound(language ? FAILURE.TYPE_ERROR[language] : FAILURE.TYPE_ERROR['en'])
    }

    public async sendOtp({ request }: HttpContextContract) {
        await this.inCheckHeader(request)

        const { mobileNumber, countryCode } = await request.validate(Validators.SendOtpValidator);

        const language = request.header('language') || 'en'


        let otp


        if (mobileNumber === 98843897) {
            otp = 1234
        } else if (mobileNumber === 98843866) {
            otp = 1234

        } else if (mobileNumber === 75020923) {
            otp = 1234

        } else {
            otp = Math.floor(1000 + Math.random() * 9000);

        }

        const maybeUser = await AuthRepo.isEntryExist(mobileNumber);

        if (!maybeUser) {
            // await AuthRepo.create(data, language);
            return {
                error: false,
                data: {
                    isRegistered: false,
                },
                message: SUCCESS.NEW_USER[language]
            };
        } else {
            if (maybeUser.userType != 'User') {
                if (maybeUser.isApprove == false) {
                    return {
                        error: false,
                        data: {
                            isRegistered: true,
                            isApprove: maybeUser.isApprove
                        },
                        message: SUCCESS.USER_NOT_APPROVED[language]
                    };
                }
            }
            const userId = maybeUser.id
            if (maybeUser.active == false) {
                return {
                    error: false,
                    message: SUCCESS.USER_DEACTIVED[language]
                };
            }

            let messageText
            if (language == 'en') {
                messageText = `Delmon: Your code is ${otp} FA+9qCX9VSu`
            } else {
                // messageText = `رمز التفعيل: `
                messageText = `Delmon: Your code is ${otp} FA+9qCX9VSu`
            }

            console.log(messageText);

            console.log(`http://www.bareedsms.com/RemoteAPI/SendSMS.aspx?username=dawajen&encoding=url&password=Sms@depco&messageData=${messageText}&receiver=+973${mobileNumber}`)
            const config: AxiosRequestConfig = {
                method: 'get',
                url: `http://www.bareedsms.com/RemoteAPI/SendSMS.aspx?username=dawajen&encoding=url&password=Sms@depco&messageData=${messageText}&receiver=+973${mobileNumber}`,
            }

            let otpResult = await axios(config)
                .then(async function (response) {

                    if (response.status == 200) {
                        return true
                    } else {
                        return false
                    }
                })
                .catch(console.log)

            if (otpResult) {
                const userDetails = {
                    otp: mobileNumber == 1234567890 ? 1234 : otp,
                    countryCode: countryCode
                }

                await UserRepo.update(userId, userDetails, language)
                return {
                    error: false,
                    data: {
                        isRegistered: true,
                        isApprove: maybeUser.isApprove
                    },
                    otp: mobileNumber == 1234567890 ? 1234 : otp,
                    // otp: otp,
                    massage: SUCCESS.SENT_OTP[language]
                };
            } else {
                return {
                    error: true,
                    massage: SUCCESS.OTP_NOT_SEND[language]
                };
            }
        }
        return {
            error: false,
            data: {
                isRegistered: true,
                otp: otp,
                userData: maybeUser
            },
            message: SUCCESS.SENT_OTP[language]
        };
    }

    public async verifyOtp({ request }: HttpContextContract) {
        await this.inCheckHeader(request)

        const { mobileNumber, otp } = await request.validate(Validators.VerifyOtpValidator);

        const language = request.header('language') || 'en'
        let userData = await AuthRepo.checkOtp(mobileNumber, otp, language)

        let token
        if (userData) {

            let data = {
                id: userData.id,
                firstName: userData.firstName,
                lastName: userData.lastName,
                userType: userData.userType,
                merchantType: userData.merchantType
            }
            token = JWT.sign(data, JWT_SECRET_KEY);
        }

        let result = {}
        if (userData) {
            result = {
                id: userData.id,
                email: userData.email,
                mobileNumber: userData.mobileNumber,
                firstName: userData.firstName,
                lastName: userData.lastName,
                token: token,
                isNewUser: userData.isNewUser,
                userName: userData.userName,
                isApprove: userData.isApprove,
                userType: userData.userType,
                merchantType: userData.merchantType,
                isRegistered: true
            }
            // const userId = userData.id
            // const userDetails = {
            //     otp: 0
            // }
            // await UserRepo.update(userId, userDetails, language)
        }

        return {
            error: false,
            message: SUCCESS.VERIFY_OTP[language],
            data: result
        };
    }

    public async adminLogin({ request }: HttpContextContract) {
        await this.inCheckHeader(request)

        const { mobileNumber } = await request.validate(Validators.SendOtpValidator);

        const language = request.header('language') || 'en'
        const userData = await AuthRepo.isEntryExist(mobileNumber);

        let token
        if (userData) {

            let data = {
                id: userData.id,
                firstName: userData.firstName,
                lastName: userData.lastName,
                userType: userData.userType,
                merchantType: userData.merchantType
            }
            token = JWT.sign(data, JWT_SECRET_KEY);
        }

        let result = {}
        if (userData) {
            result = {
                id: userData.id,
                email: userData.email,
                mobileNumber: userData.mobileNumber,
                firstName: userData.firstName,
                lastName: userData.lastName,
                token: token,
                isNewUser: userData.isNewUser,
                userName: userData.userName,
                isApprove: userData.isApprove,
                userType: userData.userType,
                merchantType: userData.merchantType,
                isRegistered: true
            }
            return {
                error: false,
                message: SUCCESS.ADMINLOGIN[language],
                data: result
            };
        } else {
            return {
                error: true,
                message: SUCCESS.NEW_USER[language],
                data: []
            };
        }
    }

    public async create({ request }: HttpContextContract) {
        await this.inCheckHeader(request)

        const { mobileNumber, countryCode, userName, email, userType, crNumber, employeeNumber } = await request.validate(Validators.CreateUserValidator);

        if (userType == 'EMPLOYEE') {
            if (!employeeNumber)

                return {
                    "error": true,
                    "message": "employeeNumber is required"
                }
        } else if (userType == 'MERCHANT') {
            if (!crNumber)
                return {
                    "error": true,
                    "message": "crNumber is required"
                }
        }

        const language = request.header('language') || 'en'
        // var otp = Math.floor(1000 + Math.random() * 9000);
        // const otp = 1234
        let otp

        if (mobileNumber === 98843897) {
            otp = 1234
        } else if (mobileNumber === 98843866) {
            otp = 1234

        } else if (mobileNumber === 75020923) {
            otp = 1234

        } else {
            otp = Math.floor(1000 + Math.random() * 9000);

        }

        const data = {
            mobileNumber: mobileNumber,
            countryCode: countryCode,
            userName: userName,
            email: email,
            userType: userType,
            isNewUser: 0,
            isApprove: userType == 'USER' ? 1 : 0,
            employeeNumber: employeeNumber ? employeeNumber : '',
            crNumber: crNumber ? crNumber : '',
            otp: mobileNumber == 1234567890 ? 1234 : otp
            // otp: 1234
        }
        const maybeUser = await AuthRepo.isEntryExist(mobileNumber);

        let userData: any = {}
        if (!maybeUser) {
            userData = UserDomain.createFromObject(await AuthRepo.create(data, language));
        } else {
            const userId = maybeUser.id
            if (maybeUser.active == false) {
                return {
                    error: true,
                    message: SUCCESS.USER_DEACTIVED[language]
                };
            }

            let messageText
            if (language == 'en') {
                messageText = `Delmon: Your code is ${otp} FA+9qCX9VSu`
            } else {
                // messageText = `رمز التفعيل: `
                messageText = `Delmon: Your code is ${otp} FA+9qCX9VSu`
            }

            console.log(messageText);

            console.log(`http://www.bareedsms.com/RemoteAPI/SendSMS.aspx?username=dawajen&encoding=url&password=Sms@depco&messageData=${messageText}&receiver=${mobileNumber}`)
            const config: AxiosRequestConfig = {
                method: 'get',
                url: `http://www.bareedsms.com/RemoteAPI/SendSMS.aspx?username=dawajen&encoding=url&password=Sms@depco&messageData=${messageText}&receiver=${mobileNumber}`,
            }

            let otpResult = await axios(config)
                .then(async function (response) {
                    if (response.status == 200) {
                        return true
                    } else {
                        return false
                    }
                })
                .catch(console.log)

            if (otpResult) {
                return {
                    error: false,
                    data: userData,
                    otp: otp,
                    massage: SUCCESS.SENT_OTP[language]
                };
            } else {
                return {
                    error: true,
                    massage: SUCCESS.OTP_NOT_SEND[language]
                };
            }

            const userDetails = {
                otp: mobileNumber == 1234567890 ? 1234 : otp,
                // otp: 1234,
                countryCode: countryCode
            }

            await UserRepo.update(userId, userDetails, language)
        }
        userData.otp = otp
        return {
            error: false,
            otp: otp,
            data: userData,
            message: SUCCESS.SENT_OTP[language]
        };
    }

    public async adminCreateUser({ request }: HttpContextContract) {
        await this.inCheckHeader(request)

        const { mobileNumber, countryCode, userName, email, userType, crNumber, employeeNumber } = await request.validate(Validators.CreateUserValidator);

        if (userType == 'EMPLOYEE') {
            if (!employeeNumber)
                return {
                    "error": true,
                    "message": "employeeNumber is required"
                }
        } else if (userType == 'MERCHANT') {
            if (!crNumber)
                return {
                    "error": true,
                    "message": "crNumber is required"
                }
        }

        const language = request.header('language') || 'en'

        const data = {
            mobileNumber: mobileNumber,
            countryCode: countryCode,
            userName: userName,
            email: email,
            userType: userType,
            isNewUser: 0,
            isApprove: 1,
            employeeNumber: employeeNumber ? employeeNumber : '',
            crNumber: crNumber ? crNumber : '',
        }
        const maybeUser = await AuthRepo.isEntryExist(mobileNumber);

        let userData: any = {}
        if (!maybeUser) {
            userData = UserDomain.createFromObject(await AuthRepo.create(data, language));
            return {
                error: true,
                message: SUCCESS.USER_CREATED[language]
            };
        } else {
            if (maybeUser.active == false) {
                return {
                    error: true,
                    message: SUCCESS.USER_DEACTIVED[language]
                };
            } else {
                return {
                    error: false,
                    data: userData,
                    message: SUCCESS.USER_ALREADY_EXIST[language]
                };
            }
        }
    }

    public async logout({ request }: HttpContextContract) {
        await this.inCheckHeader(request)

        let token = request.headers().authorization || ''

        const language = request.header('language') || 'en'

        if (token && token.startsWith("Bearer ")) token = token.slice(7, token.length);

        if (token) {
            const decoded = await JWT.verify(token, JWT_SECRET_KEY, async (err, decodedData) => {
                if (err) return false
                return decodedData
            })

            if (!decoded)
                // return response.status(422).send({
                //     message: `JWT Expired`
                // })
                return {
                    error: true,
                    message: `JWT Expired`,
                };

            const userId = decoded.id

            const userDetails = {
                deviceToken: ''
            }

            await AuthRepo.updateAdmin(userId, userDetails, language)
        }

        return {
            error: false,
            message: SUCCESS.LOGOUT[language],
        };
    }
}
