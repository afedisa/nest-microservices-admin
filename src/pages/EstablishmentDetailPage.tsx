import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import establishmentService from '../services/establishment.service';
import Tooltip from '../components/Tooltip';
import { Establishment } from '../types/entities';
import toast from 'react-hot-toast';

export default function EstablishmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [est, setEst] = useState<Establishment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const data = await establishmentService.getById(id as string);
        setEst(data);
      } catch (error) {
        toast.error('Error al cargar el establecimiento');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="p-6">Cargando...</div>;
  if (!est) return <div className="p-6">Establecimiento no encontrado</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{est.name}</h1>
          <p className="text-sm text-gray-600">{est.description}</p>
        </div>
        <div className="flex gap-2 items-center">
          <Tooltip text="Cerrar" className="mr-3">
            <button
              onClick={() => navigate('/establishments')}
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
              onClick={() => navigate(`/establishments/${est.id}/edit`)}
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
        <p><strong>Dirección:</strong> {est.address}</p>
        <p><strong>Ciudad:</strong> {est.city}</p>
        <p><strong>Teléfono:</strong> {est.phone}</p>
        <p><strong>Organización:</strong> {est.organization?.name}</p>
        <p><strong>Estado:</strong> {est.status ? 'Activo' : 'Inactivo'}</p>
      </div>
    </div>
  );
}
