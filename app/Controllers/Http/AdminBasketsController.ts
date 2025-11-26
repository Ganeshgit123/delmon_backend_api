import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ProductDomain, FavoritesDomain, RecipiesDomain } from "../../Domain";
import { ProductRepo, UserTypesRepo, FavoritesRepo, CartRepo, RecipiesRepo } from "../../Repositories";
import AuthController from 'App/Controllers/Http/AuthController'
import { format, subDays } from 'date-fns'
import Env from '@ioc:Adonis/Core/Env'
import JWT from 'jsonwebtoken'
const JWT_SECRET_KEY = Env.get('JWT_SECRET_KEY')

export default class AdminBasketsController {

    public mergeArray = async (post: any, favorites: any) => {

        let postsLen = post.length
        let favoritesLen = favorites.length

        for (let i = 0; i < favoritesLen; i++) {
            let item = favorites[i]

            for (let j = 0; j < postsLen; j++) {
                if (item.productId === post[j].id) {
                    post[j].isFavorites = 1
                } else {
                    post[j].isFavorites = 0
                }
            }
        }
        return post
    }

    public async get({ request }: HttpContextContract) {
        await AuthController.checkHeader(request)
        let authHeader = request.header('authorization') || ''

        let decoded
        if (authHeader && authHeader.startsWith('Bearer ')) {
            authHeader = authHeader.slice(7, authHeader.length)
            decoded = JWT.verify(authHeader, JWT_SECRET_KEY)
        }

        const userId: any = decoded ? decoded.id : 0
        const userType: any = decoded ? decoded.userType : null
        const merchantType: any = decoded ? decoded.merchantType : null

        let typeOfUser = ''
        if (merchantType == null) {
            typeOfUser = userType
        } else {
            typeOfUser = merchantType
        }

        let priceListNameId = await UserTypesRepo.getUserType(typeOfUser)

        const payload = request.all()
        const searchValue = payload.searchValue ? `%${payload.searchValue}%` : "";
        const type = request.header('type') || ''
        // const categoryId = payload.categoryId ? payload.categoryId == 0 ? "" : payload.categoryId : ''
        const language = request.header('language') || 'en'

        let productList = ProductDomain.createFromArrOfObject(
            await ProductRepo.getBasket(type, searchValue, priceListNameId, 1)
        )

        let favorites: any = FavoritesDomain.createFromArrOfObject(await FavoritesRepo.getFavorites(userId))

        if (favorites.length !== 0 && productList.length !== 0) {

            productList = await this.mergeArray(productList, favorites)

        } else {
            productList = productList
        }
        if (productList.length != 0) {
            productList.map((el) => {
                el.name = language == 'en' ? el.enProductName : el.arProductName
            })
        }

        return {
            error: false,
            data: productList,
        };
    }

    public async getProductDetail({ params, request }: HttpContextContract) {
        await AuthController.checkHeader(request)
        let authHeader = request.header('authorization') || ''
        const type = request.header('type') || ''

        let decoded
        if (authHeader && authHeader.startsWith('Bearer ')) {
            authHeader = authHeader.slice(7, authHeader.length)
            decoded = JWT.verify(authHeader, JWT_SECRET_KEY)
        }

        const userId: any = decoded ? decoded.id : 0
        const userType: any = decoded ? decoded.userType : null
        const merchantType: any = decoded ? decoded.merchantType : null

        let typeOfUser = ''
        if (merchantType == null) {
            typeOfUser = userType
        } else {
            typeOfUser = merchantType
        }

        let priceListNameId = await UserTypesRepo.getUserType(typeOfUser)

        let productList = ProductDomain.createFromArrOfObject(
            await ProductRepo.getBasketDetail(params.id, type, priceListNameId)
        )

        let favorites: any = FavoritesDomain.createFromArrOfObject(await FavoritesRepo.getFavorites(userId))

        if (favorites.length !== 0 && productList.length !== 0) {

            productList = await this.mergeArray(productList, favorites)

        } else {
            productList = productList
        }

        let recipiesId
        let parentId
        if (productList.length != 0) {
            productList.map((el) => {
                recipiesId = el.recipiesId
                parentId = el.basketProductList
            })
        } else {
            return {
                error: false,
                data: {}
            };
        }

        let childProduct: any = []
        let productCartCount

        if (parentId.length != 0) {
            childProduct = ProductDomain.createFromArrOfObject(
                await ProductRepo.getBasketProduct(parentId, priceListNameId, type)
            )

            let productId: any = []
            let productWithCount: any = []
            if (childProduct.length != 0) {
                childProduct.map((el) => {
                    productId.push(el.id)
                })
                productCartCount = await CartRepo.getCartProductCount(userId, productId)

                if (productCartCount.length != 0) {
                    productCartCount.map((el) => {
                        let element = { productId: el.productId, quantity: el.quantity, cartId: el.$extras.cartId }
                        productWithCount.push(element)
                    })
                    childProduct = productWithCount.map(t1 => ({ ...t1, ...childProduct.find(t2 => t2.id === t1.productId) }))
                }
            }
        }

        let productDetails = productList.length != 0 ? productList[0] : []
        productDetails.relatedProduct = productDetails.length != 0 ? childProduct : []

        let recipiesList = RecipiesDomain.createFromArrOfObject(
            await RecipiesRepo.get('', recipiesId)
        )
        productDetails.recipiesList = recipiesList

        let cartCountforMainProduct = await CartRepo.getCartProductCount(userId, [params.id])

        productDetails.quantity = cartCountforMainProduct.length != 0 ? cartCountforMainProduct[0].quantity : 0
        productDetails.cartId = cartCountforMainProduct.length != 0 ? cartCountforMainProduct[0].$extras.cartId : 0
        return {
            error: false,
            data: productDetails.length != 0 ? productDetails : {},
            productList: childProduct
        };
    }

    //admin
    public async adminGet({ request }: HttpContextContract) {
        await AuthController.checkHeader(request)
        const payload = request.all()
        const type = request.header('type') || ''

        const orderBy = payload.orderBy || "created_at";
        const orderByValue = payload.orderByValue ? payload.orderByValue.toLowerCase() : "Desc";
        const language = request.header('language') || 'en'

        const searchValue = payload.searchValue ? `%${payload.searchValue}%` : "";

        const offset = payload.offset ? Number(payload.offset) : 1;
        const limit = payload.offset ? Number(payload.limit) : 100;
        const isBasket = payload.isBasket || '';

        let postRange = payload.postRange || ''

        if (postRange) {
            postRange = subDays(new Date(), postRange - 1)
            postRange = format(postRange, 'yyyy-MM-dd')
        }

        let basketList = ProductDomain.createFromArrOfObject(
            await ProductRepo.adminGet(type, payload.active, offset, limit, orderBy, orderByValue, postRange, searchValue, isBasket, 0)
        )

        if (basketList.length != 0) {
            basketList.map(async (el) => {
                if (language == 'en') {
                    el.name = el.enProductName
                } else {
                    el.name = el.arProductName
                }
            })
        }

        return {
            error: false,
            data: basketList,
        };
    }

}
