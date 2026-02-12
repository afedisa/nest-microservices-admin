# Nest Microservices Admin Panel

Panel de administración React para gestionar el sistema de microservicios de gestión de turnos construido con NestJS.

## Características

### 🏗️ Arquitectura
- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Routing**: React Router v7
- **Forms**: React Hook Form + Yup
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

### 🔐 Autenticación
- Sistema de login con JWT
- Protección de rutas
- Manejo de roles de usuario
- Contexto de autenticación global

### 📊 Dashboard
- Estadísticas en tiempo real
- Métricas clave del sistema
- Gráficos y visualizaciones
- Actividad reciente

### 🎛️ Gestión de Entidades
- **Organizaciones**: CRUD completo con filtros y búsqueda
- **Establecimientos**: Gestión por organización
- **Usuarios**: Administración de roles y permisos
- **Servicios**: Configuración de servicios por organización
- **Turnos**: Monitoreo y gestión de colas
- **Estadísticas Avanzadas**: Análisis detallado del sistema

### 🎨 UI/UX
- Diseño responsivo
- Sidebar navegable
- Tema claro/oscuro
- Componentes reutilizables
- Feedback visual con toasts

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Layout.tsx      # Layout principal con sidebar
│   └── ProtectedRoute.tsx
├── context/            # Contextos React
│   └── AuthContext.tsx
├── pages/              # Páginas principales
│   ├── DashboardPage.tsx
│   ├── LoginPage.tsx
│   ├── OrganizationsPage.tsx
│   ├── EstablishmentsPage.tsx
│   ├── UsersPage.tsx
│   └── StatisticsPage.tsx
├── services/           # Servicios API
│   ├── api.service.ts
│   ├── auth.service.ts
│   ├── organization.service.ts
│   ├── establishment.service.ts
│   ├── user.service.ts
│   ├── dashboard.service.ts
│   └── entities.service.ts
├── types/              # Interfaces TypeScript
│   ├── api.ts
│   └── entities.ts
└── hooks/              # Custom hooks
```

## Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_ENV=development
REACT_APP_APP_NAME=Microservices Admin
REACT_APP_VERSION=1.0.0
```

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar en desarrollo
npm start

# Construir para producción
npm run build
```

## API Integration

El panel se conecta con el backend NestJS a través de los siguientes endpoints:

### Autenticación
- `POST /api/v1/auth/login` - Iniciar sesión
- `POST /api/v1/auth/register` - Registrar usuario
- `POST /api/v1/auth/forgot-password` - Recuperar contraseña

### Organizaciones
- `GET /api/v1/organizations` - Listar organizaciones
- `POST /api/v1/organizations` - Crear organización
- `PUT /api/v1/organizations/:id` - Actualizar organización
- `DELETE /api/v1/organizations/:id` - Eliminar organización

### Establecimientos
- `GET /api/v1/establishments` - Listar establecimientos
- `GET /api/v1/establishments/organization/:id` - Por organización
- `POST /api/v1/establishments` - Crear establecimiento
- `PUT /api/v1/establishments/:id` - Actualizar establecimiento

### Usuarios
- `GET /api/v1/users` - Listar usuarios
- `POST /api/v1/users` - Crear usuario
- `PUT /api/v1/users/:id` - Actualizar usuario
- `PATCH /api/v1/users/:id/status` - Cambiar estado
- `POST /api/v1/users/:id/reset-password` - Restablecer contraseña

### Dashboard
- `GET /api/v1/dashboard/stats` - Estadísticas generales
- `GET /api/v1/dashboard/users/by-role` - Usuarios por rol
- `GET /api/v1/dashboard/organizations/by-status` - Organizaciones por estado
- `GET /api/v1/dashboard/turns/trend` - Tendencia de turnos

## Tipos de Usuario

### Roles Soportados
- **ADMIN**: Acceso completo al sistema
- **MANAGER**: Gestión de establecimientos y usuarios
- **EMPLOYEE**: Operaciones básicas de turnos
- **USER**: Solo lectura

### Permisos por Rol
- Los administradores pueden gestionar todo el sistema
- Los gerentes pueden administrar sus establecimientos
- Los empleados pueden operar las colas de turnos
- Los usuarios tienen acceso de solo lectura

## Características Implementadas

### ✅ Completado
- [x] Estructura base del proyecto con routing
- [x] Sistema de autenticación con JWT
- [x] Dashboard con estadísticas básicas
- [x] CRUD de organizaciones
- [x] CRUD de establecimientos
- [x] CRUD de usuarios
- [x] Página de estadísticas avanzadas
- [x] Interfaces TypeScript para todas las entidades
- [x] Servicios API configurados
- [x] Layout responsivo con Tailwind

### 🚧 En Desarrollo
- [ ] Formularios de creación/edición
- [ ] Gestión de servicios y colas
- [ ] Monitoreo de turnos en tiempo real
- [ ] Sistema de notificaciones
- [ ] Configuraciones del sistema
- [ ] Exportación de reportes

### 🎯 Futuras Mejoras
- [ ] WebSocket para actualizaciones en tiempo real
- [ ] Sistema de temas personalizable
- [ ] Internacionalización (i18n)
- [ ] PWA support
- [ ] Tests unitarios y de integración
- [ ] Documentación de API interactiva

## Conexión con Backend

Este panel de administración está diseñado para trabajar con el sistema de microservicios ubicado en `nest-api-microservices-rbmq`. 

### Configuración del Backend
1. Asegúrate de que el backend esté ejecutándose en `http://localhost:3000`
2. Verifica que el gateway esté configurado correctamente
3. Los microservicios deben estar comunicándose vía RabbitMQ

### Endpoints del Gateway
El gateway del backend expone las APIs que consume este panel:
- `localhost:3000/api/v1/auth/*` - Autenticación
- `localhost:3000/api/v1/organizations/*` - Organizaciones
- `localhost:3000/api/v1/establishments/*` - Establecimientos
- `localhost:3000/api/v1/users/*` - Usuarios

## Desarrollo

### Scripts Disponibles
- `npm start` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm test` - Ejecuta los tests
- `npm run eject` - Expone la configuración de webpack

### Estándares de Código
- TypeScript estricto
- ESLint + Prettier configurados
- Convenciones de nomenclatura consistentes
- Componentes funcionales con hooks

### Contribuir
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto es parte del sistema de gestión de turnos con microservicios y está destinado para uso interno.