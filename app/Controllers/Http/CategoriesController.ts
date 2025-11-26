import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Validators from "../../Validators";
import { CategoryDomain } from "../../Domain";
import { CategoryRepo } from "../../Repositories";
import { SUCCESS } from "../../Data/language";
import Category from 'App/Models/Category'
import AuthController from 'App/Controllers/Http/AuthController'
import Env from '@ioc:Adonis/Core/Env'
import JWT from 'jsonwebtoken'
const JWT_SECRET_KEY = Env.get('JWT_SECRET_KEY')

export default class CategoriesController {

    public async get({ request }: HttpContextContract) {
        await AuthController.checkHeader(request)
        let authHeader = request.header('authorization') || ''

        let decoded
        if (authHeader && authHeader.startsWith('Bearer ')) {
            authHeader = authHeader.slice(7, authHeader.length)
            decoded = JWT.verify(authHeader, JWT_SECRET_KEY)
        }

        const userType1: any = decoded ? decoded.userType : null
        let userType = 0
        let employeeType = 0

        if(userType1 == "EMPLOYEE") {
          employeeType = 1
        } else if(userType1 == "USER"){
          userType = 1
        }  else if(userType1 == null){
          userType = 0
        }

        const language = request.header('language') || 'en'
        const type = request.header('type') || ''

        let categoryList = CategoryDomain.createFromArrOfObject(
            await CategoryRepo.get(type, userType, employeeType)
        )
        if (categoryList.length != 0) {
            categoryList.map((el) => {
                el.name = language == 'en' ? el.enName : el.arName
            })
        }
        categoryList.unshift({
            "id": 0,
            "name": "ALL",
            "enName": "ALL",
            "arName": "الجميع",
            "image": "https://images.immediate.co.uk/production/volatile/sites/23/2015/01/GettyImages-1044316086-197b151.jpg?quality=90&resize=980,654",
            "active": 1,
            "createdAt": "2023-03-24T22:17:32.000+05:30",
            "updatedAt": "2023-03-29T10:04:05.000+05:30",
            "type": "",
            "colorCode": "",
            "parentId": 0
        })
        return {
            error: false,
            data: categoryList,
        };
    }

    public async getSubCategory({ request }: HttpContextContract) {
        await AuthController.checkHeader(request)
        const payload = request.all()
        const language = request.header('language') || 'en'
        const type = request.header('type') || ''

        let categoryList = CategoryDomain.createFromArrOfObject(
            await CategoryRepo.getSubCategory(type, payload.categoryId)
        )
        if (categoryList.length != 0) {
            categoryList.map((el) => {
                el.name = language == 'en' ? el.enName : el.arName
            })
        }
        return {
            error: false,
            data: categoryList,
        };
    }

    public async create({ request }: HttpContextContract) {
        const payload = await request.validate(Validators.CategoryValidator);

        const language = request.header('language') || 'en'
        const CategoryDetails = await CategoryRepo.create(payload, language);

        return {
            error: false,
            data: CategoryDomain.createFromObject(CategoryDetails),
            message: SUCCESS.CATEGORY_CREATE[language]
        };
    }

    public async update({ request, params }: HttpContextContract) {
        const UpdatePost = request.all()

        const language = request.header('language') || 'en'
        await CategoryRepo.isEntryExist(params.id, language);

        const updateResult = CategoryDomain.createFromObject(
            await CategoryRepo.update(params.id, UpdatePost, language)
        );

        return {
            error: false,
            data: updateResult,
            message: SUCCESS.CATEGORY_UPDATE[language]
        };
    }

    public async delete({ request, params }: HttpContextContract) {
        const language = request.header('language') || 'en'
        const result = await CategoryRepo.isEntryExist(params.id, language);

        await CategoryRepo.delete({ active: 0 }, result, language);
        return {
            error: false,
            message: SUCCESS.CATEGORY_DELETE[language]
        };

    }

    public async adminGet({ request }: HttpContextContract) {
        await AuthController.checkHeader(request)
        const type = request.header('type') || ''

        const payload = request.all()
        const orderBy = payload.orderBy || "created_at";
        const orderByValue = payload.orderByValue ? payload.orderByValue.toLowerCase() : "Desc";

        const searchValue = payload.searchValue ? `%${payload.searchValue}%` : "";

        const offset = payload.offset ? Number(payload.offset) : 1;
        const limit = payload.offset ? Number(payload.limit) : 100;

        return {
            error: false,
            data: CategoryDomain.createFromArrOfObject(
                await CategoryRepo.adminGet(payload.active, type, orderBy, orderByValue, searchValue, offset, limit, payload.parentId)
            ),
        };
    }

    public async adminGetSubCategory({ request }: HttpContextContract) {
        await AuthController.checkHeader(request)
        const payload = request.all()
        // const language = request.header('language') || 'en'
        const type = request.header('type') || ''

        return {
            error: false,
            data: CategoryDomain.createFromArrOfObject(
                await CategoryRepo.getSubCategory(type, payload.categoryId)
            ),
        };
    }

    public async categoriesDelete({ request, params }: HttpContextContract) {
        const language = request.header('language') || 'en'

        const category = await Category.findOrFail(params.id)
        await category.delete()

        return {
            error: false,
            message: SUCCESS.CATEGORY_DELETE[language]
        };

    }
}


