# TechSolutions - Sistema de Gestión Empresarial

## Descripción del proyecto

TechSolutions es un sistema web empresarial desarrollado para la gestión de clientes, proyectos y tareas mediante un sistema de roles y permisos. El sistema permite administrar información según el perfil del usuario, garantizando control de acceso y seguridad.

El proyecto fue desarrollado bajo una arquitectura Full Stack utilizando React para el frontend, Node.js + Express para el backend y MongoDB Atlas como base de datos en la nube.

---

## Funcionalidades principales

### Gestión de clientes
- Crear clientes
- Editar clientes
- Eliminar clientes
- Buscar clientes
- Asociación de usuarios cliente
- Validación de datos duplicados

### Gestión de proyectos
- Crear proyectos
- Editar proyectos
- Eliminar proyectos
- Asignar clientes a proyectos
- Seguimiento visual del estado del proyecto
- Barra de progreso
- Consulta personalizada para clientes

### Gestión de tareas
- Crear tareas
- Editar tareas
- Eliminar tareas
- Asignar tareas a trabajadores
- Visualización controlada por permisos

### Gestión de usuarios (solo admin)
- Crear usuarios
- Editar usuarios
- Eliminar usuarios
- Asignación de roles

### Sistema de autenticación
- Inicio de sesión
- Autenticación JWT
- Protección de rutas
- Persistencia de sesión

### Sistema de roles y permisos

#### Administrador
Puede:
- Gestionar clientes
- Gestionar proyectos
- Gestionar tareas
- Gestionar usuarios
- Eliminar registros

#### Trabajador
Puede:
- Visualizar clientes
- Gestionar proyectos
- Visualizar tareas
- Editar únicamente tareas asignadas a él
- No puede gestionar usuarios

#### Cliente
Puede:
- Ver únicamente sus proyectos asignados
- Consultar estado del proyecto
- Visualizar progreso del proyecto
- No puede gestionar información

---

## Tecnologías utilizadas

### Frontend
- React.js
- React Router DOM
- Axios
- CSS3

### Backend
- Node.js
- Express.js
- JWT (JSON Web Token)
- bcryptjs

### Base de datos
- MongoDB Atlas
- Mongoose