import axios, { AxiosInstance } from 'axios';
import { WordPressConfig } from '../types.js';

export class WordPressService {
  private client: AxiosInstance;

  constructor(config: WordPressConfig) {
    this.client = axios.create({
      baseURL: `${config.wordpressUrl}/wp-json/wp/v2`,
      auth: {
        username: config.username,
        password: config.applicationPassword,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Posts
  async getPosts(params: any = {}) {
    const response = await this.client.get('/posts', { params });
    return response.data;
  }

  async getPost(id: number) {
    const response = await this.client.get(`/posts/${id}`);
    return response.data;
  }

  async createPost(data: any) {
    const response = await this.client.post('/posts', data);
    return response.data;
  }

  async updatePost(id: number, data: any) {
    const response = await this.client.post(`/posts/${id}`, data);
    return response.data;
  }

  async deletePost(id: number, force: boolean = false) {
    const response = await this.client.delete(`/posts/${id}`, {
      params: { force },
    });
    return response.data;
  }

  // Pages
  async getPages(params: any = {}) {
    const response = await this.client.get('/pages', { params });
    return response.data;
  }

  async getPage(id: number) {
    const response = await this.client.get(`/pages/${id}`);
    return response.data;
  }

  async createPage(data: any) {
    const response = await this.client.post('/pages', data);
    return response.data;
  }

  async updatePage(id: number, data: any) {
    const response = await this.client.post(`/pages/${id}`, data);
    return response.data;
  }

  async deletePage(id: number, force: boolean = false) {
    const response = await this.client.delete(`/pages/${id}`, {
      params: { force },
    });
    return response.data;
  }

  // Users
  async getUsers(params: any = {}) {
    const response = await this.client.get('/users', { params });
    return response.data;
  }

  async getUser(id: number) {
    const response = await this.client.get(`/users/${id}`);
    return response.data;
  }

  async createUser(data: any) {
    const response = await this.client.post('/users', data);
    return response.data;
  }

  async updateUser(id: number, data: any) {
    const response = await this.client.post(`/users/${id}`, data);
    return response.data;
  }

  async deleteUser(id: number, reassign?: number) {
    const params: any = {};
    if (reassign) params.reassign = reassign;
    
    const response = await this.client.delete(`/users/${id}`, { params });
    return response.data;
  }

  // Categories
  async getCategories(params: any = {}) {
    const response = await this.client.get('/categories', { params });
    return response.data;
  }

  async getCategory(id: number) {
    const response = await this.client.get(`/categories/${id}`);
    return response.data;
  }

  async createCategory(data: any) {
    const response = await this.client.post('/categories', data);
    return response.data;
  }

  async updateCategory(id: number, data: any) {
    const response = await this.client.post(`/categories/${id}`, data);
    return response.data;
  }

  async deleteCategory(id: number, force: boolean = false) {
    const response = await this.client.delete(`/categories/${id}`, {
      params: { force },
    });
    return response.data;
  }

  // Tags
  async getTags(params: any = {}) {
    const response = await this.client.get('/tags', { params });
    return response.data;
  }

  async getTag(id: number) {
    const response = await this.client.get(`/tags/${id}`);
    return response.data;
  }

  async createTag(data: any) {
    const response = await this.client.post('/tags', data);
    return response.data;
  }

  async updateTag(id: number, data: any) {
    const response = await this.client.post(`/tags/${id}`, data);
    return response.data;
  }

  async deleteTag(id: number, force: boolean = false) {
    const response = await this.client.delete(`/tags/${id}`, {
      params: { force },
    });
    return response.data;
  }

  // Comments
  async getComments(params: any = {}) {
    const response = await this.client.get('/comments', { params });
    return response.data;
  }

  async getComment(id: number) {
    const response = await this.client.get(`/comments/${id}`);
    return response.data;
  }

  async createComment(data: any) {
    const response = await this.client.post('/comments', data);
    return response.data;
  }

  async updateComment(id: number, data: any) {
    const response = await this.client.post(`/comments/${id}`, data);
    return response.data;
  }

  async deleteComment(id: number, force: boolean = false) {
    const response = await this.client.delete(`/comments/${id}`, {
      params: { force },
    });
    return response.data;
  }

  // Media
  async getMedia(params: any = {}) {
    const response = await this.client.get('/media', { params });
    return response.data;
  }

  async getMediaItem(id: number) {
    const response = await this.client.get(`/media/${id}`);
    return response.data;
  }

  async updateMediaItem(id: number, data: any) {
    const response = await this.client.post(`/media/${id}`, data);
    return response.data;
  }

  async deleteMediaItem(id: number, force: boolean = false) {
    const response = await this.client.delete(`/media/${id}`, {
      params: { force },
    });
    return response.data;
  }

  // Media Upload - Binary upload with base64 content
  async uploadMedia(fileData: {
    filename: string;
    content: string; // base64 encoded
    content_type: string;
    title?: string;
    alt_text?: string;
    caption?: string;
    description?: string;
  }): Promise<any> {
    try {
      // Convert base64 to buffer
      const buffer = Buffer.from(fileData.content, 'base64');
      
      // Upload the file using binary data
      const response = await this.client.post('/media', buffer, {
        headers: {
          'Content-Type': fileData.content_type,
          'Content-Disposition': `attachment; filename="${fileData.filename}"`,
        },
      });

      const mediaId = response.data.id;

      // Update with metadata if provided
      if (fileData.title || fileData.alt_text || fileData.caption || fileData.description) {
        const updateData: any = {};
        
        if (fileData.title) {
          updateData.title = { raw: fileData.title };
        }
        if (fileData.alt_text) {
          updateData.alt_text = fileData.alt_text;
        }
        if (fileData.caption) {
          updateData.caption = { raw: fileData.caption };
        }
        if (fileData.description) {
          updateData.description = { raw: fileData.description };
        }

        const updateResponse = await this.client.post(`/media/${mediaId}`, updateData);
        return updateResponse.data;
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to upload media: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  // Media Upload from URL - Downloads from URL and uploads to WordPress
  async uploadMediaFromUrl(urlData: {
    url: string;
    filename?: string;
    title?: string;
    alt_text?: string;
    caption?: string;
    description?: string;
  }): Promise<any> {
    try {
      // Download the image from URL
      const imageResponse = await axios.get(urlData.url, {
        responseType: 'arraybuffer',
        timeout: 30000, // 30 second timeout
        headers: {
          'User-Agent': 'WordPress-MCP/1.0',
        },
      });

      // Get content type from response headers
      const contentType = imageResponse.headers['content-type'] || 'image/png';
      
      // Extract filename from URL if not provided
      let filename = urlData.filename;
      if (!filename) {
        const urlPath = new URL(urlData.url).pathname;
        filename = urlPath.split('/').pop() || 'image.png';
        
        // Remove query parameters if present
        filename = filename.split('?')[0];
        
        // Ensure it has an extension
        if (!filename.includes('.')) {
          const ext = contentType.split('/')[1] || 'png';
          filename = `${filename}.${ext}`;
        }
      }

      // Convert to base64
      const base64Content = Buffer.from(imageResponse.data).toString('base64');

      // Upload using existing method
      return await this.uploadMedia({
        filename,
        content: base64Content,
        content_type: contentType,
        title: urlData.title,
        alt_text: urlData.alt_text,
        caption: urlData.caption,
        description: urlData.description,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Failed to download media: Request timeout');
        }
        throw new Error(`Failed to download and upload media: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  // Alias for consistency
  async uploadMediaBinary(fileData: {
    filename: string;
    content: string;
    content_type: string;
    title?: string;
    alt_text?: string;
    caption?: string;
    description?: string;
  }): Promise<any> {
    return this.uploadMedia(fileData);
  }

  // Menus (requires additional plugin support)
  async getMenus() {
    try {
      const response = await this.client.get('/menus');
      return response.data;
    } catch (error) {
      // Fallback for sites without menu endpoint
      return [];
    }
  }

  async getMenu(id: number) {
    try {
      const response = await this.client.get(`/menus/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Menu endpoint not available. Please install a menu plugin.');
    }
  }

  // Settings
  async getSettings() {
    const response = await this.client.get('/settings');
    return response.data;
  }

  async updateSettings(data: any) {
    const response = await this.client.post('/settings', data);
    return response.data;
  }

  // Search
  async search(query: string, type?: string, subtype?: string) {
    const params: any = { search: query };
    if (type) params.type = type;
    if (subtype) params.subtype = subtype;
    
    const response = await this.client.get('/search', { params });
    return response.data;
  }

  // Themes
  async getThemes() {
    try {
      const response = await this.client.get('/themes');
      return response.data;
    } catch (error) {
      throw new Error('Themes endpoint not available or insufficient permissions.');
    }
  }

  async getActiveTheme() {
    try {
      const response = await this.client.get('/themes?status=active');
      return response.data;
    } catch (error) {
      throw new Error('Active theme endpoint not available or insufficient permissions.');
    }
  }

  // Plugins
  async getPlugins() {
    try {
      const response = await this.client.get('/plugins');
      return response.data;
    } catch (error) {
      throw new Error('Plugins endpoint not available or insufficient permissions.');
    }
  }

  async getActivePlugins() {
    try {
      const response = await this.client.get('/plugins?status=active');
      return response.data;
    } catch (error) {
      throw new Error('Active plugins endpoint not available or insufficient permissions.');
    }
  }

  // Custom Post Types
  async getPostTypes() {
    const response = await this.client.get('/types');
    return response.data;
  }

  async getPostType(type: string) {
    const response = await this.client.get(`/types/${type}`);
    return response.data;
  }

  // Taxonomies
  async getTaxonomies() {
    const response = await this.client.get('/taxonomies');
    return response.data;
  }

  async getTaxonomy(taxonomy: string) {
    const response = await this.client.get(`/taxonomies/${taxonomy}`);
    return response.data;
  }

  // Site Health and Status
  async getSiteHealth() {
    try {
      const response = await this.client.get('/site-health');
      return response.data;
    } catch (error) {
      throw new Error('Site health endpoint not available or insufficient permissions.');
    }
  }

  // Batch Operations
  async batchRequest(requests: any[]) {
    try {
      const response = await this.client.post('/batch', { requests });
      return response.data;
    } catch (error) {
      throw new Error('Batch operations not supported or insufficient permissions.');
    }
  }

  // Application Passwords (for current user)
  async getApplicationPasswords() {
    try {
      const response = await this.client.get('/users/me/application-passwords');
      return response.data;
    } catch (error) {
      throw new Error('Application passwords endpoint not available or insufficient permissions.');
    }
  }

  // Widgets
  async getWidgets() {
    try {
      const response = await this.client.get('/widgets');
      return response.data;
    } catch (error) {
      throw new Error('Widgets endpoint not available or insufficient permissions.');
    }
  }

  async getWidget(id: string) {
    try {
      const response = await this.client.get(`/widgets/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Widget endpoint not available or insufficient permissions.');
    }
  }

  // Sidebars
  async getSidebars() {
    try {
      const response = await this.client.get('/sidebars');
      return response.data;
    } catch (error) {
      throw new Error('Sidebars endpoint not available or insufficient permissions.');
    }
  }

  async getSidebar(id: string) {
    try {
      const response = await this.client.get(`/sidebars/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Sidebar endpoint not available or insufficient permissions.');
    }
  }

  // Block Types
  async getBlockTypes() {
    try {
      const response = await this.client.get('/block-types');
      return response.data;
    } catch (error) {
      throw new Error('Block types endpoint not available or insufficient permissions.');
    }
  }

  async getBlockType(name: string) {
    try {
      const response = await this.client.get(`/block-types/${name}`);
      return response.data;
    } catch (error) {
      throw new Error('Block type endpoint not available or insufficient permissions.');
    }
  }

  // Revisions
  async getPostRevisions(postId: number) {
    const response = await this.client.get(`/posts/${postId}/revisions`);
    return response.data;
  }

  async getPostRevision(postId: number, revisionId: number) {
    const response = await this.client.get(`/posts/${postId}/revisions/${revisionId}`);
    return response.data;
  }

  async getPageRevisions(pageId: number) {
    const response = await this.client.get(`/pages/${pageId}/revisions`);
    return response.data;
  }

  async getPageRevision(pageId: number, revisionId: number) {
    const response = await this.client.get(`/pages/${pageId}/revisions/${revisionId}`);
    return response.data;
  }

  // Autosaves
  async getPostAutosaves(postId: number) {
    const response = await this.client.get(`/posts/${postId}/autosaves`);
    return response.data;
  }

  async getPostAutosave(postId: number, autosaveId: number) {
    const response = await this.client.get(`/posts/${postId}/autosaves/${autosaveId}`);
    return response.data;
  }

  // Custom Fields (meta)
  async getPostMeta(postId: number) {
    const response = await this.client.get(`/posts/${postId}/meta`);
    return response.data;
  }

  async createPostMeta(postId: number, data: any) {
    const response = await this.client.post(`/posts/${postId}/meta`, data);
    return response.data;
  }

  async updatePostMeta(postId: number, metaId: number, data: any) {
    const response = await this.client.post(`/posts/${postId}/meta/${metaId}`, data);
    return response.data;
  }

  async deletePostMeta(postId: number, metaId: number) {
    const response = await this.client.delete(`/posts/${postId}/meta/${metaId}`);
    return response.data;
  }
}