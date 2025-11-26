import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { BannerDomain, CategoryDomain, ProductDomain, SettingsDomain } from "../../Domain";
import { BannerRepo, CategoryRepo, ProductRepo, UserTypesRepo, SettingsRepo } from "../../Repositories";
import { SUCCESS } from "../../Data/language";
import AuthController from 'App/Controllers/Http/AuthController'
import Env from '@ioc:Adonis/Core/Env'
import JWT from 'jsonwebtoken'
const JWT_SECRET_KEY = Env.get('JWT_SECRET_KEY')

export default class HomeController {

    public async get({ request }: HttpContextContract) {
        await AuthController.checkHeader(request)
        let authHeader = request.header('authorization') || ''

        let decoded
        if (authHeader && authHeader.startsWith('Bearer ')) {
            authHeader = authHeader.slice(7, authHeader.length)
            decoded = JWT.verify(authHeader, JWT_SECRET_KEY)
        }

        const userType1: any = decoded ? decoded.userType : null
        let userType2 = 0
        let employeeType = 0

        if(userType1 == "EMPLOYEE") {
          employeeType = 1
        } else if(userType1 == "USER"){
          userType2 = 1
        }

        const type = request.header('type') || ''
        const language = request.header('language') || 'en'

        let categoryList = CategoryDomain.createFromArrOfObject(
            await CategoryRepo.get(type, userType2, employeeType)
        )
        if (categoryList.length != 0) {
            categoryList.map((el) => {
                el.name = language == 'en' ? el.enName : el.arName
            })
        }
        let bannerList = BannerDomain.createFromArrOfObject(
            await BannerRepo.get(type)
        )
        if (bannerList.length != 0) {
            bannerList.map((el) => {
                el.image = language == 'en' ? el.enImage : el.arImage
            })
        }

        // const userId: any = decoded ? decoded.id : 0
        const userType: any = decoded ? decoded.userType : null
        const merchantType: any = decoded ? decoded.merchantType : null

        let typeOfUser = ''
        if (merchantType == null) {
            typeOfUser = userType
        } else {
            typeOfUser = merchantType
        }

        let priceListNameId = await UserTypesRepo.getUserType(typeOfUser)

        let mostWantedProductList = ProductDomain.createFromArrOfObject(
            await ProductRepo.homeGet(type, 1, 0, 0, priceListNameId)
        )
        
        let offersProductList = ProductDomain.createFromArrOfObject(
            await ProductRepo.homeGet(type, 0, 1, 0, priceListNameId)
        )
        
        let newProductProductList = ProductDomain.createFromArrOfObject(
            await ProductRepo.homeGet(type, 0, 0, 1, priceListNameId)
        )
        const productArray: any[] = [];
        let res = {
            "banner": bannerList,
            "category": categoryList,
            "productdata":productArray
        }
        if (mostWantedProductList.length != 0) {
            await mostWantedProductList.map(async (el) => {
                if (language == 'en') {
                    el.name = el.enProductName
                } else {
                    el.name = el.arProductName
                    el.description = el.arDescription
                }
            })

            // res['mostWantedProductList'] = mostWantedProductList
            let mostWantedProductListTitle = language == 'en' ? "Most Wanted Product" : 'المنتج الأكثر طلبا'
            productArray.push({title: mostWantedProductListTitle,data:mostWantedProductList})
        }

        if (offersProductList.length != 0) {
            await offersProductList.map(async (el) => {
                if (language == 'en') {
                    el.name = el.enProductName
                } else {
                    el.name = el.arProductName
                    el.description = el.arDescription
                }
            })
            // res['offersProductList'] = offersProductList
            let OffersTitle = language == 'en' ? "Offers" : 'عروض'

            productArray.push({title: OffersTitle,data:offersProductList})

        }

        if (newProductProductList.length != 0) {
            await newProductProductList.map(async (el) => {
                if (language == 'en') {
                    el.name = el.enProductName
                } else {
                    el.name = el.arProductName
                    el.description = el.arDescription
                }
            })
            // res['newProductProductList'] = newProductProductList
            let newProductsTitle = language == 'en' ? "New Products" : 'منتجات جديدة'
            productArray.push({title: newProductsTitle,data:newProductProductList})

        }

        let setting = SettingsDomain.createFromArrOfObject(
            await SettingsRepo.adminGet(1)
        )
        let enPopupAdvertisement
        let arPopupAdvertisement

        if (setting.length != 0) {
            await setting.map((data) => {
                if (data.key == 'popupAdvertisement') {
                    enPopupAdvertisement = data.enValue
                    arPopupAdvertisement = data.arValue

                }
            })
        }

        return {
            error: false,
            message: SUCCESS.DATA[language],
            data: res,
            popupAdvertisement: language == 'en' ? enPopupAdvertisement : arPopupAdvertisement,

        }
    };
}
