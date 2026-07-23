# EstateFlow — Plataforma SaaS de Gestión de Comunidades

## 📌 Descripción

EstateFlow es una plataforma digital de gestión integral para urbanizaciones residenciales en España. Permite centralizar la gestión de incidencias, accesos, obras, paquetería, reservas de instalaciones y notificaciones desde un único sistema.

**Proyecto Final del Máster en Desarrollo Full Stack**

> 📄 [Documentación completa del proyecto](DOCUMENTACION.md)
> 🎬 [Guía de demostración y credenciales](DEMO.md)

---

## 🎯 Objetivo del proyecto

- **Definición del problema**: Las comunidades de vecinos gestionan incidencias, accesos, paquetería y reservas de forma manual (papel, WhatsApp, llamadas), lo que genera pérdida de información, lentitud y falta de trazabilidad.
- **Solución propuesta**: Una plataforma SaaS que digitaliza y centraliza toda la operativa de la comunidad, con roles diferenciados (residente, personal, administrador) y acceso desde cualquier dispositivo.
- **Valor aportado**: Automatización de procesos manuales, trazabilidad completa de incidencias con KPIs, validación de solapamientos en reservas, y control de accesos seguro.

---

## 🏗️ Arquitectura del sistema

### Backend (Django)
- **Python 3 + Django 5** con Django REST Framework
- **Autenticación JWT** (SimpleJWT) con tokens de acceso (2h) y refresco (1d)
- **Autenticación por sesiones** para vistas Django (login, incident_list)
- **SQLite** en desarrollo, preparado para PostgreSQL en producción
- **Permisos por roles**: ADMIN, STAFF, USER
- **Plantillas Django**: landing page, login, listado de incidencias
- **Modelo de usuario custom** con roles y tipos de residente

### Frontend (React + TypeScript)
- **React 19 + Vite** con React Router (HashRouter)
- **TypeScript** con tipado estricto
- **Tailwind CSS v4** con design system custom (colores brand, escala ink, sombras)
- **Framer Motion** para animaciones (fade-in, slide-up, scale-in, transiciones)
- **Lucide Icons** para iconografía consistente
- **class-variance-authority** + **clsx** + **tailwind-merge** para variantes de componentes
- **Context API** para gestión de estado de autenticación
- **apiClient** centralizado con refresh automático de tokens JWT
- **RoleGuard** y **ProtectedRoute** para control de acceso por roles
- **Componentes UI reutilizables**: Button, Card, Input, Select, Badge, Alert, Table, Modal, Spinner, StatCard, PageHeader

### Despliegue
- **Backend**: Render (https://estateflow-backend.onrender.com)
- **Frontend**: GitHub Pages (CI/CD con GitHub Actions)
- **Variables de entorno**: `VITE_API_URL` para la URL del backend, `DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, `CORS_ALLOWED_ORIGINS`

---

## 🧱 Estructura del proyecto

### Apps Django (backend)
- `users` — Modelo de usuario custom con roles, registro y login JWT + gestión de usuarios (ADMIN)
- `incidents` — Gestión de incidencias con máquina de estados, KPIs y vista HTML
- `reservations` — Reservas de instalaciones con validación de solapamientos
- `packages` — Gestión de paquetería y entregas
- `access` — Autorización de accesos de visitantes
- `works` — Registro de obras en viviendas
- `notifications` — Notificaciones a usuarios
- `comments` — Comentarios en incidencias
- `estructura` — Modelo de viviendas y urbanización

### Plantillas Django
- `templates/landing.html` — Página de inicio con presentación del producto
- `templates/registration/login.html` — Login con sesiones Django (CSRF)
- `templates/incidents/incident_list.html` — Listado de incidencias con filtros por rol

### Frontend React (TypeScript)
- `src/auth/` — Login, Register, ProtectedRoute
- `src/portal/` — Vistas de residente (USER): Inicio, Incidencias, Reservas, Paquetería, Accesos, Obras, Perfil
- `src/operativa/` — Vistas de personal (STAFF/ADMIN): Panel, Incidencias, Paquetes, Accesos
- `src/pages/admin/` — Panel de administración (ADMIN): Dashboard, UsersPage
- `src/components/ui/` — Design system: Button, Card, Input, Select, Badge, Alert, Table, Modal, Spinner, StatCard, PageHeader
- `src/components/layout/` — Sidebar, Topbar, DashboardLayout
- `src/context/AuthContext.tsx` — AuthContext con login, logout, isAuthenticated
- `src/hooks/useAuth.ts` — Hook para consumir AuthContext
- `src/utils/apiClient.ts` — Cliente HTTP con JWT y refresh automático
- `src/config/api.ts` — URL del backend desde variables de entorno
- `src/types/index.ts` — Tipos TypeScript de toda la aplicación

---

## 👤 Sistema de usuarios

### Roles
- **USER** — Residentes: crean incidencias, reservan instalaciones, autorizan accesos, registran obras, consultan paquetería
- **STAFF** — Personal operativo: gestiona incidencias (cambia estado), registra y entrega paquetes, revisa accesos y obras
- **ADMIN** — Administrador: gestión completa + gestión de usuarios (cambiar roles, activar/desactivar)

### Campos del modelo
- `username`, `email`, `password` (heredados de AbstractUser)
- `role` — ADMIN / STAFF / USER
- `tipo_usuario` — PROPIETARIO / INQUILINO / PERSONAL
- `vivienda` — FK a Vivienda (nullable)
- `is_active` — Boolean para activar/desactivar usuarios

### Casos de uso
- **USER**: Registrarse → Iniciar sesión → Reportar incidencia → Reservar instalación → Autorizar visita → Registrar obra → Consultar paquetería → Ver perfil
- **STAFF**: Iniciar sesión → Ver panel operativo → Cambiar estado de incidencias → Registrar paquete → Marcar paquete entregado → Revisar accesos
- **ADMIN**: Iniciar sesión → Ver dashboard con KPIs → Gestionar usuarios (cambiar rol, activar/desactivar) → Acceso a todo el sistema

---

## 🔐 Seguridad y protección de datos

- **Autenticación JWT** con tokens de acceso (2h) y refresco (1d)
- **Autenticación por sesiones** para vistas Django con CSRF middleware activado
- **Permisos DRF** por rol en cada endpoint (IsAuthenticated + comprobación de role)
- **RoleGuard** en frontend para restringir rutas por rol
- **SECRET_KEY** y **DEBUG** mediante variables de entorno
- **CORS** restringido a orígenes específicos (no wildcard)
- **Cookies seguras** y HSTS en producción (DEBUG=False)
- **SECURE_SSL_REDIRECT** activo en producción
- **XFrameOptionsMiddleware** para prevenir clickjacking
- **Validación de contraseñas** con validadores de Django (similitud, longitud, comunes, numéricas)
- **Validación de negocio**: máquina de estados en incidencias, solapamiento de reservas
- **Hashing de contraseñas** mediante el sistema de Django (PBKDF2 por defecto)

---

## 📡 API Endpoints

### Autenticación (JWT)
- `POST /api/token/` — Obtener access + refresh token
- `POST /api/token/refresh/` — Refrescar access token
- `POST /api/auth/register/` — Registro de usuario
- `GET /api/auth/me/` — Usuario actual

### Gestión de usuarios (ADMIN)
- `GET /api/users/` — Listar todos los usuarios
- `PATCH /api/users/<id>/` — Actualizar rol o estado de un usuario

### Incidents
- `GET /api/incidents/` — Listar (filtra por rol)
- `POST /api/incidents/` — Crear incidencia
- `PATCH /api/incidents/<id>/` — Actualizar estado
- `GET /api/incidents/stats/` — KPIs ejecutivos (STAFF/ADMIN)

### Reservations
- `GET /api/reservations/` — Listar mis reservas
- `POST /api/reservations/` — Crear reserva
- `GET /api/reservations/facilities/` — Listar instalaciones

### Packages
- `GET /api/packages/resident/` — Mis paquetes
- `GET /api/packages/staff/` — Todos los paquetes (STAFF/ADMIN)
- `POST /api/packages/staff/` — Registrar paquete (STAFF/ADMIN)
- `PATCH /api/packages/deliver/<id>/` — Marcar entregado (STAFF/ADMIN)

### Access
- `GET /api/access/resident/` — Mis autorizaciones
- `POST /api/access/resident/` — Autorizar visita
- `GET /api/access/staff/` — Todos los accesos (STAFF/ADMIN)

### Works
- `GET /api/works/resident/` — Mis obras
- `POST /api/works/resident/` — Registrar obra
- `GET /api/works/staff/` — Todas las obras (STAFF/ADMIN)

### Notifications
- `GET /api/notifications/resident/` — Mis notificaciones

---

## ⚙️ Instalación

### Backend
```bash
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/Mac
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```
http://localhost:8000

### Frontend
```bash
cd frontend
npm install
npm run dev
```
http://localhost:5173

### Variables de entorno

**Backend** (`.env` o variables del sistema):
```
DJANGO_SECRET_KEY=tu-clave-secreta-aqui
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=tu-dominio.com,127.0.0.1,localhost,.onrender.com
CORS_ALLOWED_ORIGINS=https://tu-frontend.com,http://localhost:5173
```

**Frontend** (`frontend/.env`):
```
VITE_API_URL=https://tu-backend.com
```

---

## 🧪 Testing manual

1. **USER**: Registra incidencias, reserva instalaciones, autoriza visitas, registra obras, consulta paquetería
2. **STAFF**: Gestiona incidencias (cambia estado), registra y entrega paquetes, revisa accesos
3. **ADMIN**: Gestiona usuarios (cambia roles, activa/desactiva), acceso a todo el sistema, visualiza KPIs

---

## �️ Tecnologías utilizadas

| Categoría | Tecnología | Justificación |
|---|---|---|
| Backend | Django 5 + DRF | Framework robusto con ORM, auth, admin y DRF para API REST |
| Autenticación | SimpleJWT | Tokens stateless con refresh automático |
| Base de datos | SQLite (dev) / PostgreSQL (prod) | SQLite para desarrollo ágil, PostgreSQL para producción |
| Frontend | React 19 + TypeScript | Tipado estricto, componentes reutilizables, escalabilidad |
| Build tool | Vite 8 | Build rápido con HMR |
| CSS | Tailwind CSS v4 | Design system consistente, utilidades, modo JIT |
| Animaciones | Framer Motion | Animaciones fluidas y discretas |
| Iconos | Lucide React | Iconografía consistente y ligera |
| Despliegue | Render + GitHub Pages | Backend en PaaS, frontend estático en GitHub Pages |
| Control de versiones | Git + GitHub | Repositorio público con commits significativos |

---

## �💡 Valor aportado

- **Automatización**: Digitalización de procesos manuales (incidencias, accesos, paquetería)
- **Centralización**: Toda la operativa de la comunidad en un único sistema
- **Escalabilidad**: Arquitectura SaaS preparada para múltiples comunidades
- **Trazabilidad**: Historial de incidencias con tiempos de resolución y KPIs
- **Seguridad**: JWT + CORS + CSRF + roles + cookies seguras + HSTS


