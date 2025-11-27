import { baseApi as api } from './emptyApi';
const injectedRtkApi = api.injectEndpoints({
  endpoints: build => ({
    getHealth: build.query<GetHealthApiResponse, GetHealthApiArg>({
      query: () => ({ url: `/health` }),
    }),
    postApiV1AuthRegister: build.mutation<
      PostApiV1AuthRegisterApiResponse,
      PostApiV1AuthRegisterApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/auth/register`,
        method: 'POST',
        body: queryArg.body,
      }),
    }),
    postApiV1AuthLogin: build.mutation<
      PostApiV1AuthLoginApiResponse,
      PostApiV1AuthLoginApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/auth/login`,
        method: 'POST',
        body: queryArg.body,
      }),
    }),
    postApiV1AuthRefresh: build.mutation<
      PostApiV1AuthRefreshApiResponse,
      PostApiV1AuthRefreshApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/auth/refresh`,
        method: 'POST',
        body: queryArg.body,
      }),
    }),
    postApiV1AuthLogout: build.mutation<
      PostApiV1AuthLogoutApiResponse,
      PostApiV1AuthLogoutApiArg
    >({
      query: () => ({ url: `/api/v1/auth/logout`, method: 'POST' }),
    }),
    getApiV1AuthMe: build.query<
      GetApiV1AuthMeApiResponse,
      GetApiV1AuthMeApiArg
    >({
      query: () => ({ url: `/api/v1/auth/me` }),
    }),
    putApiV1AuthProfile: build.mutation<
      PutApiV1AuthProfileApiResponse,
      PutApiV1AuthProfileApiArg
    >({
      query: () => ({ url: `/api/v1/auth/profile`, method: 'PUT' }),
    }),
    putApiV1AuthPassword: build.mutation<
      PutApiV1AuthPasswordApiResponse,
      PutApiV1AuthPasswordApiArg
    >({
      query: () => ({ url: `/api/v1/auth/password`, method: 'PUT' }),
    }),
    getApiV1Products: build.query<
      GetApiV1ProductsApiResponse,
      GetApiV1ProductsApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/products`,
        params: {
          page: queryArg.page,
          limit: queryArg.limit,
          brand: queryArg.brand,
          brandId: queryArg.brandId,
          isActive: queryArg.isActive,
        },
      }),
    }),
    postApiV1Products: build.mutation<
      PostApiV1ProductsApiResponse,
      PostApiV1ProductsApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/products`,
        method: 'POST',
        body: queryArg.productCreate,
      }),
    }),
    getApiV1ProductsBrands: build.query<
      GetApiV1ProductsBrandsApiResponse,
      GetApiV1ProductsBrandsApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/products/brands`,
        params: {
          isActive: queryArg.isActive,
        },
      }),
    }),
    getApiV1ProductsCategories: build.query<
      GetApiV1ProductsCategoriesApiResponse,
      GetApiV1ProductsCategoriesApiArg
    >({
      query: () => ({ url: `/api/v1/products/categories` }),
    }),
    getApiV1ProductsMy: build.query<
      GetApiV1ProductsMyApiResponse,
      GetApiV1ProductsMyApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/products/my`,
        params: {
          page: queryArg.page,
          limit: queryArg.limit,
          category: queryArg.category,
          brand: queryArg.brand,
          brandId: queryArg.brandId,
          depotId: queryArg.depotId,
          isActive: queryArg.isActive,
          search: queryArg.search,
        },
      }),
    }),
    getApiV1ProductsStats: build.query<
      GetApiV1ProductsStatsApiResponse,
      GetApiV1ProductsStatsApiArg
    >({
      query: () => ({ url: `/api/v1/products/stats` }),
    }),
    getApiV1ProductsById: build.query<
      GetApiV1ProductsByIdApiResponse,
      GetApiV1ProductsByIdApiArg
    >({
      query: queryArg => ({ url: `/api/v1/products/${queryArg.id}` }),
    }),
    putApiV1ProductsById: build.mutation<
      PutApiV1ProductsByIdApiResponse,
      PutApiV1ProductsByIdApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/products/${queryArg.id}`,
        method: 'PUT',
        body: queryArg.productUpdate,
      }),
    }),
    deleteApiV1ProductsById: build.mutation<
      DeleteApiV1ProductsByIdApiResponse,
      DeleteApiV1ProductsByIdApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/products/${queryArg.id}`,
        method: 'DELETE',
      }),
    }),
    getApiV1ProductsByIdPricingRules: build.query<
      GetApiV1ProductsByIdPricingRulesApiResponse,
      GetApiV1ProductsByIdPricingRulesApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/products/${queryArg.id}/pricing-rules`,
      }),
    }),
    postApiV1ProductsByIdPricingRules: build.mutation<
      PostApiV1ProductsByIdPricingRulesApiResponse,
      PostApiV1ProductsByIdPricingRulesApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/products/${queryArg.id}/pricing-rules`,
        method: 'POST',
        body: queryArg.body,
      }),
    }),
    putApiV1ProductsPricingRulesById: build.mutation<
      PutApiV1ProductsPricingRulesByIdApiResponse,
      PutApiV1ProductsPricingRulesByIdApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/products/pricing-rules/${queryArg.id}`,
        method: 'PUT',
        body: queryArg.body,
      }),
    }),
    deleteApiV1ProductsPricingRulesById: build.mutation<
      DeleteApiV1ProductsPricingRulesByIdApiResponse,
      DeleteApiV1ProductsPricingRulesByIdApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/products/pricing-rules/${queryArg.id}`,
        method: 'DELETE',
      }),
    }),
    getApiV1Brands: build.query<
      GetApiV1BrandsApiResponse,
      GetApiV1BrandsApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/brands`,
        params: {
          page: queryArg.page,
          limit: queryArg.limit,
          search: queryArg.search,
          isActive: queryArg.isActive,
        },
      }),
    }),
    postApiV1Brands: build.mutation<
      PostApiV1BrandsApiResponse,
      PostApiV1BrandsApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/brands`,
        method: 'POST',
        body: queryArg.brandCreate,
      }),
    }),
    getApiV1BrandsById: build.query<
      GetApiV1BrandsByIdApiResponse,
      GetApiV1BrandsByIdApiArg
    >({
      query: queryArg => ({ url: `/api/v1/brands/${queryArg.id}` }),
    }),
    putApiV1BrandsById: build.mutation<
      PutApiV1BrandsByIdApiResponse,
      PutApiV1BrandsByIdApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/brands/${queryArg.id}`,
        method: 'PUT',
        body: queryArg.brandUpdate,
      }),
    }),
    deleteApiV1BrandsById: build.mutation<
      DeleteApiV1BrandsByIdApiResponse,
      DeleteApiV1BrandsByIdApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/brands/${queryArg.id}`,
        method: 'DELETE',
      }),
    }),
    getApiV1DepotsFindNearest: build.query<
      GetApiV1DepotsFindNearestApiResponse,
      GetApiV1DepotsFindNearestApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/depots/find-nearest`,
        params: {
          latitude: queryArg.latitude,
          longitude: queryArg.longitude,
          limit: queryArg.limit,
        },
      }),
    }),
    getApiV1DepotsStats: build.query<
      GetApiV1DepotsStatsApiResponse,
      GetApiV1DepotsStatsApiArg
    >({
      query: () => ({ url: `/api/v1/depots/stats` }),
    }),
    getApiV1Depots: build.query<
      GetApiV1DepotsApiResponse,
      GetApiV1DepotsApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/depots`,
        params: {
          page: queryArg.page,
          limit: queryArg.limit,
          search: queryArg.search,
          state: queryArg.state,
          lga: queryArg.lga,
          city: queryArg.city,
          sellerId: queryArg.sellerId,
          isVerified: queryArg.isVerified,
          isActive: queryArg.isActive,
        },
      }),
    }),
    postApiV1Depots: build.mutation<
      PostApiV1DepotsApiResponse,
      PostApiV1DepotsApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/depots`,
        method: 'POST',
        body: queryArg.body,
      }),
    }),
    getApiV1DepotsById: build.query<
      GetApiV1DepotsByIdApiResponse,
      GetApiV1DepotsByIdApiArg
    >({
      query: queryArg => ({ url: `/api/v1/depots/${queryArg.id}` }),
    }),
    putApiV1DepotsById: build.mutation<
      PutApiV1DepotsByIdApiResponse,
      PutApiV1DepotsByIdApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/depots/${queryArg.id}`,
        method: 'PUT',
        body: queryArg.body,
      }),
    }),
    deleteApiV1DepotsById: build.mutation<
      DeleteApiV1DepotsByIdApiResponse,
      DeleteApiV1DepotsByIdApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/depots/${queryArg.id}`,
        method: 'DELETE',
      }),
    }),
    postApiV1DepotsByIdVerify: build.mutation<
      PostApiV1DepotsByIdVerifyApiResponse,
      PostApiV1DepotsByIdVerifyApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/depots/${queryArg.id}/verify`,
        method: 'POST',
      }),
    }),
    getApiV1DeliveryRoutesDestination: build.query<
      GetApiV1DeliveryRoutesDestinationApiResponse,
      GetApiV1DeliveryRoutesDestinationApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/delivery-routes/destination`,
        params: {
          state: queryArg.state,
          city: queryArg.city,
        },
      }),
    }),
    getApiV1DeliveryRoutesDepotByDepotId: build.query<
      GetApiV1DeliveryRoutesDepotByDepotIdApiResponse,
      GetApiV1DeliveryRoutesDepotByDepotIdApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/delivery-routes/depot/${queryArg.depotId}`,
      }),
    }),
    getApiV1DeliveryRoutesStats: build.query<
      GetApiV1DeliveryRoutesStatsApiResponse,
      GetApiV1DeliveryRoutesStatsApiArg
    >({
      query: () => ({ url: `/api/v1/delivery-routes/stats` }),
    }),
    getApiV1DeliveryRoutes: build.query<
      GetApiV1DeliveryRoutesApiResponse,
      GetApiV1DeliveryRoutesApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/delivery-routes`,
        params: {
          sourceDepotId: queryArg.sourceDepotId,
          destinationState: queryArg.destinationState,
          destinationCity: queryArg.destinationCity,
          isActive: queryArg.isActive,
          page: queryArg.page,
          limit: queryArg.limit,
        },
      }),
    }),
    postApiV1DeliveryRoutes: build.mutation<
      PostApiV1DeliveryRoutesApiResponse,
      PostApiV1DeliveryRoutesApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/delivery-routes`,
        method: 'POST',
        body: queryArg.createDeliveryRoute,
      }),
    }),
    getApiV1DeliveryRoutesById: build.query<
      GetApiV1DeliveryRoutesByIdApiResponse,
      GetApiV1DeliveryRoutesByIdApiArg
    >({
      query: queryArg => ({ url: `/api/v1/delivery-routes/${queryArg.id}` }),
    }),
    putApiV1DeliveryRoutesById: build.mutation<
      PutApiV1DeliveryRoutesByIdApiResponse,
      PutApiV1DeliveryRoutesByIdApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/delivery-routes/${queryArg.id}`,
        method: 'PUT',
        body: queryArg.updateDeliveryRoute,
      }),
    }),
    deleteApiV1DeliveryRoutesById: build.mutation<
      DeleteApiV1DeliveryRoutesByIdApiResponse,
      DeleteApiV1DeliveryRoutesByIdApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/delivery-routes/${queryArg.id}`,
        method: 'DELETE',
      }),
    }),
    postApiV1DeliveryRoutesByIdDeactivate: build.mutation<
      PostApiV1DeliveryRoutesByIdDeactivateApiResponse,
      PostApiV1DeliveryRoutesByIdDeactivateApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/delivery-routes/${queryArg.id}/deactivate`,
        method: 'POST',
      }),
    }),
    postApiV1DeliveryRoutesByIdActivate: build.mutation<
      PostApiV1DeliveryRoutesByIdActivateApiResponse,
      PostApiV1DeliveryRoutesByIdActivateApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/delivery-routes/${queryArg.id}/activate`,
        method: 'POST',
      }),
    }),
    postApiV1PricingCalculate: build.mutation<
      PostApiV1PricingCalculateApiResponse,
      PostApiV1PricingCalculateApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/pricing/calculate`,
        method: 'POST',
        body: queryArg.body,
      }),
    }),
    postApiV1PricingCalculateOrder: build.mutation<
      PostApiV1PricingCalculateOrderApiResponse,
      PostApiV1PricingCalculateOrderApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/pricing/calculate-order`,
        method: 'POST',
        body: queryArg.body,
      }),
    }),
    getApiV1PricingNearestDepot: build.query<
      GetApiV1PricingNearestDepotApiResponse,
      GetApiV1PricingNearestDepotApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/pricing/nearest-depot`,
        params: {
          productId: queryArg.productId,
          destinationState: queryArg.destinationState,
        },
      }),
    }),
    getApiV1PricingDestinationsByDepotId: build.query<
      GetApiV1PricingDestinationsByDepotIdApiResponse,
      GetApiV1PricingDestinationsByDepotIdApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/pricing/destinations/${queryArg.depotId}`,
      }),
    }),
    getApiV1InventoryLowStock: build.query<
      GetApiV1InventoryLowStockApiResponse,
      GetApiV1InventoryLowStockApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/inventory/low-stock`,
        params: {
          threshold: queryArg.threshold,
        },
      }),
    }),
    getApiV1InventoryStats: build.query<
      GetApiV1InventoryStatsApiResponse,
      GetApiV1InventoryStatsApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/inventory/stats`,
        params: {
          threshold: queryArg.threshold,
        },
      }),
    }),
    getApiV1InventoryDepotByDepotId: build.query<
      GetApiV1InventoryDepotByDepotIdApiResponse,
      GetApiV1InventoryDepotByDepotIdApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/inventory/depot/${queryArg.depotId}`,
      }),
    }),
    getApiV1InventoryDepotByDepotIdProductAndProductId: build.query<
      GetApiV1InventoryDepotByDepotIdProductAndProductIdApiResponse,
      GetApiV1InventoryDepotByDepotIdProductAndProductIdApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/inventory/depot/${queryArg.depotId}/product/${queryArg.productId}`,
      }),
    }),
    putApiV1Inventory: build.mutation<
      PutApiV1InventoryApiResponse,
      PutApiV1InventoryApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/inventory`,
        method: 'PUT',
        body: queryArg.body,
      }),
    }),
    postApiV1InventoryAdjust: build.mutation<
      PostApiV1InventoryAdjustApiResponse,
      PostApiV1InventoryAdjustApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/inventory/adjust`,
        method: 'POST',
        body: queryArg.body,
      }),
    }),
    getApiV1InventoryDepotByDepotIdProductAndProductIdHistory: build.query<
      GetApiV1InventoryDepotByDepotIdProductAndProductIdHistoryApiResponse,
      GetApiV1InventoryDepotByDepotIdProductAndProductIdHistoryApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/inventory/depot/${queryArg.depotId}/product/${queryArg.productId}/history`,
      }),
    }),
    putApiV1InventoryFactory: build.mutation<
      PutApiV1InventoryFactoryApiResponse,
      PutApiV1InventoryFactoryApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/inventory/factory`,
        method: 'PUT',
        body: queryArg.body,
      }),
    }),
    getApiV1Orders: build.query<
      GetApiV1OrdersApiResponse,
      GetApiV1OrdersApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/orders`,
        params: {
          page: queryArg.page,
          limit: queryArg.limit,
          status: queryArg.status,
          buyerId: queryArg.buyerId,
          sellerId: queryArg.sellerId,
          depotId: queryArg.depotId,
        },
      }),
    }),
    postApiV1Orders: build.mutation<
      PostApiV1OrdersApiResponse,
      PostApiV1OrdersApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/orders`,
        method: 'POST',
        body: queryArg.body,
      }),
    }),
    getApiV1OrdersMyOrders: build.query<
      GetApiV1OrdersMyOrdersApiResponse,
      GetApiV1OrdersMyOrdersApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/orders/my-orders`,
        params: {
          page: queryArg.page,
          limit: queryArg.limit,
          status: queryArg.status,
        },
      }),
    }),
    getApiV1OrdersAssigned: build.query<
      GetApiV1OrdersAssignedApiResponse,
      GetApiV1OrdersAssignedApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/orders/assigned`,
        params: {
          page: queryArg.page,
          limit: queryArg.limit,
        },
      }),
    }),
    getApiV1OrdersStats: build.query<
      GetApiV1OrdersStatsApiResponse,
      GetApiV1OrdersStatsApiArg
    >({
      query: () => ({ url: `/api/v1/orders/stats` }),
    }),
    getApiV1OrdersById: build.query<
      GetApiV1OrdersByIdApiResponse,
      GetApiV1OrdersByIdApiArg
    >({
      query: queryArg => ({ url: `/api/v1/orders/${queryArg.id}` }),
    }),
    getApiV1OrdersNumberByOrderNumber: build.query<
      GetApiV1OrdersNumberByOrderNumberApiResponse,
      GetApiV1OrdersNumberByOrderNumberApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/orders/number/${queryArg.orderNumber}`,
      }),
    }),
    patchApiV1OrdersByIdStatus: build.mutation<
      PatchApiV1OrdersByIdStatusApiResponse,
      PatchApiV1OrdersByIdStatusApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/orders/${queryArg.id}/status`,
        method: 'PATCH',
        body: queryArg.body,
      }),
    }),
    putApiV1OrdersByIdStatus: build.mutation<
      PutApiV1OrdersByIdStatusApiResponse,
      PutApiV1OrdersByIdStatusApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/orders/${queryArg.id}/status`,
        method: 'PUT',
        body: queryArg.body,
      }),
    }),
    postApiV1OrdersByIdAssign: build.mutation<
      PostApiV1OrdersByIdAssignApiResponse,
      PostApiV1OrdersByIdAssignApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/orders/${queryArg.id}/assign`,
        method: 'POST',
        body: queryArg.body,
      }),
    }),
    postApiV1OrdersByIdCancel: build.mutation<
      PostApiV1OrdersByIdCancelApiResponse,
      PostApiV1OrdersByIdCancelApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/orders/${queryArg.id}/cancel`,
        method: 'POST',
        body: queryArg.body,
      }),
    }),
    getApiV1OrdersByIdHistory: build.query<
      GetApiV1OrdersByIdHistoryApiResponse,
      GetApiV1OrdersByIdHistoryApiArg
    >({
      query: queryArg => ({ url: `/api/v1/orders/${queryArg.id}/history` }),
    }),
    postApiV1PaymentsInitiate: build.mutation<
      PostApiV1PaymentsInitiateApiResponse,
      PostApiV1PaymentsInitiateApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/payments/initiate`,
        method: 'POST',
        body: queryArg.body,
      }),
    }),
    postApiV1PaymentsVerify: build.mutation<
      PostApiV1PaymentsVerifyApiResponse,
      PostApiV1PaymentsVerifyApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/payments/verify`,
        method: 'POST',
        body: queryArg.body,
      }),
    }),
    getApiV1PaymentsById: build.query<
      GetApiV1PaymentsByIdApiResponse,
      GetApiV1PaymentsByIdApiArg
    >({
      query: queryArg => ({ url: `/api/v1/payments/${queryArg.id}` }),
    }),
    getApiV1PaymentsOrderByOrderId: build.query<
      GetApiV1PaymentsOrderByOrderIdApiResponse,
      GetApiV1PaymentsOrderByOrderIdApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/payments/order/${queryArg.orderId}`,
      }),
    }),
    postApiV1PaymentsByIdRefund: build.mutation<
      PostApiV1PaymentsByIdRefundApiResponse,
      PostApiV1PaymentsByIdRefundApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/payments/${queryArg.id}/refund`,
        method: 'POST',
        body: queryArg.body,
      }),
    }),
    postApiV1PaymentsWebhookPaystack: build.mutation<
      PostApiV1PaymentsWebhookPaystackApiResponse,
      PostApiV1PaymentsWebhookPaystackApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/payments/webhook/paystack`,
        method: 'POST',
        body: queryArg.body,
      }),
    }),
    postApiV1PaymentsWebhookMoniepoint: build.mutation<
      PostApiV1PaymentsWebhookMoniepointApiResponse,
      PostApiV1PaymentsWebhookMoniepointApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/payments/webhook/moniepoint`,
        method: 'POST',
        body: queryArg.body,
      }),
    }),
    getApiV1ReportsDashboard: build.query<
      GetApiV1ReportsDashboardApiResponse,
      GetApiV1ReportsDashboardApiArg
    >({
      query: () => ({ url: `/api/v1/reports/dashboard` }),
    }),
    getApiV1ReportsSales: build.query<
      GetApiV1ReportsSalesApiResponse,
      GetApiV1ReportsSalesApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/reports/sales`,
        params: {
          startDate: queryArg.startDate,
          endDate: queryArg.endDate,
          depotId: queryArg.depotId,
          productId: queryArg.productId,
          state: queryArg.state,
          groupBy: queryArg.groupBy,
        },
      }),
    }),
    getApiV1ReportsInventory: build.query<
      GetApiV1ReportsInventoryApiResponse,
      GetApiV1ReportsInventoryApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/reports/inventory`,
        params: {
          depotId: queryArg.depotId,
          productId: queryArg.productId,
          lowStockOnly: queryArg.lowStockOnly,
          threshold: queryArg.threshold,
        },
      }),
    }),
    getApiV1ReportsOrders: build.query<
      GetApiV1ReportsOrdersApiResponse,
      GetApiV1ReportsOrdersApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/reports/orders`,
        params: {
          startDate: queryArg.startDate,
          endDate: queryArg.endDate,
          status: queryArg.status,
          deliveryType: queryArg.deliveryType,
          depotId: queryArg.depotId,
          state: queryArg.state,
        },
      }),
    }),
    getApiV1ReportsPayments: build.query<
      GetApiV1ReportsPaymentsApiResponse,
      GetApiV1ReportsPaymentsApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/reports/payments`,
        params: {
          startDate: queryArg.startDate,
          endDate: queryArg.endDate,
          paymentMethod: queryArg.paymentMethod,
        },
      }),
    }),
    getApiV1ReportsPerformance: build.query<
      GetApiV1ReportsPerformanceApiResponse,
      GetApiV1ReportsPerformanceApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/reports/performance`,
        params: {
          startDate: queryArg.startDate,
          endDate: queryArg.endDate,
          depotId: queryArg.depotId,
          sellerId: queryArg.sellerId,
        },
      }),
    }),
    getApiV1Notifications: build.query<
      GetApiV1NotificationsApiResponse,
      GetApiV1NotificationsApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/notifications`,
        params: {
          page: queryArg.page,
          limit: queryArg.limit,
          isRead: queryArg.isRead,
        },
      }),
    }),
    getApiV1NotificationsUnreadCount: build.query<
      GetApiV1NotificationsUnreadCountApiResponse,
      GetApiV1NotificationsUnreadCountApiArg
    >({
      query: () => ({ url: `/api/v1/notifications/unread-count` }),
    }),
    patchApiV1NotificationsByIdRead: build.mutation<
      PatchApiV1NotificationsByIdReadApiResponse,
      PatchApiV1NotificationsByIdReadApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/notifications/${queryArg.id}/read`,
        method: 'PATCH',
      }),
    }),
    patchApiV1NotificationsReadAll: build.mutation<
      PatchApiV1NotificationsReadAllApiResponse,
      PatchApiV1NotificationsReadAllApiArg
    >({
      query: () => ({ url: `/api/v1/notifications/read-all`, method: 'PATCH' }),
    }),
    getApiV1Users: build.query<GetApiV1UsersApiResponse, GetApiV1UsersApiArg>({
      query: queryArg => ({
        url: `/api/v1/users`,
        params: {
          role: queryArg.role,
          search: queryArg.search,
          isActive: queryArg.isActive,
          page: queryArg.page,
          limit: queryArg.limit,
        },
      }),
    }),
    getApiV1UsersById: build.query<
      GetApiV1UsersByIdApiResponse,
      GetApiV1UsersByIdApiArg
    >({
      query: queryArg => ({ url: `/api/v1/users/${queryArg.id}` }),
    }),
    getApiV1OrdersBuyerByBuyerId: build.query<
      GetApiV1OrdersBuyerByBuyerIdApiResponse,
      GetApiV1OrdersBuyerByBuyerIdApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/orders/buyer/${queryArg.buyerId}`,
        params: {
          page: queryArg.page,
          limit: queryArg.limit,
        },
      }),
    }),
    getApiV1OrdersDepotByDepotId: build.query<
      GetApiV1OrdersDepotByDepotIdApiResponse,
      GetApiV1OrdersDepotByDepotIdApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/orders/depot/${queryArg.depotId}`,
        params: {
          page: queryArg.page,
          limit: queryArg.limit,
        },
      }),
    }),
    getApiV1PaymentsVerifyByReference: build.query<
      GetApiV1PaymentsVerifyByReferenceApiResponse,
      GetApiV1PaymentsVerifyByReferenceApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/payments/verify/${queryArg.reference}`,
      }),
    }),
    getApiV1Payments: build.query<
      GetApiV1PaymentsApiResponse,
      GetApiV1PaymentsApiArg
    >({
      query: queryArg => ({
        url: `/api/v1/payments`,
        params: {
          page: queryArg.page,
          limit: queryArg.limit,
          status: queryArg.status,
        },
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as coreApi };
export type GetHealthApiResponse = /** status 200 Service is healthy */ {
  status?: string;
  timestamp?: string;
  /** Uptime in seconds */
  uptime?: number;
};
export type GetHealthApiArg = void;
export type PostApiV1AuthRegisterApiResponse =
  /** status 201 User registered successfully */ Success & {
    data?: {
      user?: User;
      tokens?: {
        accessToken?: string;
        refreshToken?: string;
      };
    };
  };
export type PostApiV1AuthRegisterApiArg = {
  body: {
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;
    role: 'buyer' | 'seller' | 'admin';
  };
};
export type PostApiV1AuthLoginApiResponse =
  /** status 200 Login successful */ Success & {
    data?: {
      user?: User;
      tokens?: {
        accessToken?: string;
        refreshToken?: string;
      };
    };
  };
export type PostApiV1AuthLoginApiArg = {
  body: {
    email: string;
    password: string;
  };
};
export type PostApiV1AuthRefreshApiResponse =
  /** status 200 Token refreshed successfully */ Success & {
    data?: {
      accessToken?: string;
      refreshToken?: string;
    };
  };
export type PostApiV1AuthRefreshApiArg = {
  body: {
    refreshToken: string;
  };
};
export type PostApiV1AuthLogoutApiResponse =
  /** status 200 Logout successful */ Success;
export type PostApiV1AuthLogoutApiArg = void;
export type GetApiV1AuthMeApiResponse =
  /** status 200 User profile retrieved successfully */ Success & {
    data?: User;
  };
export type GetApiV1AuthMeApiArg = void;
export type PutApiV1AuthProfileApiResponse = unknown;
export type PutApiV1AuthProfileApiArg = void;
export type PutApiV1AuthPasswordApiResponse = unknown;
export type PutApiV1AuthPasswordApiArg = void;
export type GetApiV1ProductsApiResponse =
  /** status 200 Products retrieved successfully */ {
    success?: boolean;
    message?: string;
    data?: Product[];
    pagination?: Pagination;
  };
export type GetApiV1ProductsApiArg = {
  page?: number;
  limit?: number;
  brand?: string;
  /** Filter by brand ID */
  brandId?: string;
  isActive?: boolean;
};
export type PostApiV1ProductsApiResponse =
  /** status 201 Product created successfully */ Success & {
    data?: Product;
  };
export type PostApiV1ProductsApiArg = {
  productCreate: ProductCreate;
};
export type GetApiV1ProductsBrandsApiResponse =
  /** status 200 Brands retrieved successfully */ {
    success?: boolean;
    message?: string;
    data?: string[];
  };
export type GetApiV1ProductsBrandsApiArg = {
  /** Filter by active products only (default: true) */
  isActive?: boolean;
};
export type GetApiV1ProductsCategoriesApiResponse =
  /** status 200 Categories retrieved successfully */ {
    success?: boolean;
    message?: string;
    data?: ('cement' | 'building_materials')[];
  };
export type GetApiV1ProductsCategoriesApiArg = void;
export type GetApiV1ProductsMyApiResponse =
  /** status 200 Products retrieved successfully */ {
    success?: boolean;
    message?: string;
    data?: Product[];
    pagination?: Pagination;
  };
export type GetApiV1ProductsMyApiArg = {
  /** Page number */
  page?: number;
  /** Items per page */
  limit?: number;
  /** Filter by category */
  category?: 'cement' | 'building_materials';
  /** Filter by brand name */
  brand?: string;
  /** Filter by brand ID */
  brandId?: string;
  /** Filter by depot ID */
  depotId?: string;
  /** Filter by active status */
  isActive?: boolean;
  /** Search by product name */
  search?: string;
};
export type GetApiV1ProductsStatsApiResponse =
  /** status 200 Product statistics retrieved successfully */ Success & {
    data?: {
      total?: number;
      active?: number;
      inactive?: number;
      byBrand?: {
        brand?: string;
        count?: number;
      }[];
      byCategory?: {
        category?: string;
        count?: number;
      }[];
    };
  };
export type GetApiV1ProductsStatsApiArg = void;
export type GetApiV1ProductsByIdApiResponse =
  /** status 200 Product retrieved successfully */ Success & {
    data?: Product;
  };
export type GetApiV1ProductsByIdApiArg = {
  id: string;
};
export type PutApiV1ProductsByIdApiResponse =
  /** status 200 Product updated successfully */ Success & {
    data?: Product;
  };
export type PutApiV1ProductsByIdApiArg = {
  id: string;
  productUpdate: ProductUpdate;
};
export type DeleteApiV1ProductsByIdApiResponse =
  /** status 200 Product deleted successfully */ Success;
export type DeleteApiV1ProductsByIdApiArg = {
  id: string;
};
export type GetApiV1ProductsByIdPricingRulesApiResponse =
  /** status 200 Pricing rules retrieved successfully */ Success & {
    data?: object[];
  };
export type GetApiV1ProductsByIdPricingRulesApiArg = {
  id: string;
};
export type PostApiV1ProductsByIdPricingRulesApiResponse =
  /** status 201 Pricing rule created successfully */ Success;
export type PostApiV1ProductsByIdPricingRulesApiArg = {
  id: string;
  body: {
    minQuantity: number;
    maxQuantity: number;
    price: number;
  };
};
export type PutApiV1ProductsPricingRulesByIdApiResponse =
  /** status 200 Pricing rule updated successfully */ Success;
export type PutApiV1ProductsPricingRulesByIdApiArg = {
  id: string;
  body: {
    minQuantity?: number;
    maxQuantity?: number;
    price?: number;
  };
};
export type DeleteApiV1ProductsPricingRulesByIdApiResponse =
  /** status 200 Pricing rule deleted successfully */ Success;
export type DeleteApiV1ProductsPricingRulesByIdApiArg = {
  id: string;
};
export type GetApiV1BrandsApiResponse =
  /** status 200 Brands retrieved successfully */ {
    success?: boolean;
    message?: string;
    data?: Brand[];
    pagination?: Pagination;
  };
export type GetApiV1BrandsApiArg = {
  page?: number;
  limit?: number;
  /** Filter by brand name */
  search?: string;
  /** Filter by active status */
  isActive?: boolean;
};
export type PostApiV1BrandsApiResponse =
  /** status 201 Brand created successfully */ Success & {
    data?: Brand;
  };
export type PostApiV1BrandsApiArg = {
  brandCreate: BrandCreate;
};
export type GetApiV1BrandsByIdApiResponse =
  /** status 200 Brand retrieved successfully */ Success & {
    data?: Brand;
  };
export type GetApiV1BrandsByIdApiArg = {
  id: string;
};
export type PutApiV1BrandsByIdApiResponse =
  /** status 200 Brand updated successfully */ Success & {
    data?: Brand;
  };
export type PutApiV1BrandsByIdApiArg = {
  id: string;
  brandUpdate: BrandUpdate;
};
export type DeleteApiV1BrandsByIdApiResponse =
  /** status 200 Brand deleted successfully */ Success;
export type DeleteApiV1BrandsByIdApiArg = {
  id: string;
};
export type GetApiV1DepotsFindNearestApiResponse =
  /** status 200 Nearest depots retrieved successfully */ Success & {
    data?: (Depot & {
      /** Distance in kilometers */
      distance?: number;
    })[];
  };
export type GetApiV1DepotsFindNearestApiArg = {
  latitude: number;
  longitude: number;
  limit?: number;
};
export type GetApiV1DepotsStatsApiResponse =
  /** status 200 Depot statistics retrieved successfully */ Success & {
    data?: {
      total?: number;
      active?: number;
      inactive?: number;
      verified?: number;
      unverified?: number;
      byState?: {
        state?: string;
        count?: number;
      }[];
    };
  };
export type GetApiV1DepotsStatsApiArg = void;
export type GetApiV1DepotsApiResponse =
  /** status 200 Depots retrieved successfully */
  | {
      success?: boolean;
      message?: string;
      data?: Depot[];
    }
  | {
      success?: boolean;
      message?: string;
      data?: Depot[];
      pagination?: Pagination;
    };
export type GetApiV1DepotsApiArg = {
  /** Page number (optional - omit for all results) */
  page?: number;
  /** Items per page (optional - omit for all results) */
  limit?: number;
  /** Search in depot name, address, or code */
  search?: string;
  /** Filter by state */
  state?: string;
  /** Filter by LGA */
  lga?: string;
  /** Filter by city */
  city?: string;
  /** Filter by seller ID */
  sellerId?: string;
  /** Filter by verification status */
  isVerified?: 'true' | 'false';
  /** Filter by active status */
  isActive?: 'true' | 'false';
};
export type PostApiV1DepotsApiResponse =
  /** status 201 Depot created successfully */ Success & {
    data?: Depot;
  };
export type PostApiV1DepotsApiArg = {
  body: {
    name: string;
    code: string;
    /** ID of the seller who owns this depot */
    sellerId: string;
    /** Optional manager ID */
    managerId?: string;
    state: string;
    lga: string;
    city: string;
    address: string;
    latitude?: string;
    longitude?: string;
    phone: string;
    email?: string;
  };
};
export type GetApiV1DepotsByIdApiResponse =
  /** status 200 Depot retrieved successfully */ Success & {
    data?: Depot;
  };
export type GetApiV1DepotsByIdApiArg = {
  id: string;
};
export type PutApiV1DepotsByIdApiResponse =
  /** status 200 Depot updated successfully */ Success & {
    data?: Depot;
  };
export type PutApiV1DepotsByIdApiArg = {
  id: string;
  body: {
    name?: string;
    code?: string;
    sellerId?: string;
    managerId?: string;
    state?: string;
    lga?: string;
    city?: string;
    address?: string;
    latitude?: string;
    longitude?: string;
    phone?: string;
    email?: string;
    isActive?: boolean;
  };
};
export type DeleteApiV1DepotsByIdApiResponse =
  /** status 200 Depot deleted successfully */ Success;
export type DeleteApiV1DepotsByIdApiArg = {
  id: string;
};
export type PostApiV1DepotsByIdVerifyApiResponse =
  /** status 200 Depot verified successfully */ Success & {
    data?: Depot;
  };
export type PostApiV1DepotsByIdVerifyApiArg = {
  id: string;
};
export type GetApiV1DeliveryRoutesDestinationApiResponse =
  /** status 200 Delivery routes to destination retrieved successfully */ Success & {
    data?: DeliveryRoute[];
  };
export type GetApiV1DeliveryRoutesDestinationApiArg = {
  /** Destination state */
  state: string;
  /** Destination city (optional) */
  city?: string;
};
export type GetApiV1DeliveryRoutesDepotByDepotIdApiResponse =
  /** status 200 Depot delivery routes retrieved successfully */ Success & {
    data?: DeliveryRoute[];
  };
export type GetApiV1DeliveryRoutesDepotByDepotIdApiArg = {
  /** Depot ID */
  depotId: string;
};
export type GetApiV1DeliveryRoutesStatsApiResponse =
  /** status 200 Delivery route statistics retrieved successfully */ Success & {
    data?: {
      total?: number;
      active?: number;
      inactive?: number;
      byState?: {
        state?: string;
        count?: number;
      }[];
      byDepot?: {
        depotId?: string;
        depotName?: string;
        depotCode?: string | null;
        count?: number;
      }[];
    };
  };
export type GetApiV1DeliveryRoutesStatsApiArg = void;
export type GetApiV1DeliveryRoutesApiResponse =
  /** status 200 Delivery routes retrieved successfully */ {
    success?: boolean;
    message?: string;
    data?: DeliveryRoute[];
    pagination?: Pagination;
  };
export type GetApiV1DeliveryRoutesApiArg = {
  /** Filter by source depot ID */
  sourceDepotId?: string;
  /** Filter by destination state */
  destinationState?: string;
  /** Filter by destination city */
  destinationCity?: string;
  /** Filter by active status */
  isActive?: 'true' | 'false';
  page?: number;
  limit?: number;
};
export type PostApiV1DeliveryRoutesApiResponse =
  /** status 201 Delivery route created successfully */ Success & {
    data?: DeliveryRoute;
  };
export type PostApiV1DeliveryRoutesApiArg = {
  createDeliveryRoute: CreateDeliveryRoute;
};
export type GetApiV1DeliveryRoutesByIdApiResponse =
  /** status 200 Delivery route retrieved successfully */ Success & {
    data?: DeliveryRoute;
  };
export type GetApiV1DeliveryRoutesByIdApiArg = {
  id: string;
};
export type PutApiV1DeliveryRoutesByIdApiResponse =
  /** status 200 Delivery route updated successfully */ Success & {
    data?: DeliveryRoute;
  };
export type PutApiV1DeliveryRoutesByIdApiArg = {
  id: string;
  updateDeliveryRoute: UpdateDeliveryRoute;
};
export type DeleteApiV1DeliveryRoutesByIdApiResponse =
  /** status 200 Delivery route deleted successfully */ Success;
export type DeleteApiV1DeliveryRoutesByIdApiArg = {
  id: string;
};
export type PostApiV1DeliveryRoutesByIdDeactivateApiResponse =
  /** status 200 Delivery route deactivated successfully */ Success;
export type PostApiV1DeliveryRoutesByIdDeactivateApiArg = {
  id: string;
};
export type PostApiV1DeliveryRoutesByIdActivateApiResponse =
  /** status 200 Delivery route activated successfully */ Success & {
    data?: DeliveryRoute;
  };
export type PostApiV1DeliveryRoutesByIdActivateApiArg = {
  id: string;
};
export type PostApiV1PricingCalculateApiResponse =
  /** status 200 Price calculated successfully */ Success & {
    data?: PriceCalculation;
  };
export type PostApiV1PricingCalculateApiArg = {
  body: {
    productId: string;
    depotId: string;
    deliveryType: 'delivery' | 'self_pickup';
    destinationState?: string;
    destinationCity?: string | null;
    quantity: number;
  };
};
export type PostApiV1PricingCalculateOrderApiResponse =
  /** status 200 Order price calculated successfully */ Success & {
    data?: OrderPriceCalculation;
  };
export type PostApiV1PricingCalculateOrderApiArg = {
  body: {
    items: {
      productId: string;
      quantity: number;
    }[];
    depotId: string;
    deliveryType: 'delivery' | 'self_pickup';
    destinationState?: string;
    destinationCity?: string | null;
  };
};
export type GetApiV1PricingNearestDepotApiResponse =
  /** status 200 Nearest depot retrieved successfully */ Success & {
    data?: {
      depot?: Depot;
      transportFee?: number;
    };
  };
export type GetApiV1PricingNearestDepotApiArg = {
  productId: string;
  destinationState: string;
};
export type GetApiV1PricingDestinationsByDepotIdApiResponse =
  /** status 200 Depot destinations retrieved successfully */ Success & {
    data?: {
      destinationState?: string;
      destinationCity?: string | null;
      transportFee?: number;
      truckloadCapacity?: number;
    }[];
  };
export type GetApiV1PricingDestinationsByDepotIdApiArg = {
  depotId: string;
};
export type GetApiV1InventoryLowStockApiResponse =
  /** status 200 Low stock items retrieved successfully */ Success & {
    data?: Inventory[];
  };
export type GetApiV1InventoryLowStockApiArg = {
  threshold?: number;
};
export type GetApiV1InventoryStatsApiResponse =
  /** status 200 Inventory statistics retrieved successfully */ Success & {
    data?: {
      totalItems?: number;
      totalQuantity?: number;
      totalReserved?: number;
      totalAvailable?: number;
      lowStockItems?: number;
      byDepot?: {
        depotId?: string;
        depotName?: string;
        depotCode?: string | null;
        itemCount?: number;
        totalQuantity?: number;
      }[];
      byProduct?: {
        productId?: string;
        productName?: string;
        productBrand?: string | null;
        depotCount?: number;
        totalQuantity?: number;
      }[];
    };
  };
export type GetApiV1InventoryStatsApiArg = {
  /** Low stock threshold */
  threshold?: number;
};
export type GetApiV1InventoryDepotByDepotIdApiResponse =
  /** status 200 Depot inventory retrieved successfully */ Success & {
    data?: Inventory[];
  };
export type GetApiV1InventoryDepotByDepotIdApiArg = {
  depotId: string;
};
export type GetApiV1InventoryDepotByDepotIdProductAndProductIdApiResponse =
  /** status 200 Inventory retrieved successfully */ Success & {
    data?: Inventory;
  };
export type GetApiV1InventoryDepotByDepotIdProductAndProductIdApiArg = {
  depotId: string;
  productId: string;
};
export type PutApiV1InventoryApiResponse =
  /** status 200 Inventory updated successfully */ Success & {
    data?: Inventory;
  };
export type PutApiV1InventoryApiArg = {
  body: {
    depotId: string;
    productId: string;
    quantity: number;
  };
};
export type PostApiV1InventoryAdjustApiResponse =
  /** status 200 Inventory adjusted successfully */ Success & {
    data?: Inventory;
  };
export type PostApiV1InventoryAdjustApiArg = {
  body: {
    depotId: string;
    productId: string;
    /** Positive or negative adjustment */
    adjustment: number;
    reason: string;
  };
};
export type GetApiV1InventoryDepotByDepotIdProductAndProductIdHistoryApiResponse =
  /** status 200 Adjustment history retrieved successfully */ Success & {
    data?: {
      id?: string;
      adjustment?: number;
      reason?: string;
      adjustedBy?: string;
      createdAt?: string;
    }[];
  };
export type GetApiV1InventoryDepotByDepotIdProductAndProductIdHistoryApiArg = {
  depotId: string;
  productId: string;
};
export type PutApiV1InventoryFactoryApiResponse =
  /** status 200 Factory inventory updated successfully */ Success;
export type PutApiV1InventoryFactoryApiArg = {
  body: {
    productId: string;
    quantity: number;
  };
};
export type GetApiV1OrdersApiResponse =
  /** status 200 Orders retrieved successfully */ {
    success?: boolean;
    message?: string;
    data?: Order[];
    pagination?: Pagination;
  };
export type GetApiV1OrdersApiArg = {
  page?: number;
  limit?: number;
  status?:
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'ready'
    | 'in_transit'
    | 'delivered'
    | 'cancelled';
  /** Filter by buyer ID (Admin only) */
  buyerId?: string;
  /** Filter by seller ID (Admin only, auto-filtered for Sellers) */
  sellerId?: string;
  depotId?: string;
};
export type PostApiV1OrdersApiResponse =
  /** status 201 Order created successfully */ Success & {
    data?: Order;
  };
export type PostApiV1OrdersApiArg = {
  body: {
    depotId: string;
    deliveryType: 'pickup' | 'delivery';
    deliveryAddress?: string;
    items: {
      productId: string;
      quantity: number;
    }[];
    notes?: string;
  };
};
export type GetApiV1OrdersMyOrdersApiResponse =
  /** status 200 User orders retrieved successfully */ {
    success?: boolean;
    message?: string;
    data?: Order[];
    pagination?: Pagination;
  };
export type GetApiV1OrdersMyOrdersApiArg = {
  page?: number;
  limit?: number;
  status?:
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'ready'
    | 'in_transit'
    | 'delivered'
    | 'cancelled';
};
export type GetApiV1OrdersAssignedApiResponse =
  /** status 200 Assigned orders retrieved successfully */ {
    success?: boolean;
    message?: string;
    data?: Order[];
    pagination?: Pagination;
  };
export type GetApiV1OrdersAssignedApiArg = {
  page?: number;
  limit?: number;
};
export type GetApiV1OrdersStatsApiResponse =
  /** status 200 Order statistics retrieved successfully */ Success & {
    data?: {
      total?: number;
      pending?: number;
      confirmed?: number;
      processing?: number;
      delivered?: number;
      cancelled?: number;
      totalRevenue?: number;
      byStatus?: {
        status?: string;
        count?: number;
      }[];
      byDeliveryType?: {
        deliveryType?: string;
        count?: number;
      }[];
    };
  };
export type GetApiV1OrdersStatsApiArg = void;
export type GetApiV1OrdersByIdApiResponse =
  /** status 200 Order retrieved successfully */ Success & {
    data?: Order;
  };
export type GetApiV1OrdersByIdApiArg = {
  id: string;
};
export type GetApiV1OrdersNumberByOrderNumberApiResponse =
  /** status 200 Order retrieved successfully */ Success & {
    data?: Order;
  };
export type GetApiV1OrdersNumberByOrderNumberApiArg = {
  orderNumber: string;
};
export type PatchApiV1OrdersByIdStatusApiResponse =
  /** status 200 Order status updated successfully */ Success & {
    data?: Order;
  };
export type PatchApiV1OrdersByIdStatusApiArg = {
  id: string;
  body: {
    status:
      | 'pending'
      | 'confirmed'
      | 'processing'
      | 'ready'
      | 'in_transit'
      | 'delivered'
      | 'cancelled';
  };
};
export type PutApiV1OrdersByIdStatusApiResponse =
  /** status 200 Order status updated successfully */ Success & {
    data?: Order;
  };
export type PutApiV1OrdersByIdStatusApiArg = {
  id: string;
  body: {
    status:
      | 'pending'
      | 'confirmed'
      | 'processing'
      | 'ready'
      | 'in_transit'
      | 'delivered'
      | 'cancelled';
  };
};
export type PostApiV1OrdersByIdAssignApiResponse =
  /** status 200 Order assigned to driver successfully */ Success & {
    data?: Order;
  };
export type PostApiV1OrdersByIdAssignApiArg = {
  id: string;
  body: {
    driverId: string;
  };
};
export type PostApiV1OrdersByIdCancelApiResponse =
  /** status 200 Order cancelled successfully */ Success & {
    data?: Order;
  };
export type PostApiV1OrdersByIdCancelApiArg = {
  id: string;
  body: {
    reason?: string;
  };
};
export type GetApiV1OrdersByIdHistoryApiResponse =
  /** status 200 Order history retrieved successfully */ Success & {
    data?: {
      id?: string;
      status?: string;
      changedBy?: string;
      createdAt?: string;
    }[];
  };
export type GetApiV1OrdersByIdHistoryApiArg = {
  id: string;
};
export type PostApiV1PaymentsInitiateApiResponse =
  /** status 200 Payment initiated successfully */ Success & {
    data?: {
      payment?: Payment;
      /** URL to redirect user for payment */
      authorizationUrl?: string;
      reference?: string;
    };
  };
export type PostApiV1PaymentsInitiateApiArg = {
  body: {
    orderId: string;
    paymentMethod: 'paystack' | 'moniepoint' | 'offline';
  };
};
export type PostApiV1PaymentsVerifyApiResponse =
  /** status 200 Payment verification result */ Success & {
    data?: {
      payment?: Payment;
      verified?: boolean;
    };
  };
export type PostApiV1PaymentsVerifyApiArg = {
  body: {
    reference: string;
  };
};
export type GetApiV1PaymentsByIdApiResponse =
  /** status 200 Payment retrieved successfully */ Success & {
    data?: Payment;
  };
export type GetApiV1PaymentsByIdApiArg = {
  id: string;
};
export type GetApiV1PaymentsOrderByOrderIdApiResponse =
  /** status 200 Order payments retrieved successfully */ Success & {
    data?: Payment[];
  };
export type GetApiV1PaymentsOrderByOrderIdApiArg = {
  orderId: string;
};
export type PostApiV1PaymentsByIdRefundApiResponse =
  /** status 200 Payment refunded successfully */ Success & {
    data?: Payment;
  };
export type PostApiV1PaymentsByIdRefundApiArg = {
  id: string;
  body: {
    reason?: string;
  };
};
export type PostApiV1PaymentsWebhookPaystackApiResponse =
  /** status 200 Webhook processed successfully */ Success;
export type PostApiV1PaymentsWebhookPaystackApiArg = {
  body: object;
};
export type PostApiV1PaymentsWebhookMoniepointApiResponse =
  /** status 200 Webhook processed successfully */ Success;
export type PostApiV1PaymentsWebhookMoniepointApiArg = {
  body: object;
};
export type GetApiV1ReportsDashboardApiResponse =
  /** status 200 Dashboard statistics retrieved successfully (filtered by seller if user is seller) */ Success & {
    data?: {
      /** Total number of orders (filtered by seller depots if user is seller) */
      totalOrders?: number;
      /** Orders in the last 30 days (filtered by seller depots if user is seller) */
      recentOrders?: number;
      /** Total revenue from delivered orders (filtered by seller depots if user is seller) */
      totalRevenue?: number;
      /** Number of pending orders (filtered by seller depots if user is seller) */
      pendingOrders?: number;
      /** Number of items with low stock (< 10 available) in seller's depots (if user is seller) */
      lowStockItems?: number;
      /** Number of active products (filtered by seller if user is seller) */
      activeProducts?: number;
      /** Total number of depots (filtered by seller if user is seller) */
      totalDepots?: number;
      /** Number of active depots (filtered by seller if user is seller) */
      activeDepots?: number;
    };
  };
export type GetApiV1ReportsDashboardApiArg = void;
export type GetApiV1ReportsSalesApiResponse =
  /** status 200 Sales report retrieved successfully (filtered by seller if user is seller) */ Success & {
    data?: {
      summary?: {
        /** Total number of delivered orders (filtered by seller depots if user is seller) */
        totalOrders?: number;
        /** Total revenue from delivered orders (filtered by seller depots if user is seller) */
        totalRevenue?: number;
        /** Total delivery fees (filtered by seller depots if user is seller) */
        totalDeliveryFees?: number;
      };
      /** Sales breakdown by product (filtered by seller depots if user is seller) */
      byProduct?: {
        productId?: string;
        productName?: string;
        productBrand?: string;
        totalQuantity?: number;
        totalRevenue?: number;
      }[];
      /** Sales breakdown by delivery state (filtered by seller depots if user is seller) */
      byState?: {
        state?: string;
        totalOrders?: number;
        totalRevenue?: number;
      }[];
      /** Sales breakdown by delivery type (filtered by seller depots if user is seller) */
      byDeliveryType?: {
        deliveryType?: string;
        totalOrders?: number;
        totalRevenue?: number;
      }[];
      period?: {
        startDate?: string;
        endDate?: string;
      };
    };
  };
export type GetApiV1ReportsSalesApiArg = {
  /** Start date for the report (YYYY-MM-DD) */
  startDate: string;
  /** End date for the report (YYYY-MM-DD) */
  endDate: string;
  /** Filter by specific depot (sellers can only filter by their own depots) */
  depotId?: string;
  /** Filter by specific product */
  productId?: string;
  /** Filter by delivery state */
  state?: string;
  /** Group sales data by time period */
  groupBy?: 'day' | 'week' | 'month';
};
export type GetApiV1ReportsInventoryApiResponse =
  /** status 200 Inventory report retrieved successfully (filtered by seller depots if user is seller) */ Success & {
    data?: {
      summary?: {
        totalItems?: number;
        totalQuantity?: number;
        totalReserved?: number;
        totalAvailable?: number;
      };
      /** Inventory rows (filtered by seller depots if user is seller) */
      items?: {
        depotId?: string;
        depotName?: string;
        productId?: string;
        productName?: string;
        productBrand?: string;
        quantity?: number;
        reservedQuantity?: number;
        availableQuantity?: number;
        lastVerifiedAt?: string | null;
      }[];
    };
  };
export type GetApiV1ReportsInventoryApiArg = {
  /** Optional depot filter. Sellers can only use their own depot IDs. */
  depotId?: string;
  productId?: string;
  /** Return only items with available quantity below the threshold. */
  lowStockOnly?: boolean;
  /** Low stock threshold (defaults to 10). */
  threshold?: number;
};
export type GetApiV1ReportsOrdersApiResponse =
  /** status 200 Orders report retrieved successfully (filtered by seller depots if user is seller) */ Success & {
    data?: {
      totalOrders?: number;
      ordersByStatus?: {
        [key: string]: number;
      };
      ordersByDate?: {
        date?: string;
        count?: number;
      }[];
    };
  };
export type GetApiV1ReportsOrdersApiArg = {
  startDate: string;
  endDate: string;
  status?:
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'ready'
    | 'in_transit'
    | 'delivered'
    | 'cancelled';
  deliveryType?: string;
  /** Optional depot filter. Sellers can only use their own depots. */
  depotId?: string;
  state?: string;
};
export type GetApiV1ReportsPaymentsApiResponse =
  /** status 200 Payments report retrieved successfully */ Success & {
    data?: {
      totalAmount?: number;
      totalPayments?: number;
      paymentsByMethod?: {
        [key: string]: {
          count?: number;
          amount?: number;
        };
      };
      paymentsByStatus?: {
        [key: string]: number;
      };
    };
  };
export type GetApiV1ReportsPaymentsApiArg = {
  startDate: string;
  endDate: string;
  paymentMethod?: 'paystack' | 'moniepoint' | 'offline';
};
export type GetApiV1ReportsPerformanceApiResponse =
  /** status 200 Performance metrics retrieved successfully (filtered by seller depots if user is seller) */ Success & {
    data?: {
      /** Percentage of orders delivered */
      orderFulfillmentRate?: number;
      /** Average time in hours */
      averageDeliveryTime?: number;
      /** Percentage satisfied */
      customerSatisfaction?: number;
      topSellingProducts?: {
        productId?: string;
        productName?: string;
        quantitySold?: number;
        revenue?: number;
      }[];
      topPerformingDepots?: {
        depotId?: string;
        depotName?: string;
        totalOrders?: number;
        revenue?: number;
      }[];
    };
  };
export type GetApiV1ReportsPerformanceApiArg = {
  startDate: string;
  endDate: string;
  /** Optional depot filter. Sellers can only use their own depots. */
  depotId?: string;
  /** Filter by seller/assignee (admins only). */
  sellerId?: string;
};
export type GetApiV1NotificationsApiResponse =
  /** status 200 Notifications retrieved successfully */ {
    success?: boolean;
    message?: string;
    data?: Notification[];
    pagination?: Pagination;
  };
export type GetApiV1NotificationsApiArg = {
  page?: number;
  limit?: number;
  isRead?: boolean;
};
export type GetApiV1NotificationsUnreadCountApiResponse =
  /** status 200 Unread count retrieved successfully */ Success & {
    data?: {
      count?: number;
    };
  };
export type GetApiV1NotificationsUnreadCountApiArg = void;
export type PatchApiV1NotificationsByIdReadApiResponse =
  /** status 200 Notification marked as read */ Success & {
    data?: Notification;
  };
export type PatchApiV1NotificationsByIdReadApiArg = {
  id: string;
};
export type PatchApiV1NotificationsReadAllApiResponse =
  /** status 200 All notifications marked as read */ Success;
export type PatchApiV1NotificationsReadAllApiArg = void;
export type GetApiV1UsersApiResponse =
  /** status 200 Users retrieved successfully */ Success & {
    data?: User[];
    pagination?: Pagination;
  };
export type GetApiV1UsersApiArg = {
  /** Filter by user role */
  role?: 'buyer' | 'seller' | 'admin';
  /** Search by name or email */
  search?: string;
  /** Filter by active status */
  isActive?: boolean;
  /** Page number (optional - omit for all results) */
  page?: number;
  /** Items per page (optional - omit for all results) */
  limit?: number;
};
export type GetApiV1UsersByIdApiResponse =
  /** status 200 User retrieved successfully */ Success & {
    data?: User;
  };
export type GetApiV1UsersByIdApiArg = {
  id: string;
};
export type GetApiV1OrdersBuyerByBuyerIdApiResponse =
  /** status 200 Buyer orders retrieved successfully */ Success & {
    data?: {
      data?: Order[];
      pagination?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
      };
    };
  };
export type GetApiV1OrdersBuyerByBuyerIdApiArg = {
  buyerId: string;
  page?: number;
  limit?: number;
};
export type GetApiV1OrdersDepotByDepotIdApiResponse =
  /** status 200 Depot orders retrieved successfully */ Success & {
    data?: {
      data?: Order[];
      pagination?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
      };
    };
  };
export type GetApiV1OrdersDepotByDepotIdApiArg = {
  depotId: string;
  page?: number;
  limit?: number;
};
export type GetApiV1PaymentsVerifyByReferenceApiResponse =
  /** status 200 Payment verification result */ Success & {
    data?: {
      payment?: Payment;
      verified?: boolean;
    };
  };
export type GetApiV1PaymentsVerifyByReferenceApiArg = {
  reference: string;
};
export type GetApiV1PaymentsApiResponse =
  /** status 200 Payments retrieved successfully */ Success & {
    data?: {
      payments?: Payment[];
      pagination?: {
        currentPage?: number;
        totalPages?: number;
        totalItems?: number;
        itemsPerPage?: number;
      };
    };
  };
export type GetApiV1PaymentsApiArg = {
  page?: number;
  limit?: number;
  status?: 'pending' | 'completed' | 'failed' | 'refunded';
};
export type Success = {
  success?: boolean;
  message?: string;
  data?: object;
};
export type User = {
  id?: string;
  email?: string;
  fullName?: string;
  phoneNumber?: string;
  role?: 'buyer' | 'seller' | 'admin';
  isActive?: boolean;
  createdAt?: string;
};
export type Error = {
  success?: boolean;
  message?: string;
  errors?: object[];
};
export type Product = {
  id?: string;
  name?: string;
  brand?: string;
  brandId?: string | null;
  description?: string;
  category?: 'cement' | 'building_materials';
  sellerId?: string;
  depotId?: string;
  /** Base price in Naira */
  basePrice?: string;
  weight?: string;
  unit?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  sku?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  seller?: {
    id?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
  };
  depot?: {
    id?: string;
    name?: string;
    code?: string;
    state?: string;
    city?: string;
  };
};
export type Pagination = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
};
export type ProductCreate = {
  name: string;
  /** Brand name (used only when brandId is not provided) */
  brand?: string;
  /** Brand identifier. Provide either brandId or brand name. */
  brandId?: string;
  description?: string;
  category: 'cement' | 'building_materials';
  /** ID of the seller (optional - auto-assigned for sellers, required for admins creating products for other sellers) */
  sellerId?: string;
  /** ID of the depot */
  depotId: string;
  /** Base price in Naira */
  basePrice: string;
  weight?: string;
  unit?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  sku?: string;
};
export type ProductUpdate = {
  name?: string;
  brand?: string;
  brandId?: string;
  description?: string;
  category?: 'cement' | 'building_materials';
  sellerId?: string;
  depotId?: string;
  /** Base price in Naira */
  basePrice?: string;
  weight?: string;
  unit?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  sku?: string;
  isActive?: boolean;
};
export type Brand = {
  id?: string;
  name?: string;
  slug?: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};
export type BrandCreate = {
  name: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  isActive?: boolean;
};
export type BrandUpdate = {
  name?: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  isActive?: boolean;
};
export type Depot = {
  id?: string;
  name?: string;
  code?: string;
  sellerId?: string;
  managerId?: string;
  state?: string;
  lga?: string;
  city?: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  phone?: string;
  email?: string;
  isVerified?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  seller?: {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    businessName?: string;
    role?: 'seller' | 'admin';
  };
};
export type DeliveryRoute = {
  id?: string;
  sourceDepotId?: string;
  destinationState?: string;
  destinationCity?: string | null;
  /** Number of bags per truck */
  truckloadCapacity?: number;
  /** Transport fee in Naira */
  transportFee?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
};
export type CreateDeliveryRoute = {
  sourceDepotId: string;
  destinationState: string;
  destinationCity?: string;
  truckloadCapacity?: number;
  transportFee: number;
  isActive?: boolean;
};
export type UpdateDeliveryRoute = {
  destinationState?: string;
  destinationCity?: string | null;
  truckloadCapacity?: number;
  transportFee?: number;
  isActive?: boolean;
};
export type PriceCalculation = {
  /** Base price per unit */
  basePrice?: number;
  /** Total before transport fee */
  subtotal?: number;
  /** Transport fee (0 for self-pickup) */
  transportFee?: number;
  /** Final total price */
  totalPrice?: number;
  deliveryType?: 'delivery' | 'self_pickup';
  routeInfo?: {
    sourceDepotId?: string;
    destinationState?: string;
    destinationCity?: string;
  };
};
export type OrderPriceCalculation = {
  items?: {
    productId?: string;
    productName?: string;
    productBrand?: string;
    quantity?: number;
    basePrice?: number;
    totalPrice?: number;
  }[];
  subtotal?: number;
  transportFee?: number;
  totalPrice?: number;
  deliveryType?: 'delivery' | 'self_pickup';
  routeInfo?: {
    sourceDepotId?: string;
    destinationState?: string;
    destinationCity?: string;
  };
};
export type Inventory = {
  id?: string;
  depotId?: string;
  productId?: string;
  quantity?: number;
  lastUpdated?: string;
};
export type Order = {
  id?: string;
  orderNumber?: string;
  buyerId?: string;
  depotId?: string;
  status?:
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'ready'
    | 'in_transit'
    | 'delivered'
    | 'cancelled';
  deliveryType?: 'pickup' | 'delivery';
  totalAmount?: number;
  items?: object[];
  createdAt?: string;
};
export type Payment = {
  id?: string;
  orderId?: string;
  amount?: number;
  paymentMethod?: 'paystack' | 'moniepoint' | 'offline';
  status?: 'pending' | 'completed' | 'failed' | 'refunded';
  reference?: string;
  createdAt?: string;
};
export type Notification = {
  id?: string;
  userId?: string;
  title?: string;
  message?: string;
  type?: string;
  isRead?: boolean;
  createdAt?: string;
};
export const {
  useGetHealthQuery,
  usePostApiV1AuthRegisterMutation,
  usePostApiV1AuthLoginMutation,
  usePostApiV1AuthRefreshMutation,
  usePostApiV1AuthLogoutMutation,
  useGetApiV1AuthMeQuery,
  usePutApiV1AuthProfileMutation,
  usePutApiV1AuthPasswordMutation,
  useGetApiV1ProductsQuery,
  usePostApiV1ProductsMutation,
  useGetApiV1ProductsBrandsQuery,
  useGetApiV1ProductsCategoriesQuery,
  useGetApiV1ProductsMyQuery,
  useGetApiV1ProductsStatsQuery,
  useGetApiV1ProductsByIdQuery,
  usePutApiV1ProductsByIdMutation,
  useDeleteApiV1ProductsByIdMutation,
  useGetApiV1ProductsByIdPricingRulesQuery,
  usePostApiV1ProductsByIdPricingRulesMutation,
  usePutApiV1ProductsPricingRulesByIdMutation,
  useDeleteApiV1ProductsPricingRulesByIdMutation,
  useGetApiV1BrandsQuery,
  usePostApiV1BrandsMutation,
  useGetApiV1BrandsByIdQuery,
  usePutApiV1BrandsByIdMutation,
  useDeleteApiV1BrandsByIdMutation,
  useGetApiV1DepotsFindNearestQuery,
  useGetApiV1DepotsStatsQuery,
  useGetApiV1DepotsQuery,
  usePostApiV1DepotsMutation,
  useGetApiV1DepotsByIdQuery,
  usePutApiV1DepotsByIdMutation,
  useDeleteApiV1DepotsByIdMutation,
  usePostApiV1DepotsByIdVerifyMutation,
  useGetApiV1DeliveryRoutesDestinationQuery,
  useGetApiV1DeliveryRoutesDepotByDepotIdQuery,
  useGetApiV1DeliveryRoutesStatsQuery,
  useGetApiV1DeliveryRoutesQuery,
  usePostApiV1DeliveryRoutesMutation,
  useGetApiV1DeliveryRoutesByIdQuery,
  usePutApiV1DeliveryRoutesByIdMutation,
  useDeleteApiV1DeliveryRoutesByIdMutation,
  usePostApiV1DeliveryRoutesByIdDeactivateMutation,
  usePostApiV1DeliveryRoutesByIdActivateMutation,
  usePostApiV1PricingCalculateMutation,
  usePostApiV1PricingCalculateOrderMutation,
  useGetApiV1PricingNearestDepotQuery,
  useGetApiV1PricingDestinationsByDepotIdQuery,
  useGetApiV1InventoryLowStockQuery,
  useGetApiV1InventoryStatsQuery,
  useGetApiV1InventoryDepotByDepotIdQuery,
  useGetApiV1InventoryDepotByDepotIdProductAndProductIdQuery,
  usePutApiV1InventoryMutation,
  usePostApiV1InventoryAdjustMutation,
  useGetApiV1InventoryDepotByDepotIdProductAndProductIdHistoryQuery,
  usePutApiV1InventoryFactoryMutation,
  useGetApiV1OrdersQuery,
  usePostApiV1OrdersMutation,
  useGetApiV1OrdersMyOrdersQuery,
  useGetApiV1OrdersAssignedQuery,
  useGetApiV1OrdersStatsQuery,
  useGetApiV1OrdersByIdQuery,
  useGetApiV1OrdersNumberByOrderNumberQuery,
  usePatchApiV1OrdersByIdStatusMutation,
  usePutApiV1OrdersByIdStatusMutation,
  usePostApiV1OrdersByIdAssignMutation,
  usePostApiV1OrdersByIdCancelMutation,
  useGetApiV1OrdersByIdHistoryQuery,
  usePostApiV1PaymentsInitiateMutation,
  usePostApiV1PaymentsVerifyMutation,
  useGetApiV1PaymentsByIdQuery,
  useGetApiV1PaymentsOrderByOrderIdQuery,
  usePostApiV1PaymentsByIdRefundMutation,
  usePostApiV1PaymentsWebhookPaystackMutation,
  usePostApiV1PaymentsWebhookMoniepointMutation,
  useGetApiV1ReportsDashboardQuery,
  useGetApiV1ReportsSalesQuery,
  useGetApiV1ReportsInventoryQuery,
  useGetApiV1ReportsOrdersQuery,
  useGetApiV1ReportsPaymentsQuery,
  useGetApiV1ReportsPerformanceQuery,
  useGetApiV1NotificationsQuery,
  useGetApiV1NotificationsUnreadCountQuery,
  usePatchApiV1NotificationsByIdReadMutation,
  usePatchApiV1NotificationsReadAllMutation,
  useGetApiV1UsersQuery,
  useGetApiV1UsersByIdQuery,
  useGetApiV1OrdersBuyerByBuyerIdQuery,
  useGetApiV1OrdersDepotByDepotIdQuery,
  useGetApiV1PaymentsVerifyByReferenceQuery,
  useGetApiV1PaymentsQuery,
} = injectedRtkApi;
