import http from "http";
import fetch from "node-fetch";
import {
  Tool,
  createMCPServer,
  StreamableHTTPServerTransport,
} from "@modelcontextprotocol/sdk";

// Configuration interface
interface Config {
  wordpressLink: string;
  username: string;
  applicationPassword: string;
}

// Helper to build auth header
function getAuthHeader(cfg: Config) {
  const token = Buffer.from(`${cfg.username}:${cfg.applicationPassword}`).toString("base64");
  return `Basic ${token}`;
}

// Generic fetch wrapper
async function wpFetch<T>(
  cfg: Config,
  path: string,
  method: string = "GET",
  body?: any
): Promise<T> {
  const url = `${cfg.wordpressLink.replace(/\/$/, "")}/wp-json/${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthHeader(cfg),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`WP API error ${res.status}: ${text}`);
  }
  return (await res.json()) as T;
}

// Define all tools programmatically
function allTools(): Tool<any, any>[] {
  const wpEndpoints = [
    // Posts
    { name: "getPosts", path: "wp/v2/posts", method: "GET" },
    { name: "getPost", path: "wp/v2/posts/{id}", method: "GET" },
    { name: "createPost", path: "wp/v2/posts", method: "POST" },
    { name: "updatePost", path: "wp/v2/posts/{id}", method: "POST" },
    { name: "deletePost", path: "wp/v2/posts/{id}", method: "DELETE" },
    // Pages
    { name: "getPages", path: "wp/v2/pages", method: "GET" },
    { name: "getPage", path: "wp/v2/pages/{id}", method: "GET" },
    { name: "createPage", path: "wp/v2/pages", method: "POST" },
    { name: "updatePage", path: "wp/v2/pages/{id}", method: "POST" },
    { name: "deletePage", path: "wp/v2/pages/{id}", method: "DELETE" },
    // Media
    { name: "getMedia", path: "wp/v2/media", method: "GET" },
    { name: "getMediaItem", path: "wp/v2/media/{id}", method: "GET" },
    { name: "createMedia", path: "wp/v2/media", method: "POST" },
    { name: "updateMedia", path: "wp/v2/media/{id}", method: "POST" },
    { name: "deleteMedia", path: "wp/v2/media/{id}", method: "DELETE" },
    // Comments
    { name: "getComments", path: "wp/v2/comments", method: "GET" },
    { name: "getComment", path: "wp/v2/comments/{id}", method: "GET" },
    { name: "createComment", path: "wp/v2/comments", method: "POST" },
    { name: "updateComment", path: "wp/v2/comments/{id}", method: "POST" },
    { name: "deleteComment", path: "wp/v2/comments/{id}", method: "DELETE" },
    // Users
    { name: "getUsers", path: "wp/v2/users", method: "GET" },
    { name: "getUser", path: "wp/v2/users/{id}", method: "GET" },
    { name: "createUser", path: "wp/v2/users", method: "POST" },
    { name: "updateUser", path: "wp/v2/users/{id}", method: "POST" },
    { name: "deleteUser", path: "wp/v2/users/{id}", method: "DELETE" },
    // Taxonomies
    { name: "getCategories", path: "wp/v2/categories", method: "GET" },
    { name: "getTags", path: "wp/v2/tags", method: "GET" },
    // WooCommerce (v3)
    { name: "getProducts", path: "wc/v3/products", method: "GET" },
    { name: "getProduct", path: "wc/v3/products/{id}", method: "GET" },
    { name: "createProduct", path: "wc/v3/products", method: "POST" },
    { name: "updateProduct", path: "wc/v3/products/{id}", method: "PUT" },
    { name: "deleteProduct", path: "wc/v3/products/{id}", method: "DELETE" },
    { name: "getOrders", path: "wc/v3/orders", method: "GET" },
    { name: "getOrder", path: "wc/v3/orders/{id}", method: "GET" },
    { name: "createOrder", path: "wc/v3/orders", method: "POST" },
    { name: "updateOrder", path: "wc/v3/orders/{id}", method: "PUT" },
    { name: "deleteOrder", path: "wc/v3/orders/{id}", method: "DELETE" },
    { name: "getCustomers", path: "wc/v3/customers", method: "GET" },
    { name: "getCustomer", path: "wc/v3/customers/{id}", method: "GET" },
    { name: "createCustomer", path: "wc/v3/customers", method: "POST" },
    { name: "updateCustomer", path: "wc/v3/customers/{id}", method: "PUT" },
    { name: "deleteCustomer", path: "wc/v3/customers/{id}", method: "DELETE" },
    { name: "getCoupons", path: "wc/v3/coupons", method: "GET" },
    { name: "getCoupon", path: "wc/v3/coupons/{id}", method: "GET" },
    { name: "createCoupon", path: "wc/v3/coupons", method: "POST" },
    { name: "updateCoupon", path: "wc/v3/coupons/{id}", method: "PUT" },
    { name: "deleteCoupon", path: "wc/v3/coupons/{id}", method: "DELETE" }
  ];

  return wpEndpoints.map(spec => {
    return {
      name: spec.name,
      description: `${spec.method} ${spec.path}`,
      inputSchema: {
        type: "object",
        properties: {
          id: { type: "integer" },
          query: { type: "object", additionalProperties: true },
          body: { type: "object", additionalProperties: true }
        },
        required: []
      },
      handler: async (args: any, cfg: Config) => {
        let path = spec.path;
        if (args.id !== undefined) path = path.replace("{id}", String(args.id));
const qp =
  args.query && Object.entries(args.query).length
    ? "?" +
      (Object.entries(args.query) as [string, unknown][])
        .map(([k, v]) => {
          // coerce v to string so encodeURIComponent is happy
          const vs = v === null || v === undefined ? "" : String(v);
          return `${encodeURIComponent(k)}=${encodeURIComponent(vs)}`;
        })
        .join("&")
    : "";
        return wpFetch(
          cfg,
          path + qp,
          spec.method,
          ["POST", "PUT"].includes(spec.method) ? args.body : undefined
        );
      }
    } as Tool<any, any>;
  });
}

// Create and start the MCP server
async function main() {
  const server = createMCPServer<Config>({
    name: "wordpress-mcp",
    version: "1.0.0",
    configSchema: {
      type: "object",
      required: ["wordpressLink", "username", "applicationPassword"],
      properties: {
        wordpressLink: { type: "string", description: "Your WP site URL" },
        username: { type: "string", description: "WP username" },
        applicationPassword: { type: "string", description: "WP application password" }
      }
    },
    tools: allTools()
  });

  const port = process.env.PORT ? parseInt(process.env.PORT) : 8000;
  const transport = new StreamableHTTPServerTransport(server);

  const httpServer = http.createServer((req: any, res: any) => {
    if (req.url?.startsWith("/mcp")) {
      transport.handleHttpRequest(req, res);
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  httpServer.listen(port, () =>
    console.log(`wordpress-mcp listening on http://0.0.0.0:${port}/mcp`)
  );
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});