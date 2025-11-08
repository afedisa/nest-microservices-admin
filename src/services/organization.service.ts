import apiService from './api.service';
import { Organization } from '../types/entities';
import { CreateOrganizationRequest, UpdateOrganizationRequest, QueryParams } from '../types/api';

class OrganizationService {
  private baseUrl = '/v1/organizations';

  async getAll(params?: QueryParams): Promise<Organization[]> {
    return await apiService.get<Organization[]>(`${this.baseUrl}/all`, params);
  }

  async getById(id: string): Promise<Organization> {
    return await apiService.get<Organization>(`${this.baseUrl}/${id}`);
  }

  async create(data: CreateOrganizationRequest): Promise<Organization> {
    return await apiService.post<Organization>(this.baseUrl, data);
  }

  async update(id: string, data: UpdateOrganizationRequest): Promise<Organization> {
    return await apiService.patch<Organization>(`${this.baseUrl}/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return await apiService.delete<void>(`${this.baseUrl}/${id}`);
  }

  async updateStatus(id: string, status: boolean): Promise<Organization> {
    return await apiService.patch<Organization>(`${this.baseUrl}/${id}/status`, { status });
  }

  async getStats(): Promise<any> {
    return await apiService.get<any>(`${this.baseUrl}/stats`);
  }
}

const organizationService = new OrganizationService();
export default organizationService;