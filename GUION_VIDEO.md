# 🎬 GUION MAESTRO DEL VÍDEO EXPLICATIVO (PFM) — EstateFlow

> ⏱️ **Límite oficial de Conquer Blocks**: Máximo 5:00 minutos.  
> 🎯 **Duración estimada**: **4:20 minutos** (con 40 segundos de margen de seguridad).  
> 🌐 **Formato interactivo disponible**: Abre en tu navegador [GUION_VIDEO.html](file:///C:/Users/Jorge/Desktop/EstateFlow-Community_Management_Platform/GUION_VIDEO.html) para tener el teleprompter con cronómetro y botones de copiado rápido.

---

## 🔑 CREDENCIALES DIRECTAS PARA EL VÍDEO

| Rol | Usuario | Contraseña | Destino al hacer login |
|---|---|---|---|
| **Residente** | `maria` | `user123456` | Portal del Residente (`http://localhost:5173/#/portal`) |
| **Personal / Staff** | `porteria` | `staff123456` | Panel Operativo (`http://localhost:5173/#/operativa`) |
| **Administrador** | `admin` | `admin123456` | Panel Administrador (`http://localhost:5173/#/admin`) |

---

## ⏱️ DESGLOSE PASO A PASO CON ENLACES EXACTOS

---

### 1️⃣ Portada y Planteamiento del Problema (0:00 - 0:40)

* 🔗 **Enlace a abrir**: [http://localhost:8000/](http://localhost:8000/) (Landing page de Django)
* **Acciones en pantalla**:
  1. Muestra la cabecera: *"EF EstateFlow — Gestión inteligente de tu urbanización"*.
  2. Haz un scroll suave hacia abajo mostrando las tarjetas de funcionalidades: *Gestión de incidencias, Reservas de instalaciones, Paquetería, Control de accesos*.
* **Qué decir**:
  > *"Hola, soy Jorge Moscoso y os presento mi Proyecto Final de Máster: EstateFlow, una plataforma SaaS orientada a la gestión integral y digitalización de comunidades residenciales.*
  >
  > *El problema habitual en la mayoría de urbanizaciones es la falta de un programa centralizado que atienda todas las necesidades que surgen en el día a día: desde la notificación de averías y la reserva de zonas comunes, hasta la recepción de paquetería y el control de accesos. Al no existir una herramienta unificada, la información se dispersa y se pierde el control.*
  >
  > *EstateFlow centraliza todos estos procesos en una única aplicación con tres roles específicos: Residentes, Personal operativo y Administrador general."*

---

### 2️⃣ Tecnologías y Backend en Django (Modelos y ORM) (0:40 - 1:15)

* 🔗 **Enlace a abrir**: [http://localhost:8000/admin/](http://localhost:8000/admin/) (Panel de Administración de Django)
* **Acciones en pantalla**:
  1. Abre el panel de administración oficial de Django *(si te pide entrar, usa `admin` / `admin123456`)*.
  2. Muestra los modelos de datos relacionales registrados en Django (*Users, Viviendas, Incidencias, Reservas, Paquetes*).
* **Qué decir**:
  > *"A nivel arquitectónico, el sistema combina un backend robusto en Django y una interfaz desacoplada con React.*
  >
  > *En el backend utilizamos Python 3.12 con Django 5 y Django REST Framework. Como vemos aquí en el panel oficial de Django, disponemos de un modelo de datos relacional completo gestionado por el ORM, con entidades bien estructuradas para usuarios, urbanizaciones, incidencias y reservas.*
  >
  > *Django se encarga de la lógica de negocio y expone una API REST protegida mediante tokens JWT con SimpleJWT, que es la que suministra los datos en tiempo real al frontend."*

---

### 3️⃣ Demostración en React por Roles (1:15 - 3:30)

* 🔗 **Enlace a abrir**: [http://localhost:5173/#/login](http://localhost:5173/#/login) (Single Page Application en React)

#### 👤 3.1 — Rol Residente: María (1:15 - 2:00)
* **Acciones en pantalla**:
  1. En el login escribe: Usuario `maria` | Clave `user123456` y pulsa **Iniciar sesión**.
  2. Entras al *Portal del Residente*. En el menú lateral izquierdo haz clic en **Incidencias** ([http://localhost:5173/#/portal/incidencias](http://localhost:5173/#/portal/incidencias)).
  3. Pulsa el botón **+ Nueva incidencia** y rellena:
     - Título: `Luz fundida descansillo`
     - Ubicación: `Bloque A portal 1`
     - Descripción: `Parpadea el foco del rellano`
  4. Pulsa **Crear incidencia** y señala cómo aparece de inmediato en la tabla.
  5. Haz un clic rápido en el menú lateral en **Reservas** ([http://localhost:5173/#/portal/reservas](http://localhost:5173/#/portal/reservas)) mostrando las pistas de pádel y gimnasio.
* **Qué decir**:
  > *"Pasamos a la Single Page Application desarrollada en React 19, TypeScript y Vite con estilos en Tailwind CSS v4.*
  >
  > *Iniciamos sesión como residente con María. El sistema detecta su rol USER y abre su portal privado. Si vamos a la sección de Incidencias, creamos una nueva avería de ejemplo.*
  >
  > *Al pulsar en 'Crear incidencia', vemos cómo se añade al instante en la lista gracias al estado reactivo, sin recargar la página. Además, desde el menú lateral el vecino puede reservar pistas de pádel o piscina con control de horarios."*

#### 🔧 3.2 — Rol Personal Operativo: Portería (2:00 - 2:45)
* **Acciones en pantalla**:
  1. Haz clic en **Cerrar sesión** (abajo del todo en el menú lateral izquierdo).
  2. En el login escribe: Usuario `porteria` | Clave `staff123456` y pulsa **Iniciar sesión** (lleva a [http://localhost:5173/#/operativa](http://localhost:5173/#/operativa)).
  3. En el menú lateral izquierdo haz clic en **Incidencias** ([http://localhost:5173/#/operativa/incidencias](http://localhost:5173/#/operativa/incidencias)).
  4. Localiza la avería `Luz fundida descansillo` y en la columna *Cambiar estado* selecciona: **En progreso**.
* **Qué decir**:
  > *"Ahora cerramos sesión y accedemos con el perfil operativo de conserjería con el usuario portería.*
  >
  > *La aplicación nos redirige automáticamente a su panel de control operativo. Al entrar en Incidencias, el personal técnico visualiza las averías reportadas por los vecinos.*
  >
  > *Desde el desplegable de acciones, el operario avanza el estado de la incidencia de 'Abierta' a 'En progreso', implementando un flujo de trabajo controlado por una máquina de estados para asegurar la trazabilidad del mantenimiento."*

#### 👑 3.3 — Rol Administrador: Admin (2:45 - 3:30)
* **Acciones en pantalla**:
  1. Haz clic de nuevo en **Cerrar sesión** (abajo del todo en el menú lateral).
  2. En el login escribe: Usuario `admin` | Clave `admin123456` y pulsa **Iniciar sesión** (lleva a [http://localhost:5173/#/admin](http://localhost:5173/#/admin)).
  3. Muestra el *Dashboard de Administrador*: 6 tarjetas de métricas (Total, Abiertas, Resueltas, Tiempo medio, etc.) y la alerta de incidencias críticas.
  4. En el menú lateral izquierdo haz clic en **Usuarios** ([http://localhost:5173/#/admin/usuarios](http://localhost:5173/#/admin/usuarios)).
  5. Señala la tabla de usuarios donde el administrador puede reasignar roles (USER, STAFF, ADMIN) o activar/desactivar cuentas.
* **Qué decir**:
  > *"Por último, cerramos sesión e iniciamos como Administrador general con el usuario admin.*
  >
  > *El administrador cuenta con un cuadro de mandos global con KPIs esenciales: tiempo medio de resolución, volumen de averías resueltas y alertas de incidencias críticas en zonas comunes.*
  >
  > *Además, dispone del módulo de Gestión de Usuarios, donde puede modificar roles en caliente y habilitar o suspender cuentas de residentes o empleados según las necesidades de la comunidad."*

---

### 4️⃣ Requisito Clave: React Consumiendo Datos del Backend en Vivo (3:30 - 4:15)
*(⚠️ Requisito prioritario Conquer Blocks — 15% de la calificación final)*

#### 🔹 Paso 4.1: Abrir DevTools
* **🖥️ En pantalla**: Pulsa **F12** ➔ Haz clic en la pestaña superior **Red (Network)** ➔ Pulsa justo debajo en el filtro **Fetch/XHR**.
* **🎙️ Qué decir mientras lo abres**:
  > *"Vamos a ver ahora cómo se comunica la aplicación en tiempo real abriendo la pestaña de Red en las herramientas de desarrollador."*

#### 🔹 Paso 4.2: Recargar la vista
* **🖥️ En pantalla**: Pulsa **F5** para recargar. Verás aparecer en la lista peticiones como `me/` y `users/`.
* **🎙️ Qué decir mientras se cargan**:
  > *"Al recargar la vista, observamos cómo los componentes de React realizan peticiones HTTP Fetch contra los endpoints del backend de Django, en este caso a `/api/auth/me/` y a `/api/users/`."*

#### 🔹 Paso 4.3: Mostrar el Token JWT (Headers)
* **🖥️ En pantalla**: Haz clic en la fila de `users/` ➔ Ve a la pestaña **Encabezados (Headers)** ➔ Señala con el ratón la línea: `Authorization: Bearer <token_jwt>`.
* **🎙️ Qué decir señalando la cabecera**:
  > *"En los encabezados de la petición se comprueba el envío del token Bearer JWT obtenido en el login para verificar los permisos del usuario..."*

#### 🔹 Paso 4.4: Mostrar el JSON recibido (Response)
* **🖥️ En pantalla**: Haz clic en la pestaña **Respuesta (Response)** al lado de Headers y muestra los datos de los usuarios en formato JSON devueltos por Django.
* **🎙️ Qué decir mostrando el JSON**:
  > *"...y el backend responde con los datos en formato JSON, que React procesa y pinta en pantalla de forma dinámica y reactiva."*

---

### 5️⃣ Conclusiones y Cierre (4:15 - 4:35)

* **Acciones en pantalla**:
  1. Cierra las DevTools con **F12** (o con la X).
  2. Deja en pantalla el dashboard principal de la aplicación.
* **Qué decir**:
  > *"EstateFlow reúne de forma completa las exigencias del Máster en Desarrollo Full Stack: una arquitectura limpia y desacoplada, backend con Django y persistencia de datos relacional, interfaz reactiva en React consumiendo la API, control riguroso de roles y seguridad.*
  >
  > *Muchas gracias por vuestra atención y quedo a vuestra total disposición para la defensa del proyecto."*
