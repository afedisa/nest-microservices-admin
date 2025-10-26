import apiService from './api.service';
import { LoginRequest, LoginResponse } from '../types/api';

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiService.post<LoginResponse>('/v1/auth/login', credentials);
    
    // Store token and user info
    if (response.access_token) {
      apiService.setAuthToken(response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  async logout(): Promise<void> {
    apiService.removeAuthToken();
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
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