# EstateFlow — Guía de Demostración

## Credenciales de acceso

### Ejecutar seed de datos (solo primera vez)

```bash
# En el backend, activar venv y ejecutar:
python manage.py seed_data
```

Esto crea todos los datos de demostración: urbanización, viviendas, usuarios, incidencias, reservas, paquetes, accesos, obras y notificaciones.

### Usuarios preconfigurados

| Rol | Usuario | Contraseña | Descripción |
|---|---|---|---|
| **ADMIN** | `admin` | `admin123456` | Administrador con acceso total |
| **STAFF** | `porteria` | `staff123456` | Personal de portería/recepción |
| **STAFF** | `mantenimiento` | `staff123456` | Personal de mantenimiento |
| **USER** | `maria` | `user123456` | Propietaria de A-101 |
| **USER** | `carlos` | `user123456` | Inquilino de A-102 |
| **USER** | `laura` | `user123456` | Propietaria de A-201 |
| **USER** | `javier` | `user123456` | Propietario de B-101 |
| **USER** | `ana` | `user123456` | Inquilina de B-102 |
| **USER** | `pedro` | `user123456` | Propietario de C-101 |
| **USER** | `elena` | `user123456` | Propietaria de C-102 |

### URLs de acceso

| Entorno | URL |
|---|---|
| Frontend (local) | http://localhost:5173/ |
| Frontend (producción) | https://jstack-dev.github.io/EstateFlow-Community_Management_Platform/ |
| Backend (local) | http://localhost:8000/ |
| Backend (producción) | https://estateflow-backend.onrender.com |
| Admin Django | http://localhost:8000/admin/ |
| Landing Django | http://localhost:8000/ |
| Incidencias Django | http://localhost:8000/incidents/ |

---

## Guía de demostración por rol

### 1. Demo como ADMIN (`admin` / `admin123456`)

**Panel principal**:
- Ver dashboard con 6 métricas: total incidencias, abiertas, en progreso, resueltas, media de resolución, usuarios activos
- Ver alerta de incidencias críticas (ascensor bloqueado, portón automático)
- Ver tabla de usuarios recientes con rol y estado
- Ver lista de incidencias recientes con badges de estado y urgencia

**Gestión de usuarios**:
1. Click en "Gestionar usuarios"
2. Ver lista completa de 10 usuarios
3. Cambiar rol de un usuario (ej. `maria` de USER a STAFF)
4. Activar/desactivar un usuario
5. Ver cómo los cambios se reflejan en tiempo real

**Admin Django**:
- Ir a http://localhost:8000/admin/
- Login con `admin` / `admin123456`
- Ver todos los modelos: usuarios, incidencias, reservas, paquetes, etc.

---

### 2. Demo como STAFF (`porteria` / `staff123456`)

**Panel operativo**:
- Ver métricas: total, abiertas, en progreso, resueltas, media de resolución
- Ver alerta de incidencias críticas sin resolver
- Ver tabla de incidencias recientes con estado y urgencia

**Gestión de incidencias**:
1. Click en "Incidencias" en el sidebar
2. Ver todas las incidencias de la urbanización
3. Cambiar estado de "Fuga de agua en garaje" de Abierta → En progreso
4. El sistema asigna automáticamente al staff actual
5. Cambiar a "Resuelta" cuando termine (requiere asignación previa)

**Gestión de paquetes**:
1. Click en "Paquetes"
2. Ver todos los paquetes recibidos
3. Registrar nuevo paquete: seleccionar residente, transportista, tracking, descripción
4. Marcar un paquete pendiente como "Entregado"

**Control de accesos**:
1. Click en "Accesos"
2. Ver todos los accesos autorizados por los residentes
3. Ver nombre del visitante, DNI, fecha y residente que autorizó

---

### 3. Demo como USER / Residente (`maria` / `user123456`)

**Panel de inicio**:
- Saludo personalizado ("Hola, maria")
- 5 stats clicables: incidencias abiertas, reservas activas, paquetes pendientes, visitas autorizadas, obras registradas
- Acciones rápidas: reportar incidencia, reservar instalación, autorizar visita, registrar obra
- Lista de incidencias recientes con badges de estado
- Próximas reservas con fecha y hora
- Paquetes pendientes de recogida

**Reportar incidencia**:
1. Click en "Incidencias" o en "Reportar incidencia"
2. Rellenar formulario: título, descripción, categoría, ubicación, urgencia
3. Enviar y ver la incidencia en la lista

**Reservar instalación**:
1. Click en "Reservas"
2. Seleccionar instalación (Pádel, Piscina, Salón Social, Gimnasio, Tenis, BBQ)
3. Elegir fecha y hora
4. El sistema valida solapamientos automáticamente
5. Ver la reserva en la lista

**Autorizar visita**:
1. Click en "Accesos"
2. Rellenar: nombre del visitante, DNI (opcional), fecha
3. Enviar y ver la autorización en la lista

**Consultar paquetería**:
1. Click en "Paquetería"
2. Ver paquetes recibidos con transportista y estado
3. Los paquetes pendientes aparecen destacados

**Registrar obra**:
1. Click en "Obras"
2. Rellenar: título, descripción, fechas, empresa, número de trabajadores
3. Enviar y ver la obra en la lista

**Ver perfil**:
1. Click en "Perfil"
2. Ver datos: username, email, rol, tipo de usuario, vivienda

---

## Datos de demostración cargados

### Urbanización
- **Residencial Los Olivos** — Pozuelo de Alarcón, Madrid

### Viviendas (10)
- Bloque A: A-101, A-102, A-201, A-202
- Bloque B: B-101, B-102, B-201, B-202
- Chalets: C-101, C-102

### Instalaciones (6)
- Pista de Pádel (08:00 - 22:00)
- Piscina Municipal (10:00 - 20:00)
- Salón Social (09:00 - 23:00)
- Gimnasio Comunitario (06:00 - 23:00)
- Pista de Tenis (08:00 - 21:00)
- Zona BBQ (11:00 - 22:00)

### Incidencias (10)
| Título | Estado | Urgencia |
|---|---|---|
| Fuga de agua en garaje | Abierta | Alta |
| Luz rota en escalera | En progreso | Normal |
| Portón automático no cierra | Abierta | Crítica |
| Jardín sin mantenimiento | Resuelta | Normal |
| Cámara de seguridad rota | En progreso | Alta |
| Ascensor bloqueado | Abierta | Crítica |
| Piscina con algas | Resuelta | Normal |
| Ruido en obra vecina | Abierta | Normal |
| Barandilla suelta | Abierta | Alta |
| Caldera comunitaria | En progreso | Alta |

### Paquetes (8)
- 3 pendientes de recogida
- 5 entregados
- Transportistas: Amazon, SEUR, DHL, Correos

### Reservas (8)
- Pádel, Salón Social, Gimnasio, Piscina, Tenis, BBQ
- Fechas desde hoy hasta +7 días

### Accesos autorizados (8)
- Visitas familiares, técnicos, mensajería, empresas de reformas

### Obras registradas (5)
- Reforma cocina, instalación AC, pintura exterior, cambio ventanas, impermeabilización

### Notificaciones (12)
- Asignación de incidencias, paquetes recibidos, reservas confirmadas, recordatorios

---

## Script de demostración sugerido (5 minutos)

1. **(30s)** Mostrar landing page Django en http://localhost:8000/
2. **(30s)** Login como admin en el frontend React, mostrar dashboard
3. **(1min)** Como admin, ir a gestión de usuarios, cambiar rol a un usuario
4. **(1min)** Logout, login como `porteria` (STAFF), mostrar panel operativo
5. **(30s)** Cambiar estado de una incidencia (Abierta → En progreso)
6. **(1min)** Logout, login como `maria` (USER), mostrar panel de inicio
7. **(30s)** Reportar una nueva incidencia
8. **(30s)** Reservar una instalación (mostrar validación de solapamiento)

**Total: 5 minutos**

---

*Guía preparada para la demostración del Proyecto Final del Máster en Desarrollo Full Stack*
