import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import establishmentService from '../services/establishment.service';
import { CreateEstablishmentRequest, UpdateEstablishmentRequest } from '../types/api';
import organizationService from '../services/organization.service';
import { Organization } from '../types/entities';
import toast from 'react-hot-toast';
import { useForm, SubmitHandler, Resolver } from 'react-hook-form';
import FormLabel from '../components/FormLabel';
import computePatch from '../utils/computePatch';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().required('El nombre es obligatorio'),
  description: yup.string().optional(),
  address: yup.string().required('La dirección es obligatoria'),
  city: yup.string().optional(),
  phone: yup.string().required('El teléfono es obligatorio'),
  organizationId: yup.string().required('Organización obligatoria'),
  img_link: yup.string().optional(),
}).required();

type EstablishmentFormValues = yup.InferType<typeof schema>;

export default function EstablishmentFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<EstablishmentFormValues | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EstablishmentFormValues>({
    resolver: yupResolver(schema) as unknown as Resolver<EstablishmentFormValues>,
    defaultValues: {
      name: '',
      description: undefined,
      address: '',
      city: undefined,
      phone: '',
      organizationId: '',
      img_link: undefined,
    }
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await organizationService.getAll();
        setOrganizations(data);
      } catch (e) {
        setOrganizations([]);
      }

      if (isEdit && id) {
        try {
          setLoading(true);
          const est = await establishmentService.getById(id);
          // Map backend establishment entity to the form shape
          const formValues: EstablishmentFormValues = {
            name: est.name || '',
            description: est.description ?? undefined,
            address: est.address || '',
            city: est.city ?? '',
            phone: est.phone || '',
            organizationId: est.organizationId ?? est.organization?.id ?? '',
            img_link: est.img_link ?? undefined,
          };
          reset(formValues);
          setInitialValues(formValues);
        } catch (e) {
          toast.error('Error al cargar el establecimiento');
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [id, isEdit, reset]);

  const onSubmit: SubmitHandler<EstablishmentFormValues> = async (formData) => {
    try {
      setLoading(true);
      if (isEdit && id) {
        if (!initialValues) {
          const payload: UpdateEstablishmentRequest = { ...formData };
          await establishmentService.update(id, payload);
        } else {
          const patch = computePatch(initialValues, formData) as UpdateEstablishmentRequest;
          if (Object.keys(patch).length === 0) {
            toast('No hay cambios para guardar');
          } else {
            await establishmentService.update(id, patch);
          }
        }
        toast.success('Establecimiento actualizado');
      } else {
        const payload: CreateEstablishmentRequest = {
          name: formData.name,
          description: formData.description,
          address: formData.address,
          city: formData.city || '',
          phone: formData.phone,
          img_link: formData.img_link || '',
          organizationId: formData.organizationId,
        };
        await establishmentService.create(payload);
        toast.success('Establecimiento creado');
      }
      navigate('/establishments');
    } catch (error) {
      toast.error('Error al guardar el establecimiento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{isEdit ? 'Editar Establecimiento' : 'Nuevo Establecimiento'}</h1>
          <p className="mt-1 text-sm text-gray-500">Gestiona los datos del establecimiento</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow px-6 py-6 rounded">
        <div className="grid grid-cols-1 gap-4">
          <div>
              <FormLabel>Nombre</FormLabel>
            <input {...register('name')} className="mt-1 block w-full border rounded px-3 py-2" />
            {errors.name?.message && <p className="text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
              <FormLabel>Descripción</FormLabel>
            <textarea {...register('description')} className="mt-1 block w-full border rounded px-3 py-2" />
          </div>

          <div>
              <FormLabel>Dirección</FormLabel>
            <input {...register('address')} className="mt-1 block w-full border rounded px-3 py-2" />
            {errors.address?.message && <p className="text-sm text-red-600">{errors.address.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <FormLabel>Ciudad</FormLabel>
              <input {...register('city')} className="mt-1 block w-full border rounded px-3 py-2" />
              {errors.city?.message && <p className="text-sm text-red-600">{errors.city.message}</p>}
            </div>
            <div>
                <FormLabel>Teléfono</FormLabel>
              <input {...register('phone')} className="mt-1 block w-full border rounded px-3 py-2" />
              {errors.phone?.message && <p className="text-sm text-red-600">{errors.phone.message}</p>}
            </div>
          </div>

          <div>
              <FormLabel>Organización</FormLabel>
            <select {...register('organizationId')} className="mt-1 block w-full border rounded px-3 py-2">
              <option value="">-- Selecciona organización --</option>
              {organizations.map(org => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
            {errors.organizationId?.message && <p className="text-sm text-red-600">{errors.organizationId.message}</p>}
          </div>

          <div className="flex justify-end">
            <button type="button" onClick={() => navigate('/establishments')} className="mr-3 px-4 py-2 border rounded">Cancelar</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </div>
      </form>
    </div>
  );
}
