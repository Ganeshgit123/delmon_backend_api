import Exceptions from '../Exceptions';
import Product from 'App/Models/Product';
import Order from 'App/Models/Order';
import { FAILURE } from "../Data/language";
import { format } from 'date-fns'
import Database from '@ioc:Adonis/Lucid/Database';

export default class ProductRepo {
    static async create(data: any, language: string) {
        const result = await Product.create(data)
        if (!result) throw Exceptions.notFound(FAILURE.PRODUCT_CREATE[language])
        return result
    }

    static async update(id: number, data: any, language: string) {
        try {
            const product = await Product.findOrFail(id)
            product.merge(data)
            await product.save()

            return product
        } catch (error) {
            throw Exceptions.conflict(FAILURE.PRODUCT_CONFLICT[language])
        }
    }

    static async homeGet(type, mostWantedProduct, offers, newProduct, priceListNameId) {
        const result = await Product.query()
            .select('products.*')
            .select('categories.en_name as categoryName')
            .select('product_price_lists.price as productPrice', 'product_price_lists.offer_price as offerPrice')
            .select('favorites.id as favId')
            .where('products.active', 1)
            .leftJoin('favorites', 'products.id', 'favorites.product_id')
            .innerJoin('categories', 'products.category_id', 'categories.id')
            .innerJoin('product_price_lists', 'products.id', 'product_price_lists.product_id')
            .if(priceListNameId, (query) =>
                query.where('product_price_lists.price_list_name_id', priceListNameId))
            .if(mostWantedProduct, (query) =>
                query.where('products.most_wanted_product', mostWantedProduct))
            .if(offers, (query) =>
                query.where('products.offers', offers))
            .if(newProduct, (query) =>
                query.where('products.new_product', newProduct))
            .if(type, (query) =>
                query.where('products.type', type))
            // .if(categoryId, (query) =>
            //     query.where('products.category_id', categoryId))
            // .if(searchValue, (query) =>
            //     query.where('products.name', 'like', searchValue))
            .where('products.is_basket', 0)
            .where('products.parent_id', 0)
            .where('categories.user_type', 1)


        return result
    }

    static async get(type, categoryId, searchValue, priceListNameId, userType, employeeType) {
        const result = await Product.query()
            .select('products.*')
            .select('categories.en_name as categoryName')
            .select('product_price_lists.price as productPrice', 'product_price_lists.offer_price as offerPrice')
            // .select('favorites.id as favId')
            .where('products.active', 1)
            // .leftJoin('favorites', 'products.id', 'favorites.product_id')
            .innerJoin('categories', 'products.category_id', 'categories.id')
            .innerJoin('product_price_lists', 'products.id', 'product_price_lists.product_id')
            .if(priceListNameId, (query) =>
                query.where('product_price_lists.price_list_name_id', priceListNameId))
            .if(type, (query) =>
                query.where('products.type', type))
            .if(categoryId, (query) =>
                query.where('products.category_id', categoryId))
            .if(searchValue, (query) =>
                query.where('products.en_product_name', 'like', searchValue))
            .if(userType, (query) =>
                query.where('categories.user_type', userType))
            .if(employeeType, (query) =>
                query.where('categories.employee_type', employeeType))
            // .if(searchValue, (query) =>
            //     query.where('products.ar_product_name', 'like', searchValue))
            .where('categories.active', 1)
            .where('products.is_basket', 0)
            .where('products.parent_id', 0)

        return result
    }

    static async trendingProduct() {
        const result = await Database.rawQuery(`SELECT 
    p.parent_id AS productId,
    ANY_VALUE(p.en_product_name) AS enProductName,
    ANY_VALUE(p.ar_product_name) AS arProductName,
    SUM(o.quantity) AS quantity
FROM carts AS o
INNER JOIN products AS p ON o.product_id = p.id
GROUP BY p.parent_id
ORDER BY quantity DESC LIMIT 5`)
        return result[0]
    }

    static async getProductDetail(userId, productId, type, priceListNameId) {
        console.log("data" + productId + type + priceListNameId)
        const result = await Product.query()
            .select('products.*')
            .select('categories.en_name as categoryName')
            .select('product_price_lists.price as productPrice', 'product_price_lists.offer_price as offerPrice', 'product_price_lists.stock as stockCount')
            .select('favorites.id as favId')
            .leftJoin('favorites', (join) => {
                join.on('products.id', '=', 'favorites.product_id')
                if (userId) {
                    join.on('favorites.user_id', '=', userId)
                }
            })
            .innerJoin('categories', 'products.category_id', 'categories.id')
            .innerJoin('product_price_lists', 'products.id', 'product_price_lists.product_id')
            .if(priceListNameId, (query) =>
                query.where('product_price_lists.price_list_name_id', priceListNameId))
            .if(productId, (query) =>
                query.where('products.id', productId))
            .if(type, (query) =>
                query.where('products.type', type))
            .where('products.is_basket', 0)
            .where('products.parent_id', 0)
            .where('products.active', 1)

        return result
    }

    static async getChildProduct(id, priceListNameId) {
        const result = await Product.query()
            .select('products.*')
            .select('categories.en_name as categoryName')
            .select('product_price_lists.price as productPrice', 'product_price_lists.offer_price as offerPrice', 'product_price_lists.stock as stockCount')
            // Use scalar subquery to avoid row multiplication from favorites join
            .select(Database.raw('(SELECT MAX(f.id) FROM favorites f WHERE f.product_id = products.id) AS favId'))
            .where('products.active', 1)
            // Removed: .leftJoin('favorites', 'products.id', 'favorites.product_id')
            .innerJoin('categories', 'products.category_id', 'categories.id')
            .innerJoin('product_price_lists', 'products.id', 'product_price_lists.product_id')
            .if(priceListNameId, (query) =>
                query.where('product_price_lists.price_list_name_id', priceListNameId))
            .where((query) => {
                query
                    // .where('products.id', id)
                    .orWhere('products.parent_id', id)
            })
            .where('products.active', 1)
            .where('products.is_basket', 0)
        return result
    }

    static async delete(data: any, Product, language: string) {
        Product.active = data.active
        await Product.save()
        if (!Product.$isPersisted)
            throw Exceptions.notFound(FAILURE.PRODUCT_DELETE_CONFLICT[language])
        return Product
    }

    static async isEntryExist(id: number, language: string) {
        const result = await Product.query().where('id', id).first()
        if (!result) throw Exceptions.notFound(FAILURE.PRODUCT_CONFLICT[language])
        return result
    }

    static async getBasket(type, searchValue, priceListNameId, isBasket) {
        const result = await Product.query()
            .select('products.*')
            .select('product_price_lists.price as productPrice', 'product_price_lists.offer_price as offerPrice')
            .innerJoin('product_price_lists', 'products.id', 'product_price_lists.product_id')
            .if(priceListNameId, (query) =>
                query.where('product_price_lists.price_list_name_id', priceListNameId))
            .if(type, (query) =>
                query.where('products.type', type))
            .if(isBasket, (query) =>
                query.where('products.is_basket', isBasket))
            .if(searchValue, (query) =>
                query.where('products.name', 'like', searchValue))
        return result
    }

    static async getBasketDetail(productId, type, priceListNameId) {
        const result = await Product.query()
            .select('products.*')
            .select('product_price_lists.price as productPrice', 'product_price_lists.offer_price as offerPrice')
            .innerJoin('product_price_lists', 'products.id', 'product_price_lists.product_id')
            .where('products.is_basket', 1)
            .if(priceListNameId, (query) =>
                query.where('product_price_lists.price_list_name_id', priceListNameId))
            .if(productId, (query) =>
                query.where('products.id', productId))
            .if(type, (query) =>
                query.where('products.type', type))
        return result
    }

    static async getBasketProduct(parentId, priceListNameId, type) {
        const result = await Product.query()
            .select('products.*')
            .select('product_price_lists.price as productPrice', 'product_price_lists.offer_price as offerPrice')
            .innerJoin('product_price_lists', 'products.id', 'product_price_lists.product_id')
            .if(priceListNameId, (query) =>
                query.where('product_price_lists.price_list_name_id', priceListNameId))
            .if(type, (query) =>
                query.where('products.type', type))
            .whereIn('products.id', parentId)
        return result
    }

    static async adminGet(type, active, offset, limit, orderBy, orderByValue, postRange, searchValue, isBasket, parentId) {
        const currentData = format(new Date(), 'yyyy-MM-dd')
        const result = await Product.query()
            .select('products.*')
            .select('categories.en_name as categoryName', 'categories.en_name as enName', 'categories.en_name as arName')
            .leftJoin('categories', 'products.category_id', 'categories.id')
            .if(parentId == 0, (query) =>
                query.where('products.parent_id', parentId))
            .if(parentId == "ALL", (query) =>
                query.whereNot('products.parent_id', 0))
            .if(type, (query) =>
                query.where('products.type', type))
            .if(type, (query) =>
                query.where('products.is_basket', isBasket))
            .if(active, (query) =>
                query.where('products.active', active))
            .if(postRange, (query) =>
                query.whereBetween('products.updated_at', [`${postRange} 00:00:00`, `${currentData} 23:59:00`]))
            .if(searchValue, (query) =>
                query.whereILike('products.name', searchValue))
            .if(offset && limit, (query) => {
                query.forPage(offset, limit)
            })
            .if(orderBy && orderByValue, (query) => {
                query.orderBy(orderBy, orderByValue)
            })
        return result
    }

    static async adminProductDetails(type, id) {
        const result = await Product.query()
            .select('products.*')
            .select('categories.en_name as categoryName')
            // .where('products.active', 1)
            .innerJoin('categories', 'products.category_id', 'categories.id')
            .if(type, (query) =>
                query.where('products.type', type))
            .where('products.parent_id', id)
            .orWhere('products.id', id)
        // .where('products.active', 1)
        return result
    }

    static async getAppliedCouponId(userId) {
        const result = await Order.query()
            .select('coupon_id')
            // .whereNot('couponId', 'NULL')
            .if(userId, (query) => query.where('orders.user_id', userId))
        return result
    }

    static async checkCoupon(couponCode, userId) {
        const result = await Order.query()
            .select('coupon_id')
            .where('order.user_id', userId)
            // .whereNot('couponId', 'NULL')
            .if(couponCode, (query) => query.where('order.coupon_name', couponCode))
        return result
    }

    static async getProductForPastOrder(orderId: any, id: any, language: string, priceListNameId: number) {
        // const result = await Product.query().whereIn('id', JSON.parse((id)))
        // const result = await Product.query().whereIn('id', id)
        const result = await Product.query()
            .select('products.*')
            .select('carts.quantity', 'carts.price as cartPrice', 'carts.delivery_address_id as deliveryAddressId', 'carts.order_id as orderId')
            .select('product_price_lists.price as productPrice', 'product_price_lists.offer_price as offerPrice')
            .select('categories.en_name as categoryName', 'categories.vat')
            .leftJoin('product_price_lists', 'products.id', 'product_price_lists.product_id')
            .leftJoin('carts', 'products.id', 'carts.product_id') // 👈 Added join to carts table
            .leftJoin('categories', 'products.category_id', 'categories.id')
            .if(priceListNameId, (query) =>
                query.where('product_price_lists.price_list_name_id', priceListNameId))
            .whereIn('products.id', id)
            .where('carts.order_id', orderId)

            .debug(true) // Logs SQL + 
        if (!result) throw Exceptions.notFound(FAILURE.PRODUCT_CONFLICT[language])
        return result
    }

}