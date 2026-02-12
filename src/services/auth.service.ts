import apiService from './api.service';
import { LoginRequest, LoginResponse } from '../types/api';
import { hashPassword } from '../utils/hash';

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const pepper = process.env.REACT_APP_PASSWORD_PEPPER;
    if (!pepper) {
      throw new Error('Falta configurar REACT_APP_PASSWORD_PEPPER');
    }

    const hashedPassword = await hashPassword(credentials.password, pepper);
    const payload = { ...credentials, password: hashedPassword };
    const response = await apiService.post<LoginResponse>('/v1/auth/login', payload);
    console.log('Login response:', response);
    // Store token and user info
    if (response.access_token) {
      apiService.setAuthToken(response.access_token);
      localStorage.setItem('user', JSON.stringify(response.userData));
    }
    
    return response;
  }

  async logout(): Promise<void> {
    try {
      // Intentamos notificar al servidor (si existe endpoint de logout)
      // No dependemos de su éxito para limpiar el cliente.
      await apiService.post('/v1/auth/logout');
    } catch (e) {
      // Ignorar errores de logout remoto; seguimos con limpieza local
    }

    // Limpiar token y datos relacionados en cliente
    apiService.removeAuthToken();
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('userData');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!apiService.getAuthToken();
  }

  async register(userData: any): Promise<any> {
    return await apiService.post('/v1/auth/register', userData);
  }

  async forgotPassword(email: string): Promise<any> {
    return await apiService.post('/v1/auth/forgot-password', { email });
  }

  async resetPassword(token: string, password: string): Promise<any> {
    return await apiService.post('/v1/auth/reset-password', { token, password });
  }
}

const authService = new AuthService();
export default authService;