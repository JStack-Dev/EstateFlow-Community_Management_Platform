# EstateFlow — Plataforma SaaS de Gestión de Comunidades

## 📌 Descripción

EstateFlow es una plataforma digital de gestión integral para urbanizaciones residenciales en España. Permite centralizar la gestión de incidencias, accesos, obras, paquetería, reservas de instalaciones y notificaciones desde un único sistema.

---

## 🎯 Objetivo del proyecto

- Digitalizar y optimizar procesos manuales en comunidades de vecinos
- Centralizar la información operativa en una plataforma SaaS escalable
- Demostrar competencias full stack: Django (backend) + React (frontend)

---

## 🏗️ Arquitectura del sistema

### Backend
- **Python 3 + Django 5** con Django REST Framework
- **Autenticación JWT** (SimpleJWT) con tokens de acceso y refresco
- **SQLite** en desarrollo, preparado para PostgreSQL en producción
- **Permisos por roles**: ADMIN, STAFF, USER

### Frontend
- **React + Vite** con React Router (HashRouter)
- **Context API** para gestión de estado de autenticación
- **apiClient** centralizado con refresh automático de tokens JWT
- **RoleGuard** y **ProtectedRoute** para control de acceso por roles

### Despliegue
- **Backend**: Render (o cualquier PaaS con soporte Python)
- **Frontend**: GitHub Pages (CI/CD con GitHub Actions)
- **Variables de entorno**: `VITE_API_URL` para la URL del backend

---

## 🧱 Estructura del proyecto

### Apps Django (backend)
- `users` — Modelo de usuario custom con roles, registro y login JWT
- `incidents` — Gestión de incidencias con máquina de estados y KPIs
- `reservations` — Reservas de instalaciones con validación de solapamientos
- `packages` — Gestión de paquetería y entregas
- `access` — Autorización de accesos de visitantes
- `works` — Registro de obras en viviendas
- `notifications` — Notificaciones a usuarios
- `comments` — Comentarios en incidencias
- `estructura` — Modelo de viviendas y urbanización

### Frontend React
- `auth/` — Login, Register, ProtectedRoute
- `portal/` — Vistas de residente (USER)
- `operativa/` — Vistas de personal (STAFF/ADMIN)
- `pages/admin/` — Panel de administración (ADMIN)
- `components/` — Componentes compartidos (NotificationBell, etc.)
- `context/` — AuthContext con login, logout, isAuthenticated
- `utils/apiClient.js` — Cliente HTTP con JWT y refresh automático
- `config/api.js` — URL del backend desde variables de entorno

---

## 👤 Sistema de usuarios

### Roles
- **USER** — Residentes: crean incidencias, reservas, autorizan accesos, registran obras
- **STAFF** — Personal operativo: gestiona incidencias, paquetes, accesos, obras
- **ADMIN** — Administrador: gestión completa + gestión de usuarios

### Campos del modelo
- `username`, `email`, `password` (heredados de AbstractUser)
- `role` — ADMIN / STAFF / USER
- `tipo_usuario` — PROPIETARIO / INQUILINO / PERSONAL
- `vivienda` — FK a Vivienda (nullable)
- `activo` — Boolean para activar/desactivar usuarios

---

## 🔐 Seguridad

- **Autenticación JWT** con tokens de acceso (2h) y refresco (1d)
- **Permisos DRF** por rol en cada endpoint
- **RoleGuard** en frontend para restringir rutas por rol
- **SECRET_KEY** y **DEBUG** mediante variables de entorno
- **CORS** restringido a orígenes específicos
- **Cookies seguras** y HSTS en producción (DEBUG=False)
- **Validación de contraseñas** con validadores de Django
- **Validación de negocio**: máquina de estados en incidencias, solapamiento de reservas

---

## � API Endpoints

### Autenticación (JWT)
- `POST /api/token/` — Obtener access + refresh token
- `POST /api/token/refresh/` — Refrescar access token
- `POST /api/auth/register/` — Registro de usuario
- `POST /api/auth/login/` — Login alternativo (devuelve tokens)
- `GET /api/auth/me/` — Usuario actual

### Incidents
- `GET /api/incidents/` — Listar (filtra por rol)
- `POST /api/incidents/` — Crear incidencia
- `PATCH /api/incidents/<id>/` — Actualizar estado
- `GET /api/incidents/stats/` — KPIs ejecutivos

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
DJANGO_ALLOWED_HOSTS=tu-dominio.com,127.0.0.1,localhost
CORS_ALLOWED_ORIGINS=https://tu-frontend.com,http://localhost:5173
```

**Frontend** (`frontend/.env`):
```
VITE_API_URL=https://tu-backend.com
```

---

## 🧪 Testing manual

1. **USER**: Registra incidencias, reserva instalaciones, autoriza visitas, registra obras
2. **STAFF**: Gestiona incidencias (cambia estado), registra y entrega paquetes, revisa accesos
3. **ADMIN**: Gestiona usuarios (cambia roles, activa/desactiva), acceso a todo el sistema

---

## 💡 Valor aportado

- **Automatización**: Digitalización de procesos manuales (incidencias, accesos, paquetería)
- **Centralización**: Toda la operativa de la comunidad en un único sistema
- **Escalabilidad**: Arquitectura SaaS preparada para múltiples comunidades
- **Trazabilidad**: Historial de incidencias con tiempos de resolución y KPIs


