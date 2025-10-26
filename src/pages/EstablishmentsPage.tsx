import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import { Establishment, Organization } from '../types/entities';
import establishmentService from '../services/establishment.service';
import organizationService from '../services/organization.service';
import toast from 'react-hot-toast';

export default function EstablishmentsPage() {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrganization, setSelectedOrganization] = useState<string>('');
  const [selectedEstablishments, setSelectedEstablishments] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [establishmentsData, organizationsData] = await Promise.all([
        establishmentService.getAll(),
        organizationService.getAll(),
      ]);
      setEstablishments(establishmentsData);
      setOrganizations(organizationsData);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error('Error al cargar los establecimientos');
      
      // Mock data for demo
      setEstablishments([
        {
          id: '1',
          name: 'Sucursal Centro',
          description: 'Sucursal principal en el centro',
          address: 'Calle Principal 100',
          city: 'Madrid',
          phone: '+34 911 111 111',
          img_link: '',
          status: true,
          askingName: true,
          askingPhone: false,
          hasSMS: true,
          remainingSMS: 200,
          organizationId: '1',
          organization: {
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
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Sucursal Norte',
          description: 'Sucursal en zona norte',
          address: 'Av. Norte 200',
          city: 'Madrid',
          phone: '+34 911 222 222',
          img_link: '',
          status: true,
          askingName: false,
          askingPhone: true,
          hasSMS: false,
          remainingSMS: 0,
          organizationId: '2',
          organization: {
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
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
      
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

  const filteredEstablishments = establishments.filter(est => {
    const matchesSearch = est.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         est.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOrganization = !selectedOrganization || est.organizationId === selectedOrganization;
    return matchesSearch && matchesOrganization;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este establecimiento?')) {
      try {
        await establishmentService.delete(id);
        toast.success('Establecimiento eliminado correctamente');
        fetchData();
      } catch (error) {
        toast.error('Error al eliminar el establecimiento');
      }
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: boolean) => {
    try {
      await establishmentService.updateStatus(id, !currentStatus);
      toast.success('Estado actualizado correctamente');
      fetchData();
    } catch (error) {
      toast.error('Error al actualizar el estado');
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedEstablishments(prev =>
      prev.includes(id)
        ? prev.filter(estId => estId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedEstablishments(prev =>
      prev.length === filteredEstablishments.length
        ? []
        : filteredEstablishments.map(est => est.id)
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
          <h1 className="text-2xl font-semibold text-gray-900">Establecimientos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona los establecimientos del sistema
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => navigate('/establishments/new')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Nuevo Establecimiento
          </button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar establecimientos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={selectedOrganization}
            onChange={(e) => setSelectedOrganization(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Todas las organizaciones</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>
        
        {selectedEstablishments.length > 0 && (
          <button
            onClick={() => {/* Bulk delete logic */}}
            className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <TrashIcon className="-ml-1 mr-2 h-4 w-4" />
            Eliminar Seleccionados ({selectedEstablishments.length})
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
                  checked={selectedEstablishments.length === filteredEstablishments.length && filteredEstablishments.length > 0}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Establecimiento
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
                Configuración
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEstablishments.map((establishment) => (
              <tr key={establishment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedEstablishments.includes(establishment.id)}
                    onChange={() => toggleSelection(establishment.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{establishment.name}</div>
                    <div className="text-sm text-gray-500">{establishment.description}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{establishment.organization?.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{establishment.city}</div>
                  <div className="text-sm text-gray-500">{establishment.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleStatusToggle(establishment.id, establishment.status)}
                    className={`inline-flex px-2 text-xs font-semibold rounded-full ${
                      establishment.status
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {establishment.status ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex flex-col space-y-1">
                    {establishment.askingName && (
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        Pide Nombre
                      </span>
                    )}
                    {establishment.askingPhone && (
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                        Pide Teléfono
                      </span>
                    )}
                    {establishment.hasSMS && (
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                        SMS ({establishment.remainingSMS})
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => navigate(`/establishments/${establishment.id}`)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => navigate(`/establishments/${establishment.id}/edit`)}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(establishment.id)}
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
        
        {filteredEstablishments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron establecimientos.</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div className="flex justify-between items-center text-sm text-gray-700">
          <span>
            Mostrando {filteredEstablishments.length} de {establishments.length} establecimientos
          </span>
          <span>
            {establishments.filter(est => est.status).length} activos
          </span>
        </div>
      </div>
    </div>
  );
}