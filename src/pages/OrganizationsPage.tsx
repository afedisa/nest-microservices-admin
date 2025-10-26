import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { Organization } from '../types/entities';
import organizationService from '../services/organization.service';
import toast from 'react-hot-toast';

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrganizations, setSelectedOrganizations] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const data = await organizationService.getAll();
      setOrganizations(data);
    } catch (error: any) {
      console.error('Error fetching organizations:', error);
      toast.error('Error al cargar las organizaciones');
      
      // Mock data for demo
      setOrganizations([
        {
          id: '1',
          name: 'Clínica San José',
          description: 'Centro médico especializado',
          address: 'Av. Principal 123',
          city: 'Madrid',
          state: 'Madrid',
          phone: '+34 911 234 567',
          status: true,
          logo_link_url: '',
          logo_link_name: '',
          img_link_url: '',
          img_link_name: '',
          hasBooking: true,
          waitingPeople: true,
          hasSMS: true,
          remainingSMS: 500,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Banco Central',
          description: 'Servicios bancarios',
          address: 'Calle Mayor 456',
          city: 'Barcelona',
          state: 'Cataluña',
          phone: '+34 932 345 678',
          status: true,
          logo_link_url: '',
          logo_link_name: '',
          img_link_url: '',
          img_link_name: '',
          hasBooking: false,
          waitingPeople: true,
          hasSMS: false,
          remainingSMS: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta organización?')) {
      try {
        await organizationService.delete(id);
        toast.success('Organización eliminada correctamente');
        fetchOrganizations();
      } catch (error) {
        toast.error('Error al eliminar la organización');
      }
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: boolean) => {
    try {
      await organizationService.updateStatus(id, !currentStatus);
      toast.success('Estado actualizado correctamente');
      fetchOrganizations();
    } catch (error) {
      toast.error('Error al actualizar el estado');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedOrganizations.length === 0) return;
    
    if (window.confirm(`¿Estás seguro de que quieres eliminar ${selectedOrganizations.length} organizaciones?`)) {
      try {
        await Promise.all(selectedOrganizations.map(id => organizationService.delete(id)));
        toast.success('Organizaciones eliminadas correctamente');
        setSelectedOrganizations([]);
        fetchOrganizations();
      } catch (error) {
        toast.error('Error al eliminar las organizaciones');
      }
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedOrganizations(prev =>
      prev.includes(id)
        ? prev.filter(orgId => orgId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedOrganizations(prev =>
      prev.length === filteredOrganizations.length
        ? []
        : filteredOrganizations.map(org => org.id)
    );
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
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Organizaciones</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona las organizaciones del sistema
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => navigate('/organizations/new')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Nueva Organización
          </button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar organizaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        
        {selectedOrganizations.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <TrashIcon className="-ml-1 mr-2 h-4 w-4" />
            Eliminar Seleccionadas ({selectedOrganizations.length})
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedOrganizations.length === filteredOrganizations.length && filteredOrganizations.length > 0}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Organización
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ubicación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Servicios
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrganizations.map((organization) => (
              <tr key={organization.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedOrganizations.includes(organization.id)}
                    onChange={() => toggleSelection(organization.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{organization.name}</div>
                    <div className="text-sm text-gray-500">{organization.description}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{organization.city}, {organization.state}</div>
                  <div className="text-sm text-gray-500">{organization.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleStatusToggle(organization.id, organization.status)}
                    className={`inline-flex px-2 text-xs font-semibold rounded-full ${
                      organization.status
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {organization.status ? 'Activa' : 'Inactiva'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    {organization.hasBooking && (
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        Reservas
                      </span>
                    )}
                    {organization.hasSMS && (
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                        SMS
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => navigate(`/organizations/${organization.id}`)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => navigate(`/organizations/${organization.id}/edit`)}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(organization.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredOrganizations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron organizaciones.</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div className="flex justify-between items-center text-sm text-gray-700">
          <span>
            Mostrando {filteredOrganizations.length} de {organizations.length} organizaciones
          </span>
          <span>
            {organizations.filter(org => org.status).length} activas
          </span>
        </div>
      </div>
    </div>
  );
}