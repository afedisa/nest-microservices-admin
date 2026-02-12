import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import organizationService from '../services/organization.service';
import Tooltip from '../components/Tooltip';
import { Organization } from '../types/entities';
import toast from 'react-hot-toast';

export default function OrganizationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const data = await organizationService.getById(id as string);
        setOrg(data);
      } catch (error) {
        toast.error('Error al cargar la organización');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="p-6">Cargando...</div>;
  if (!org) return <div className="p-6">Organización no encontrada</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{org.name}</h1>
          <p className="text-sm text-gray-600">{org.description}</p>
        </div>
        <div className="flex gap-2 items-center">
          <Tooltip text="Cerrar" className="mr-3">
            <button
              onClick={() => navigate('/organizations')}
              aria-label="Cerrar"
              className="p-2 border rounded hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="sr-only">Cerrar</span>
            </button>
          </Tooltip>

          <Tooltip text="Editar">
            <button
              onClick={() => navigate(`/organizations/${org.id}/edit`)}
              aria-label="Editar"
              className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                <path d="M2 15a1 1 0 011-1h3v2H3a1 1 0 01-1-1z" />
              </svg>
              <span className="sr-only">Editar</span>
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="bg-white shadow p-6 rounded">
        <p><strong>Dirección:</strong> {org.address}</p>
        <p><strong>Ciudad:</strong> {org.city}</p>
        <p><strong>Provincia/Estado:</strong> {org.state}</p>
        <p><strong>Teléfono:</strong> {org.phone}</p>
        <p><strong>Estado:</strong> {org.status ? 'Activa' : 'Inactiva'}</p>
        <div className="mt-4">
          <h3 className="font-semibold">Servicios</h3>
          <div className="flex gap-2 mt-2">
            {org.hasBooking && <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">Reservas</span>}
            {org.hasSMS && <span className="px-2 py-1 bg-green-100 text-green-800 rounded">SMS</span>}
            {org.waitingPeople && <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">Espera</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
