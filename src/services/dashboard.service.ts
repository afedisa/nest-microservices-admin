import apiService from './api.service';
import { DashboardStats, ChartData, TimeSeriesData } from '../types/entities';

class DashboardService {
  private baseUrl = '/v1/dashboard';

  async getStats(): Promise<DashboardStats> {
    return await apiService.get<DashboardStats>(`${this.baseUrl}/stats`);
  }

  async getOrganizationsByStatus(): Promise<ChartData[]> {
    return await apiService.get<ChartData[]>(`${this.baseUrl}/organizations/by-status`);
  }

  async getEstablishmentsByOrganization(): Promise<ChartData[]> {
    return await apiService.get<ChartData[]>(`${this.baseUrl}/establishments/by-organization`);
  }

  async getUsersByRole(): Promise<ChartData[]> {
    return await apiService.get<ChartData[]>(`${this.baseUrl}/users/by-role`);
  }

  async getTurnsTrend(days: number = 30): Promise<TimeSeriesData[]> {
    return await apiService.get<TimeSeriesData[]>(`${this.baseUrl}/turns/trend`, { days });
  }

  async getActiveTurnsByService(): Promise<ChartData[]> {
    return await apiService.get<ChartData[]>(`${this.baseUrl}/turns/by-service`);
  }

  async getQueueMetrics(): Promise<any> {
    return await apiService.get<any>(`${this.baseUrl}/queues/metrics`);
  }

  async getServiceMetrics(): Promise<any> {
    return await apiService.get<any>(`${this.baseUrl}/services/metrics`);
  }

  async getEstablishmentMetrics(establishmentId: string): Promise<any> {
    return await apiService.get<any>(`${this.baseUrl}/establishments/${establishmentId}/metrics`);
  }

  async getOrganizationMetrics(organizationId: string): Promise<any> {
    return await apiService.get<any>(`${this.baseUrl}/organizations/${organizationId}/metrics`);
  }

  async getRealtimeStats(): Promise<any> {
    return await apiService.get<any>(`${this.baseUrl}/realtime`);
  }
}

const dashboardService = new DashboardService();
export default dashboardService;