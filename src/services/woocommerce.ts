import axios, { AxiosInstance } from 'axios';
import { WordPressConfig, WCProduct, WCOrder, WCCustomer, WCCoupon } from '../types.js';

export class WooCommerceService {
  private client: AxiosInstance;

  constructor(config: WordPressConfig) {
    this.client = axios.create({
      baseURL: `${config.wordpressUrl}/wp-json/wc/v3`,
      auth: {
        username: config.username,
        password: config.applicationPassword,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Products
  async getProducts(params?: Record<string, any>) {
    const response = await this.client.get('/products', { params });
    return response.data;
  }

  async getProduct(id: number) {
    const response = await this.client.get(`/products/${id}`);
    return response.data;
  }

  async createProduct(product: WCProduct) {
    const response = await this.client.post('/products', product);
    return response.data;
  }

  async updateProduct(id: number, product: Partial<WCProduct>) {
    const response = await this.client.put(`/products/${id}`, product);
    return response.data;
  }

  async deleteProduct(id: number, force = false) {
    const response = await this.client.delete(`/products/${id}`, {
      params: { force },
    });
    return response.data;
  }

  async batchUpdateProducts(data: {
    create?: WCProduct[];
    update?: Array<{ id: number } & Partial<WCProduct>>;
    delete?: number[];
  }) {
    const response = await this.client.post('/products/batch', data);
    return response.data;
  }

  // Product Variations
  async getProductVariations(productId: number, params?: Record<string, any>) {
    const response = await this.client.get(`/products/${productId}/variations`, { params });
    return response.data;
  }

  async getProductVariation(productId: number, variationId: number) {
    const response = await this.client.get(`/products/${productId}/variations/${variationId}`);
    return response.data;
  }

  async createProductVariation(productId: number, variation: any) {
    const response = await this.client.post(`/products/${productId}/variations`, variation);
    return response.data;
  }

  async updateProductVariation(productId: number, variationId: number, variation: any) {
    const response = await this.client.put(`/products/${productId}/variations/${variationId}`, variation);
    return response.data;
  }

  async deleteProductVariation(productId: number, variationId: number, force = false) {
    const response = await this.client.delete(`/products/${productId}/variations/${variationId}`, {
      params: { force },
    });
    return response.data;
  }

  // Product Categories
  async getProductCategories(params?: Record<string, any>) {
    const response = await this.client.get('/products/categories', { params });
    return response.data;
  }

  async getProductCategory(id: number) {
    const response = await this.client.get(`/products/categories/${id}`);
    return response.data;
  }

  async createProductCategory(category: any) {
    const response = await this.client.post('/products/categories', category);
    return response.data;
  }

  async updateProductCategory(id: number, category: any) {
    const response = await this.client.put(`/products/categories/${id}`, category);
    return response.data;
  }

  async deleteProductCategory(id: number, force = false) {
    const response = await this.client.delete(`/products/categories/${id}`, {
      params: { force },
    });
    return response.data;
  }

  // Product Tags
  async getProductTags(params?: Record<string, any>) {
    const response = await this.client.get('/products/tags', { params });
    return response.data;
  }

  async getProductTag(id: number) {
    const response = await this.client.get(`/products/tags/${id}`);
    return response.data;
  }

  async createProductTag(tag: any) {
    const response = await this.client.post('/products/tags', tag);
    return response.data;
  }

  async updateProductTag(id: number, tag: any) {
    const response = await this.client.put(`/products/tags/${id}`, tag);
    return response.data;
  }

  async deleteProductTag(id: number, force = false) {
    const response = await this.client.delete(`/products/tags/${id}`, {
      params: { force },
    });
    return response.data;
  }

  // Orders
  async getOrders(params?: Record<string, any>) {
    const response = await this.client.get('/orders', { params });
    return response.data;
  }

  async getOrder(id: number) {
    const response = await this.client.get(`/orders/${id}`);
    return response.data;
  }

  async createOrder(order: WCOrder) {
    const response = await this.client.post('/orders', order);
    return response.data;
  }

  async updateOrder(id: number, order: Partial<WCOrder>) {
    const response = await this.client.put(`/orders/${id}`, order);
    return response.data;
  }

  async deleteOrder(id: number, force = false) {
    const response = await this.client.delete(`/orders/${id}`, {
      params: { force },
    });
    return response.data;
  }

  async batchUpdateOrders(data: {
    create?: WCOrder[];
    update?: Array<{ id: number } & Partial<WCOrder>>;
    delete?: number[];
  }) {
    const response = await this.client.post('/orders/batch', data);
    return response.data;
  }

  // Order Notes
  async getOrderNotes(orderId: number, params?: Record<string, any>) {
    const response = await this.client.get(`/orders/${orderId}/notes`, { params });
    return response.data;
  }

  async getOrderNote(orderId: number, noteId: number) {
    const response = await this.client.get(`/orders/${orderId}/notes/${noteId}`);
    return response.data;
  }

  async createOrderNote(orderId: number, note: { note: string; customer_note?: boolean }) {
    const response = await this.client.post(`/orders/${orderId}/notes`, note);
    return response.data;
  }

  async deleteOrderNote(orderId: number, noteId: number, force = false) {
    const response = await this.client.delete(`/orders/${orderId}/notes/${noteId}`, {
      params: { force },
    });
    return response.data;
  }

  // Customers
  async getCustomers(params?: Record<string, any>) {
    const response = await this.client.get('/customers', { params });
    return response.data;
  }

  async getCustomer(id: number) {
    const response = await this.client.get(`/customers/${id}`);
    return response.data;
  }

  async createCustomer(customer: WCCustomer) {
    const response = await this.client.post('/customers', customer);
    return response.data;
  }

  async updateCustomer(id: number, customer: Partial<WCCustomer>) {
    const response = await this.client.put(`/customers/${id}`, customer);
    return response.data;
  }

  async deleteCustomer(id: number, force = false, reassign?: number) {
    const params: any = { force };
    if (reassign) params.reassign = reassign;
    
    const response = await this.client.delete(`/customers/${id}`, { params });
    return response.data;
  }

  async batchUpdateCustomers(data: {
    create?: WCCustomer[];
    update?: Array<{ id: number } & Partial<WCCustomer>>;
    delete?: number[];
  }) {
    const response = await this.client.post('/customers/batch', data);
    return response.data;
  }

  // Coupons
  async getCoupons(params?: Record<string, any>) {
    const response = await this.client.get('/coupons', { params });
    return response.data;
  }

  async getCoupon(id: number) {
    const response = await this.client.get(`/coupons/${id}`);
    return response.data;
  }

  async createCoupon(coupon: WCCoupon) {
    const response = await this.client.post('/coupons', coupon);
    return response.data;
  }

  async updateCoupon(id: number, coupon: Partial<WCCoupon>) {
    const response = await this.client.put(`/coupons/${id}`, coupon);
    return response.data;
  }

  async deleteCoupon(id: number, force = false) {
    const response = await this.client.delete(`/coupons/${id}`, {
      params: { force },
    });
    return response.data;
  }

  async batchUpdateCoupons(data: {
    create?: WCCoupon[];
    update?: Array<{ id: number } & Partial<WCCoupon>>;
    delete?: number[];
  }) {
    const response = await this.client.post('/coupons/batch', data);
    return response.data;
  }

  // Reports
  async getSalesReport(params?: Record<string, any>) {
    const response = await this.client.get('/reports/sales', { params });
    return response.data;
  }

  async getTopSellersReport(params?: Record<string, any>) {
    const response = await this.client.get('/reports/top_sellers', { params });
    return response.data;
  }

  async getCouponsReport(params?: Record<string, any>) {
    const response = await this.client.get('/reports/coupons/totals', { params });
    return response.data;
  }

  async getCustomersReport(params?: Record<string, any>) {
    const response = await this.client.get('/reports/customers/totals', { params });
    return response.data;
  }

  async getOrdersReport(params?: Record<string, any>) {
    const response = await this.client.get('/reports/orders/totals', { params });
    return response.data;
  }

  async getProductsReport(params?: Record<string, any>) {
    const response = await this.client.get('/reports/products/totals', { params });
    return response.data;
  }

  async getReviewsReport(params?: Record<string, any>) {
    const response = await this.client.get('/reports/reviews/totals', { params });
    return response.data;
  }

  // Product Reviews
  async getProductReviews(params?: Record<string, any>) {
    const response = await this.client.get('/products/reviews', { params });
    return response.data;
  }

  async getProductReview(id: number) {
    const response = await this.client.get(`/products/reviews/${id}`);
    return response.data;
  }

  async createProductReview(review: any) {
    const response = await this.client.post('/products/reviews', review);
    return response.data;
  }

  async updateProductReview(id: number, review: any) {
    const response = await this.client.put(`/products/reviews/${id}`, review);
    return response.data;
  }

  async deleteProductReview(id: number, force = false) {
    const response = await this.client.delete(`/products/reviews/${id}`, {
      params: { force },
    });
    return response.data;
  }

  // Tax Classes
  async getTaxClasses() {
    const response = await this.client.get('/taxes/classes');
    return response.data;
  }

  async createTaxClass(taxClass: { name: string; slug?: string }) {
    const response = await this.client.post('/taxes/classes', taxClass);
    return response.data;
  }

  async deleteTaxClass(slug: string, force = false) {
    const response = await this.client.delete(`/taxes/classes/${slug}`, {
      params: { force },
    });
    return response.data;
  }

  // Tax Rates
  async getTaxRates(params?: Record<string, any>) {
    const response = await this.client.get('/taxes', { params });
    return response.data;
  }

  async getTaxRate(id: number) {
    const response = await this.client.get(`/taxes/${id}`);
    return response.data;
  }

  async createTaxRate(taxRate: any) {
    const response = await this.client.post('/taxes', taxRate);
    return response.data;
  }

  async updateTaxRate(id: number, taxRate: any) {
    const response = await this.client.put(`/taxes/${id}`, taxRate);
    return response.data;
  }

  async deleteTaxRate(id: number, force = false) {
    const response = await this.client.delete(`/taxes/${id}`, {
      params: { force },
    });
    return response.data;
  }

  // Shipping Zones
  async getShippingZones() {
    const response = await this.client.get('/shipping/zones');
    return response.data;
  }

  async getShippingZone(id: number) {
    const response = await this.client.get(`/shipping/zones/${id}`);
    return response.data;
  }

  async createShippingZone(zone: any) {
    const response = await this.client.post('/shipping/zones', zone);
    return response.data;
  }

  async updateShippingZone(id: number, zone: any) {
    const response = await this.client.put(`/shipping/zones/${id}`, zone);
    return response.data;
  }

  async deleteShippingZone(id: number, force = false) {
    const response = await this.client.delete(`/shipping/zones/${id}`, {
      params: { force },
    });
    return response.data;
  }

  // Shipping Zone Methods
  async getShippingZoneMethods(zoneId: number) {
    const response = await this.client.get(`/shipping/zones/${zoneId}/methods`);
    return response.data;
  }

  async getShippingZoneMethod(zoneId: number, methodId: number) {
    const response = await this.client.get(`/shipping/zones/${zoneId}/methods/${methodId}`);
    return response.data;
  }

  async createShippingZoneMethod(zoneId: number, method: any) {
    const response = await this.client.post(`/shipping/zones/${zoneId}/methods`, method);
    return response.data;
  }

  async updateShippingZoneMethod(zoneId: number, methodId: number, method: any) {
    const response = await this.client.put(`/shipping/zones/${zoneId}/methods/${methodId}`, method);
    return response.data;
  }

  async deleteShippingZoneMethod(zoneId: number, methodId: number, force = false) {
    const response = await this.client.delete(`/shipping/zones/${zoneId}/methods/${methodId}`, {
      params: { force },
    });
    return response.data;
  }

  // Payment Gateways
  async getPaymentGateways() {
    const response = await this.client.get('/payment_gateways');
    return response.data;
  }

  async getPaymentGateway(id: string) {
    const response = await this.client.get(`/payment_gateways/${id}`);
    return response.data;
  }

  async updatePaymentGateway(id: string, gateway: any) {
    const response = await this.client.put(`/payment_gateways/${id}`, gateway);
    return response.data;
  }

  // System Status
  async getSystemStatus() {
    const response = await this.client.get('/system_status');
    return response.data;
  }

  async getSystemStatusTools() {
    const response = await this.client.get('/system_status/tools');
    return response.data;
  }

  async runSystemStatusTool(id: string) {
    const response = await this.client.put(`/system_status/tools/${id}`);
    return response.data;
  }

  // Settings
  async getSettings() {
    const response = await this.client.get('/settings');
    return response.data;
  }

  async getSettingGroup(groupId: string) {
    const response = await this.client.get(`/settings/${groupId}`);
    return response.data;
  }

  async getSettingOption(groupId: string, optionId: string) {
    const response = await this.client.get(`/settings/${groupId}/${optionId}`);
    return response.data;
  }

  async updateSettingOption(groupId: string, optionId: string, option: any) {
    const response = await this.client.put(`/settings/${groupId}/${optionId}`, option);
    return response.data;
  }

  async batchUpdateSettingGroup(groupId: string, options: any[]) {
    const response = await this.client.post(`/settings/${groupId}/batch`, {
      update: options,
    });
    return response.data;
  }

  // Webhooks
  async getWebhooks(params?: Record<string, any>) {
    const response = await this.client.get('/webhooks', { params });
    return response.data;
  }

  async getWebhook(id: number) {
    const response = await this.client.get(`/webhooks/${id}`);
    return response.data;
  }

  async createWebhook(webhook: any) {
    const response = await this.client.post('/webhooks', webhook);
    return response.data;
  }

  async updateWebhook(id: number, webhook: any) {
    const response = await this.client.put(`/webhooks/${id}`, webhook);
    return response.data;
  }

  async deleteWebhook(id: number, force = false) {
    const response = await this.client.delete(`/webhooks/${id}`, {
      params: { force },
    });
    return response.data;
  }
}