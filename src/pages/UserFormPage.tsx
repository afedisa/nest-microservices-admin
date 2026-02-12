import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import userService from '../services/user.service';
import { CreateUserRequest, UpdateUserRequest } from '../types/api';
import organizationService from '../services/organization.service';
import establishmentService from '../services/establishment.service';
import { Organization, Establishment } from '../types/entities';
import toast from 'react-hot-toast';
import FormLabel from '../components/FormLabel';
import computePatch from '../utils/computePatch';
import { useForm, SubmitHandler, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

export default function UserFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<UserFormValues | null>(null);

  const schema = yup.object({
    name: yup.string().required('El nombre es obligatorio'),
    email: yup.string().email('Email inválido').required('Email es obligatorio'),
    username: yup.string().required('Username obligatorio'),
    role: yup.string().required(),
    organizationId: yup.string().required('Organización obligatoria'),
    establishmentId: yup.string().required('Establecimiento obligatorio'),
    password: yup.string().optional(),
  });

  type UserFormValues = yup.InferType<typeof schema>;

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<UserFormValues>({
    resolver: yupResolver(schema) as unknown as Resolver<UserFormValues>,
    defaultValues: {
      name: '',
      email: '',
      username: '',
      role: 'USER',
      organizationId: '',
      establishmentId: '',
      password: undefined,
    }
  });

  const watchedOrg = watch('organizationId');

  useEffect(() => {
    (async () => {
      try {
        const data = await organizationService.getAll();
        setOrganizations(data);
      } catch (e) {
        setOrganizations([]);
      }
    })();
  }, []);

  useEffect(() => {
    if (watchedOrg) {
      establishmentService.getByOrganization(watchedOrg).then(setEstablishments).catch(() => setEstablishments([]));
    } else {
      setEstablishments([]);
    }
  }, [watchedOrg]);

  useEffect(() => {
    if (isEdit && id) {
      (async () => {
          try {
            setLoading(true);
            const data = await userService.getById(id);
            // Map backend user entity to our form shape
            const formValues = {
              name: data.name || '',
              email: data.email || '',
              username: data.username || '',
              role: String(data.role || 'USER'),
              organizationId: data.establishment?.organizationId ?? '',
              establishmentId: data.establishmentId ?? data.establishment?.id ?? '',
              password: undefined,
            };
            reset(formValues);
            setInitialValues(formValues);
            const orgId = data.establishment?.organizationId || undefined;
            if (orgId) {
              const ests = await establishmentService.getByOrganization(orgId);
              setEstablishments(ests);
            }
        } catch (e) {
          toast.error('Error al cargar el usuario');
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [id, isEdit, reset]);

  const onSubmit: SubmitHandler<UserFormValues> = async (formData) => {
    if (!formData.name || !formData.email || !formData.organizationId || !formData.establishmentId) {
      toast.error('El usuario debe tener nombre, email, organización y establecimiento');
      return;
    }
    if (!isEdit && !formData.password) {
      toast.error('Contraseña obligatoria al crear un usuario');
      return;
    }

    try {
      setLoading(true);
      if (isEdit && id) {
        if (!initialValues) {
          const payload: UpdateUserRequest = { ...formData };
          if (!payload.password) delete payload.password;
          await userService.update(id, payload);
        } else {
          const patch = computePatch(initialValues, formData) as UpdateUserRequest;
          if (!patch.password) delete (patch as any).password;
          if (Object.keys(patch).length === 0) {
            toast('No hay cambios para guardar');
          } else {
            await userService.update(id, patch);
          }
        }
        toast.success('Usuario actualizado');
      } else {
        const payload: CreateUserRequest = {
          name: formData.name,
          username: formData.username,
          password: formData.password as string,
          email: formData.email,
          role: formData.role,
          establishmentId: formData.establishmentId,
        };
        await userService.create(payload);
        toast.success('Usuario creado');
      }
      navigate('/users');
    } catch (error) {
      toast.error('Error al guardar el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{isEdit ? 'Editar Usuario' : 'Nuevo Usuario'}</h1>
          <p className="mt-1 text-sm text-gray-500">Gestiona los usuarios y su asignación</p>
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
            <FormLabel>Email</FormLabel>
            <input {...register('email')} className="mt-1 block w-full border rounded px-3 py-2" />
            {errors.email?.message && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <FormLabel>Usuario (username)</FormLabel>
            <input {...register('username')} className="mt-1 block w-full border rounded px-3 py-2" />
            {errors.username?.message && <p className="text-sm text-red-600">{errors.username.message}</p>}
          </div>

          {!isEdit && (
            <div>
              <FormLabel>Contraseña</FormLabel>
              <input type="password" {...register('password')} className="mt-1 block w-full border rounded px-3 py-2" />
              {errors.password?.message && <p className="text-sm text-red-600">{errors.password.message}</p>}
            </div>
          )}

          <div>
            <FormLabel>Rol</FormLabel>
            <select {...register('role')} className="mt-1 block w-full border rounded px-3 py-2">
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
              <option value="SUPERVISOR">SUPERVISOR</option>
            </select>
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

          <div>
            <FormLabel>Establecimiento</FormLabel>
            <select {...register('establishmentId')} className="mt-1 block w-full border rounded px-3 py-2">
              <option value="">-- Selecciona establecimiento --</option>
              {establishments.map(est => (
                <option key={est.id} value={est.id}>{est.name}</option>
              ))}
            </select>
            {errors.establishmentId?.message && <p className="text-sm text-red-600">{errors.establishmentId.message}</p>}
          </div>

          <div className="flex justify-end">
            <button type="button" onClick={() => navigate('/users')} className="mr-3 px-4 py-2 border rounded">Cancelar</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </div>
      </form>
    </div>
  );
}
