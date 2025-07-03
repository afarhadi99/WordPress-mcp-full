export interface WordPressConfig {
  wordpressUrl: string;
  username: string;
  applicationPassword: string;
}

export interface WordPressPost {
  id?: number;
  title: {
    rendered?: string;
    raw?: string;
  };
  content: {
    rendered?: string;
    raw?: string;
  };
  excerpt?: {
    rendered?: string;
    raw?: string;
  };
  status?: string;
  author?: number;
  featured_media?: number;
  comment_status?: string;
  ping_status?: string;
  sticky?: boolean;
  format?: string;
  categories?: number[];
  tags?: number[];
  slug?: string;
  date?: string;
  date_gmt?: string;
  modified?: string;
  modified_gmt?: string;
}

export interface WordPressPage {
  id?: number;
  title: {
    rendered?: string;
    raw?: string;
  };
  content: {
    rendered?: string;
    raw?: string;
  };
  excerpt?: {
    rendered?: string;
    raw?: string;
  };
  status?: string;
  author?: number;
  featured_media?: number;
  parent?: number;
  menu_order?: number;
  comment_status?: string;
  ping_status?: string;
  slug?: string;
  template?: string;
}

export interface WordPressUser {
  id?: number;
  username?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  url?: string;
  description?: string;
  nickname?: string;
  slug?: string;
  roles?: string[];
  capabilities?: Record<string, boolean>;
  avatar_urls?: Record<string, string>;
}

export interface WordPressCategory {
  id?: number;
  count?: number;
  description?: string;
  link?: string;
  name?: string;
  slug?: string;
  taxonomy?: string;
  parent?: number;
}

export interface WordPressTag {
  id?: number;
  count?: number;
  description?: string;
  link?: string;
  name?: string;
  slug?: string;
  taxonomy?: string;
}

export interface WordPressComment {
  id?: number;
  post?: number;
  parent?: number;
  author?: number;
  author_name?: string;
  author_email?: string;
  author_url?: string;
  date?: string;
  content?: {
    rendered?: string;
    raw?: string;
  };
  status?: string;
  type?: string;
}

export interface WordPressMedia {
  id?: number;
  date?: string;
  slug?: string;
  status?: string;
  type?: string;
  title?: {
    rendered?: string;
    raw?: string;
  };
  author?: number;
  comment_status?: string;
  ping_status?: string;
  alt_text?: string;
  caption?: {
    rendered?: string;
    raw?: string;
  };
  description?: {
    rendered?: string;
    raw?: string;
  };
  media_type?: string;
  mime_type?: string;
  source_url?: string;
}

// WooCommerce Types
export interface WCProduct {
  id?: number;
  name?: string;
  slug?: string;
  permalink?: string;
  date_created?: string;
  date_modified?: string;
  type?: string;
  status?: string;
  featured?: boolean;
  catalog_visibility?: string;
  description?: string;
  short_description?: string;
  sku?: string;
  price?: string;
  regular_price?: string;
  sale_price?: string;
  date_on_sale_from?: string;
  date_on_sale_to?: string;
  on_sale?: boolean;
  purchasable?: boolean;
  total_sales?: number;
  virtual?: boolean;
  downloadable?: boolean;
  downloads?: Array<{
    id?: string;
    name?: string;
    file?: string;
  }>;
  download_limit?: number;
  download_expiry?: number;
  external_url?: string;
  button_text?: string;
  tax_status?: string;
  tax_class?: string;
  manage_stock?: boolean;
  stock_quantity?: number;
  backorders?: string;
  backorders_allowed?: boolean;
  backordered?: boolean;
  low_stock_amount?: number;
  sold_individually?: boolean;
  weight?: string;
  dimensions?: {
    length?: string;
    width?: string;
    height?: string;
  };
  shipping_required?: boolean;
  shipping_taxable?: boolean;
  shipping_class?: string;
  shipping_class_id?: number;
  reviews_allowed?: boolean;
  average_rating?: string;
  rating_count?: number;
  upsell_ids?: number[];
  cross_sell_ids?: number[];
  parent_id?: number;
  purchase_note?: string;
  categories?: Array<{
    id?: number;
    name?: string;
    slug?: string;
  }>;
  tags?: Array<{
    id?: number;
    name?: string;
    slug?: string;
  }>;
  images?: Array<{
    id?: number;
    date_created?: string;
    date_modified?: string;
    src?: string;
    name?: string;
    alt?: string;
  }>;
  attributes?: Array<{
    id?: number;
    name?: string;
    position?: number;
    visible?: boolean;
    variation?: boolean;
    options?: string[];
  }>;
  default_attributes?: Array<{
    id?: number;
    name?: string;
    option?: string;
  }>;
  variations?: number[];
  grouped_products?: number[];
  menu_order?: number;
  related_ids?: number[];
  stock_status?: string;
}

export interface WCOrder {
  id?: number;
  parent_id?: number;
  status?: string;
  currency?: string;
  version?: string;
  prices_include_tax?: boolean;
  date_created?: string;
  date_modified?: string;
  discount_total?: string;
  discount_tax?: string;
  shipping_total?: string;
  shipping_tax?: string;
  cart_tax?: string;
  total?: string;
  total_tax?: string;
  customer_id?: number;
  order_key?: string;
  billing?: {
    first_name?: string;
    last_name?: string;
    company?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
    email?: string;
    phone?: string;
  };
  shipping?: {
    first_name?: string;
    last_name?: string;
    company?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  payment_method?: string;
  payment_method_title?: string;
  transaction_id?: string;
  customer_ip_address?: string;
  customer_user_agent?: string;
  created_via?: string;
  customer_note?: string;
  date_completed?: string;
  date_paid?: string;
  cart_hash?: string;
  number?: string;
  line_items?: Array<{
    id?: number;
    name?: string;
    product_id?: number;
    variation_id?: number;
    quantity?: number;
    tax_class?: string;
    subtotal?: string;
    subtotal_tax?: string;
    total?: string;
    total_tax?: string;
    taxes?: Array<{
      id?: number;
      total?: string;
      subtotal?: string;
    }>;
    meta_data?: Array<{
      id?: number;
      key?: string;
      value?: string;
    }>;
    sku?: string;
    price?: number;
  }>;
  tax_lines?: Array<{
    id?: number;
    rate_code?: string;
    rate_id?: number;
    label?: string;
    compound?: boolean;
    tax_total?: string;
    shipping_tax_total?: string;
    meta_data?: Array<{
      id?: number;
      key?: string;
      value?: string;
    }>;
  }>;
  shipping_lines?: Array<{
    id?: number;
    method_title?: string;
    method_id?: string;
    instance_id?: string;
    total?: string;
    total_tax?: string;
    taxes?: Array<{
      id?: number;
      total?: string;
    }>;
    meta_data?: Array<{
      id?: number;
      key?: string;
      value?: string;
    }>;
  }>;
  fee_lines?: Array<{
    id?: number;
    name?: string;
    tax_class?: string;
    tax_status?: string;
    total?: string;
    total_tax?: string;
    taxes?: Array<{
      id?: number;
      total?: string;
      subtotal?: string;
    }>;
    meta_data?: Array<{
      id?: number;
      key?: string;
      value?: string;
    }>;
  }>;
  coupon_lines?: Array<{
    id?: number;
    code?: string;
    discount?: string;
    discount_tax?: string;
    meta_data?: Array<{
      id?: number;
      key?: string;
      value?: string;
    }>;
  }>;
  refunds?: Array<{
    id?: number;
    reason?: string;
    total?: string;
  }>;
}

export interface WCCustomer {
  id?: number;
  date_created?: string;
  date_modified?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  username?: string;
  password?: string;
  billing?: {
    first_name?: string;
    last_name?: string;
    company?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
    email?: string;
    phone?: string;
  };
  shipping?: {
    first_name?: string;
    last_name?: string;
    company?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  is_paying_customer?: boolean;
  avatar_url?: string;
  meta_data?: Array<{
    id?: number;
    key?: string;
    value?: string;
  }>;
}

export interface WCCoupon {
  id?: number;
  code?: string;
  amount?: string;
  date_created?: string;
  date_modified?: string;
  discount_type?: string;
  description?: string;
  date_expires?: string;
  usage_count?: number;
  individual_use?: boolean;
  product_ids?: number[];
  excluded_product_ids?: number[];
  usage_limit?: number;
  usage_limit_per_user?: number;
  limit_usage_to_x_items?: number;
  free_shipping?: boolean;
  product_categories?: number[];
  excluded_product_categories?: number[];
  exclude_sale_items?: boolean;
  minimum_amount?: string;
  maximum_amount?: string;
  email_restrictions?: string[];
  used_by?: string[];
  meta_data?: Array<{
    id?: number;
    key?: string;
    value?: string;
  }>;
}