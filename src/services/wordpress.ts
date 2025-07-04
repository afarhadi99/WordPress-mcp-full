import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';
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

  // Media Upload
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
      
      // Create form data
      const formData = new FormData();
      formData.append('file', buffer, {
        filename: fileData.filename,
        contentType: fileData.content_type,
      });

      // Add optional metadata
      if (fileData.title) {
        formData.append('title', fileData.title);
      }
      if (fileData.alt_text) {
        formData.append('alt_text', fileData.alt_text);
      }
      if (fileData.caption) {
        formData.append('caption', fileData.caption);
      }
      if (fileData.description) {
        formData.append('description', fileData.description);
      }

      const response = await this.client.post('/media', formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to upload media: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  // Alternative binary upload method
  async uploadMediaBinary(fileData: {
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
      
      // Upload the file
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
}