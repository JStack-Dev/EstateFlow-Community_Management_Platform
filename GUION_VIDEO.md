# GUION VÍDEO EXPLICATIVO — EstateFlow (5 minutos)

## Instrucciones de grabación

1. Abre OBS Studio o Loom antes de empezar
2. Ten el navegador con estas pestañas abiertas:
   - GitHub: https://github.com/JStack-Dev/EstateFlow-Community_Management_Platform
   - Backend: https://estateflow-backend.onrender.com
   - Frontend: https://jstack-dev.github.io/EstateFlow-Community_Management_Platform/
3. Resolución 1080p, pantalla completa
4. Lee el guion con naturalidad, no tiene que ser perfecto

---

## BLOQUE 1: Problema y contexto (0:00 - 0:45)

**[PANTALLA: Landing page del backend — https://estateflow-backend.onrender.com]**

> "El problema que aborda EstateFlow es la gestión ineficiente de las comunidades residenciales. Hoy en día, la mayoría de urbanizaciones gestionan incidencias, reservas, paquetería y accesos mediante WhatsApp, papel o hojas de cálculo. Esto genera pérdida de información, falta de trazabilidad y procesos lentos."
>
> "EstateFlow centraliza toda la operativa de la comunidad en una plataforma digital única, accesible desde cualquier dispositivo, con roles diferenciados para administradores, personal de servicio y residentes."

---

## BLOQUE 2: Tecnologías (0:45 - 1:15)

**[PANTALLA: README.md en GitHub — pestaña del repo]**

> "El backend está construido con Django 5 y Django REST Framework, usando SimpleJWT para autenticación mediante tokens. La base de datos es SQLite en desarrollo y PostgreSQL en producción."
>
> "El frontend es React 19 con TypeScript, Vite como bundler, Tailwind CSS v4 para los estilos y Framer Motion para animaciones."
>
> "El despliegue usa Render para el backend y GitHub Pages con integración continua mediante GitHub Actions para el frontend. Todo el código está en un repositorio público de GitHub."

---

## BLOQUE 3: Demostración funcional (1:15 - 4:15)

### 3a. Login y roles (1:15 - 1:45)

**[PANTALLA: Frontend — https://jstack-dev.github.io/EstateFlow-Community_Management_Platform/]**

> "Vamos a ver la aplicación en funcionamiento. Empezamos con el login."

**[Acción: Escribir admin / admin123456 y pulsar Iniciar sesión]**

> "Al entrar como administrador, el sistema nos redirige automáticamente al panel de administración, donde podemos ver métricas globales y gestionar usuarios."

**[Acción: Cerrar sesión]**

> "Si entramos como residente..."

**[Acción: Escribir maria / user123456 y pulsar Iniciar sesión]**

> "...nos redirige al portal del residente, con un dashboard personalizado. El sistema distingue tres roles: ADMIN, STAFF y USER, cada uno con permisos y vistas diferentes."

### 3b. Portal del residente (1:45 - 2:45)

**[PANTALLA: Página de Inicio del portal]**

> "Aquí podemos ver React obteniendo datos reales del backend. El dashboard hace cinco llamadas paralelas a la API y muestra un resumen con incidencias abiertas, reservas activas, paquetes pendientes, visitas autorizadas y obras registradas."

**[Acción: Pulsar F12, abrir Network tab, recargar la página]**

> "Si abrimos las herramientas de desarrollador, podemos ver las peticiones reales a la API: incidencias, reservas, paquetería, accesos y obras, todas autenticadas con el token JWT."

**[Acción: Cerrar DevTools, ir a Incidencias]**

> "En la sección de incidencias, el residente puede reportar nuevas incidencias..."

**[Acción: Pulsar "Nueva incidencia", rellenar formulario y crear]**

> "...rellenando título, descripción, ubicación, categoría y nivel de urgencia. La incidencia se crea al instante y aparece en la tabla."

**[Acción: Ir a Reservas]**

> "En reservas, el residente puede ver las instalaciones disponibles y reservarlas para un día y horario concreto, con validación de solapamientos."

### 3c. Panel de operativa — Staff (2:45 - 3:30)

**[Acción: Cerrar sesión, entrar como porteria / staff123456]**

> "Ahora entramos como personal de servicio, en este caso portería."
>
> "El panel operativo muestra KPIs: total de incidencias, abiertas, en progreso, resueltas y tiempo medio de resolución."

**[Acción: Ir a Incidencias]**

> "Desde aquí el staff puede cambiar el estado de las incidencias. El sistema tiene una máquina de estados que valida las transiciones: una incidencia abierta pasa a en progreso, y de ahí a resuelta. No se permiten saltos arbitrarios."

**[Acción: Cambiar una incidencia de OPEN a IN_PROGRESS]**

> "Vemos cómo al cambiar el estado, la tabla se actualiza inmediatamente."

### 3d. Panel de administración (3:30 - 4:15)

**[Acción: Cerrar sesión, entrar como admin / admin123456]**

> "Volviendo al panel de administración, aquí tenemos métricas globales del sistema."

**[Acción: Mostrar el dashboard con stats]**

> "Podemos ver incidencias críticas sin resolver, usuarios recientes y todas las incidencias del sistema."

**[Acción: Ir a Usuarios]**

> "En la gestión de usuarios, el administrador puede cambiar roles y activar o desactivar usuarios."

**[Acción: Mostrar la tabla de usuarios, cambiar un rol]**

---

## BLOQUE 4: Integración React + Backend (4:15 - 4:45)

**[PANTALLA: Frontend con DevTools abiertos]**

> "Para cumplir con el requisito de integración, el frontend React hace peticiones autenticadas al backend Django. Por ejemplo, en la página de incidencias, React hace un GET a la ruta API incidents con el token Bearer en la cabecera de autorización, y renderiza los datos en una tabla con componentes reutilizables construidos con Tailwind CSS."

**[Acción: Mostrar Network tab, click en una petición, mostrar Request Headers con Authorization: Bearer]**

> "Aquí podemos ver el token JWT en la cabecera. Si el token expira, el cliente lo renueva automáticamente usando el refresh token."

---

## BLOQUE 5: Cierre (4:45 - 5:00)

**[PANTALLA: Repositorio GitHub]**

> "EstateFlow automatiza procesos que antes requerían llamadas y papel, aporta trazabilidad completa de incidencias, y da visibilidad a administradores y personal de servicio."
>
> "El sistema está desplegado y accesible públicamente. El repositorio GitHub incluye documentación completa, guía de instalación y datos de demostración."
>
> "Gracias por vuestra atención."

---

## CREDENCIALES PARA EL VÍDEO

| Rol | Usuario | Contraseña |
|-----|---------|------------|
| Admin | admin | admin123456 |
| Staff | porteria | staff123456 |
| Residente | maria | user123456 |
