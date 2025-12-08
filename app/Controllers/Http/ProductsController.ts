import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Validators from "../../Validators";
import { ProductDomain, RecipiesDomain, ProductPriceListDomain } from "../../Domain";
import { ProductRepo, RecipiesRepo, CartRepo, UserTypesRepo, ProductPriceListsRepo } from "../../Repositories";
import { SUCCESS } from "../../Data/language";
import Product from 'App/Models/Product';
import AuthController from 'App/Controllers/Http/AuthController'
import { format, subDays } from 'date-fns'
import Env from '@ioc:Adonis/Core/Env'
import JWT from 'jsonwebtoken'
const JWT_SECRET_KEY = Env.get('JWT_SECRET_KEY')
const Excel = require('exceljs');


export default class ProductsController {

    public mergeArray = async (post: any, favorites: any) => {

        let postsLen = post.length
        let favoritesLen = favorites.length

        for (let i = 0; i < favoritesLen; i++) {
            let item = favorites[i]
            console.log("item," + item)
            for (let j = 0; j < postsLen; j++) {
                console.log("item2," + item)

                if (item.productId === post[j].id) {
                    post[j].isFavorites = 1
                } else {
                    post[j].isFavorites = 0
                }
            }
        }
        return post
    }

    public add = async (productList: any, language: any) => {

        if (productList.length != 0) {
            productList.map(async (el) => {
                if (language == 'en') {
                    el.name = el.enProductName
                } else {
                    el.name = el.enProductName
                }
            })
            return productList

        } else {
            return productList
        }
    }

    public async get({ request }: HttpContextContract) {
        await AuthController.checkHeader(request)
        let authHeader = request.header('authorization') || ''
        const language = request.header('language') || 'en'

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
        const userType1: any = decoded ? decoded.userType : null
        let userTypeCat = 0
        let employeeType = 0

        if (userType1 == "EMPLOYEE") {
            employeeType = 1
        } else if (userType1 == "USER") {
            userTypeCat = 1
        }

        let priceListNameId = await UserTypesRepo.getUserType(typeOfUser)

        // console.log(priceListNameId,'priceListNameId')
        const payload = request.all()
        const searchValue = payload.searchValue ? `%${payload.searchValue}%` : "";
        const type = request.header('type') || ''
        const categoryId = payload.categoryId ? payload.categoryId == 0 ? "" : payload.categoryId : ''


        // console.log(type, categoryId, searchValue)
        let productList = ProductDomain.createFromArrOfObject(
            await ProductRepo.get(type, categoryId, searchValue, priceListNameId, userTypeCat, employeeType)
        )
        console.log("productList", productList);
        if (productList.length != 0) {
            productList.map(async (el) => {
                if (language == 'en') {
                    el.name = el.enProductName
                } else {
                    el.name = el.enProductName
                }
            })
        }
        // let favorites: any = FavoritesDomain.createFromArrOfObject(await FavoritesRepo.getFavorites(userId))

        // if (favorites.length !== 0 && productList.length !== 0) {

        //     productList = await this.mergeArray(productList, favorites)

        // } else {
        //     productList = productList
        // }
        var totalCartCount = await CartRepo.getCartCount(userId, type);
        // console.log(productList,'productList')
        return {
            error: false,
            totalCartCount: totalCartCount,
            data: productList,
        };
    }

    public async trendingProduct({ request }: HttpContextContract) {

        const language = request.header('language') || 'en'

        let productList = await ProductRepo.trendingProduct()
        productList = await this.add(productList, language)
        return {
            error: false,
            data: productList,
        };
    }

    public async getProductDetail({ params, request }: HttpContextContract) {
        await AuthController.checkHeader(request)
        let authHeader = request.header('authorization') || ''
        const type = request.header('type') || ''
        const language = request.header('language') || 'en'

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
            await ProductRepo.getProductDetail(userId, params.id, type, priceListNameId)
        )

        // let favorites: any = FavoritesDomain.createFromArrOfObject(await FavoritesRepo.getFavorites(userId))

        // if (favorites.length !== 0 && productList.length !== 0) {

        //     productList = await this.mergeArray(productList, favorites)

        // } else {
        //     productList = productList
        // }

        let recipiesId
        let parentId
        if (productList.length != 0) {
            productList.map((el) => {
                recipiesId = el.recipiesId
                parentId = el.parentId == 0 ? el.id : el.parentId
                if (language == 'en') {
                    el.name = el.enProductName
                } else {
                    el.name = el.enProductName
                }
            })
        }

        let childProduct: any = []
        let productCartCount

        if (parentId) {
            childProduct = ProductDomain.createFromArrOfObject(
                await ProductRepo.getChildProduct(parentId, priceListNameId)
            )

            let productId: any = []
            let productWithCount: any = []
            if (childProduct.length != 0) {
                childProduct.map((el) => {
                    productId.push(el.id)
                    if (language == 'en') {
                        el.name = el.enProductName
                    } else {
                        el.name = el.enProductName
                    }
                })
                productCartCount = await CartRepo.getCartProductCount(userId, productId)

                if (productCartCount.length != 0) {
                    productCartCount.map((el) => {
                        let element = { productId: el.productId, quantity: el.quantity, cartId: el.$extras.cartId }
                        productWithCount.push(element)
                    })

                    childProduct = await childProduct.map(v => ({ ...v, ...productWithCount.find(sp => sp.productId === v.id) }));

                    // childProduct = childProduct.map(t1 => ({ ...t1, ...productWithCount.find(t2 => t2.id === t1.productId) }))
                }
            }
        }

        let childProductfilter
        if (childProduct.length != 0) {
            childProductfilter = await childProduct.filter(function (el) {
                return el.normalPrice != 0
            });
        }

        let productDetails = productList.length != 0 ? productList[0] : []
        productDetails.relatedProduct = productDetails.length != 0 ? childProductfilter : []

        let recipiesList = RecipiesDomain.createFromArrOfObject(
            await RecipiesRepo.get('', recipiesId)
        )
        productDetails.recipiesList = recipiesList

        let cartCountforMainProduct = await CartRepo.getCartProductCount(userId, [params.id])

        productDetails.quantity = cartCountforMainProduct.length != 0 ? cartCountforMainProduct[0].quantity : 0
        productDetails.cartId = cartCountforMainProduct.length != 0 ? cartCountforMainProduct[0].$extras.cartId : 0

        return {
            error: false,
            data: productDetails.length != 0 ? productDetails : {}
        };
    }

    public async create({ request }: HttpContextContract) {
        const req = request.all()
        let payload
        if (req.isBasket == 1) {
            payload = await request.validate(Validators.AdminBasketValidator);
        } else {
            payload = await request.validate(Validators.ProductValidator);
        }

        const language = request.header('language') || 'en'
        const productListDetails = await ProductRepo.create(payload, language);

        return {
            error: false,
            data: ProductDomain.createFromObject(productListDetails),
            message: req.isBasket == 1 ? SUCCESS.ADMIN_BASKET_CREATE[language] : SUCCESS.PRODUCT_CREATE[language]
        };
    }

    public async update({ request, params }: HttpContextContract) {
        const UpdatePost = request.all()

        const language = request.header('language') || 'en'
        await ProductRepo.isEntryExist(params.id, language);


        const updateResult = ProductDomain.createFromObject(
            await ProductRepo.update(params.id, UpdatePost, language)
        );

        return {
            error: false,
            data: updateResult,
            message: UpdatePost.isBasket == 1 ? SUCCESS.ADMIN_BASKET_UPDATE[language] : SUCCESS.ADMIN_BASKET_UPDATE[language]
        };
    }

    public async addRelatedProduct({ request }: HttpContextContract) {
        const updatePost = request.all()

        const language = request.header('language') || 'en'
        // await ProductRepo.isEntryExist(params.id, language);

        let productArray = updatePost.product
        if (productArray.length != 0) {
            productArray.map(async (el) => {
                if (el.parentId == 0) {
                    let id = el.id
                    await delete el.id
                    await ProductRepo.update(id, el, language)

                } else {
                    await ProductRepo.create(el, language);
                }
            })
        }

        return {
            error: false,
            // data: updateResult,
            message: updatePost.isBasket == 1 ? SUCCESS.ADMIN_BASKET_UPDATE[language] : SUCCESS.ADMIN_BASKET_UPDATE[language]
        };
    }

    public async updateRelatedProduct({ request }: HttpContextContract) {
        const updatePost = request.all()

        const language = request.header('language') || 'en'
        // await ProductRepo.isEntryExist(params.id, language);        
        let productArray = updatePost.product
        if (productArray.length != 0) {
            await productArray.map(async (el) => {
                let id = el.id
                await delete el.id
                await ProductRepo.update(id, el, language)
            })
        }

        return {
            error: false,
            // data: updateResult,
            message: updatePost.isBasket == 1 ? SUCCESS.ADMIN_BASKET_UPDATE[language] : SUCCESS.ADMIN_BASKET_UPDATE[language]
        };
    }

    public async delete({ request, params }: HttpContextContract) {
        const language = request.header('language') || 'en'
        const result = await ProductRepo.isEntryExist(params.id, language);

        await ProductRepo.delete({ active: 0 }, result, language);
        return {
            error: false,
            message: SUCCESS.PRODUCT_DELETE[language]
        };

    }

    public async adminGet({ request }: HttpContextContract) {
        await AuthController.checkHeader(request)
        const payload = request.all()
        const type = request.header('type') || ''
        const language = request.header('language') || 'en'
        const parentId = payload.parentId || 0;

        const orderBy = payload.orderBy || "products.created_at";
        const orderByValue = payload.orderByValue ? payload.orderByValue.toLowerCase() : "Desc";

        const searchValue = payload.searchValue ? `%${payload.searchValue}%` : "";

        const offset = payload.offset ? Number(payload.offset) : 1;
        const limit = payload.offset ? Number(payload.limit) : 100;

        // let categoryId = payload.categoryId || ''
        // let subCategoryId = payload.subCategoryId || ''

        let postRange = payload.postRange || ''

        if (postRange) {
            postRange = subDays(new Date(), postRange - 1)
            postRange = format(postRange, 'yyyy-MM-dd')
        }
        let productList = ProductDomain.createFromArrOfObject(
            await ProductRepo.adminGet(type, payload.active, offset, limit, orderBy, orderByValue, postRange, searchValue, 0, parentId)
        )

        if (productList.length != 0) {
            productList.map(async (el) => {
                if (language == 'en') {
                    el.name = el.enProductName
                } else {
                    el.name = el.enProductName
                }
            })
        }

        return {
            error: false,
            data: productList,
        };
    }

    public async adminProductDetails({ params, request }: HttpContextContract) {
        await AuthController.checkHeader(request)
        const type = request.header('type') || ''
        const language = request.header('language') || 'en'

        let productList = ProductDomain.createFromArrOfObject(
            await ProductRepo.adminProductDetails(type, params.id)
        )

        if (productList.length != 0) {
            let enProductName = productList[0].enProductName
            let arProductName = productList[0].arProductName

            productList.map(async (el) => {
                if (language == 'en') {
                    el.name = enProductName
                } else {
                    el.name = arProductName
                }
            })
        }
        return {
            error: false,
            data: productList,
        };
    }

    public async productDelete({ request, params }: HttpContextContract) {
        // const result = await BannerRepo.isEntryExist(params.id);
        const language = request.header('language') || 'en'

        const product = await Product.findOrFail(params.id)
        await product.delete()

        return {
            error: false,
            message: SUCCESS.PRODUCT_DELETE[language]
        };

    }

    public async productImport({ request, params }: HttpContextContract) {

        const language = request.header('language') || 'en'

        const validationOptions = {
            types: ['pdf'],
            size: '1mb',
        };

        const imageFile = request.file('file', validationOptions);

        if (imageFile) {
            const workbook = new Excel.Workbook();
            workbook.xlsx.readFile(imageFile.tmpPath)
                .then(async function () {
                    // Use the first sheet
                    const worksheet = workbook.getWorksheet(1);

                    // Convert the worksheet data to JSON
                    const jsonData: any = [];

                    worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
                        if (rowNumber !== 1) { // Skip header row
                            const rowData = {};
                            row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
                                rowData[worksheet.getCell(1, colNumber).value] = cell.value;
                            });
                            jsonData.push(rowData);
                        }
                    });

                    // console.log(jsonData.length)
                    if (jsonData.length != 0) {
                        try {
                            // Iterate over JSON data and generate update queries
                            for (const item of jsonData) {
                                const { id, price, offer_price, stock, productId } = item; // Assuming your JSON structure has id, field1, field2

                                if (id === null) {
                                    let insertData = {
                                        price: price,
                                        offer_price: offer_price,
                                        stock: stock,
                                        productId: productId,
                                        price_list_name_id: params.id
                                    }
                                    const productListDetails = await ProductPriceListsRepo.create(insertData, language);

                                    // console.log(productListDetails,'productListDetails');

                                } else {
                                    let updatePrice = {
                                        price: price,
                                        offer_price: offer_price,
                                        stock: stock
                                    }
                                    ProductPriceListDomain.createFromObject(
                                        await ProductPriceListsRepo.update(id, updatePrice, language)
                                    );
                                }
                            }

                        } catch (error) {
                            console.error('Error:', error);
                        }

                    }

                })
                .catch(function (error) {
                    console.error('Error:', error);
                });
        }
        return {
            error: false,
            message: SUCCESS.EXCEL_IMPORT[language],
            data: [],
        };

    }

}
