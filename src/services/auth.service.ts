import apiService from './api.service';
import { LoginRequest, LoginResponse } from '../types/api';

const encodeHex = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

const hashPassword = async (password: string, pepper: string): Promise<string> => {
  const data = new TextEncoder().encode(`${password}${pepper}`);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return encodeHex(hash);
};

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