# EstateFlow — SaaS Community Management Platform

## 📌 Descripción
EstateFlow es una plataforma digital de gestión integral para urbanizaciones residenciales en España, diseñada para digitalizar y optimizar la operativa de comunidades. Permite centralizar la gestión de incidencias, accesos, obras, paquetería, reservas de instalaciones y supervisión general desde un único sistema.

---

## 🎯 Objetivo del proyecto
- Diseñar una solución SaaS escalable y mantenible
- Digitalizar procesos manuales en comunidades
- Centralizar la información operativa
- Demostrar dominio full stack en entorno real

---

## 🧠 Competencias demostradas
- Análisis de requisitos reales
- Diseño de arquitectura modular
- Desarrollo de API REST profesional
- Integración frontend-backend
- Documentación técnica completa
- Enfoque SaaS escalable

---

## 🏗️ Arquitectura del sistema

### Backend
- Python 3 + Django 5
- Django REST Framework
- Autenticación por sesión (cookies + CSRF)
- SQLite (dev), preparado para PostgreSQL

### Frontend
- React + Vite
- Context API
- React Router
- Fetch API con credentials

---

## 🧱 Estructura

Backend:
- users
- incidents
- estructura
- comments

Frontend:
- auth
- portal
- operativa
- admin
- context
- components

---

## 👤 Sistema de usuarios

Roles:
- USER (residentes)
- STAFF (operativa)
- ADMIN (administración)

Campos clave:
- vivienda
- tipo_usuario
- role
- activo

---

## 🔐 Seguridad
- Backend: permisos DRF
- Frontend: RoleGuard
- Autenticación con sesión segura

---

## 🔄 Flujo del sistema

### Login
POST /api/auth/login/

### Usuario
- Portal personal
- Gestión de incidencias

### Staff
- Panel operativo
- Gestión global

### Admin
- Dashboard
- Gestión usuarios

---

## 🔌 API

Auth:
- POST /api/auth/register/
- POST /api/auth/login/
- POST /api/auth/logout/
- GET /api/auth/me/

Users:
- GET /api/users/
- PATCH /api/users/<id>/

Incidents:
- GET /api/incidents/
- POST /api/incidents/
- PATCH /api/incidents/<id>/
- GET /api/incidents/stats/

---

## ⚙️ Instalación

### Backend
```
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

http://localhost:8000

---

### Frontend
```
cd frontend
npm install
npm run dev
```

http://localhost:5173

---

## 🧪 Testing
- USER: crea y ve incidencias propias
- STAFF: gestiona incidencias
- ADMIN: gestiona usuarios

---

## 💡 Valor
- Automatización
- Centralización
- Escalabilidad SaaS


