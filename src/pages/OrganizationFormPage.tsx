import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import organizationService from '../services/organization.service';
import FormLabel from '../components/FormLabel';
import computePatch from '../utils/computePatch';
import { CreateOrganizationRequest, UpdateOrganizationRequest } from '../types/api';
import { Resolver } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().required('El nombre es obligatorio'),
  address: yup.string().required('La dirección es obligatoria'),
  city: yup.string().required('La ciudad es obligatoria'),
  state: yup.string().optional(),
  phone: yup.string().optional(),
  description: yup.string().optional(),
  hasBooking: yup.boolean().optional(),
  waitingPeople: yup.boolean().optional(),
  hasSMS: yup.boolean().optional(),
}).required();
type OrganizationFormValues = yup.InferType<typeof schema>;

export default function OrganizationFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<OrganizationFormValues | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<OrganizationFormValues>({
  // yupResolver's inferred types don't always line up exactly with the
  // generic expected by useForm<T>. Cast to the appropriate Resolver
  // to keep strong typing on the form values while satisfying TS.
  resolver: yupResolver(schema) as unknown as Resolver<OrganizationFormValues>,
    defaultValues: {
      name: '',
      description: undefined,
      address: '',
      city: '',
      state: undefined,
      phone: undefined,
      hasBooking: false,
      waitingPeople: false,
      hasSMS: false,
    }
  });

  useEffect(() => {
    if (isEdit && id) {
      (async () => {
        try {
          setLoading(true);
          const data = await organizationService.getById(id);
          // Map backend entity to form shape
          const formValues = {
            name: data.name || '',
            description: data.description || undefined,
            address: data.address || '',
            city: data.city || '',
            state: data.state ?? undefined,
            phone: data.phone ?? undefined,
            hasBooking: data.hasBooking ?? undefined,
            waitingPeople: data.waitingPeople ?? undefined,
            hasSMS: data.hasSMS ?? undefined,
          } as OrganizationFormValues;
          reset(formValues);
          setInitialValues(formValues);
        } catch (e) {
          toast.error('Error al cargar la organización');
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [id, isEdit, reset]);

  const onSubmit: SubmitHandler<OrganizationFormValues> = async (formData) => {
    try {
      setLoading(true);
      if (isEdit && id) {
        if (!initialValues) {
          // Fallback: send full form if for some reason initial not loaded
          const payload: UpdateOrganizationRequest = {
            ...formData,
            state: formData.state ?? '',
            phone: formData.phone ?? '',
            logo_link_url: '',
            logo_link_name: '',
            img_link_url: '',
            img_link_name: '',
          };
          await organizationService.update(id, payload);
        } else {
          // compute patch of changed fields only (use shared util)
          const patch = computePatch(initialValues, formData) as UpdateOrganizationRequest;
          if (Object.keys(patch).length === 0) {
            toast('No hay cambios para guardar');
          } else {
            await organizationService.update(id, patch);
          }
        }
        toast.success('Organización actualizada');
      } else {
        // Create requires additional fields declared in API types.
        const payload: CreateOrganizationRequest = {
          name: formData.name,
          description: formData.description,
          address: formData.address,
          city: formData.city,
          state: formData.state ?? '',
          phone: formData.phone ?? '',
          logo_link_url: '',
          logo_link_name: '',
          img_link_url: '',
          img_link_name: '',
          hasBooking: formData.hasBooking,
          waitingPeople: formData.waitingPeople,
          hasSMS: formData.hasSMS,
        };
        await organizationService.create(payload);
        toast.success('Organización creada');
      }
      navigate('/organizations');
    } catch (error) {
      toast.error('Error al guardar la organización');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{isEdit ? 'Editar Organización' : 'Nueva Organización'}</h1>
          <p className="mt-1 text-sm text-gray-500">Gestiona los datos de la organización</p>
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
              <FormLabel>Provincia / Estado</FormLabel>
              <input {...register('state')} className="mt-1 block w-full border rounded px-3 py-2" />
            </div>
          </div>

          <div>
            <FormLabel>Teléfono</FormLabel>
            <input {...register('phone')} className="mt-1 block w-full border rounded px-3 py-2" />
          </div>

          <div className="flex items-center space-x-6">
            <div className="inline-flex items-center">
              <input type="checkbox" {...register('hasBooking')} className="mr-2" />
              <FormLabel inline className="!font-semibold">Reservas</FormLabel>
            </div>
            <div className="inline-flex items-center">
              <input type="checkbox" {...register('waitingPeople')} className="mr-2" />
              <FormLabel inline className="!font-semibold">Mostrar personas en espera</FormLabel>
            </div>
            <div className="inline-flex items-center">
              <input type="checkbox" {...register('hasSMS')} className="mr-2" />
              <FormLabel inline className="!font-semibold">SMS habilitado</FormLabel>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="button" onClick={() => navigate('/organizations')} className="mr-3 px-4 py-2 border rounded">Cancelar</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </div>
      </form>
    </div>
  );
}
