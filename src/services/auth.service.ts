import apiService from './api.service';
import { LoginRequest, LoginResponse } from '../types/api';

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiService.post<LoginResponse>('/v1/auth/login', credentials);
    
    // Store token and user info
    if (response.token) {
      apiService.setAuthToken(response.token);
      // Guardamos los datos del usuario en la clave 'userData' según el requisito
      localStorage.setItem('userData', JSON.stringify(response.userData));
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