import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { User, ROLES } from '../types/entities';
import userService from '../services/user.service';
import toast from 'react-hot-toast';

const roleColors = {
  [ROLES.ADMIN]: 'bg-red-100 text-red-800',
  [ROLES.MANAGER]: 'bg-blue-100 text-blue-800',
  [ROLES.EMPLOYEE]: 'bg-green-100 text-green-800',
  [ROLES.USER]: 'bg-gray-100 text-gray-800',
};

const roleLabels = {
  [ROLES.ADMIN]: 'Administrador',
  [ROLES.MANAGER]: 'Gerente',
  [ROLES.EMPLOYEE]: 'Empleado',
  [ROLES.USER]: 'Usuario',
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(data);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error('Error al cargar los usuarios');
      
      // Mock data for demo
      setUsers([
        {
          id: '1',
          name: 'Juan',
          surname: 'Pérez',
          username: 'jperez',
          email: 'juan.perez@clinica.com',
          password: '',
          role: ROLES.ADMIN,
          status: true,
          emailverified: true,
          socialMediaUser: false,
          language: 'es',
          verificationToken: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'María',
          surname: 'González',
          username: 'mgonzalez',
          email: 'maria.gonzalez@clinica.com',
          password: '',
          role: ROLES.MANAGER,
          status: true,
          emailverified: true,
          socialMediaUser: false,
          language: 'es',
          verificationToken: '',
          establishmentId: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '3',
          name: 'Carlos',
          surname: 'López',
          username: 'clopez',
          email: 'carlos.lopez@banco.com',
          password: '',
          role: ROLES.EMPLOYEE,
          status: true,
          emailverified: false,
          socialMediaUser: false,
          language: 'es',
          verificationToken: '',
          establishmentId: '2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '4',
          name: 'Ana',
          surname: 'Martínez',
          username: 'amartinez',
          email: 'ana.martinez@email.com',
          password: '',
          role: ROLES.USER,
          status: false,
          emailverified: true,
          socialMediaUser: true,
          language: 'es',
          verificationToken: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.surname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !selectedRole || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await userService.delete(id);
        toast.success('Usuario eliminado correctamente');
        fetchUsers();
      } catch (error) {
        toast.error('Error al eliminar el usuario');
      }
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: boolean) => {
    try {
      await userService.updateStatus(id, !currentStatus);
      toast.success('Estado actualizado correctamente');
      fetchUsers();
    } catch (error) {
      toast.error('Error al actualizar el estado');
    }
  };

  const handleResetPassword = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres restablecer la contraseña de este usuario?')) {
      try {
        const result = await userService.resetPassword(id);
        toast.success(`Contraseña restablecida. Nueva contraseña: ${result.temporaryPassword}`);
      } catch (error) {
        toast.error('Error al restablecer la contraseña');
      }
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedUsers(prev =>
      prev.includes(id)
        ? prev.filter(userId => userId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedUsers(prev =>
      prev.length === filteredUsers.length
        ? []
        : filteredUsers.map(user => user.id)
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
          <h1 className="text-2xl font-semibold text-gray-900">Usuarios</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona los usuarios del sistema
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => navigate('/users/new')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Nuevo Usuario
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
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Todos los roles</option>
            {Object.values(ROLES).map((role) => (
              <option key={role} value={role}>
                {roleLabels[role]}
              </option>
            ))}
          </select>
        </div>
        
        {selectedUsers.length > 0 && (
          <button
            onClick={() => {/* Bulk delete logic */}}
            className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <TrashIcon className="-ml-1 mr-2 h-4 w-4" />
            Eliminar Seleccionados ({selectedUsers.length})
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
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Verificación
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleSelection(user.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {user.profilePhotoURL ? (
                        <img
                          className="h-10 w-10 rounded-full"
                          src={user.profilePhotoURL}
                          alt=""
                        />
                      ) : (
                        <UserCircleIcon className="h-10 w-10 text-gray-400" />
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name} {user.surname}
                      </div>
                      <div className="text-sm text-gray-500">@{user.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                  {user.socialMediaUser && (
                    <div className="text-xs text-blue-600">Redes Sociales</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${roleColors[user.role]}`}>
                    {roleLabels[user.role]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleStatusToggle(user.id, user.status)}
                    className={`inline-flex px-2 text-xs font-semibold rounded-full ${
                      user.status
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.status ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    user.emailverified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.emailverified ? 'Verificado' : 'Pendiente'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => navigate(`/users/${user.id}`)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Ver detalles"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => navigate(`/users/${user.id}/edit`)}
                      className="text-yellow-600 hover:text-yellow-900"
                      title="Editar"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleResetPassword(user.id)}
                      className="text-purple-600 hover:text-purple-900"
                      title="Restablecer contraseña"
                    >
                      <ShieldCheckIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Eliminar"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron usuarios.</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div className="flex justify-between items-center text-sm text-gray-700">
          <span>
            Mostrando {filteredUsers.length} de {users.length} usuarios
          </span>
          <div className="flex space-x-4">
            <span>{users.filter(u => u.status).length} activos</span>
            <span>{users.filter(u => u.emailverified).length} verificados</span>
          </div>
        </div>
      </div>
    </div>
  );
}