export { deleteUserAddress } from './address/delete-user-address';
export { getUserAddress } from './address/get-user-address';
export { setUserAddress } from './address/set-user-address';

export * from './auth/login';
export { registerUser } from './auth/register';

export { getCountries } from './country/get-countries';

export { getOrderById } from './order/get-order-by-id';
export { getPaginatedOrdersByUser } from './order/get-paginated-orders-by-user';
export { getPaginatedOrdersAdmin } from './order/get-paginated-orders-admin';
export { placeOrder } from './order/place-order';

export { setTransactionId } from './payment/set-transaction-id';
export { paypalCheckPayment } from './payment/paypal-check-payment';

export { createUpdateProduct } from './product/create-update-product';
export { deleteProduct } from './product/delete-product';
export { deleteProductImage } from './product/delete-product-image';
export { getPaginatedProductsWithImages } from './product/product-pagination';
export { getProductBySlug } from './product/get-product-by-slug';
export { getProductCategories } from './product/get-product-categories';
export { getStockBySlug } from './product/get-stock-by-slug';

export { changeUserRole } from './user/change-user-role';
export { getPaginatedUsersAdmin } from './user/get-paginated-users-admin';
