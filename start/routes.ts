/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import fs from 'fs'
import Env from '@ioc:Adonis/Core/Env'

if (!fs.existsSync(Env.get('PDF_PATH'))) {
  fs.mkdirSync(Env.get('PDF_PATH'))
  console.log('PDF_FOLDER_CREATED')
}

Route.get('/', async () => {
  return 'Welcome to Delmon...'
})

// user Routes
Route.group(() => {
  Route.get('/home', 'HomeController.get')
  Route.get('/banner', 'BannersController.get')
  Route.get('/category', 'CategoriesController.get')
  Route.get('/subCategory', 'CategoriesController.getSubCategory')
  Route.get('/product', 'ProductsController.get')
  Route.get('/trendingProduct', 'ProductsController.trendingProduct')
  Route.post('/productImport/:id', 'ProductsController.productImport')
  Route.get('/product/basket', 'AdminBasketsController.get')
  // Route.get('/auth/product', 'ProductsController.get').middleware('auth')
  Route.get('/productDetail/:id', 'ProductsController.getProductDetail')
  Route.get('/basket/productDetail/:id', 'AdminBasketsController.getProductDetail')
  // Route.get('/auth/productDetail/:id', 'ProductsController.getProductDetail').middleware('auth')
  Route.get('/recipies', 'RecipiesController.get')
  Route.get('/coupon', 'CouponsController.get')
  Route.get('/loyaltyPoints', 'LoyaltyPointsController.get').middleware('auth')
  Route.get('/applyLoyaltyPoints', 'LoyaltyPointsController.applyLoyaltyPoints')
  Route.get('/pin', 'PinsController.get')
  Route.get('/area', 'AreasController.getArea')
  Route.get('/zone', 'ZonesController.get')
  Route.get('/findArea', 'AreasController.userGet')
  Route.get('/url', 'SettingsController.getUrl')
  Route.get('/getInvoice/:id', 'OrdersController.getInvoice')

  Route.group(() => {
    Route.post('/', 'ReportsController.create')
  }).prefix('/report')

  Route.group(() => {
    Route.post('/apply', 'CouponsController.getCoupon')
  }).prefix('/coupon').middleware('auth')

  Route.group(() => {
    Route.get('/', 'SpinAndWinsController.get')
  }).prefix('/spinAndWin')

  Route.group(() => {
    Route.post('/', 'SpinAndWinListsController.create')
  }).prefix('/spinAndWinList')

  Route.group(() => {
    Route.get('/', 'WalletsController.get')
    Route.post('/add', 'WalletsController.create')
  }).prefix('/wallet').middleware('auth')

  Route.group(() => {
    Route.post('/createUser', 'AuthController.create')
    Route.post('/sendOtp', 'AuthController.sendOtp')
    Route.post('/verifyOtp', 'AuthController.verifyOtp')
    Route.post('/adminLogin', 'AuthController.adminLogin')
    Route.get('/logout', 'AuthController.logout').middleware('auth')
  }).prefix('/auth')

  Route.group(() => {
    Route.get('/view', 'CartsController.get')
    Route.post('/', 'CartsController.create')
    Route.post('/:id', 'CartsController.update')
    Route.delete('/:id', 'CartsController.delete')
  }).prefix('/cart')

  Route.group(() => {
    Route.get('/:id', 'BasketsController.basketToCart')
  }).prefix('/basketToCart').middleware('auth')

  Route.group(() => {
    Route.get('/', 'BasketsController.adminBasketToCart')
  }).prefix('/adminBasketToCart').middleware('auth')

  Route.group(() => {
    Route.get('/list', 'AddressesController.get')
    Route.post('/', 'AddressesController.create')
    Route.post('/:id', 'AddressesController.update')
    Route.post('/delete/:id', 'AddressesController.delete')
    Route.delete('/delete/:id', 'AddressesController.addressDelete')
  }).prefix('/address')

  Route.group(() => {
    Route.get('/list', 'BasketsController.get')
    Route.post('/', 'BasketsController.create')
    Route.post('/:id', 'BasketsController.update')
    Route.post('/delete/:id', 'BasketsController.basketDelete')
  }).prefix('/basket').middleware('auth')

  Route.group(() => {
    Route.get('/list', 'BasketProductListsController.get')
    Route.post('/', 'BasketProductListsController.create')
    Route.post('/:id', 'BasketProductListsController.update')
    Route.post('/delete/:id', 'BasketProductListsController.BasketProductListDelete')
  }).prefix('/basketProductList').middleware('auth')

  Route.group(() => {
    Route.get('/get', 'FavoritesController.get')
    Route.post('/', 'FavoritesController.favorites').middleware('auth')
  }).prefix('/favorites')

  Route.group(() => {
    Route.get('/', 'OrdersController.get')
    Route.get('/getOrderDetails', 'OrdersController.getOrderDetails')
    Route.post('/', 'OrdersController.create')
    Route.post('/:id', 'OrdersController.update')
    Route.get('/reOrder/:id', 'OrdersController.reOrder').middleware('auth')
  }).prefix('/order')

  Route.get('/', 'UsersController.get')
  Route.post('/update', 'UsersController.update').middleware('auth')

}).prefix('/v1/user')

// Admin Routes
Route.group(() => {

  // admin Auth login and logout API
  Route.post('/login', 'AdminsController.login')
  Route.get('/logout', 'AdminsController.logout')
  Route.post('/changePassword', 'AdminsController.changePassword').middleware('auth')
  Route.get('/subCategory', 'CategoriesController.adminGetSubCategory')

  Route.group(() => {
    Route.get('/getReport', 'ReportsController.get')
  }).prefix('/report')

  Route.group(() => {
    Route.get('/driverReport', 'DeliveryBoysController.getDriverReport')
    Route.get('/orderReport', 'DeliveryBoysController.getOrderReport').middleware('auth')
  }).prefix('/deliveryBoy')

  Route.group(() => {
    Route.post('/createUser', 'AuthController.adminCreateUser')
  }).prefix('/auth')

  Route.group(() => {
    Route.post('/', 'NotificationsController.sendPushNotification')
  }).prefix('/fcm')

  Route.group(() => {
    Route.post('/', 'NotificationsController.smsNotification')
  }).prefix('/sms')

  Route.group(() => {
    Route.post('/', 'NotificationsController.sendEmailPushNotification')
  }).prefix('/emailNotification')

  Route.group(() => {
    Route.get('/cron', 'SettingsController.cronUpdate')
    Route.get('/', 'SettingsController.adminGet')
    Route.post('/', 'SettingsController.create')
    Route.post('/:id', 'SettingsController.update')
    Route.delete('/:id', 'SettingsController.delete')
  }).prefix('/setting')

  Route.group(() => {
    Route.get('/', 'CouponsController.adminGet')
    Route.post('/', 'CouponsController.create')
    Route.post('/:id', 'CouponsController.update')
    Route.delete('/:id', 'CouponsController.delete')
    Route.delete('/delete/:id', 'CouponsController.categoriesDelete')

  }).prefix('/coupon')

  Route.group(() => {
    Route.post('/add', 'UsersController.multiUserSpinUpdate')
    Route.get('/', 'SpinAndWinsController.adminGet')
    Route.post('/', 'SpinAndWinsController.create')
    Route.post('/:id', 'SpinAndWinsController.update')
    Route.delete('/:id', 'SpinAndWinsController.delete')
    Route.delete('/delete/:id', 'SpinAndWinsController.categoriesDelete')

  }).prefix('/SpinAndWin')

  Route.group(() => {
    Route.get('/', 'SpinAndWinListsController.adminGet')
  }).prefix('/spinAndWinList')

  // zone
  Route.group(() => {
    Route.get('/', 'ZonesController.adminGet')
    Route.post('/', 'ZonesController.create')
    Route.post('/:id', 'ZonesController.update')
    Route.delete('/:id', 'ZonesController.delete')
  }).prefix('/zone')

  // area
  Route.group(() => {
    Route.get('/', 'AreasController.adminGet')
    Route.post('/', 'AreasController.create')
    Route.post('/:id', 'AreasController.update')
    Route.delete('/:id', 'AreasController.delete')
  }).prefix('/area')

  // pin
  Route.group(() => {
    Route.get('/', 'PinsController.adminGet')
    Route.post('/', 'PinsController.create')
    Route.post('/:id', 'PinsController.update')
    Route.delete('/:id', 'PinsController.delete')
  }).prefix('/pin').middleware('auth')

  //category crud API
  Route.group(() => {
    Route.get('/', 'CategoriesController.adminGet')
    Route.post('/', 'CategoriesController.create').middleware('auth')
    Route.post('/:id', 'CategoriesController.update').middleware('auth')
    Route.delete('/:id', 'CategoriesController.delete').middleware('auth')
    Route.delete('/delete/:id', 'CategoriesController.categoriesDelete').middleware('auth')
  }).prefix('/category')

  // subCategory crud API
  // Route.group(() => {
  //   Route.get('/', 'SubCategoriesController.adminGet')
  //   Route.post('/', 'SubCategoriesController.create')
  //   Route.post('/:id', 'SubCategoriesController.update')
  //   Route.delete('/:id', 'SubCategoriesController.delete')
  //   Route.delete('/delete/:id', 'SubCategoriesController.categoriesDelete')
  // }).prefix('/subCategory').middleware('auth')

  // user API
  Route.group(() => {
    Route.get('/', 'UsersController.getAllUser')
    Route.post('/update/:id', 'UsersController.adminUpdate')
  }).prefix('/user')

  // dashboard API
  Route.group(() => {
    Route.get('/', 'DashboardController.get')
  }).prefix('/dashboard').middleware('auth')

  Route.group(() => {
    Route.get('/', 'BannersController.adminGet')
    Route.post('/', 'BannersController.create')
    Route.post('/:id', 'BannersController.update')
    Route.delete('/:id', 'BannersController.delete')
    Route.delete('/delete/:id', 'BannersController.bannerDelete')
  }).prefix('/banner')

  Route.group(() => {
    Route.get('/', 'PriceListNamesController.adminGet')
    Route.post('/', 'PriceListNamesController.create')
    Route.post('/:id', 'PriceListNamesController.update')
    Route.delete('/:id', 'PriceListNamesController.delete')
    Route.delete('/delete/:id', 'PriceListNamesController.priceListNameDelete')
  }).prefix('/priceListName')

  Route.group(() => {
    Route.get('/', 'ProductPriceListsController.adminGet')
    Route.post('/', 'ProductPriceListsController.create')
    Route.post('/:id', 'ProductPriceListsController.update')
    Route.delete('/:id', 'ProductPriceListsController.delete')
    Route.delete('/delete/:id', 'ProductPriceListsController.priceListNameDelete')
  }).prefix('/ProductPriceList')

  Route.group(() => {
    Route.get('/', 'UserTypesController.adminGet')
    Route.post('/', 'UserTypesController.create')
    Route.post('/:id', 'UserTypesController.update')
    Route.delete('/:id', 'UserTypesController.delete')
    Route.delete('/delete/:id', 'UserTypesController.userTypeDelete')
  }).prefix('/userType')

  //need to remove

  Route.group(() => {
    Route.get('/', 'PriceListsController.adminGet')
    Route.post('/', 'PriceListsController.create')
    Route.post('/:id', 'PriceListsController.update')
    Route.delete('/:id', 'PriceListsController.delete')
    Route.delete('/delete/:id', 'PriceListsController.bannerDelete')
  }).prefix('/priceList')

  Route.group(() => {
    Route.get('/basketList', 'AdminBasketsController.adminGet')
    Route.get('/', 'ProductsController.adminGet')
    Route.get('/mostOrderProduct', 'CartsController.mostOrderProduct')
    Route.get('/mostFavoritesProduct', 'CartsController.mostFavoritesProduct')
    Route.get('/mostWantedAddress', 'CartsController.mostWantedAddress')
    Route.get('/:id', 'ProductsController.adminProductDetails')
    Route.post('/', 'ProductsController.create')
    Route.post('/add', 'ProductsController.addRelatedProduct')
    Route.post('/update', 'ProductsController.updateRelatedProduct')
    Route.post('/:id', 'ProductsController.update')
    Route.delete('/:id', 'ProductsController.delete')
    Route.delete('/delete/:id', 'ProductsController.productDelete')
  }).prefix('/product')

  Route.group(() => {
    Route.get('/', 'RecipiesController.adminGet')
    Route.post('/', 'RecipiesController.create')
    Route.post('/:id', 'RecipiesController.update')
    Route.delete('/:id', 'RecipiesController.delete')
    Route.delete('/delete/:id', 'RecipiesController.recipiesDelete')
  }).prefix('/recipies')

  Route.group(() => {
    Route.get('/:id', 'AdminsController.getAdminList')
    Route.post('/', 'AdminsController.createAdmin')
    Route.post('/:id', 'AdminsController.updateAdmin')
    Route.delete('/:id', 'AdminsController.deleteAdmin')
  }).prefix('/adminUser')

  Route.group(() => {
    Route.get('/', 'RolesController.get')
    Route.post('/', 'RolesController.create')
    Route.post('/:id', 'RolesController.update')
    Route.delete('/:id', 'RolesController.delete')

  }).prefix('/roleType')

  Route.group(() => {
    Route.get('/', 'OrdersController.adminGetOrder')
    Route.get('/listWithSum', 'OrdersController.adminGetOrderWithSum')
    Route.post('/multiApprove', 'OrdersController.multiUpdate')
    Route.post('/:id', 'OrdersController.update')
  }).prefix('/order')

  // admin crud API
  Route.get('/:id', 'AdminsController.getAdminList').middleware('auth')
  Route.post('/', 'AdminsController.createAdmin').middleware('auth')
  Route.post('/:id', 'AdminsController.updateAdmin').middleware('auth')
  Route.delete('/:id', 'AdminsController.deleteAdmin').middleware('auth')

}).prefix('/v1/admin')

//deliveryBoy
Route.group(() => {

  Route.group(() => {
    Route.post('/login', 'DeliveryBoysController.login')
    Route.post('/changePassword', 'DeliveryBoysController.changePassword').middleware('auth')
    Route.get('/list', 'DeliveryBoysController.getDeliveryBoysList')
    Route.get('/deliveryBoy/:id', 'DeliveryBoysController.getDeliveryBoyDetails')
    Route.post('/create', 'DeliveryBoysController.createDeliveryBoys')
    Route.post('/update/:id', 'DeliveryBoysController.updateDeliveryBoys')
    Route.delete('/delete/:id', 'DeliveryBoysController.deleteDeliveryBoys')
    Route.get('/logout', 'DeliveryBoysController.logout').middleware('auth')
  }).prefix('/auth')

  Route.group(() => {
    Route.get('/', 'OrdersController.deliveryBoyGetOrder')
    Route.post('/:id', 'OrdersController.update')
  }).prefix('/order')

}).prefix('/v1/deliveryBoy')

