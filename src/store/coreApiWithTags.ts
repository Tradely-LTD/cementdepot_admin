import { coreApi } from './results';
import { TAGS } from './emptyApi';

const LIST_ID = 'LIST' as const;

// Enhanced API with proper cache tags for automatic invalidation

export const cementDepotApi = coreApi.enhanceEndpoints({
  endpoints: {
    // Health Check
    getHealth: {
      providesTags: [{ type: TAGS.AUTH, id: 'HEALTH' }],
    },

    // Products - Query
    getApiV1Products: {
      providesTags: result =>
        result && (result as any).data
          ? [
              ...(result as any).data.map((item: any) => ({
                type: TAGS.PRODUCT,
                id: item.id,
              })),
              { type: TAGS.PRODUCT, id: LIST_ID },
            ]
          : [{ type: TAGS.PRODUCT, id: LIST_ID }],
    },
    getApiV1ProductsMy: {
      providesTags: result =>
        result && (result as any).data
          ? [
              ...(result as any).data.map((item: any) => ({
                type: TAGS.PRODUCT,
                id: item.id,
              })),
              { type: TAGS.PRODUCT, id: LIST_ID },
            ]
          : [{ type: TAGS.PRODUCT, id: LIST_ID }],
    },
    getApiV1ProductsById: {
      providesTags: (_result, _error, arg) => [
        { type: TAGS.PRODUCT, id: arg.id },
      ],
    },
    getApiV1ProductsBrands: {
      providesTags: [{ type: TAGS.PRODUCT, id: 'BRANDS' }],
    },
    getApiV1ProductsCategories: {
      providesTags: [{ type: TAGS.PRODUCT, id: 'CATEGORIES' }],
    },
    getApiV1ProductsByIdPricingRules: {
      providesTags: (_result, _error, arg) => [
        { type: TAGS.PRODUCT, id: `PRICING-${arg.id}` },
      ],
    },

    // Products - Mutations
    postApiV1Products: {
      invalidatesTags: [{ type: TAGS.PRODUCT, id: LIST_ID }],
    },
    putApiV1ProductsById: {
      invalidatesTags: (_result, _error, arg) => [
        { type: TAGS.PRODUCT, id: arg.id },
        { type: TAGS.PRODUCT, id: LIST_ID },
      ],
    },
    deleteApiV1ProductsById: {
      invalidatesTags: [{ type: TAGS.PRODUCT, id: LIST_ID }],
    },
    postApiV1ProductsByIdPricingRules: {
      invalidatesTags: (_result, _error, arg) => [
        { type: TAGS.PRODUCT, id: `PRICING-${arg.id}` },
      ],
    },
    putApiV1ProductsPricingRulesById: {
      invalidatesTags: (_result, _error, arg) => [
        { type: TAGS.PRODUCT, id: `PRICING-${arg.id}` },
      ],
    },
    deleteApiV1ProductsPricingRulesById: {
      invalidatesTags: (_result, _error, arg) => [
        { type: TAGS.PRODUCT, id: `PRICING-${arg.id}` },
      ],
    },

    // Depots - Query
    getApiV1Depots: {
      providesTags: result =>
        result && (result as any).data
          ? [
              ...(result as any).data.map((item: any) => ({
                type: TAGS.DEPOT,
                id: item.id,
              })),
              { type: TAGS.DEPOT, id: LIST_ID },
            ]
          : [{ type: TAGS.DEPOT, id: LIST_ID }],
    },
    getApiV1DepotsStats: {
      providesTags: [{ type: TAGS.DEPOT, id: 'STATS' }],
    },
    getApiV1Users: {
      providesTags: result =>
        result && (result as any).data
          ? [
              ...(result as any).data.map((item: any) => ({
                type: TAGS.AUTH,
                id: item.id,
              })),
              { type: TAGS.AUTH, id: 'USERS_LIST' },
            ]
          : [{ type: TAGS.AUTH, id: 'USERS_LIST' }],
    },
    getApiV1DepotsById: {
      providesTags: (_result, _error, arg) => [
        { type: TAGS.DEPOT, id: arg.id },
      ],
    },
    getApiV1DepotsFindNearest: {
      providesTags: [{ type: TAGS.DEPOT, id: 'NEAREST' }],
    },

    // Depots - Mutations
    postApiV1Depots: {
      invalidatesTags: [{ type: TAGS.DEPOT, id: LIST_ID }],
    },
    putApiV1DepotsById: {
      invalidatesTags: (_result, _error, arg) => [
        { type: TAGS.DEPOT, id: arg.id },
        { type: TAGS.DEPOT, id: LIST_ID },
      ],
    },
    deleteApiV1DepotsById: {
      invalidatesTags: [{ type: TAGS.DEPOT, id: LIST_ID }],
    },
    postApiV1DepotsByIdVerify: {
      invalidatesTags: (_result, _error, arg) => [
        { type: TAGS.DEPOT, id: arg.id },
        { type: TAGS.DEPOT, id: LIST_ID },
      ],
    },

    // Inventory - Query
    getApiV1InventoryDepotByDepotId: {
      providesTags: (_result, _error, arg) => [
        { type: TAGS.INVENTORY, id: `DEPOT-${arg.depotId}` },
      ],
    },
    getApiV1InventoryDepotByDepotIdProductAndProductId: {
      providesTags: (_result, _error, arg) => [
        { type: TAGS.INVENTORY, id: `${arg.depotId}-${arg.productId}` },
      ],
    },
    getApiV1InventoryLowStock: {
      providesTags: [{ type: TAGS.INVENTORY, id: 'LOW_STOCK' }],
    },
    getApiV1InventoryDepotByDepotIdProductAndProductIdHistory: {
      providesTags: (_result, _error, arg) => [
        { type: TAGS.INVENTORY, id: `HISTORY-${arg.depotId}-${arg.productId}` },
      ],
    },

    // Inventory - Mutations
    putApiV1Inventory: {
      invalidatesTags: (_result, _error, arg) => [
        { type: TAGS.INVENTORY, id: `DEPOT-${arg.body.depotId}` },
        {
          type: TAGS.INVENTORY,
          id: `${arg.body.depotId}-${arg.body.productId}`,
        },
        { type: TAGS.INVENTORY, id: 'LOW_STOCK' },
      ],
    },
    postApiV1InventoryAdjust: {
      invalidatesTags: (_result, _error, arg) => [
        { type: TAGS.INVENTORY, id: `DEPOT-${arg.body.depotId}` },
        {
          type: TAGS.INVENTORY,
          id: `${arg.body.depotId}-${arg.body.productId}`,
        },
        {
          type: TAGS.INVENTORY,
          id: `HISTORY-${arg.body.depotId}-${arg.body.productId}`,
        },
        { type: TAGS.INVENTORY, id: 'LOW_STOCK' },
      ],
    },
    putApiV1InventoryFactory: {
      invalidatesTags: [{ type: TAGS.INVENTORY, id: 'LOW_STOCK' }],
    },

    // Delivery Routes - Query
    getApiV1DeliveryRoutes: {
      providesTags: result =>
        result && (result as any).data
          ? [
              ...(result as any).data.map((route: any) => ({
                type: TAGS.DELIVERY_ROUTE,
                id: route.id,
              })),
              { type: TAGS.DELIVERY_ROUTE, id: LIST_ID },
            ]
          : [{ type: TAGS.DELIVERY_ROUTE, id: LIST_ID }],
    },
    getApiV1DeliveryRoutesById: {
      providesTags: (_result, _error, arg) => [
        { type: TAGS.DELIVERY_ROUTE, id: arg.id },
      ],
    },
    getApiV1DeliveryRoutesDestination: {
      providesTags: (_result, _error, arg) => [
        {
          type: TAGS.DELIVERY_ROUTE,
          id: `DEST-${arg.state}-${arg.city ?? 'ALL'}`,
        },
      ],
    },
    getApiV1DeliveryRoutesDepotByDepotId: {
      providesTags: (_result, _error, arg) => [
        { type: TAGS.DELIVERY_ROUTE, id: `DEPOT-${arg.depotId}` },
      ],
    },

    // Delivery Routes - Mutations
    postApiV1DeliveryRoutes: {
      invalidatesTags: [{ type: TAGS.DELIVERY_ROUTE, id: LIST_ID }],
    },
    putApiV1DeliveryRoutesById: {
      invalidatesTags: (_result, _error, arg) => [
        { type: TAGS.DELIVERY_ROUTE, id: arg.id },
        { type: TAGS.DELIVERY_ROUTE, id: LIST_ID },
      ],
    },
    deleteApiV1DeliveryRoutesById: {
      invalidatesTags: (_result, _error, arg) => [
        { type: TAGS.DELIVERY_ROUTE, id: arg.id },
        { type: TAGS.DELIVERY_ROUTE, id: LIST_ID },
      ],
    },
    postApiV1DeliveryRoutesByIdActivate: {
      invalidatesTags: (_result, _error, arg) => [
        { type: TAGS.DELIVERY_ROUTE, id: arg.id },
        { type: TAGS.DELIVERY_ROUTE, id: LIST_ID },
      ],
    },
    postApiV1DeliveryRoutesByIdDeactivate: {
      invalidatesTags: (_result, _error, arg) => [
        { type: TAGS.DELIVERY_ROUTE, id: arg.id },
        { type: TAGS.DELIVERY_ROUTE, id: LIST_ID },
      ],
    },

    // Pricing
    postApiV1PricingCalculate: {
      invalidatesTags: [{ type: TAGS.PRICING, id: 'PRICE_CACHE' }],
    },
    postApiV1PricingCalculateOrder: {
      invalidatesTags: [{ type: TAGS.PRICING, id: 'PRICE_CACHE' }],
    },
    getApiV1PricingNearestDepot: {
      providesTags: (_result, _error, arg) => [
        {
          type: TAGS.PRICING,
          id: `NEAREST-${arg.destinationState}-${arg.productId}`,
        },
      ],
    },
    getApiV1PricingDestinationsByDepotId: {
      providesTags: (_result, _error, arg) => [
        { type: TAGS.PRICING, id: `DESTINATIONS-${arg.depotId}` },
      ],
    },

    // Orders - Query
    getApiV1Orders: {
      providesTags: result =>
        result && (result as any).data
          ? [
              ...(result as any).data.map((item: any) => ({
                type: TAGS.ORDER,
                id: item.id,
              })),
              { type: TAGS.ORDER, id: LIST_ID },
            ]
          : [{ type: TAGS.ORDER, id: LIST_ID }],
    },
    getApiV1OrdersById: {
      providesTags: (_result, _error, arg) => [
        { type: TAGS.ORDER, id: arg.id },
      ],
    },
    getApiV1OrdersMyOrders: {
      providesTags: result =>
        result && (result as any).data
          ? [
              ...(result as any).data.map((item: any) => ({
                type: TAGS.ORDER,
                id: item.id,
              })),
              { type: TAGS.ORDER, id: 'MY_ORDERS' },
            ]
          : [{ type: TAGS.ORDER, id: 'MY_ORDERS' }],
    },
    getApiV1OrdersAssigned: {
      providesTags: result =>
        result && (result as any).data
          ? [
              ...(result as any).data.map((item: any) => ({
                type: TAGS.ORDER,
                id: item.id,
              })),
              { type: TAGS.ORDER, id: 'ASSIGNED' },
            ]
          : [{ type: TAGS.ORDER, id: 'ASSIGNED' }],
    },
    getApiV1OrdersNumberByOrderNumber: {
      providesTags: (_result, _error, arg) => [
        { type: TAGS.ORDER, id: arg.orderNumber },
      ],
    },
    getApiV1OrdersByIdHistory: {
      providesTags: (_result, _error, arg) => [
        { type: TAGS.ORDER, id: `HISTORY-${arg.id}` },
      ],
    },
    getApiV1OrdersBuyerByBuyerId: {
      providesTags: (_result, _error, arg) => [
        { type: TAGS.ORDER, id: `BUYER-${arg.buyerId}` },
      ],
    },
    getApiV1OrdersDepotByDepotId: {
      providesTags: (_result, _error, arg) => [
        { type: TAGS.ORDER, id: `DEPOT-${arg.depotId}` },
      ],
    },

    // Orders - Mutations
    postApiV1Orders: {
      invalidatesTags: [
        { type: TAGS.ORDER, id: LIST_ID },
        { type: TAGS.INVENTORY, id: 'LOW_STOCK' },
      ],
    },
    patchApiV1OrdersByIdStatus: {
      invalidatesTags: (_result, _error, arg) => [
        { type: TAGS.ORDER, id: arg.id },
        { type: TAGS.ORDER, id: LIST_ID },
        { type: TAGS.ORDER, id: `HISTORY-${arg.id}` },
      ],
    },
    putApiV1OrdersByIdStatus: {
      invalidatesTags: (_result, _error, arg) => [
        { type: TAGS.ORDER, id: arg.id },
        { type: TAGS.ORDER, id: LIST_ID },
        { type: TAGS.ORDER, id: `HISTORY-${arg.id}` },
      ],
    },
    postApiV1OrdersByIdAssign: {
      invalidatesTags: (_result, _error, arg) => [
        { type: TAGS.ORDER, id: arg.id },
        { type: TAGS.ORDER, id: LIST_ID },
        { type: TAGS.ORDER, id: 'ASSIGNED' },
      ],
    },
    postApiV1OrdersByIdCancel: {
      invalidatesTags: (_result, _error, arg) => [
        { type: TAGS.ORDER, id: arg.id },
        { type: TAGS.ORDER, id: LIST_ID },
        { type: TAGS.ORDER, id: `HISTORY-${arg.id}` },
      ],
    },

    // Payments - Query
    getApiV1Payments: {
      providesTags: result =>
        result && (result as any).data?.payments
          ? [
              ...(result as any).data.payments.map((item: any) => ({
                type: TAGS.PAYMENT,
                id: item.id,
              })),
              { type: TAGS.PAYMENT, id: LIST_ID },
            ]
          : [{ type: TAGS.PAYMENT, id: LIST_ID }],
    },
    getApiV1PaymentsById: {
      providesTags: (_result, _error, arg) => [
        { type: TAGS.PAYMENT, id: arg.id },
      ],
    },
    getApiV1PaymentsOrderByOrderId: {
      providesTags: (_result, _error, arg) => [
        { type: TAGS.PAYMENT, id: `ORDER-${arg.orderId}` },
      ],
    },
    getApiV1PaymentsVerifyByReference: {
      providesTags: (_result, _error, arg) => [
        { type: TAGS.PAYMENT, id: `REF-${arg.reference}` },
      ],
    },

    // Payments - Mutations
    postApiV1PaymentsInitiate: {
      invalidatesTags: (_result, _error, arg) => [
        { type: TAGS.PAYMENT, id: `ORDER-${arg.body.orderId}` },
        { type: TAGS.ORDER, id: arg.body.orderId },
        { type: TAGS.PAYMENT, id: LIST_ID },
      ],
    },
    postApiV1PaymentsVerify: {
      invalidatesTags: [{ type: TAGS.PAYMENT, id: LIST_ID }],
    },
    postApiV1PaymentsByIdRefund: {
      invalidatesTags: (_result, _error, arg) => [
        { type: TAGS.PAYMENT, id: arg.id },
        { type: TAGS.PAYMENT, id: LIST_ID },
      ],
    },

    // Notifications - Query
    getApiV1Notifications: {
      providesTags: result =>
        result && (result as any).data
          ? [
              ...(result as any).data.map((item: any) => ({
                type: TAGS.NOTIFICATION,
                id: item.id,
              })),
              { type: TAGS.NOTIFICATION, id: LIST_ID },
            ]
          : [{ type: TAGS.NOTIFICATION, id: LIST_ID }],
    },
    getApiV1NotificationsUnreadCount: {
      providesTags: [{ type: TAGS.NOTIFICATION, id: 'UNREAD_COUNT' }],
    },

    // Notifications - Mutations
    patchApiV1NotificationsByIdRead: {
      invalidatesTags: (_result, _error, arg) => [
        { type: TAGS.NOTIFICATION, id: arg.id },
        { type: TAGS.NOTIFICATION, id: LIST_ID },
        { type: TAGS.NOTIFICATION, id: 'UNREAD_COUNT' },
      ],
    },
    patchApiV1NotificationsReadAll: {
      invalidatesTags: [
        { type: TAGS.NOTIFICATION, id: LIST_ID },
        { type: TAGS.NOTIFICATION, id: 'UNREAD_COUNT' },
      ],
    },

    // Reports - Query
    getApiV1ReportsDashboard: {
      providesTags: [{ type: TAGS.REPORT, id: 'DASHBOARD' }],
    },
    getApiV1ReportsSales: {
      providesTags: [{ type: TAGS.REPORT, id: 'SALES' }],
    },
    getApiV1ReportsInventory: {
      providesTags: [{ type: TAGS.REPORT, id: 'INVENTORY' }],
    },
    getApiV1ReportsOrders: {
      providesTags: [{ type: TAGS.REPORT, id: 'ORDERS' }],
    },
    getApiV1ReportsPayments: {
      providesTags: [{ type: TAGS.REPORT, id: 'PAYMENTS' }],
    },
    getApiV1ReportsPerformance: {
      providesTags: [{ type: TAGS.REPORT, id: 'PERFORMANCE' }],
    },

    // Auth - Query
    getApiV1AuthMe: {
      providesTags: [{ type: TAGS.AUTH, id: 'ME' }],
    },

    // Auth - Mutations
    postApiV1AuthLogin: {
      invalidatesTags: [{ type: TAGS.AUTH, id: 'ME' }],
    },
    postApiV1AuthLogout: {
      invalidatesTags: [
        { type: TAGS.AUTH, id: 'ME' },
        { type: TAGS.PRODUCT, id: LIST_ID },
        { type: TAGS.DEPOT, id: LIST_ID },
        { type: TAGS.INVENTORY, id: LIST_ID },
        { type: TAGS.ORDER, id: LIST_ID },
        { type: TAGS.PAYMENT, id: LIST_ID },
        { type: TAGS.NOTIFICATION, id: LIST_ID },
        { type: TAGS.REPORT, id: LIST_ID },
      ],
    },
    postApiV1AuthRefresh: {
      invalidatesTags: [{ type: TAGS.AUTH, id: 'ME' }],
    },
  },
});

// Export all hooks
export const {
  // Health
  useGetHealthQuery,

  // Auth
  usePostApiV1AuthLoginMutation,
  usePostApiV1AuthRegisterMutation,
  usePostApiV1AuthLogoutMutation,
  usePostApiV1AuthRefreshMutation,
  useGetApiV1AuthMeQuery,

  // Products
  useGetApiV1ProductsQuery,
  useGetApiV1ProductsMyQuery,
  useGetApiV1ProductsStatsQuery,
  useGetApiV1ProductsByIdQuery,
  useGetApiV1ProductsBrandsQuery,
  useGetApiV1ProductsCategoriesQuery,
  useGetApiV1ProductsByIdPricingRulesQuery,
  usePostApiV1ProductsMutation,
  usePutApiV1ProductsByIdMutation,
  useDeleteApiV1ProductsByIdMutation,
  usePostApiV1ProductsByIdPricingRulesMutation,
  usePutApiV1ProductsPricingRulesByIdMutation,
  useDeleteApiV1ProductsPricingRulesByIdMutation,

  // Depots
  useGetApiV1DepotsQuery,
  useGetApiV1DepotsByIdQuery,
  useGetApiV1DepotsFindNearestQuery,
  useGetApiV1DepotsStatsQuery,
  usePostApiV1DepotsMutation,
  usePutApiV1DepotsByIdMutation,

  // Users
  useGetApiV1UsersQuery,
  useGetApiV1UsersByIdQuery,
  useDeleteApiV1DepotsByIdMutation,
  usePostApiV1DepotsByIdVerifyMutation,

  // Inventory
  useGetApiV1InventoryDepotByDepotIdQuery,
  useGetApiV1InventoryDepotByDepotIdProductAndProductIdQuery,
  useGetApiV1InventoryLowStockQuery,
  useGetApiV1InventoryDepotByDepotIdProductAndProductIdHistoryQuery,
  usePutApiV1InventoryMutation,
  usePostApiV1InventoryAdjustMutation,
  usePutApiV1InventoryFactoryMutation,

  // Delivery Routes
  useGetApiV1DeliveryRoutesQuery,
  useGetApiV1DeliveryRoutesByIdQuery,
  useGetApiV1DeliveryRoutesDestinationQuery,
  useGetApiV1DeliveryRoutesDepotByDepotIdQuery,
  usePostApiV1DeliveryRoutesMutation,
  usePutApiV1DeliveryRoutesByIdMutation,
  useDeleteApiV1DeliveryRoutesByIdMutation,
  usePostApiV1DeliveryRoutesByIdActivateMutation,
  usePostApiV1DeliveryRoutesByIdDeactivateMutation,

  // Pricing
  usePostApiV1PricingCalculateMutation,
  usePostApiV1PricingCalculateOrderMutation,
  useGetApiV1PricingNearestDepotQuery,
  useGetApiV1PricingDestinationsByDepotIdQuery,

  // Orders
  useGetApiV1OrdersQuery,
  useGetApiV1OrdersByIdQuery,
  useGetApiV1OrdersMyOrdersQuery,
  useGetApiV1OrdersAssignedQuery,
  useGetApiV1OrdersNumberByOrderNumberQuery,
  useGetApiV1OrdersByIdHistoryQuery,
  useGetApiV1OrdersBuyerByBuyerIdQuery,
  useGetApiV1OrdersDepotByDepotIdQuery,
  usePostApiV1OrdersMutation,
  usePatchApiV1OrdersByIdStatusMutation,
  usePutApiV1OrdersByIdStatusMutation,
  usePostApiV1OrdersByIdAssignMutation,
  usePostApiV1OrdersByIdCancelMutation,

  // Payments
  useGetApiV1PaymentsQuery,
  useGetApiV1PaymentsByIdQuery,
  useGetApiV1PaymentsOrderByOrderIdQuery,
  useGetApiV1PaymentsVerifyByReferenceQuery,
  usePostApiV1PaymentsInitiateMutation,
  usePostApiV1PaymentsVerifyMutation,
  usePostApiV1PaymentsByIdRefundMutation,
  usePostApiV1PaymentsWebhookPaystackMutation,
  usePostApiV1PaymentsWebhookMoniepointMutation,

  // Notifications
  useGetApiV1NotificationsQuery,
  useGetApiV1NotificationsUnreadCountQuery,
  usePatchApiV1NotificationsByIdReadMutation,
  usePatchApiV1NotificationsReadAllMutation,

  // Reports
  useGetApiV1ReportsDashboardQuery,
  useGetApiV1ReportsSalesQuery,
  useGetApiV1ReportsInventoryQuery,
  useGetApiV1ReportsOrdersQuery,
  useGetApiV1ReportsPaymentsQuery,
  useGetApiV1ReportsPerformanceQuery,
} = cementDepotApi;

// Export types
export type {
  PostApiV1AuthLoginApiArg,
  PostApiV1AuthLoginApiResponse,
  PostApiV1AuthRegisterApiArg,
  PostApiV1PricingCalculateApiArg,
  PostApiV1PricingCalculateOrderApiArg,
  ProductCreate,
  ProductUpdate,
  DeliveryRoute,
  CreateDeliveryRoute,
  UpdateDeliveryRoute,
  PriceCalculation,
  OrderPriceCalculation,
} from './results';

// Export the actual LoginResponse type
export type { LoginResponse } from '@/pages/admin/auth-slice';
