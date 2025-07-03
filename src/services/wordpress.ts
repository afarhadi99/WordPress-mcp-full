import axios, { AxiosInstance } from 'axios';
import { WordPressConfig, WordPressPost, WordPressPage, WordPressUser, WordPressCategory, WordPressTag, WordPressComment, WordPressMedia } from '../types.js';

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
  async getPosts(params?: Record<string, any>) {
    const response = await this.client.get('/posts', { params });
    return response.data;
  }

  async getPost(id: number) {
    const response = await this.client.get(`/posts/${id}`);
    return response.data;
  }

  async createPost(post: WordPressPost) {
    const response = await this.client.post('/posts', post);
    return response.data;
  }

  async updatePost(id: number, post: Partial<WordPressPost>) {
    const response = await this.client.put(`/posts/${id}`, post);
    return response.data;
  }

  async deletePost(id: number, force = false) {
    const response = await this.client.delete(`/posts/${id}`, {
      params: { force },
    });
    return response.data;
  }

  // Pages
  async getPages(params?: Record<string, any>) {
    const response = await this.client.get('/pages', { params });
    return response.data;
  }

  async getPage(id: number) {
    const response = await this.client.get(`/pages/${id}`);
    return response.data;
  }

  async createPage(page: WordPressPage) {
    const response = await this.client.post('/pages', page);
    return response.data;
  }

  async updatePage(id: number, page: Partial<WordPressPage>) {
    const response = await this.client.put(`/pages/${id}`, page);
    return response.data;
  }

  async deletePage(id: number, force = false) {
    const response = await this.client.delete(`/pages/${id}`, {
      params: { force },
    });
    return response.data;
  }

  // Users
  async getUsers(params?: Record<string, any>) {
    const response = await this.client.get('/users', { params });
    return response.data;
  }

  async getUser(id: number) {
    const response = await this.client.get(`/users/${id}`);
    return response.data;
  }

  async createUser(user: WordPressUser) {
    const response = await this.client.post('/users', user);
    return response.data;
  }

  async updateUser(id: number, user: Partial<WordPressUser>) {
    const response = await this.client.put(`/users/${id}`, user);
    return response.data;
  }

  async deleteUser(id: number, reassign?: number) {
    const params: any = { force: true };
    if (reassign) params.reassign = reassign;
    
    const response = await this.client.delete(`/users/${id}`, { params });
    return response.data;
  }

  // Categories
  async getCategories(params?: Record<string, any>) {
    const response = await this.client.get('/categories', { params });
    return response.data;
  }

  async getCategory(id: number) {
    const response = await this.client.get(`/categories/${id}`);
    return response.data;
  }

  async createCategory(category: WordPressCategory) {
    const response = await this.client.post('/categories', category);
    return response.data;
  }

  async updateCategory(id: number, category: Partial<WordPressCategory>) {
    const response = await this.client.put(`/categories/${id}`, category);
    return response.data;
  }

  async deleteCategory(id: number, force = false) {
    const response = await this.client.delete(`/categories/${id}`, {
      params: { force },
    });
    return response.data;
  }

  // Tags
  async getTags(params?: Record<string, any>) {
    const response = await this.client.get('/tags', { params });
    return response.data;
  }

  async getTag(id: number) {
    const response = await this.client.get(`/tags/${id}`);
    return response.data;
  }

  async createTag(tag: WordPressTag) {
    const response = await this.client.post('/tags', tag);
    return response.data;
  }

  async updateTag(id: number, tag: Partial<WordPressTag>) {
    const response = await this.client.put(`/tags/${id}`, tag);
    return response.data;
  }

  async deleteTag(id: number, force = false) {
    const response = await this.client.delete(`/tags/${id}`, {
      params: { force },
    });
    return response.data;
  }

  // Comments
  async getComments(params?: Record<string, any>) {
    const response = await this.client.get('/comments', { params });
    return response.data;
  }

  async getComment(id: number) {
    const response = await this.client.get(`/comments/${id}`);
    return response.data;
  }

  async createComment(comment: WordPressComment) {
    const response = await this.client.post('/comments', comment);
    return response.data;
  }

  async updateComment(id: number, comment: Partial<WordPressComment>) {
    const response = await this.client.put(`/comments/${id}`, comment);
    return response.data;
  }

  async deleteComment(id: number, force = false) {
    const response = await this.client.delete(`/comments/${id}`, {
      params: { force },
    });
    return response.data;
  }

  // Media
  async getMedia(params?: Record<string, any>) {
    const response = await this.client.get('/media', { params });
    return response.data;
  }

  async getMediaItem(id: number) {
    const response = await this.client.get(`/media/${id}`);
    return response.data;
  }

  async updateMediaItem(id: number, media: Partial<WordPressMedia>) {
    const response = await this.client.put(`/media/${id}`, media);
    return response.data;
  }

  async deleteMediaItem(id: number, force = false) {
    const response = await this.client.delete(`/media/${id}`, {
      params: { force },
    });
    return response.data;
  }

  // Menu Items
  async getMenus() {
    const response = await this.client.get('/menus');
    return response.data;
  }

  async getMenu(id: number) {
    const response = await this.client.get(`/menus/${id}`);
    return response.data;
  }

  // Settings
  async getSettings() {
    const response = await this.client.get('/settings');
    return response.data;
  }

  async updateSettings(settings: Record<string, any>) {
    const response = await this.client.post('/settings', settings);
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