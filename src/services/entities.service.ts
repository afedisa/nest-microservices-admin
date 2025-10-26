import apiService from './api.service';
import { Service, Queue, Turn } from '../types/entities';
import { QueryParams } from '../types/api';

class ServiceService {
  private baseUrl = '/v1/services';

  async getAll(params?: QueryParams): Promise<Service[]> {
    return await apiService.get<Service[]>(this.baseUrl, params);
  }

  async getById(id: string): Promise<Service> {
    return await apiService.get<Service>(`${this.baseUrl}/${id}`);
  }

  async getByOrganization(organizationId: string, params?: QueryParams): Promise<Service[]> {
    return await apiService.get<Service[]>(`${this.baseUrl}/organization/${organizationId}`, params);
  }

  async create(data: any): Promise<Service> {
    return await apiService.post<Service>(this.baseUrl, data);
  }

  async update(id: string, data: any): Promise<Service> {
    return await apiService.put<Service>(`${this.baseUrl}/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return await apiService.delete<void>(`${this.baseUrl}/${id}`);
  }
}

class QueueService {
  private baseUrl = '/v1/queues';

  async getAll(params?: QueryParams): Promise<Queue[]> {
    return await apiService.get<Queue[]>(this.baseUrl, params);
  }

  async getById(id: string): Promise<Queue> {
    return await apiService.get<Queue>(`${this.baseUrl}/${id}`);
  }

  async getByEstablishment(establishmentId: string, params?: QueryParams): Promise<Queue[]> {
    return await apiService.get<Queue[]>(`${this.baseUrl}/establishment/${establishmentId}`, params);
  }

  async create(data: any): Promise<Queue> {
    return await apiService.post<Queue>(this.baseUrl, data);
  }

  async update(id: string, data: any): Promise<Queue> {
    return await apiService.put<Queue>(`${this.baseUrl}/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return await apiService.delete<void>(`${this.baseUrl}/${id}`);
  }
}

class TurnService {
  private baseUrl = '/v1/turns';

  async getAll(params?: QueryParams): Promise<Turn[]> {
    return await apiService.get<Turn[]>(this.baseUrl, params);
  }

  async getById(id: string): Promise<Turn> {
    return await apiService.get<Turn>(`${this.baseUrl}/${id}`);
  }

  async getByQueue(queueId: string, params?: QueryParams): Promise<Turn[]> {
    return await apiService.get<Turn[]>(`${this.baseUrl}/queue/${queueId}`, params);
  }

  async create(data: any): Promise<Turn> {
    return await apiService.post<Turn>(this.baseUrl, data);
  }

  async update(id: string, data: any): Promise<Turn> {
    return await apiService.put<Turn>(`${this.baseUrl}/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return await apiService.delete<void>(`${this.baseUrl}/${id}`);
  }

  async callNext(queueId: string): Promise<Turn> {
    return await apiService.post<Turn>(`${this.baseUrl}/call-next/${queueId}`);
  }

  async finish(id: string): Promise<Turn> {
    return await apiService.patch<Turn>(`${this.baseUrl}/${id}/finish`);
  }
}

const serviceService = new ServiceService();
const queueService = new QueueService();
const turnService = new TurnService();

export { serviceService, queueService, turnService };