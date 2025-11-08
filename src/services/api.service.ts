import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { QueryParams } from '../types/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        // No añadir token en login/logout según la regla
        const url = config.url || '';
        if (url.includes('/v1/auth/login') || url.includes('/v1/auth/logout')) {
          return config;
        }

        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Limpiar token y datos de usuario
          localStorage.removeItem('auth_token');
          localStorage.removeItem('userData');
          // Intentamos borrar cookies comunes que puedan contener el jwt
          try {
            const cookieNames = ['jwtToken', 'token', 'access_token', 'jwt'];
            cookieNames.forEach((name) => {
              document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
            });
          } catch (e) {
            // no crítico si falla (e.g. SSR env)
          }
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic GET method
  async get<T>(url: string, params?: QueryParams): Promise<T> {
    const response: AxiosResponse<T> = await this.api.get(url, { params });
    return response.data;
  }

  // Generic POST method
  async post<T, D = any>(url: string, data?: D): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(url, data);
    return response.data;
  }

  // Generic PUT method
  async put<T, D = any>(url: string, data?: D): Promise<T> {
    const response: AxiosResponse<T> = await this.api.put(url, data);
    return response.data;
  }

  // Generic DELETE method
  async delete<T>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await this.api.delete(url);
    return response.data;
  }

  // Generic PATCH method
  async patch<T, D = any>(url: string, data?: D): Promise<T> {
    const response: AxiosResponse<T> = await this.api.patch(url, data);
    return response.data;
  }

  // Set auth token
  setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  // Remove auth token
  removeAuthToken(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('userData');

    // Intentar borrar cookies comunes donde el backend pudiera haber guardado el jwt
    try {
      const cookieNames = ['jwtToken', 'token', 'access_token', 'jwt'];
      cookieNames.forEach((name) => {
        document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
      });
    } catch (e) {
      // noop
    }
  }

  // Get auth token
  getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}

const apiService = new ApiService();
export default apiService;