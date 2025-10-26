import React, { useState, useEffect } from 'react';
import {
  BuildingOfficeIcon,
  BuildingStorefrontIcon,
  UsersIcon,
  ClockIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';
import dashboardService from '../services/dashboard.service';
import { DashboardStats, ChartData } from '../types/entities';
import toast from 'react-hot-toast';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<any>;
  color: string;
  trend?: number;
}

function StatCard({ title, value, icon: Icon, color, trend }: StatCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${color}`} aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value.toLocaleString()}</div>
                {trend !== undefined && (
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                    trend >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trend >= 0 ? (
                      <ArrowTrendingUpIcon className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowTrendingDownIcon className="self-center flex-shrink-0 h-4 w-4 text-red-500" />
                    )}
                    <span className="sr-only">{trend >= 0 ? 'Increased' : 'Decreased'} by</span>
                    {Math.abs(trend)}%
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

interface QuickStatsProps {
  data: ChartData[];
  title: string;
}

function QuickStats({ data, title }: QuickStatsProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">{title}</h3>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{item.name}</span>
              <span className="text-sm font-medium text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [usersByRole, setUsersByRole] = useState<ChartData[]>([]);
  const [organizationsByStatus, setOrganizationsByStatus] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch main stats
        const statsData = await dashboardService.getStats();
        setStats(statsData);

        // Fetch chart data
        const [usersData, orgsData] = await Promise.all([
          dashboardService.getUsersByRole(),
          dashboardService.getOrganizationsByStatus(),
        ]);

        setUsersByRole(usersData);
        setOrganizationsByStatus(orgsData);
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Error al cargar los datos del dashboard');
        
        // Set mock data if API fails
        setStats({
          totalOrganizations: 12,
          totalEstablishments: 45,
          totalUsers: 234,
          totalTurns: 1567,
          totalServices: 78,
          activeQueues: 23,
          activeTurns: 45,
          completedTurns: 1522,
        });
        
        setUsersByRole([
          { name: 'Administradores', value: 5 },
          { name: 'Gerentes', value: 12 },
          { name: 'Empleados', value: 89 },
          { name: 'Usuarios', value: 128 },
        ]);
        
        setOrganizationsByStatus([
          { name: 'Activas', value: 10 },
          { name: 'Inactivas', value: 2 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No se pudieron cargar los datos del dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Resumen general del sistema de gestión de turnos
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Organizaciones"
          value={stats.totalOrganizations}
          icon={BuildingOfficeIcon}
          color="text-blue-600"
          trend={8.2}
        />
        <StatCard
          title="Total Establecimientos"
          value={stats.totalEstablishments}
          icon={BuildingStorefrontIcon}
          color="text-green-600"
          trend={12.5}
        />
        <StatCard
          title="Total Usuarios"
          value={stats.totalUsers}
          icon={UsersIcon}
          color="text-purple-600"
          trend={-2.1}
        />
        <StatCard
          title="Turnos Activos"
          value={stats.activeTurns}
          icon={ClockIcon}
          color="text-orange-600"
        />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Turnos"
          value={stats.totalTurns}
          icon={ChartBarIcon}
          color="text-indigo-600"
        />
        <StatCard
          title="Turnos Completados"
          value={stats.completedTurns}
          icon={ChartBarIcon}
          color="text-green-600"
        />
        <StatCard
          title="Total Servicios"
          value={stats.totalServices}
          icon={ChartBarIcon}
          color="text-blue-600"
        />
        <StatCard
          title="Colas Activas"
          value={stats.activeQueues}
          icon={ClockIcon}
          color="text-red-600"
        />
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <QuickStats
          title="Usuarios por Rol"
          data={usersByRole}
        />
        <QuickStats
          title="Organizaciones por Estado"
          data={organizationsByStatus}
        />
      </div>

      {/* Recent activity section */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Actividad Reciente
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-600">
                Nueva organización "Clínica San José" registrada
              </span>
              <span className="text-xs text-gray-400">hace 2 horas</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-sm text-gray-600">
                15 nuevos turnos creados en "Banco Central"
              </span>
              <span className="text-xs text-gray-400">hace 4 horas</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-sm text-gray-600">
                Usuario "Juan Pérez" actualizado
              </span>
              <span className="text-xs text-gray-400">hace 6 horas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}