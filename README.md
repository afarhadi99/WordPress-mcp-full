# WordPress + WooCommerce MCP Server

A comprehensive Model Context Protocol (MCP) server for interacting with WordPress and WooCommerce REST APIs. This server provides tools for managing all aspects of a WordPress site and WooCommerce store.

## Features

### WordPress REST API Support
- **Posts**: Create, read, update, delete posts with full metadata support
- **Pages**: Manage WordPress pages including hierarchical structures
- **Users**: User management with role-based access control
- **Categories & Tags**: Taxonomy management for content organization
- **Comments**: Comment moderation and management
- **Media**: Media library management and file operations
- **Menus**: Navigation menu access and management
- **Settings**: Site settings configuration
- **Search**: Content search across all post types

### WooCommerce REST API Support
- **Products**: Complete product management including variations, categories, and tags
- **Orders**: Order processing, status updates, and order notes
- **Customers**: Customer account management and data
- **Coupons**: Discount code creation and management
- **Reports**: Sales analytics and business intelligence
- **Reviews**: Product review management
- **Tax Management**: Tax classes and rates configuration
- **Shipping**: Shipping zones and methods setup
- **Payment Gateways**: Payment method configuration
- **System Status**: Store health monitoring and diagnostic tools
- **Settings**: Store configuration management
- **Webhooks**: Event-driven integrations

## Configuration

This MCP requires three configuration parameters:

- `wordpressUrl`: Your WordPress site URL (e.g., `https://yourdomain.com`)
- `username`: Your WordPress username
- `applicationPassword`: WordPress application password (not regular password)

### Setting up WordPress Application Password

1. Go to your WordPress admin dashboard
2. Navigate to Users → Profile
3. Scroll down to "Application Passwords"
4. Enter a name for your application (e.g., "MCP Server")
5. Click "Add New Application Password"
6. Copy the generated password and use it as `applicationPassword`

## Available Tools

### WordPress Tools (wp_*)
- Post management: `wp_get_posts`, `wp_create_post`, `wp_update_post`, `wp_delete_post`
- Page management: `wp_get_pages`, `wp_create_page`, `wp_update_page`, `wp_delete_page`
- User management: `wp_get_users`, `wp_create_user`, `wp_update_user`, `wp_delete_user`
- Category management: `wp_get_categories`, `wp_create_category`, `wp_update_category`, `wp_delete_category`
- Tag management: `wp_get_tags`, `wp_create_tag`, `wp_update_tag`, `wp_delete_tag`
- Comment management: `wp_get_comments`, `wp_create_comment`, `wp_update_comment`, `wp_delete_comment`
- Media management: `wp_get_media`, `wp_get_media_item`, `wp_update_media_item`, `wp_delete_media_item`
- Menu access: `wp_get_menus`, `wp_get_menu`
- Settings: `wp_get_settings`, `wp_update_settings`
- Search: `wp_search`

### WooCommerce Tools (wc_*)
- Product management: `wc_get_products`, `wc_create_product`, `wc_update_product`, `wc_delete_product`, `wc_batch_update_products`
- Product variations: `wc_get_product_variations`, `wc_create_product_variation`, etc.
- Product categories: `wc_get_product_categories`, `wc_create_product_category`, etc.
- Product tags: `wc_get_product_tags`, `wc_create_product_tag`, etc.
- Order management: `wc_get_orders`, `wc_create_order`, `wc_update_order`, `wc_delete_order`, `wc_batch_update_orders`
- Order notes: `wc_get_order_notes`, `wc_create_order_note`, `wc_delete_order_note`
- Customer management: `wc_get_customers`, `wc_create_customer`, `wc_update_customer`, `wc_delete_customer`
- Coupon management: `wc_get_coupons`, `wc_create_coupon`, `wc_update_coupon`, `wc_delete_coupon`
- Reports: `wc_get_sales_report`, `wc_get_top_sellers_report`, etc.
- Product reviews: `wc_get_product_reviews`, `wc_create_product_review`, etc.
- Tax management: `wc_get_tax_classes`, `wc_get_tax_rates`, etc.
- Shipping: `wc_get_shipping_zones`, `wc_get_shipping_zone_methods`, etc.
- Payment gateways: `wc_get_payment_gateways`, `wc_update_payment_gateway`
- System status: `wc_get_system_status`, `wc_run_system_status_tool`
- Settings: `wc_get_settings`, `wc_update_setting_option`, etc.
- Webhooks: `wc_get_webhooks`, `wc_create_webhook`, etc.

## Example Usage

### Creating a WordPress Post
```json
{
  "tool": "wp_create_post",
  "arguments": {
    "title": "My New Blog Post",
    "content": "This is the content of my blog post.",
    "status": "publish",
    "categories": [1, 2],
    "tags": [3, 4]
  }
}