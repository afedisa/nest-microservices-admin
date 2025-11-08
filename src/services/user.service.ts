import apiService from './api.service';
import { User } from '../types/entities';
import { CreateUserRequest, UpdateUserRequest, QueryParams } from '../types/api';

class UserService {
  private baseUrl = '/v1/users';

  async getAll(params?: QueryParams): Promise<User[]> {
    return await apiService.get<User[]>(`${this.baseUrl}/all`, params);
  }

  async getById(id: string): Promise<User> {
    return await apiService.get<User>(`${this.baseUrl}/${id}`);
  }

  async getByEstablishment(establishmentId: string, params?: QueryParams): Promise<User[]> {
    return await apiService.get<User[]>(`${this.baseUrl}/establishment/${establishmentId}`, params);
  }

  async create(data: CreateUserRequest): Promise<User> {
    return await apiService.post<User>(this.baseUrl, data);
  }

  async update(id: string, data: UpdateUserRequest): Promise<User> {
    return await apiService.patch<User>(`${this.baseUrl}/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return await apiService.delete<void>(`${this.baseUrl}/${id}`);
  }

  async updateStatus(id: string, status: boolean): Promise<User> {
    return await apiService.patch<User>(`${this.baseUrl}/${id}/status`, { status });
  }

  async changePassword(id: string, currentPassword: string, newPassword: string): Promise<void> {
    return await apiService.patch<void>(`${this.baseUrl}/${id}/password`, {
      currentPassword,
      newPassword
    });
  }

  async resetPassword(id: string): Promise<{ temporaryPassword: string }> {
    return await apiService.post<{ temporaryPassword: string }>(`${this.baseUrl}/${id}/reset-password`);
  }

  async getStats(): Promise<any> {
    return await apiService.get<any>(`${this.baseUrl}/stats`);
  }
}

const userService = new UserService();
export default userService;