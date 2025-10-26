import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  BuildingOfficeIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';
import dashboardService from '../services/dashboard.service';
import { ChartData, TimeSeriesData } from '../types/entities';
import toast from 'react-hot-toast';

// Simple chart component since we don't have recharts
interface SimpleBarChartProps {
  data: ChartData[];
  title: string;
  color: string;
}

function SimpleBarChart({ data, title, color }: SimpleBarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-24 text-sm text-gray-600 truncate">{item.name}</div>
            <div className="flex-1 mx-3">
              <div className="bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full ${color}`}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="w-12 text-sm font-medium text-gray-900 text-right">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: number;
  change: number;
  icon: React.ComponentType<any>;
  color: string;
}

function MetricCard({ title, value, change, icon: Icon, color }: MetricCardProps) {
  const isPositive = change >= 0;
  
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {value.toLocaleString()}
                </div>
                <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isPositive ? (
                    <ArrowTrendingUpIcon className="self-center flex-shrink-0 h-4 w-4" />
                  ) : (
                    <ArrowTrendingDownIcon className="self-center flex-shrink-0 h-4 w-4" />
                  )}
                  <span className="ml-1">{Math.abs(change)}%</span>
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SimpleLineChartProps {
  data: TimeSeriesData[];
  title: string;
}

function SimpleLineChart({ data, title }: SimpleLineChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="relative h-48">
        <svg width="100%" height="100%" className="overflow-visible">
          <polyline
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
            points={data.map((point, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = 100 - ((point.value - minValue) / range) * 100;
              return `${x},${y}`;
            }).join(' ')}
          />
          {data.map((point, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - ((point.value - minValue) / range) * 100;
            return (
              <circle
                key={index}
                cx={`${x}%`}
                cy={`${y}%`}
                r="3"
                fill="#3B82F6"
              />
            );
          })}
        </svg>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
          {data.map((point, index) => (
            <span key={index}>{new Date(point.date).toLocaleDateString()}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function StatisticsPage() {
  const [loading, setLoading] = useState(true);
  const [usersByRole, setUsersByRole] = useState<ChartData[]>([]);
  const [establishmentsByOrg, setEstablishmentsByOrg] = useState<ChartData[]>([]);
  const [turnsTrend, setTurnsTrend] = useState<TimeSeriesData[]>([]);
  const [turnsByService, setTurnsByService] = useState<ChartData[]>([]);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      
      const [usersData, establishmentsData, trendsData, servicesData] = await Promise.all([
        dashboardService.getUsersByRole(),
        dashboardService.getEstablishmentsByOrganization(),
        dashboardService.getTurnsTrend(30),
        dashboardService.getActiveTurnsByService(),
      ]);

      setUsersByRole(usersData);
      setEstablishmentsByOrg(establishmentsData);
      setTurnsTrend(trendsData);
      setTurnsByService(servicesData);
    } catch (error: any) {
      console.error('Error fetching statistics:', error);
      toast.error('Error al cargar las estadísticas');
      
      // Mock data for demo
      setUsersByRole([
        { name: 'Administradores', value: 5 },
        { name: 'Gerentes', value: 12 },
        { name: 'Empleados', value: 89 },
        { name: 'Usuarios', value: 128 },
      ]);
      
      setEstablishmentsByOrg([
        { name: 'Clínica San José', value: 8 },
        { name: 'Banco Central', value: 12 },
        { name: 'Centro Comercial', value: 6 },
        { name: 'Hospital General', value: 15 },
      ]);
      
      setTurnsTrend([
        { date: '2024-01-01', value: 45 },
        { date: '2024-01-02', value: 52 },
        { date: '2024-01-03', value: 48 },
        { date: '2024-01-04', value: 61 },
        { date: '2024-01-05', value: 55 },
        { date: '2024-01-06', value: 67 },
        { date: '2024-01-07', value: 73 },
      ]);
      
      setTurnsByService([
        { name: 'Consulta General', value: 45 },
        { name: 'Servicios Bancarios', value: 32 },
        { name: 'Atención al Cliente', value: 28 },
        { name: 'Emergencias', value: 15 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Estadísticas Avanzadas</h1>
        <p className="mt-1 text-sm text-gray-500">
          Análisis detallado del sistema de gestión de turnos
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Turnos Diarios Promedio"
          value={67}
          change={12.5}
          icon={ClockIcon}
          color="text-blue-600"
        />
        <MetricCard
          title="Tiempo Espera Promedio"
          value={23}
          change={-8.2}
          icon={ChartBarIcon}
          color="text-green-600"
        />
        <MetricCard
          title="Satisfacción Cliente"
          value={87}
          change={5.3}
          icon={ChartBarIcon}
          color="text-purple-600"
        />
        <MetricCard
          title="Eficiencia Operativa"
          value={92}
          change={2.1}
          icon={BuildingOfficeIcon}
          color="text-orange-600"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SimpleBarChart
          data={usersByRole}
          title="Distribución de Usuarios por Rol"
          color="bg-blue-500"
        />
        <SimpleBarChart
          data={establishmentsByOrg}
          title="Establecimientos por Organización"
          color="bg-green-500"
        />
      </div>

      {/* Trends */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SimpleLineChart
          data={turnsTrend}
          title="Tendencia de Turnos (Últimos 7 días)"
        />
        <SimpleBarChart
          data={turnsByService}
          title="Turnos Activos por Servicio"
          color="bg-purple-500"
        />
      </div>

      {/* Additional Stats Tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Performing Establishments */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Establecimientos con Mejor Rendimiento
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Sucursal Centro', metric: '98% satisfacción', trend: '+5%' },
                { name: 'Hospital General', metric: '15 min espera', trend: '-12%' },
                { name: 'Banco Norte', metric: '156 turnos/día', trend: '+8%' },
                { name: 'Clínica Oeste', metric: '92% eficiencia', trend: '+3%' },
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.metric}</div>
                  </div>
                  <div className={`text-sm font-medium ${
                    item.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.trend}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Service Performance */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Rendimiento por Tipo de Servicio
            </h3>
            <div className="space-y-3">
              {[
                { service: 'Consulta Médica', time: '25 min', satisfaction: '95%' },
                { service: 'Servicios Bancarios', time: '18 min', satisfaction: '89%' },
                { service: 'Atención Cliente', time: '12 min', satisfaction: '92%' },
                { service: 'Trámites Legales', time: '35 min', satisfaction: '87%' },
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <div className="text-sm font-medium text-gray-900">{item.service}</div>
                  <div className="flex space-x-4 text-sm text-gray-500">
                    <span>{item.time}</span>
                    <span className="text-green-600">{item.satisfaction}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Estado del Sistema
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">99.8%</div>
              <div className="text-sm text-gray-500">Tiempo de Actividad</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">156ms</div>
              <div className="text-sm text-gray-500">Tiempo de Respuesta</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">2,453</div>
              <div className="text-sm text-gray-500">Turnos Procesados Hoy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}