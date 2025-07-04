import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { WordPressService } from './services/wordpress.js';
import { WooCommerceService } from './services/woocommerce.js';
import { WordPressConfig } from './types.js';

// Helper functions
function getString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function getNumber(value: unknown): number {
  return typeof value === 'number' ? value : 0;
}

function getBoolean(value: unknown): boolean {
  return typeof value === 'boolean' ? value : false;
}

function getArray(value: unknown): any[] {
  return Array.isArray(value) ? value : [];
}

function getObject(value: unknown): Record<string, any> {
  return typeof value === 'object' && value !== null ? value as Record<string, any> : {};
}

// Configuration from environment variables (set by Smithery via commandFunction)
function parseConfig(): WordPressConfig {
  const config = {
    wordpressUrl: process.env.WORDPRESS_URL || '',
    username: process.env.USERNAME || '',
    applicationPassword: process.env.APPLICATION_PASSWORD || '',
  };

  if (!config.wordpressUrl || !config.username || !config.applicationPassword) {
    throw new Error('Missing required configuration: WORDPRESS_URL, USERNAME, and APPLICATION_PASSWORD environment variables are required');
  }

  return config;
}

// Complete tools array with ALL WordPress and WooCommerce tools
const tools: Tool[] = [
  // WordPress Posts
  {
    name: 'wp_get_posts',
    description: 'Get WordPress posts with optional filtering parameters',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number for pagination' },
        per_page: { type: 'number', description: 'Number of posts per page (default: 10, max: 100)' },
        search: { type: 'string', description: 'Search term' },
        author: { type: 'number', description: 'Author ID' },
        categories: { type: 'string', description: 'Comma-separated category IDs' },
        tags: { type: 'string', description: 'Comma-separated tag IDs' },
        status: { type: 'string', description: 'Post status (publish, draft, private, etc.)' },
        orderby: { type: 'string', description: 'Sort posts by (date, title, etc.)' },
        order: { type: 'string', description: 'Sort order (asc, desc)' },
      },
    },
  },
  {
    name: 'wp_get_post',
    description: 'Get a specific WordPress post by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Post ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'wp_create_post',
    description: 'Create a new WordPress post',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Post title' },
        content: { type: 'string', description: 'Post content' },
        excerpt: { type: 'string', description: 'Post excerpt' },
        status: { type: 'string', description: 'Post status (draft, publish, private, etc.)' },
        author: { type: 'number', description: 'Author ID' },
        featured_media: { type: 'number', description: 'Featured image ID' },
        categories: { type: 'array', items: { type: 'number' }, description: 'Category IDs' },
        tags: { type: 'array', items: { type: 'number' }, description: 'Tag IDs' },
        slug: { type: 'string', description: 'Post slug' },
        comment_status: { type: 'string', description: 'Comment status (open, closed)' },
        ping_status: { type: 'string', description: 'Ping status (open, closed)' },
        sticky: { type: 'boolean', description: 'Whether post is sticky' },
        format: { type: 'string', description: 'Post format' },
      },
      required: ['title', 'content'],
    },
  },
  {
    name: 'wp_update_post',
    description: 'Update an existing WordPress post',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Post ID' },
        title: { type: 'string', description: 'Post title' },
        content: { type: 'string', description: 'Post content' },
        excerpt: { type: 'string', description: 'Post excerpt' },
        status: { type: 'string', description: 'Post status' },
        author: { type: 'number', description: 'Author ID' },
        featured_media: { type: 'number', description: 'Featured image ID' },
        categories: { type: 'array', items: { type: 'number' }, description: 'Category IDs' },
        tags: { type: 'array', items: { type: 'number' }, description: 'Tag IDs' },
        slug: { type: 'string', description: 'Post slug' },
        comment_status: { type: 'string', description: 'Comment status' },
        ping_status: { type: 'string', description: 'Ping status' },
        sticky: { type: 'boolean', description: 'Whether post is sticky' },
        format: { type: 'string', description: 'Post format' },
      },
      required: ['id'],
    },
  },
  {
    name: 'wp_delete_post',
    description: 'Delete a WordPress post',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Post ID' },
        force: { type: 'boolean', description: 'Whether to bypass trash and force deletion' },
      },
      required: ['id'],
    },
  },

  // WordPress Pages
  {
    name: 'wp_get_pages',
    description: 'Get WordPress pages with optional filtering parameters',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number for pagination' },
        per_page: { type: 'number', description: 'Number of pages per page' },
        search: { type: 'string', description: 'Search term' },
        author: { type: 'number', description: 'Author ID' },
        parent: { type: 'number', description: 'Parent page ID' },
        status: { type: 'string', description: 'Page status' },
        orderby: { type: 'string', description: 'Sort pages by' },
        order: { type: 'string', description: 'Sort order' },
      },
    },
  },
  {
    name: 'wp_get_page',
    description: 'Get a specific WordPress page by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Page ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'wp_create_page',
    description: 'Create a new WordPress page',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Page title' },
        content: { type: 'string', description: 'Page content' },
        excerpt: { type: 'string', description: 'Page excerpt' },
        status: { type: 'string', description: 'Page status' },
        author: { type: 'number', description: 'Author ID' },
        featured_media: { type: 'number', description: 'Featured image ID' },
        parent: { type: 'number', description: 'Parent page ID' },
        menu_order: { type: 'number', description: 'Menu order' },
        comment_status: { type: 'string', description: 'Comment status' },
        ping_status: { type: 'string', description: 'Ping status' },
        slug: { type: 'string', description: 'Page slug' },
        template: { type: 'string', description: 'Page template' },
      },
      required: ['title', 'content'],
    },
  },
  {
    name: 'wp_update_page',
    description: 'Update an existing WordPress page',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Page ID' },
        title: { type: 'string', description: 'Page title' },
        content: { type: 'string', description: 'Page content' },
        excerpt: { type: 'string', description: 'Page excerpt' },
        status: { type: 'string', description: 'Page status' },
        author: { type: 'number', description: 'Author ID' },
        featured_media: { type: 'number', description: 'Featured image ID' },
        parent: { type: 'number', description: 'Parent page ID' },
        menu_order: { type: 'number', description: 'Menu order' },
        comment_status: { type: 'string', description: 'Comment status' },
        ping_status: { type: 'string', description: 'Ping status' },
        slug: { type: 'string', description: 'Page slug' },
        template: { type: 'string', description: 'Page template' },
      },
      required: ['id'],
    },
  },
  {
    name: 'wp_delete_page',
    description: 'Delete a WordPress page',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Page ID' },
        force: { type: 'boolean', description: 'Whether to bypass trash and force deletion' },
      },
      required: ['id'],
    },
  },

  // WordPress Users
  {
    name: 'wp_get_users',
    description: 'Get WordPress users with optional filtering parameters',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number for pagination' },
        per_page: { type: 'number', description: 'Number of users per page' },
        search: { type: 'string', description: 'Search term' },
        roles: { type: 'string', description: 'User roles (comma-separated)' },
        orderby: { type: 'string', description: 'Sort users by' },
        order: { type: 'string', description: 'Sort order' },
      },
    },
  },
  {
    name: 'wp_get_user',
    description: 'Get a specific WordPress user by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'User ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'wp_create_user',
    description: 'Create a new WordPress user',
    inputSchema: {
      type: 'object',
      properties: {
        username: { type: 'string', description: 'Username' },
        email: { type: 'string', description: 'Email address' },
        password: { type: 'string', description: 'Password' },
        name: { type: 'string', description: 'Display name' },
        first_name: { type: 'string', description: 'First name' },
        last_name: { type: 'string', description: 'Last name' },
        url: { type: 'string', description: 'Website URL' },
        description: { type: 'string', description: 'User description' },
        nickname: { type: 'string', description: 'Nickname' },
        slug: { type: 'string', description: 'User slug' },
        roles: { type: 'array', items: { type: 'string' }, description: 'User roles' },
      },
      required: ['username', 'email', 'password'],
    },
  },
  {
    name: 'wp_update_user',
    description: 'Update an existing WordPress user',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'User ID' },
        username: { type: 'string', description: 'Username' },
        email: { type: 'string', description: 'Email address' },
        password: { type: 'string', description: 'Password' },
        name: { type: 'string', description: 'Display name' },
        first_name: { type: 'string', description: 'First name' },
        last_name: { type: 'string', description: 'Last name' },
        url: { type: 'string', description: 'Website URL' },
        description: { type: 'string', description: 'User description' },
        nickname: { type: 'string', description: 'Nickname' },
        slug: { type: 'string', description: 'User slug' },
        roles: { type: 'array', items: { type: 'string' }, description: 'User roles' },
      },
      required: ['id'],
    },
  },
  {
    name: 'wp_delete_user',
    description: 'Delete a WordPress user',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'User ID' },
        reassign: { type: 'number', description: 'User ID to reassign content to' },
      },
      required: ['id'],
    },
  },

  // WordPress Categories
  {
    name: 'wp_get_categories',
    description: 'Get WordPress categories',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number for pagination' },
        per_page: { type: 'number', description: 'Number of categories per page' },
        search: { type: 'string', description: 'Search term' },
        parent: { type: 'number', description: 'Parent category ID' },
        orderby: { type: 'string', description: 'Sort categories by' },
        order: { type: 'string', description: 'Sort order' },
      },
    },
  },
  {
    name: 'wp_get_category',
    description: 'Get a specific WordPress category by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Category ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'wp_create_category',
    description: 'Create a new WordPress category',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Category name' },
        description: { type: 'string', description: 'Category description' },
        slug: { type: 'string', description: 'Category slug' },
        parent: { type: 'number', description: 'Parent category ID' },
      },
      required: ['name'],
    },
  },
  {
    name: 'wp_update_category',
    description: 'Update an existing WordPress category',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Category ID' },
        name: { type: 'string', description: 'Category name' },
        description: { type: 'string', description: 'Category description' },
        slug: { type: 'string', description: 'Category slug' },
        parent: { type: 'number', description: 'Parent category ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'wp_delete_category',
    description: 'Delete a WordPress category',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Category ID' },
        force: { type: 'boolean', description: 'Whether to force delete' },
      },
      required: ['id'],
    },
  },

  // WordPress Tags
  {
    name: 'wp_get_tags',
    description: 'Get WordPress tags',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number for pagination' },
        per_page: { type: 'number', description: 'Number of tags per page' },
        search: { type: 'string', description: 'Search term' },
        orderby: { type: 'string', description: 'Sort tags by' },
        order: { type: 'string', description: 'Sort order' },
      },
    },
  },
  {
    name: 'wp_get_tag',
    description: 'Get a specific WordPress tag by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Tag ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'wp_create_tag',
    description: 'Create a new WordPress tag',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Tag name' },
        description: { type: 'string', description: 'Tag description' },
        slug: { type: 'string', description: 'Tag slug' },
      },
      required: ['name'],
    },
  },
  {
    name: 'wp_update_tag',
    description: 'Update an existing WordPress tag',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Tag ID' },
        name: { type: 'string', description: 'Tag name' },
        description: { type: 'string', description: 'Tag description' },
        slug: { type: 'string', description: 'Tag slug' },
      },
      required: ['id'],
    },
  },
  {
    name: 'wp_delete_tag',
    description: 'Delete a WordPress tag',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Tag ID' },
        force: { type: 'boolean', description: 'Whether to force delete' },
      },
      required: ['id'],
    },
  },

  // WordPress Comments
  {
    name: 'wp_get_comments',
    description: 'Get WordPress comments',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number for pagination' },
        per_page: { type: 'number', description: 'Number of comments per page' },
        search: { type: 'string', description: 'Search term' },
        post: { type: 'number', description: 'Post ID' },
        author: { type: 'number', description: 'Author ID' },
        author_email: { type: 'string', description: 'Author email' },
        status: { type: 'string', description: 'Comment status' },
        type: { type: 'string', description: 'Comment type' },
        orderby: { type: 'string', description: 'Sort comments by' },
        order: { type: 'string', description: 'Sort order' },
      },
    },
  },
  {
    name: 'wp_get_comment',
    description: 'Get a specific WordPress comment by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Comment ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'wp_create_comment',
    description: 'Create a new WordPress comment',
    inputSchema: {
      type: 'object',
      properties: {
        post: { type: 'number', description: 'Post ID' },
        content: { type: 'string', description: 'Comment content' },
        author: { type: 'number', description: 'Author ID' },
        author_name: { type: 'string', description: 'Author name' },
        author_email: { type: 'string', description: 'Author email' },
        author_url: { type: 'string', description: 'Author URL' },
        parent: { type: 'number', description: 'Parent comment ID' },
        status: { type: 'string', description: 'Comment status' },
        type: { type: 'string', description: 'Comment type' },
      },
      required: ['post', 'content'],
    },
  },
  {
    name: 'wp_update_comment',
    description: 'Update an existing WordPress comment',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Comment ID' },
        content: { type: 'string', description: 'Comment content' },
        author: { type: 'number', description: 'Author ID' },
        author_name: { type: 'string', description: 'Author name' },
        author_email: { type: 'string', description: 'Author email' },
        author_url: { type: 'string', description: 'Author URL' },
        status: { type: 'string', description: 'Comment status' },
        type: { type: 'string', description: 'Comment type' },
      },
      required: ['id'],
    },
  },
  {
    name: 'wp_delete_comment',
    description: 'Delete a WordPress comment',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Comment ID' },
        force: { type: 'boolean', description: 'Whether to force delete (skip trash)' },
      },
      required: ['id'],
    },
  },

  // WordPress Media
  {
    name: 'wp_get_media',
    description: 'Get WordPress media items',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number for pagination' },
        per_page: { type: 'number', description: 'Number of media items per page' },
        search: { type: 'string', description: 'Search term' },
        author: { type: 'number', description: 'Author ID' },
        media_type: { type: 'string', description: 'Media type (image, video, audio, etc.)' },
        mime_type: { type: 'string', description: 'MIME type' },
        orderby: { type: 'string', description: 'Sort media by' },
        order: { type: 'string', description: 'Sort order' },
      },
    },
  },
  {
    name: 'wp_get_media_item',
    description: 'Get a specific WordPress media item by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Media ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'wp_update_media_item',
    description: 'Update an existing WordPress media item',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Media ID' },
        title: { type: 'string', description: 'Media title' },
        alt_text: { type: 'string', description: 'Alt text' },
        caption: { type: 'string', description: 'Caption' },
        description: { type: 'string', description: 'Description' },
      },
      required: ['id'],
    },
  },
  {
    name: 'wp_delete_media_item',
    description: 'Delete a WordPress media item',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Media ID' },
        force: { type: 'boolean', description: 'Whether to force delete' },
      },
      required: ['id'],
    },
  },

  {
  name: 'wp_upload_media',
  description: 'Upload a file to WordPress media library',
  inputSchema: {
    type: 'object',
    properties: {
      filename: { type: 'string', description: 'Name of the file including extension' },
      content: { type: 'string', description: 'Base64 encoded file content' },
      content_type: { type: 'string', description: 'MIME type of the file (e.g., image/jpeg, image/png)' },
      title: { type: 'string', description: 'Media title' },
      alt_text: { type: 'string', description: 'Alt text for the image' },
      caption: { type: 'string', description: 'Media caption' },
      description: { type: 'string', description: 'Media description' },
    },
    required: ['filename', 'content', 'content_type'],
  },
},

  // WordPress Menus
  {
    name: 'wp_get_menus',
    description: 'Get WordPress menus',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'wp_get_menu',
    description: 'Get a specific WordPress menu by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Menu ID' },
      },
      required: ['id'],
    },
  },

  // WordPress Settings
  {
    name: 'wp_get_settings',
    description: 'Get WordPress settings',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'wp_update_settings',
    description: 'Update WordPress settings',
    inputSchema: {
      type: 'object',
      properties: {
        settings: { type: 'object', description: 'Settings object' },
      },
      required: ['settings'],
    },
  },

  // WordPress Search
  {
    name: 'wp_search',
    description: 'Search WordPress content',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        type: { type: 'string', description: 'Content type to search (post, page, etc.)' },
        subtype: { type: 'string', description: 'Content subtype' },
      },
      required: ['query'],
    },
  },

  // WooCommerce Products
  {
    name: 'wc_get_products',
    description: 'Get WooCommerce products with optional filtering parameters',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number for pagination' },
        per_page: { type: 'number', description: 'Number of products per page' },
        search: { type: 'string', description: 'Search term' },
        category: { type: 'string', description: 'Product category slug' },
        tag: { type: 'string', description: 'Product tag slug' },
        status: { type: 'string', description: 'Product status' },
        type: { type: 'string', description: 'Product type' },
        featured: { type: 'boolean', description: 'Filter by featured products' },
        on_sale: { type: 'boolean', description: 'Filter by products on sale' },
        min_price: { type: 'string', description: 'Minimum price' },
        max_price: { type: 'string', description: 'Maximum price' },
        stock_status: { type: 'string', description: 'Stock status' },
        orderby: { type: 'string', description: 'Sort products by' },
        order: { type: 'string', description: 'Sort order' },
      },
    },
  },
  {
    name: 'wc_get_product',
    description: 'Get a specific WooCommerce product by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Product ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'wc_create_product',
    description: 'Create a new WooCommerce product',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Product name' },
        type: { type: 'string', description: 'Product type (simple, grouped, external, variable)' },
        status: { type: 'string', description: 'Product status' },
        featured: { type: 'boolean', description: 'Featured product' },
        catalog_visibility: { type: 'string', description: 'Catalog visibility' },
        description: { type: 'string', description: 'Product description' },
        short_description: { type: 'string', description: 'Product short description' },
        sku: { type: 'string', description: 'Product SKU' },
        regular_price: { type: 'string', description: 'Regular price' },
        sale_price: { type: 'string', description: 'Sale price' },
        manage_stock: { type: 'boolean', description: 'Manage stock' },
        stock_quantity: { type: 'number', description: 'Stock quantity' },
        stock_status: { type: 'string', description: 'Stock status' },
        backorders: { type: 'string', description: 'Backorders setting' },
        weight: { type: 'string', description: 'Product weight' },
        length: { type: 'string', description: 'Product length' },
        width: { type: 'string', description: 'Product width' },
        height: { type: 'string', description: 'Product height' },
        categories: { type: 'array', items: { type: 'object' }, description: 'Product categories' },
        tags: { type: 'array', items: { type: 'object' }, description: 'Product tags' },
        images: { type: 'array', items: { type: 'object' }, description: 'Product images' },
        attributes: { type: 'array', items: { type: 'object' }, description: 'Product attributes' },
      },
      required: ['name'],
    },
  },
  {
    name: 'wc_update_product',
    description: 'Update an existing WooCommerce product',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Product ID' },
        name: { type: 'string', description: 'Product name' },
        type: { type: 'string', description: 'Product type' },
        status: { type: 'string', description: 'Product status' },
        featured: { type: 'boolean', description: 'Featured product' },
        catalog_visibility: { type: 'string', description: 'Catalog visibility' },
        description: { type: 'string', description: 'Product description' },
        short_description: { type: 'string', description: 'Product short description' },
        sku: { type: 'string', description: 'Product SKU' },
        regular_price: { type: 'string', description: 'Regular price' },
        sale_price: { type: 'string', description: 'Sale price' },
        manage_stock: { type: 'boolean', description: 'Manage stock' },
        stock_quantity: { type: 'number', description: 'Stock quantity' },
        stock_status: { type: 'string', description: 'Stock status' },
        backorders: { type: 'string', description: 'Backorders setting' },
        weight: { type: 'string', description: 'Product weight' },
        categories: { type: 'array', items: { type: 'object' }, description: 'Product categories' },
        tags: { type: 'array', items: { type: 'object' }, description: 'Product tags' },
        images: { type: 'array', items: { type: 'object' }, description: 'Product images' },
        attributes: { type: 'array', items: { type: 'object' }, description: 'Product attributes' },
      },
      required: ['id'],
    },
  },
  {
    name: 'wc_delete_product',
    description: 'Delete a WooCommerce product',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Product ID' },
        force: { type: 'boolean', description: 'Whether to force delete (skip trash)' },
      },
      required: ['id'],
    },
  },
  {
    name: 'wc_batch_update_products',
    description: 'Batch update WooCommerce products',
    inputSchema: {
      type: 'object',
      properties: {
        create: { type: 'array', description: 'Products to create' },
        update: { type: 'array', description: 'Products to update' },
        delete: { type: 'array', description: 'Product IDs to delete' },
      },
    },
  },

  // WooCommerce Product Variations
  {
    name: 'wc_get_product_variations',
    description: 'Get variations for a variable WooCommerce product',
    inputSchema: {
      type: 'object',
      properties: {
        product_id: { type: 'number', description: 'Product ID' },
        page: { type: 'number', description: 'Page number for pagination' },
        per_page: { type: 'number', description: 'Number of variations per page' },
      },
      required: ['product_id'],
    },
  },
  {
    name: 'wc_get_product_variation',
    description: 'Get a specific product variation',
    inputSchema: {
      type: 'object',
      properties: {
        product_id: { type: 'number', description: 'Product ID' },
        variation_id: { type: 'number', description: 'Variation ID' },
      },
      required: ['product_id', 'variation_id'],
    },
  },
  {
    name: 'wc_create_product_variation',
    description: 'Create a new product variation',
    inputSchema: {
      type: 'object',
      properties: {
        product_id: { type: 'number', description: 'Product ID' },
        variation: { type: 'object', description: 'Variation data' },
      },
      required: ['product_id', 'variation'],
    },
  },
  {
    name: 'wc_update_product_variation',
    description: 'Update a product variation',
    inputSchema: {
      type: 'object',
      properties: {
        product_id: { type: 'number', description: 'Product ID' },
        variation_id: { type: 'number', description: 'Variation ID' },
        variation: { type: 'object', description: 'Variation data' },
      },
      required: ['product_id', 'variation_id', 'variation'],
    },
  },
  {
    name: 'wc_delete_product_variation',
    description: 'Delete a product variation',
    inputSchema: {
      type: 'object',
      properties: {
        product_id: { type: 'number', description: 'Product ID' },
        variation_id: { type: 'number', description: 'Variation ID' },
        force: { type: 'boolean', description: 'Whether to force delete' },
      },
      required: ['product_id', 'variation_id'],
    },
  },

  // WooCommerce Product Categories
  {
    name: 'wc_get_product_categories',
    description: 'Get WooCommerce product categories',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number for pagination' },
        per_page: { type: 'number', description: 'Number of categories per page' },
        search: { type: 'string', description: 'Search term' },
        parent: { type: 'number', description: 'Parent category ID' },
        orderby: { type: 'string', description: 'Sort categories by' },
        order: { type: 'string', description: 'Sort order' },
      },
    },
  },
  {
    name: 'wc_get_product_category',
    description: 'Get a specific WooCommerce product category by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Category ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'wc_create_product_category',
    description: 'Create a new WooCommerce product category',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Category name' },
        slug: { type: 'string', description: 'Category slug' },
        parent: { type: 'number', description: 'Parent category ID' },
        description: { type: 'string', description: 'Category description' },
        display: { type: 'string', description: 'Category display type' },
        image: { type: 'object', description: 'Category image' },
        menu_order: { type: 'number', description: 'Menu order' },
      },
      required: ['name'],
    },
  },
  {
    name: 'wc_update_product_category',
    description: 'Update an existing WooCommerce product category',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Category ID' },
        name: { type: 'string', description: 'Category name' },
        slug: { type: 'string', description: 'Category slug' },
        parent: { type: 'number', description: 'Parent category ID' },
        description: { type: 'string', description: 'Category description' },
        display: { type: 'string', description: 'Category display type' },
        image: { type: 'object', description: 'Category image' },
        menu_order: { type: 'number', description: 'Menu order' },
      },
      required: ['id'],
    },
  },
  {
    name: 'wc_delete_product_category',
    description: 'Delete a WooCommerce product category',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Category ID' },
        force: { type: 'boolean', description: 'Whether to force delete' },
      },
      required: ['id'],
    },
  },

  // WooCommerce Product Tags
  {
    name: 'wc_get_product_tags',
    description: 'Get WooCommerce product tags',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number for pagination' },
        per_page: { type: 'number', description: 'Number of tags per page' },
        search: { type: 'string', description: 'Search term' },
        orderby: { type: 'string', description: 'Sort tags by' },
        order: { type: 'string', description: 'Sort order' },
      },
    },
  },
  {
    name: 'wc_get_product_tag',
    description: 'Get a specific WooCommerce product tag by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Tag ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'wc_create_product_tag',
    description: 'Create a new WooCommerce product tag',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Tag name' },
        slug: { type: 'string', description: 'Tag slug' },
        description: { type: 'string', description: 'Tag description' },
      },
      required: ['name'],
    },
  },
  {
    name: 'wc_update_product_tag',
    description: 'Update an existing WooCommerce product tag',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Tag ID' },
        name: { type: 'string', description: 'Tag name' },
        slug: { type: 'string', description: 'Tag slug' },
        description: { type: 'string', description: 'Tag description' },
      },
      required: ['id'],
    },
  },
  {
    name: 'wc_delete_product_tag',
    description: 'Delete a WooCommerce product tag',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Tag ID' },
        force: { type: 'boolean', description: 'Whether to force delete' },
      },
      required: ['id'],
    },
  },

  // WooCommerce Orders
  {
    name: 'wc_get_orders',
    description: 'Get WooCommerce orders with optional filtering parameters',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number for pagination' },
        per_page: { type: 'number', description: 'Number of orders per page' },
        search: { type: 'string', description: 'Search term' },
        after: { type: 'string', description: 'Orders created after this date (ISO 8601)' },
        before: { type: 'string', description: 'Orders created before this date (ISO 8601)' },
        status: { type: 'string', description: 'Order status' },
        customer: { type: 'number', description: 'Customer ID' },
        product: { type: 'number', description: 'Product ID' },
        orderby: { type: 'string', description: 'Sort orders by' },
        order: { type: 'string', description: 'Sort order' },
      },
    },
  },
  {
    name: 'wc_get_order',
    description: 'Get a specific WooCommerce order by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Order ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'wc_create_order',
    description: 'Create a new WooCommerce order',
    inputSchema: {
      type: 'object',
      properties: {
        payment_method: { type: 'string', description: 'Payment method' },
        payment_method_title: { type: 'string', description: 'Payment method title' },
        set_paid: { type: 'boolean', description: 'Mark order as paid' },
        billing: { type: 'object', description: 'Billing address' },
        shipping: { type: 'object', description: 'Shipping address' },
        line_items: { type: 'array', description: 'Order line items' },
        shipping_lines: { type: 'array', description: 'Shipping lines' },
        fee_lines: { type: 'array', description: 'Fee lines' },
        coupon_lines: { type: 'array', description: 'Coupon lines' },
        status: { type: 'string', description: 'Order status' },
        currency: { type: 'string', description: 'Order currency' },
        customer_id: { type: 'number', description: 'Customer ID' },
        customer_note: { type: 'string', description: 'Customer note' },
      },
      required: ['line_items'],
    },
  },
  {
    name: 'wc_update_order',
    description: 'Update an existing WooCommerce order',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Order ID' },
        status: { type: 'string', description: 'Order status' },
        billing: { type: 'object', description: 'Billing address' },
        shipping: { type: 'object', description: 'Shipping address' },
        line_items: { type: 'array', description: 'Order line items' },
        shipping_lines: { type: 'array', description: 'Shipping lines' },
        fee_lines: { type: 'array', description: 'Fee lines' },
        coupon_lines: { type: 'array', description: 'Coupon lines' },
        customer_note: { type: 'string', description: 'Customer note' },
      },
      required: ['id'],
    },
  },
  {
    name: 'wc_delete_order',
    description: 'Delete a WooCommerce order',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Order ID' },
        force: { type: 'boolean', description: 'Whether to force delete (skip trash)' },
      },
      required: ['id'],
    },
  },
  {
    name: 'wc_batch_update_orders',
    description: 'Batch update WooCommerce orders',
    inputSchema: {
      type: 'object',
      properties: {
        create: { type: 'array', description: 'Orders to create' },
        update: { type: 'array', description: 'Orders to update' },
        delete: { type: 'array', description: 'Order IDs to delete' },
      },
    },
  },

  // WooCommerce Order Notes
  {
    name: 'wc_get_order_notes',
    description: 'Get notes for a WooCommerce order',
    inputSchema: {
      type: 'object',
      properties: {
        order_id: { type: 'number', description: 'Order ID' },
        type: { type: 'string', description: 'Note type (customer, internal, any)' },
      },
      required: ['order_id'],
    },
  },
  {
    name: 'wc_get_order_note',
    description: 'Get a specific order note',
    inputSchema: {
      type: 'object',
      properties: {
        order_id: { type: 'number', description: 'Order ID' },
        note_id: { type: 'number', description: 'Note ID' },
      },
      required: ['order_id', 'note_id'],
    },
  },
  {
    name: 'wc_create_order_note',
    description: 'Create a new order note',
    inputSchema: {
      type: 'object',
      properties: {
        order_id: { type: 'number', description: 'Order ID' },
        note: { type: 'string', description: 'Note content' },
        customer_note: { type: 'boolean', description: 'Whether note is visible to customer' },
      },
      required: ['order_id', 'note'],
    },
  },
  {
    name: 'wc_delete_order_note',
    description: 'Delete an order note',
    inputSchema: {
      type: 'object',
      properties: {
        order_id: { type: 'number', description: 'Order ID' },
        note_id: { type: 'number', description: 'Note ID' },
        force: { type: 'boolean', description: 'Whether to force delete' },
      },
      required: ['order_id', 'note_id'],
    },
  },

  // WooCommerce Customers
  {
    name: 'wc_get_customers',
    description: 'Get WooCommerce customers with optional filtering parameters',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number for pagination' },
        per_page: { type: 'number', description: 'Number of customers per page' },
        search: { type: 'string', description: 'Search term' },
        email: { type: 'string', description: 'Customer email' },
        role: { type: 'string', description: 'Customer role' },
        orderby: { type: 'string', description: 'Sort customers by' },
        order: { type: 'string', description: 'Sort order' },
      },
    },
  },
  {
    name: 'wc_get_customer',
    description: 'Get a specific WooCommerce customer by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Customer ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'wc_create_customer',
    description: 'Create a new WooCommerce customer',
    inputSchema: {
      type: 'object',
      properties: {
        email: { type: 'string', description: 'Customer email' },
        first_name: { type: 'string', description: 'Customer first name' },
        last_name: { type: 'string', description: 'Customer last name' },
        username: { type: 'string', description: 'Customer username' },
        password: { type: 'string', description: 'Customer password' },
        billing: { type: 'object', description: 'Billing address' },
        shipping: { type: 'object', description: 'Shipping address' },
      },
      required: ['email'],
    },
  },
  {
    name: 'wc_update_customer',
    description: 'Update an existing WooCommerce customer',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Customer ID' },
        email: { type: 'string', description: 'Customer email' },
        first_name: { type: 'string', description: 'Customer first name' },
        last_name: { type: 'string', description: 'Customer last name' },
        username: { type: 'string', description: 'Customer username' },
        password: { type: 'string', description: 'Customer password' },
        billing: { type: 'object', description: 'Billing address' },
        shipping: { type: 'object', description: 'Shipping address' },
      },
      required: ['id'],
    },
  },
  {
    name: 'wc_delete_customer',
    description: 'Delete a WooCommerce customer',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Customer ID' },
        force: { type: 'boolean', description: 'Whether to force delete' },
        reassign: { type: 'number', description: 'User ID to reassign content to' },
      },
      required: ['id'],
    },
  },
  {
    name: 'wc_batch_update_customers',
    description: 'Batch update WooCommerce customers',
    inputSchema: {
      type: 'object',
      properties: {
        create: { type: 'array', description: 'Customers to create' },
        update: { type: 'array', description: 'Customers to update' },
        delete: { type: 'array', description: 'Customer IDs to delete' },
      },
    },
  },

  // WooCommerce Coupons
  {
    name: 'wc_get_coupons',
    description: 'Get WooCommerce coupons with optional filtering parameters',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number for pagination' },
        per_page: { type: 'number', description: 'Number of coupons per page' },
        search: { type: 'string', description: 'Search term' },
        after: { type: 'string', description: 'Coupons created after this date' },
        before: { type: 'string', description: 'Coupons created before this date' },
        code: { type: 'string', description: 'Coupon code' },
        orderby: { type: 'string', description: 'Sort coupons by' },
        order: { type: 'string', description: 'Sort order' },
      },
    },
  },
  {
    name: 'wc_get_coupon',
    description: 'Get a specific WooCommerce coupon by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Coupon ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'wc_create_coupon',
    description: 'Create a new WooCommerce coupon',
    inputSchema: {
      type: 'object',
      properties: {
        code: { type: 'string', description: 'Coupon code' },
        amount: { type: 'string', description: 'Coupon amount' },
        discount_type: { type: 'string', description: 'Discount type (percent, fixed_cart, fixed_product)' },
        description: { type: 'string', description: 'Coupon description' },
        date_expires: { type: 'string', description: 'Expiry date (ISO 8601)' },
        individual_use: { type: 'boolean', description: 'Individual use only' },
        product_ids: { type: 'array', items: { type: 'number' }, description: 'Product IDs' },
        excluded_product_ids: { type: 'array', items: { type: 'number' }, description: 'Excluded product IDs' },
        usage_limit: { type: 'number', description: 'Usage limit' },
        usage_limit_per_user: { type: 'number', description: 'Usage limit per user' },
        limit_usage_to_x_items: { type: 'number', description: 'Limit usage to X items' },
        free_shipping: { type: 'boolean', description: 'Free shipping' },
        product_categories: { type: 'array', items: { type: 'number' }, description: 'Product category IDs' },
        excluded_product_categories: { type: 'array', items: { type: 'number' }, description: 'Excluded product category IDs' },
        exclude_sale_items: { type: 'boolean', description: 'Exclude sale items' },
        minimum_amount: { type: 'string', description: 'Minimum amount' },
        maximum_amount: { type: 'string', description: 'Maximum amount' },
        email_restrictions: { type: 'array', items: { type: 'string' }, description: 'Email restrictions' },
      },
      required: ['code', 'amount'],
    },
  },
  {
    name: 'wc_update_coupon',
    description: 'Update an existing WooCommerce coupon',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Coupon ID' },
        code: { type: 'string', description: 'Coupon code' },
        amount: { type: 'string', description: 'Coupon amount' },
        discount_type: { type: 'string', description: 'Discount type' },
        description: { type: 'string', description: 'Coupon description' },
        date_expires: { type: 'string', description: 'Expiry date' },
        individual_use: { type: 'boolean', description: 'Individual use only' },
        product_ids: { type: 'array', items: { type: 'number' }, description: 'Product IDs' },
        excluded_product_ids: { type: 'array', items: { type: 'number' }, description: 'Excluded product IDs' },
        usage_limit: { type: 'number', description: 'Usage limit' },
        usage_limit_per_user: { type: 'number', description: 'Usage limit per user' },
        limit_usage_to_x_items: { type: 'number', description: 'Limit usage to X items' },
        free_shipping: { type: 'boolean', description: 'Free shipping' },
        product_categories: { type: 'array', items: { type: 'number' }, description: 'Product category IDs' },
        excluded_product_categories: { type: 'array', items: { type: 'number' }, description: 'Excluded product category IDs' },
        exclude_sale_items: { type: 'boolean', description: 'Exclude sale items' },
        minimum_amount: { type: 'string', description: 'Minimum amount' },
        maximum_amount: { type: 'string', description: 'Maximum amount' },
        email_restrictions: { type: 'array', items: { type: 'string' }, description: 'Email restrictions' },
      },
      required: ['id'],
    },
  },
  {
    name: 'wc_delete_coupon',
    description: 'Delete a WooCommerce coupon',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Coupon ID' },
        force: { type: 'boolean', description: 'Whether to force delete (skip trash)' },
      },
      required: ['id'],
    },
  },
  {
    name: 'wc_batch_update_coupons',
    description: 'Batch update WooCommerce coupons',
    inputSchema: {
      type: 'object',
      properties: {
        create: { type: 'array', description: 'Coupons to create' },
        update: { type: 'array', description: 'Coupons to update' },
        delete: { type: 'array', description: 'Coupon IDs to delete' },
      },
    },
  },

  // WooCommerce Reports
  {
    name: 'wc_get_sales_report',
    description: 'Get WooCommerce sales report',
    inputSchema: {
      type: 'object',
      properties: {
        context: { type: 'string', description: 'Request context (view, edit)' },
        period: { type: 'string', description: 'Report period (week, month, last_month, year)' },
        date_min: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
        date_max: { type: 'string', description: 'End date (YYYY-MM-DD)' },
      },
    },
  },
  {
    name: 'wc_get_top_sellers_report',
    description: 'Get WooCommerce top sellers report',
    inputSchema: {
      type: 'object',
      properties: {
        context: { type: 'string', description: 'Request context' },
        period: { type: 'string', description: 'Report period' },
        date_min: { type: 'string', description: 'Start date' },
        date_max: { type: 'string', description: 'End date' },
      },
    },
  },
  {
    name: 'wc_get_coupons_report',
    description: 'Get WooCommerce coupons totals report',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'wc_get_customers_report',
    description: 'Get WooCommerce customers totals report',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'wc_get_orders_report',
    description: 'Get WooCommerce orders totals report',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'wc_get_products_report',
    description: 'Get WooCommerce products totals report',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'wc_get_reviews_report',
    description: 'Get WooCommerce reviews totals report',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // WooCommerce Product Reviews
  {
    name: 'wc_get_product_reviews',
    description: 'Get WooCommerce product reviews',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number for pagination' },
        per_page: { type: 'number', description: 'Number of reviews per page' },
        search: { type: 'string', description: 'Search term' },
        product: { type: 'array', items: { type: 'number' }, description: 'Product IDs' },
        status: { type: 'string', description: 'Review status' },
        reviewer: { type: 'array', items: { type: 'number' }, description: 'Reviewer IDs' },
        reviewer_email: { type: 'array', items: { type: 'string' }, description: 'Reviewer emails' },
        orderby: { type: 'string', description: 'Sort reviews by' },
        order: { type: 'string', description: 'Sort order' },
      },
    },
  },
  {
    name: 'wc_get_product_review',
    description: 'Get a specific WooCommerce product review by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Review ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'wc_create_product_review',
    description: 'Create a new WooCommerce product review',
    inputSchema: {
      type: 'object',
      properties: {
        product_id: { type: 'number', description: 'Product ID' },
        review: { type: 'string', description: 'Review content' },
        rating: { type: 'number', description: 'Review rating (1-5)' },
        reviewer: { type: 'string', description: 'Reviewer name' },
        reviewer_email: { type: 'string', description: 'Reviewer email' },
        status: { type: 'string', description: 'Review status' },
      },
      required: ['product_id', 'review', 'rating', 'reviewer', 'reviewer_email'],
    },
  },
  {
    name: 'wc_update_product_review',
    description: 'Update an existing WooCommerce product review',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Review ID' },
        review: { type: 'string', description: 'Review content' },
        rating: { type: 'number', description: 'Review rating (1-5)' },
        reviewer: { type: 'string', description: 'Reviewer name' },
        reviewer_email: { type: 'string', description: 'Reviewer email' },
        status: { type: 'string', description: 'Review status' },
      },
      required: ['id'],
    },
  },
  {
    name: 'wc_delete_product_review',
    description: 'Delete a WooCommerce product review',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Review ID' },
        force: { type: 'boolean', description: 'Whether to force delete (skip trash)' },
      },
      required: ['id'],
    },
  },

  // WooCommerce Tax Classes
  {
    name: 'wc_get_tax_classes',
    description: 'Get WooCommerce tax classes',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'wc_create_tax_class',
    description: 'Create a new WooCommerce tax class',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Tax class name' },
        slug: { type: 'string', description: 'Tax class slug' },
      },
      required: ['name'],
    },
  },
  {
    name: 'wc_delete_tax_class',
    description: 'Delete a WooCommerce tax class',
    inputSchema: {
      type: 'object',
      properties: {
        slug: { type: 'string', description: 'Tax class slug' },
        force: { type: 'boolean', description: 'Whether to force delete' },
      },
      required: ['slug'],
    },
  },

  // WooCommerce Tax Rates
  {
    name: 'wc_get_tax_rates',
    description: 'Get WooCommerce tax rates',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number for pagination' },
        per_page: { type: 'number', description: 'Number of tax rates per page' },
        class: { type: 'string', description: 'Tax class' },
      },
    },
  },
  {
    name: 'wc_get_tax_rate',
    description: 'Get a specific WooCommerce tax rate by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Tax rate ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'wc_create_tax_rate',
    description: 'Create a new WooCommerce tax rate',
    inputSchema: {
      type: 'object',
      properties: {
        country: { type: 'string', description: 'Country code' },
        state: { type: 'string', description: 'State code' },
        postcode: { type: 'string', description: 'Postcode' },
        city: { type: 'string', description: 'City name' },
        rate: { type: 'string', description: 'Tax rate' },
        name: { type: 'string', description: 'Tax rate name' },
        priority: { type: 'number', description: 'Tax priority' },
        compound: { type: 'boolean', description: 'Whether tax is compound' },
        shipping: { type: 'boolean', description: 'Whether tax applies to shipping' },
        order: { type: 'number', description: 'Tax rate order' },
        class: { type: 'string', description: 'Tax class' },
      },
      required: ['rate', 'name'],
    },
  },
  {
    name: 'wc_update_tax_rate',
    description: 'Update an existing WooCommerce tax rate',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Tax rate ID' },
        country: { type: 'string', description: 'Country code' },
        state: { type: 'string', description: 'State code' },
        postcode: { type: 'string', description: 'Postcode' },
        city: { type: 'string', description: 'City name' },
        rate: { type: 'string', description: 'Tax rate' },
        name: { type: 'string', description: 'Tax rate name' },
        priority: { type: 'number', description: 'Tax priority' },
        compound: { type: 'boolean', description: 'Whether tax is compound' },
        shipping: { type: 'boolean', description: 'Whether tax applies to shipping' },
        order: { type: 'number', description: 'Tax rate order' },
        class: { type: 'string', description: 'Tax class' },
      },
      required: ['id'],
    },
  },
  {
    name: 'wc_delete_tax_rate',
    description: 'Delete a WooCommerce tax rate',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Tax rate ID' },
        force: { type: 'boolean', description: 'Whether to force delete' },
      },
      required: ['id'],
    },
  },

  // WooCommerce Shipping Zones
  {
    name: 'wc_get_shipping_zones',
    description: 'Get WooCommerce shipping zones',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'wc_get_shipping_zone',
    description: 'Get a specific WooCommerce shipping zone by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Shipping zone ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'wc_create_shipping_zone',
    description: 'Create a new WooCommerce shipping zone',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Shipping zone name' },
        order: { type: 'number', description: 'Shipping zone order' },
      },
      required: ['name'],
    },
  },
  {
    name: 'wc_update_shipping_zone',
    description: 'Update an existing WooCommerce shipping zone',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Shipping zone ID' },
        name: { type: 'string', description: 'Shipping zone name' },
        order: { type: 'number', description: 'Shipping zone order' },
      },
      required: ['id'],
    },
  },
  {
    name: 'wc_delete_shipping_zone',
    description: 'Delete a WooCommerce shipping zone',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Shipping zone ID' },
        force: { type: 'boolean', description: 'Whether to force delete' },
      },
      required: ['id'],
    },
  },

  // WooCommerce Shipping Zone Methods
  {
    name: 'wc_get_shipping_zone_methods',
    description: 'Get shipping methods for a WooCommerce shipping zone',
    inputSchema: {
      type: 'object',
      properties: {
        zone_id: { type: 'number', description: 'Shipping zone ID' },
      },
      required: ['zone_id'],
    },
  },
  {
    name: 'wc_get_shipping_zone_method',
    description: 'Get a specific shipping zone method',
    inputSchema: {
      type: 'object',
      properties: {
        zone_id: { type: 'number', description: 'Shipping zone ID' },
        method_id: { type: 'number', description: 'Shipping method instance ID' },
      },
      required: ['zone_id', 'method_id'],
    },
  },
  {
    name: 'wc_create_shipping_zone_method',
    description: 'Create a new shipping zone method',
    inputSchema: {
      type: 'object',
      properties: {
        zone_id: { type: 'number', description: 'Shipping zone ID' },
        method_id: { type: 'string', description: 'Shipping method ID' },
        settings: { type: 'object', description: 'Shipping method settings' },
      },
      required: ['zone_id', 'method_id'],
    },
  },
  {
    name: 'wc_update_shipping_zone_method',
    description: 'Update a shipping zone method',
    inputSchema: {
      type: 'object',
      properties: {
        zone_id: { type: 'number', description: 'Shipping zone ID' },
        method_id: { type: 'number', description: 'Shipping method instance ID' },
        settings: { type: 'object', description: 'Shipping method settings' },
      },
      required: ['zone_id', 'method_id', 'settings'],
    },
  },
  {
    name: 'wc_delete_shipping_zone_method',
    description: 'Delete a shipping zone method',
    inputSchema: {
      type: 'object',
      properties: {
        zone_id: { type: 'number', description: 'Shipping zone ID' },
        method_id: { type: 'number', description: 'Shipping method instance ID' },
        force: { type: 'boolean', description: 'Whether to force delete' },
      },
      required: ['zone_id', 'method_id'],
    },
  },

  // WooCommerce Payment Gateways
  {
    name: 'wc_get_payment_gateways',
    description: 'Get WooCommerce payment gateways',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'wc_get_payment_gateway',
    description: 'Get a specific WooCommerce payment gateway by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Payment gateway ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'wc_update_payment_gateway',
    description: 'Update a WooCommerce payment gateway',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Payment gateway ID' },
        settings: { type: 'object', description: 'Payment gateway settings' },
      },
      required: ['id', 'settings'],
    },
  },

  // WooCommerce System Status
  {
    name: 'wc_get_system_status',
    description: 'Get WooCommerce system status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'wc_get_system_status_tools',
    description: 'Get WooCommerce system status tools',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'wc_run_system_status_tool',
    description: 'Run a WooCommerce system status tool',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Tool ID' },
      },
      required: ['id'],
    },
  },

  // WooCommerce Settings
  {
    name: 'wc_get_settings',
    description: 'Get WooCommerce settings groups',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'wc_get_setting_group',
    description: 'Get a specific WooCommerce settings group',
    inputSchema: {
      type: 'object',
      properties: {
        group_id: { type: 'string', description: 'Settings group ID' },
      },
      required: ['group_id'],
    },
  },
  {
    name: 'wc_get_setting_option',
    description: 'Get a specific WooCommerce setting option',
    inputSchema: {
      type: 'object',
      properties: {
        group_id: { type: 'string', description: 'Settings group ID' },
        option_id: { type: 'string', description: 'Setting option ID' },
      },
      required: ['group_id', 'option_id'],
    },
  },
  {
    name: 'wc_update_setting_option',
    description: 'Update a WooCommerce setting option',
    inputSchema: {
      type: 'object',
      properties: {
        group_id: { type: 'string', description: 'Settings group ID' },
        option_id: { type: 'string', description: 'Setting option ID' },
        value: { type: 'string', description: 'Setting value' },
      },
      required: ['group_id', 'option_id', 'value'],
    },
  },
  {
    name: 'wc_batch_update_setting_group',
    description: 'Batch update WooCommerce settings group',
    inputSchema: {
      type: 'object',
      properties: {
        group_id: { type: 'string', description: 'Settings group ID' },
        options: { type: 'array', description: 'Array of setting options to update' },
      },
      required: ['group_id', 'options'],
    },
  },

  // WooCommerce Webhooks
  {
    name: 'wc_get_webhooks',
    description: 'Get WooCommerce webhooks',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number for pagination' },
        per_page: { type: 'number', description: 'Number of webhooks per page' },
        search: { type: 'string', description: 'Search term' },
        after: { type: 'string', description: 'Webhooks created after this date' },
        before: { type: 'string', description: 'Webhooks created before this date' },
        status: { type: 'string', description: 'Webhook status' },
      },
    },
  },
  {
    name: 'wc_get_webhook',
    description: 'Get a specific WooCommerce webhook by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Webhook ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'wc_create_webhook',
    description: 'Create a new WooCommerce webhook',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Webhook name' },
        topic: { type: 'string', description: 'Webhook topic' },
        delivery_url: { type: 'string', description: 'Delivery URL' },
        secret: { type: 'string', description: 'Webhook secret' },
        status: { type: 'string', description: 'Webhook status' },
      },
      required: ['name', 'topic', 'delivery_url'],
    },
  },
  {
    name: 'wc_update_webhook',
    description: 'Update an existing WooCommerce webhook',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Webhook ID' },
        name: { type: 'string', description: 'Webhook name' },
        topic: { type: 'string', description: 'Webhook topic' },
        delivery_url: { type: 'string', description: 'Delivery URL' },
        secret: { type: 'string', description: 'Webhook secret' },
        status: { type: 'string', description: 'Webhook status' },
      },
      required: ['id'],
    },
  },
  {
    name: 'wc_delete_webhook',
    description: 'Delete a WooCommerce webhook',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Webhook ID' },
        force: { type: 'boolean', description: 'Whether to force delete' },
      },
      required: ['id'],
    },
  },
];

async function main() {
  const config = parseConfig();
  const wordpressService = new WordPressService(config);
  const woocommerceService = new WooCommerceService(config);
  
  const server = new Server(
    {
      name: 'wordpress-woocommerce-mcp',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // List tools handler
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools };
  });

  // Call tool handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (!args) {
      return {
        content: [
          {
            type: 'text',
            text: 'Error: No arguments provided',
          },
        ],
        isError: true,
      };
    }

    try {
      let result: any;

      // WordPress Posts
      if (name === 'wp_get_posts') {
        result = await wordpressService.getPosts(getObject(args));
      } else if (name === 'wp_get_post') {
        result = await wordpressService.getPost(getNumber(args.id));
      } else if (name === 'wp_create_post') {
        const postData = {
          title: { raw: getString(args.title) },
          content: { raw: getString(args.content) },
          excerpt: args.excerpt ? { raw: getString(args.excerpt) } : undefined,
          status: getString(args.status) || undefined,
          author: getNumber(args.author) || undefined,
          featured_media: getNumber(args.featured_media) || undefined,
          categories: getArray(args.categories),
          tags: getArray(args.tags),
          slug: getString(args.slug) || undefined,
          comment_status: getString(args.comment_status) || undefined,
          ping_status: getString(args.ping_status) || undefined,
          sticky: getBoolean(args.sticky),
          format: getString(args.format) || undefined,
        };
        result = await wordpressService.createPost(postData);
      } else if (name === 'wp_update_post') {
        const postData = {
          title: args.title ? { raw: getString(args.title) } : undefined,
          content: args.content ? { raw: getString(args.content) } : undefined,
          excerpt: args.excerpt ? { raw: getString(args.excerpt) } : undefined,
          status: getString(args.status) || undefined,
          author: getNumber(args.author) || undefined,
          featured_media: getNumber(args.featured_media) || undefined,
          categories: args.categories ? getArray(args.categories) : undefined,
          tags: args.tags ? getArray(args.tags) : undefined,
          slug: getString(args.slug) || undefined,
          comment_status: getString(args.comment_status) || undefined,
          ping_status: getString(args.ping_status) || undefined,
          sticky: getBoolean(args.sticky),
          format: getString(args.format) || undefined,
        };
        result = await wordpressService.updatePost(getNumber(args.id), postData);
      } else if (name === 'wp_delete_post') {
        result = await wordpressService.deletePost(getNumber(args.id), getBoolean(args.force));
      }
      
      // WordPress Pages
      else if (name === 'wp_get_pages') {
        result = await wordpressService.getPages(getObject(args));
      } else if (name === 'wp_get_page') {
        result = await wordpressService.getPage(getNumber(args.id));
      } else if (name === 'wp_create_page') {
        const pageData = {
          title: { raw: getString(args.title) },
          content: { raw: getString(args.content) },
          excerpt: args.excerpt ? { raw: getString(args.excerpt) } : undefined,
          status: getString(args.status) || undefined,
          author: getNumber(args.author) || undefined,
          featured_media: getNumber(args.featured_media) || undefined,
          parent: getNumber(args.parent) || undefined,
          menu_order: getNumber(args.menu_order) || undefined,
          comment_status: getString(args.comment_status) || undefined,
          ping_status: getString(args.ping_status) || undefined,
          slug: getString(args.slug) || undefined,
          template: getString(args.template) || undefined,
        };
        result = await wordpressService.createPage(pageData);
      } else if (name === 'wp_update_page') {
        const pageData = {
          title: args.title ? { raw: getString(args.title) } : undefined,
          content: args.content ? { raw: getString(args.content) } : undefined,
          excerpt: args.excerpt ? { raw: getString(args.excerpt) } : undefined,
          status: getString(args.status) || undefined,
          author: getNumber(args.author) || undefined,
          featured_media: getNumber(args.featured_media) || undefined,
          parent: getNumber(args.parent) || undefined,
          menu_order: getNumber(args.menu_order) || undefined,
          comment_status: getString(args.comment_status) || undefined,
          ping_status: getString(args.ping_status) || undefined,
          slug: getString(args.slug) || undefined,
          template: getString(args.template) || undefined,
        };
        result = await wordpressService.updatePage(getNumber(args.id), pageData);
      } else if (name === 'wp_delete_page') {
        result = await wordpressService.deletePage(getNumber(args.id), getBoolean(args.force));
      }
      
      // WordPress Users
      else if (name === 'wp_get_users') {
        result = await wordpressService.getUsers(getObject(args));
      } else if (name === 'wp_get_user') {
        result = await wordpressService.getUser(getNumber(args.id));
      } else if (name === 'wp_create_user') {
        const userData = {
          username: getString(args.username),
          email: getString(args.email),
          password: getString(args.password),
          name: getString(args.name) || undefined,
          first_name: getString(args.first_name) || undefined,
          last_name: getString(args.last_name) || undefined,
          url: getString(args.url) || undefined,
          description: getString(args.description) || undefined,
          nickname: getString(args.nickname) || undefined,
          slug: getString(args.slug) || undefined,
          roles: getArray(args.roles),
        };
        result = await wordpressService.createUser(userData);
      } else if (name === 'wp_update_user') {
        const userData = {
          username: getString(args.username) || undefined,
          email: getString(args.email) || undefined,
          password: getString(args.password) || undefined,
          name: getString(args.name) || undefined,
          first_name: getString(args.first_name) || undefined,
          last_name: getString(args.last_name) || undefined,
          url: getString(args.url) || undefined,
          description: getString(args.description) || undefined,
          nickname: getString(args.nickname) || undefined,
          slug: getString(args.slug) || undefined,
          roles: getArray(args.roles),
        };
        result = await wordpressService.updateUser(getNumber(args.id), userData);
      } else if (name === 'wp_delete_user') {
        const reassignId = getNumber(args.reassign) || undefined;
        result = await wordpressService.deleteUser(getNumber(args.id), reassignId);
      }
      
      // WordPress Categories
      else if (name === 'wp_get_categories') {
        result = await wordpressService.getCategories(getObject(args));
      } else if (name === 'wp_get_category') {
        result = await wordpressService.getCategory(getNumber(args.id));
      } else if (name === 'wp_create_category') {
        const categoryData = {
          name: getString(args.name),
          description: getString(args.description) || undefined,
          slug: getString(args.slug) || undefined,
          parent: getNumber(args.parent) || undefined,
        };
        result = await wordpressService.createCategory(categoryData);
      } else if (name === 'wp_update_category') {
        const categoryData = {
          name: getString(args.name) || undefined,
          description: getString(args.description) || undefined,
          slug: getString(args.slug) || undefined,
          parent: getNumber(args.parent) || undefined,
        };
        result = await wordpressService.updateCategory(getNumber(args.id), categoryData);
      } else if (name === 'wp_delete_category') {
        result = await wordpressService.deleteCategory(getNumber(args.id), getBoolean(args.force));
      }
      
      // WordPress Tags
      else if (name === 'wp_get_tags') {
        result = await wordpressService.getTags(getObject(args));
      } else if (name === 'wp_get_tag') {
        result = await wordpressService.getTag(getNumber(args.id));
      } else if (name === 'wp_create_tag') {
        const tagData = {
          name: getString(args.name),
          description: getString(args.description) || undefined,
          slug: getString(args.slug) || undefined,
        };
        result = await wordpressService.createTag(tagData);
      } else if (name === 'wp_update_tag') {
        const tagData = {
          name: getString(args.name) || undefined,
          description: getString(args.description) || undefined,
          slug: getString(args.slug) || undefined,
        };
        result = await wordpressService.updateTag(getNumber(args.id), tagData);
      } else if (name === 'wp_delete_tag') {
        result = await wordpressService.deleteTag(getNumber(args.id), getBoolean(args.force));
      }
      
      // WordPress Comments
      else if (name === 'wp_get_comments') {
        result = await wordpressService.getComments(getObject(args));
      } else if (name === 'wp_get_comment') {
        result = await wordpressService.getComment(getNumber(args.id));
      } else if (name === 'wp_create_comment') {
        const commentData = {
          post: getNumber(args.post),
          content: { raw: getString(args.content) },
          author: getNumber(args.author) || undefined,
          author_name: getString(args.author_name) || undefined,
          author_email: getString(args.author_email) || undefined,
          author_url: getString(args.author_url) || undefined,
          parent: getNumber(args.parent) || undefined,
          status: getString(args.status) || undefined,
          type: getString(args.type) || undefined,
        };
        result = await wordpressService.createComment(commentData);
      } else if (name === 'wp_update_comment') {
        const commentData = {
          content: args.content ? { raw: getString(args.content) } : undefined,
          author: getNumber(args.author) || undefined,
          author_name: getString(args.author_name) || undefined,
          author_email: getString(args.author_email) || undefined,
          author_url: getString(args.author_url) || undefined,
          status: getString(args.status) || undefined,
          type: getString(args.type) || undefined,
        };
        result = await wordpressService.updateComment(getNumber(args.id), commentData);
      } else if (name === 'wp_delete_comment') {
        result = await wordpressService.deleteComment(getNumber(args.id), getBoolean(args.force));
      }
      
      // WordPress Media
      else if (name === 'wp_get_media') {
        result = await wordpressService.getMedia(getObject(args));
      } else if (name === 'wp_get_media_item') {
        result = await wordpressService.getMediaItem(getNumber(args.id));
      } else if (name === 'wp_update_media_item') {
        const mediaData = {
          title: args.title ? { raw: getString(args.title) } : undefined,
          alt_text: getString(args.alt_text) || undefined,
          caption: args.caption ? { raw: getString(args.caption) } : undefined,
          description: args.description ? { raw: getString(args.description) } : undefined,
        };
        result = await wordpressService.updateMediaItem(getNumber(args.id), mediaData);
      } else if (name === 'wp_delete_media_item') {
        result = await wordpressService.deleteMediaItem(getNumber(args.id), getBoolean(args.force));
      }
      else if (name === 'wp_upload_media') {
        const uploadData = {
            filename: getString(args.filename),
            content: getString(args.content),
            content_type: getString(args.content_type),
            title: getString(args.title) || undefined,
            alt_text: getString(args.alt_text) || undefined,
            caption: getString(args.caption) || undefined,
            description: getString(args.description) || undefined,
        };
        result = await wordpressService.uploadMediaBinary(uploadData);
        }
      // WordPress Menus
      else if (name === 'wp_get_menus') {
        result = await wordpressService.getMenus();
      } else if (name === 'wp_get_menu') {
        result = await wordpressService.getMenu(getNumber(args.id));
      }
      
      // WordPress Settings
      else if (name === 'wp_get_settings') {
        result = await wordpressService.getSettings();
      } else if (name === 'wp_update_settings') {
        result = await wordpressService.updateSettings(getObject(args.settings));
      }
      
      // WordPress Search
      else if (name === 'wp_search') {
        result = await wordpressService.search(
          getString(args.query), 
          getString(args.type) || undefined, 
          getString(args.subtype) || undefined
        );
      }
      
      // WooCommerce Products
      else if (name === 'wc_get_products') {
        result = await woocommerceService.getProducts(getObject(args));
      } else if (name === 'wc_get_product') {
        result = await woocommerceService.getProduct(getNumber(args.id));
      } else if (name === 'wc_create_product') {
        result = await woocommerceService.createProduct(getObject(args));
      } else if (name === 'wc_update_product') {
        const productData = getObject(args);
        const productId = getNumber(args.id);
        delete productData.id;
        result = await woocommerceService.updateProduct(productId, productData);
      } else if (name === 'wc_delete_product') {
        result = await woocommerceService.deleteProduct(getNumber(args.id), getBoolean(args.force));
      } else if (name === 'wc_batch_update_products') {
        result = await woocommerceService.batchUpdateProducts(getObject(args));
      }
      
      // WooCommerce Product Variations
      else if (name === 'wc_get_product_variations') {
        result = await woocommerceService.getProductVariations(getNumber(args.product_id), getObject(args));
      } else if (name === 'wc_get_product_variation') {
        result = await woocommerceService.getProductVariation(getNumber(args.product_id), getNumber(args.variation_id));
      } else if (name === 'wc_create_product_variation') {
        result = await woocommerceService.createProductVariation(getNumber(args.product_id), getObject(args.variation));
      } else if (name === 'wc_update_product_variation') {
        result = await woocommerceService.updateProductVariation(getNumber(args.product_id), getNumber(args.variation_id), getObject(args.variation));
      } else if (name === 'wc_delete_product_variation') {
        result = await woocommerceService.deleteProductVariation(getNumber(args.product_id), getNumber(args.variation_id), getBoolean(args.force));
      }
      
      // WooCommerce Product Categories
      else if (name === 'wc_get_product_categories') {
        result = await woocommerceService.getProductCategories(getObject(args));
      } else if (name === 'wc_get_product_category') {
        result = await woocommerceService.getProductCategory(getNumber(args.id));
      } else if (name === 'wc_create_product_category') {
        result = await woocommerceService.createProductCategory(getObject(args));
      } else if (name === 'wc_update_product_category') {
        const categoryData = getObject(args);
        const categoryId = getNumber(args.id);
        delete categoryData.id;
        result = await woocommerceService.updateProductCategory(categoryId, categoryData);
      } else if (name === 'wc_delete_product_category') {
        result = await woocommerceService.deleteProductCategory(getNumber(args.id), getBoolean(args.force));
      }
      
      // WooCommerce Product Tags
      else if (name === 'wc_get_product_tags') {
        result = await woocommerceService.getProductTags(getObject(args));
      } else if (name === 'wc_get_product_tag') {
        result = await woocommerceService.getProductTag(getNumber(args.id));
      } else if (name === 'wc_create_product_tag') {
        result = await woocommerceService.createProductTag(getObject(args));
      } else if (name === 'wc_update_product_tag') {
        const tagData = getObject(args);
        const tagId = getNumber(args.id);
        delete tagData.id;
        result = await woocommerceService.updateProductTag(tagId, tagData);
      } else if (name === 'wc_delete_product_tag') {
        result = await woocommerceService.deleteProductTag(getNumber(args.id), getBoolean(args.force));
      }
      
      // WooCommerce Orders
      else if (name === 'wc_get_orders') {
        result = await woocommerceService.getOrders(getObject(args));
      } else if (name === 'wc_get_order') {
        result = await woocommerceService.getOrder(getNumber(args.id));
      } else if (name === 'wc_create_order') {
        result = await woocommerceService.createOrder(getObject(args));
      } else if (name === 'wc_update_order') {
        const orderData = getObject(args);
        const orderId = getNumber(args.id);
        delete orderData.id;
        result = await woocommerceService.updateOrder(orderId, orderData);
      } else if (name === 'wc_delete_order') {
        result = await woocommerceService.deleteOrder(getNumber(args.id), getBoolean(args.force));
      } else if (name === 'wc_batch_update_orders') {
        result = await woocommerceService.batchUpdateOrders(getObject(args));
      }
      
      // WooCommerce Order Notes
      else if (name === 'wc_get_order_notes') {
        result = await woocommerceService.getOrderNotes(getNumber(args.order_id), getObject(args));
      } else if (name === 'wc_get_order_note') {
        result = await woocommerceService.getOrderNote(getNumber(args.order_id), getNumber(args.note_id));
      } else if (name === 'wc_create_order_note') {
        result = await woocommerceService.createOrderNote(getNumber(args.order_id), {
          note: getString(args.note),
          customer_note: getBoolean(args.customer_note),
        });
      } else if (name === 'wc_delete_order_note') {
        result = await woocommerceService.deleteOrderNote(getNumber(args.order_id), getNumber(args.note_id), getBoolean(args.force));
      }
      
      // WooCommerce Customers
      else if (name === 'wc_get_customers') {
        result = await woocommerceService.getCustomers(getObject(args));
      } else if (name === 'wc_get_customer') {
        result = await woocommerceService.getCustomer(getNumber(args.id));
      } else if (name === 'wc_create_customer') {
        result = await woocommerceService.createCustomer(getObject(args));
      } else if (name === 'wc_update_customer') {
        const customerData = getObject(args);
        const customerId = getNumber(args.id);
        delete customerData.id;
        result = await woocommerceService.updateCustomer(customerId, customerData);
      } else if (name === 'wc_delete_customer') {
        const reassignId = getNumber(args.reassign) || undefined;
        result = await woocommerceService.deleteCustomer(getNumber(args.id), getBoolean(args.force), reassignId);
      } else if (name === 'wc_batch_update_customers') {
        result = await woocommerceService.batchUpdateCustomers(getObject(args));
      }
      
      // WooCommerce Coupons
      else if (name === 'wc_get_coupons') {
        result = await woocommerceService.getCoupons(getObject(args));
      } else if (name === 'wc_get_coupon') {
        result = await woocommerceService.getCoupon(getNumber(args.id));
      } else if (name === 'wc_create_coupon') {
        result = await woocommerceService.createCoupon(getObject(args));
      } else if (name === 'wc_update_coupon') {
        const couponData = getObject(args);
        const couponId = getNumber(args.id);
        delete couponData.id;
        result = await woocommerceService.updateCoupon(couponId, couponData);
      } else if (name === 'wc_delete_coupon') {
        result = await woocommerceService.deleteCoupon(getNumber(args.id), getBoolean(args.force));
      } else if (name === 'wc_batch_update_coupons') {
        result = await woocommerceService.batchUpdateCoupons(getObject(args));
      }
      
      // WooCommerce Reports
      else if (name === 'wc_get_sales_report') {
        result = await woocommerceService.getSalesReport(getObject(args));
      } else if (name === 'wc_get_top_sellers_report') {
        result = await woocommerceService.getTopSellersReport(getObject(args));
      } else if (name === 'wc_get_coupons_report') {
        result = await woocommerceService.getCouponsReport(getObject(args));
      } else if (name === 'wc_get_customers_report') {
        result = await woocommerceService.getCustomersReport(getObject(args));
      } else if (name === 'wc_get_orders_report') {
        result = await woocommerceService.getOrdersReport(getObject(args));
      } else if (name === 'wc_get_products_report') {
        result = await woocommerceService.getProductsReport(getObject(args));
      } else if (name === 'wc_get_reviews_report') {
        result = await woocommerceService.getReviewsReport(getObject(args));
      }
      
      // WooCommerce Product Reviews
      else if (name === 'wc_get_product_reviews') {
        result = await woocommerceService.getProductReviews(getObject(args));
      } else if (name === 'wc_get_product_review') {
        result = await woocommerceService.getProductReview(getNumber(args.id));
      } else if (name === 'wc_create_product_review') {
        result = await woocommerceService.createProductReview(getObject(args));
      } else if (name === 'wc_update_product_review') {
        const reviewData = getObject(args);
        const reviewId = getNumber(args.id);
        delete reviewData.id;
        result = await woocommerceService.updateProductReview(reviewId, reviewData);
      } else if (name === 'wc_delete_product_review') {
        result = await woocommerceService.deleteProductReview(getNumber(args.id), getBoolean(args.force));
      }
      
      // WooCommerce Tax Classes
        else if (name === 'wc_get_tax_classes') {
        result = await woocommerceService.getTaxClasses();
        } else if (name === 'wc_create_tax_class') {
        const taxClassData = {
            name: getString(args.name),
            slug: getString(args.slug) || undefined,
        };
        result = await woocommerceService.createTaxClass(taxClassData);
        } else if (name === 'wc_delete_tax_class') {
        result = await woocommerceService.deleteTaxClass(getString(args.slug), getBoolean(args.force));
        }
      
      // WooCommerce Tax Rates
      else if (name === 'wc_get_tax_rates') {
        result = await woocommerceService.getTaxRates(getObject(args));
      } else if (name === 'wc_get_tax_rate') {
        result = await woocommerceService.getTaxRate(getNumber(args.id));
      } else if (name === 'wc_create_tax_rate') {
        result = await woocommerceService.createTaxRate(getObject(args));
      } else if (name === 'wc_update_tax_rate') {
        const taxRateData = getObject(args);
        const taxRateId = getNumber(args.id);
        delete taxRateData.id;
        result = await woocommerceService.updateTaxRate(taxRateId, taxRateData);
      } else if (name === 'wc_delete_tax_rate') {
        result = await woocommerceService.deleteTaxRate(getNumber(args.id), getBoolean(args.force));
      }
      
      // WooCommerce Shipping Zones
      else if (name === 'wc_get_shipping_zones') {
        result = await woocommerceService.getShippingZones();
      } else if (name === 'wc_get_shipping_zone') {
        result = await woocommerceService.getShippingZone(getNumber(args.id));
      } else if (name === 'wc_create_shipping_zone') {
        result = await woocommerceService.createShippingZone(getObject(args));
      } else if (name === 'wc_update_shipping_zone') {
        const zoneData = getObject(args);
        const zoneId = getNumber(args.id);
        delete zoneData.id;
        result = await woocommerceService.updateShippingZone(zoneId, zoneData);
      } else if (name === 'wc_delete_shipping_zone') {
        result = await woocommerceService.deleteShippingZone(getNumber(args.id), getBoolean(args.force));
      }
      
      // WooCommerce Shipping Zone Methods
      else if (name === 'wc_get_shipping_zone_methods') {
        result = await woocommerceService.getShippingZoneMethods(getNumber(args.zone_id));
      } else if (name === 'wc_get_shipping_zone_method') {
        result = await woocommerceService.getShippingZoneMethod(getNumber(args.zone_id), getNumber(args.method_id));
      } else if (name === 'wc_create_shipping_zone_method') {
        result = await woocommerceService.createShippingZoneMethod(getNumber(args.zone_id), {
          method_id: getString(args.method_id),
          settings: getObject(args.settings),
        });
      } else if (name === 'wc_update_shipping_zone_method') {
        result = await woocommerceService.updateShippingZoneMethod(getNumber(args.zone_id), getNumber(args.method_id), {
          settings: getObject(args.settings),
        });
      } else if (name === 'wc_delete_shipping_zone_method') {
        result = await woocommerceService.deleteShippingZoneMethod(getNumber(args.zone_id), getNumber(args.method_id), getBoolean(args.force));
      }
      
      // WooCommerce Payment Gateways
      else if (name === 'wc_get_payment_gateways') {
        result = await woocommerceService.getPaymentGateways();
      } else if (name === 'wc_get_payment_gateway') {
        result = await woocommerceService.getPaymentGateway(getString(args.id));
      } else if (name === 'wc_update_payment_gateway') {
        result = await woocommerceService.updatePaymentGateway(getString(args.id), getObject(args.settings));
      }
      
      // WooCommerce System Status
      else if (name === 'wc_get_system_status') {
        result = await woocommerceService.getSystemStatus();
      } else if (name === 'wc_get_system_status_tools') {
        result = await woocommerceService.getSystemStatusTools();
      } else if (name === 'wc_run_system_status_tool') {
        result = await woocommerceService.runSystemStatusTool(getString(args.id));
      }
      
      // WooCommerce Settings
      else if (name === 'wc_get_settings') {
        result = await woocommerceService.getSettings();
      } else if (name === 'wc_get_setting_group') {
        result = await woocommerceService.getSettingGroup(getString(args.group_id));
      } else if (name === 'wc_get_setting_option') {
        result = await woocommerceService.getSettingOption(getString(args.group_id), getString(args.option_id));
      } else if (name === 'wc_update_setting_option') {
        result = await woocommerceService.updateSettingOption(getString(args.group_id), getString(args.option_id), {
          value: getString(args.value),
        });
      } else if (name === 'wc_batch_update_setting_group') {
        result = await woocommerceService.batchUpdateSettingGroup(getString(args.group_id), getArray(args.options));
      }
      
      // WooCommerce Webhooks
      else if (name === 'wc_get_webhooks') {
        result = await woocommerceService.getWebhooks(getObject(args));
      } else if (name === 'wc_get_webhook') {
        result = await woocommerceService.getWebhook(getNumber(args.id));
      } else if (name === 'wc_create_webhook') {
        result = await woocommerceService.createWebhook(getObject(args));
      } else if (name === 'wc_update_webhook') {
        const webhookData = getObject(args);
        const webhookId = getNumber(args.id);
        delete webhookData.id;
        result = await woocommerceService.updateWebhook(webhookId, webhookData);
      } else if (name === 'wc_delete_webhook') {
        result = await woocommerceService.deleteWebhook(getNumber(args.id), getBoolean(args.force));
      }
      
      else {
        throw new Error(`Unknown tool: ${name}`);
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
          },
        ],
        isError: true,
      };
    }
  });

  // Use stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});