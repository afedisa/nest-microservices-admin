# Nest Microservices Admin Panel

Panel de administración web construido con React y TypeScript para gestionar el sistema de microservicios de gestión de turnos y colas.

## 🚀 Stack Tecnológico

- **Framework**: React 19 + TypeScript 4.9
- **Routing**: React Router v7
- **Styling**: Tailwind CSS 3.4
- **Forms**: React Hook Form + Yup
- **HTTP Client**: Axios
- **Icons**: Heroicons + Lucide React
- **Notifications**: React Hot Toast
- **Charts**: Recharts
- **Build Tool**: Create React App 5

## ✨ Características

### 🔐 Seguridad
- Autenticación JWT con sistema de hashing SHA-256 + pepper
- Protección de rutas con `ProtectedRoute`
- Gestión de roles y permisos
- Contexto de autenticación global con React Context

### 📊 Módulos Principales
- **Dashboard**: Estadísticas y métricas clave del sistema
- **Organizaciones**: Gestión completa (CRUD) con filtros y búsqueda
- **Establecimientos**: Administración por organización
- **Usuarios**: Control de acceso, roles y permisos
- **Estadísticas**: Análisis avanzado con gráficos interactivos

### 🎨 UI/UX
- Diseño responsivo mobile-first
- Layout con sidebar navegable
- Feedback visual con toasts
- Componentes reutilizables
- Formularios con validación en tiempo real

## 📁 Estructura del Proyecto

\`\`\`
src/
├── components/          # Componentes reutilizables
│   ├── Layout.tsx      # Layout principal con sidebar
│   └── ProtectedRoute.tsx  # HOC para rutas protegidas
├── context/            # Contextos de React
│   └── AuthContext.tsx # Gestión del estado de autenticación
├── pages/              # Páginas de la aplicación
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── OrganizationsPage.tsx
│   ├── EstablishmentsPage.tsx
│   ├── UsersPage.tsx
│   └── StatisticsPage.tsx
├── services/           # Servicios de API
│   ├── api.service.ts         # Cliente HTTP base
│   ├── auth.service.ts        # Autenticación (con hash)
│   ├── organization.service.ts
│   ├── establishment.service.ts
│   ├── user.service.ts
│   ├── dashboard.service.ts
│   └── entities.service.ts
├── types/              # TypeScript types e interfaces
│   ├── api.ts         # Tipos de peticiones/respuestas
│   └── entities.ts    # Entidades del dominio
└── App.tsx             # Componente principal con routing
\`\`\`

## ⚙️ Configuración

### 1. Variables de Entorno

Crea un archivo \`.env\` en la raíz del proyecto:

\`\`\`env
# Puerto del servidor de desarrollo
PORT=5173

# URL del backend API
REACT_APP_API_URL=http://localhost:3001/api

# Pepper para el hash de contraseñas (debe coincidir con el backend)
REACT_APP_PASSWORD_PEPPER=your_pepper_secret_key_here

# Configuración de la aplicación
REACT_APP_ENV=development
REACT_APP_APP_NAME=Microservices Admin
REACT_APP_VERSION=1.0.0
\`\`\`

> ⚠️ **Importante**: La variable \`REACT_APP_PASSWORD_PEPPER\` debe coincidir exactamente con el pepper configurado en el backend para que el sistema de autenticación funcione correctamente.

### 2. Instalación

\`\`\`bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo (puerto 5173)
npm start

# Construir para producción
npm run build

# Ejecutar tests
npm test
\`\`\`

## 🔌 Integración con Backend

### Endpoints de la API

El panel se comunica con el backend NestJS a través de los siguientes endpoints:

#### Autenticación
\`\`\`
POST /api/v1/auth/login          # Iniciar sesión (password hasheado)
POST /api/v1/auth/register       # Registrar usuario
POST /api/v1/auth/forgot-password # Recuperar contraseña
POST /api/v1/auth/reset-password  # Restablecer contraseña
\`\`\`

#### Organizaciones
\`\`\`
GET    /api/v1/organizations        # Listar con paginación
GET    /api/v1/organizations/:id    # Obtener por ID
POST   /api/v1/organizations        # Crear
PUT    /api/v1/organizations/:id    # Actualizar
DELETE /api/v1/organizations/:id    # Eliminar
\`\`\`

#### Establecimientos
\`\`\`
GET    /api/v1/establishments                    # Listar
GET    /api/v1/establishments/organization/:id  # Por organización
POST   /api/v1/establishments                    # Crear
PUT    /api/v1/establishments/:id               # Actualizar
DELETE /api/v1/establishments/:id               # Eliminar
\`\`\`

#### Usuarios
\`\`\`
GET    /api/v1/users                  # Listar con filtros
GET    /api/v1/users/:id              # Obtener por ID
POST   /api/v1/users                  # Crear
PUT    /api/v1/users/:id              # Actualizar
PATCH  /api/v1/users/:id/status       # Cambiar estado
POST   /api/v1/users/:id/reset-password # Restablecer contraseña
\`\`\`

#### Dashboard
\`\`\`
GET /api/v1/dashboard/stats              # Estadísticas generales
GET /api/v1/dashboard/users/by-role      # Usuarios por rol
GET /api/v1/dashboard/organizations/by-status # Organizaciones por estado
GET /api/v1/dashboard/turns/trend        # Tendencia de turnos
\`\`\`

### Sistema de Autenticación

El frontend implementa un sistema de hashing de contraseñas antes de enviarlas al backend:

1. **Hash en el Cliente**: Las contraseñas se hashean con SHA-256 + pepper antes de enviarse
2. **Pepper Compartido**: El frontend y backend comparten el mismo pepper (variable de entorno)
3. **Validación en Backend**: El backend compara el hash recibido con el almacenado

\`\`\`typescript
// Ejemplo de hash (implementado en auth.service.ts)
const hashedPassword = await hashPassword(password, pepper);
// Envía: { email, password: hashedPassword }
\`\`\`

## 🎯 Roles y Permisos

| Rol | Permisos |
|-----|----------|
| **ADMIN** | Acceso completo al sistema |
| **MANAGER** | Gestión de establecimientos y usuarios |
| **EMPLOYEE** | Operaciones básicas de turnos |
| **USER** | Solo lectura |

## 🛠️ Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| \`npm start\` | Inicia el servidor de desarrollo en el puerto configurado (5173) |
| \`npm run build\` | Compila la aplicación para producción |
| \`npm test\` | Ejecuta los tests en modo watch |
| \`npm run eject\` | Expone la configuración de webpack (irreversible) |

## 🌐 Configuración del Backend

Para que este frontend funcione correctamente, asegúrate de que:

1. El backend esté ejecutándose (por defecto en \`http://localhost:3001\`)
2. El gateway esté configurado y exponiendo las rutas \`/api/v1/*\`
3. Los microservicios estén comunicándose vía RabbitMQ
4. El pepper (\`PASSWORD_PEPPER\`) sea idéntico en backend y frontend

## 📦 Dependencias Principales

\`\`\`json
{
  "react": "^19.2.0",
  "react-router-dom": "^7.9.4",
  "react-hook-form": "^7.65.0",
  "axios": "^1.12.2",
  "tailwindcss": "^3.4.18",
  "recharts": "^3.3.0"
}
\`\`\`

## 🚧 Estado del Proyecto

### ✅ Implementado
- [x] Sistema de autenticación completo con hashing
- [x] Dashboard con estadísticas
- [x] CRUD de organizaciones
- [x] CRUD de establecimientos
- [x] CRUD de usuarios
- [x] Estadísticas avanzadas con gráficos
- [x] Layout responsivo
- [x] Protección de rutas
- [x] Manejo de errores y notificaciones

### 🔄 En Desarrollo
- [ ] Gestión de servicios y colas
- [ ] Monitoreo de turnos en tiempo real
- [ ] Sistema de notificaciones push
- [ ] Exportación de reportes (PDF/Excel)

### 🎯 Roadmap
- [ ] WebSocket para actualizaciones en tiempo real
- [ ] Internacionalización (i18n)
- [ ] Tests E2E con Cypress
- [ ] PWA support
- [ ] Tema oscuro/claro

## 📄 Licencia

Private project

## 👥 Autor

afedisa
