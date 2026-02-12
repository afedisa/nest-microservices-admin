import apiService from './api.service';
import { Establishment } from '../types/entities';
import { CreateEstablishmentRequest, UpdateEstablishmentRequest, QueryParams } from '../types/api';

class EstablishmentService {
  private baseUrl = '/v1/establishments';

  async getAll(params?: QueryParams): Promise<Establishment[]> {
    return await apiService.get<Establishment[]>(`${this.baseUrl}/all`, params);
  }

  async getById(id: string): Promise<Establishment> {
    return await apiService.get<Establishment>(`${this.baseUrl}/${id}`);
  }

  async getByOrganization(organizationId: string, params?: QueryParams): Promise<Establishment[]> {
    return await apiService.get<Establishment[]>(`${this.baseUrl}/organization/${organizationId}`, params);
  }

  async create(data: CreateEstablishmentRequest): Promise<Establishment> {
    return await apiService.post<Establishment>(this.baseUrl, data);
  }

  async update(id: string, data: UpdateEstablishmentRequest): Promise<Establishment> {
    return await apiService.patch<Establishment>(`${this.baseUrl}/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return await apiService.delete<void>(`${this.baseUrl}/${id}`);
  }

  async updateStatus(id: string, status: boolean): Promise<Establishment> {
    return await apiService.patch<Establishment>(`${this.baseUrl}/${id}/status`, { status });
  }

  async getStats(): Promise<any> {
    return await apiService.get<any>(`${this.baseUrl}/stats`);
  }
}

const establishmentService = new EstablishmentService();
export default establishmentService;