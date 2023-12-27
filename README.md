# Proyecto de API con Socket.io y MongoDB

Este proyecto es una API construida con Express, Socket.io para la gestión de mensajes en tiempo real y MongoDB para almacenar los mensajes y los usuarios.

## Configuración del Proyecto

1. Clona este repositorio.
2. Instala las dependencias utilizando `npm install`.
3. Crea un archivo `.env` y configura las variables de entorno:

   ```plaintext
   PORT=3000
   MONGO_PORT=27017
   ```

## Ejecución del Proyecto

- Ejecuta `npm start` para iniciar el servidor.
- El servidor se ejecutará en el puerto configurado en el archivo `.env` o por defecto en el puerto 3000.

## Endpoints

### Mensajes

- **GET /:** Obtiene todos los mensajes.
- **POST /:** Crea un nuevo mensaje.

### Usuarios

- **GET /users:** Obtiene todos los usuarios con sus mensajes.

## Uso del Socket.io

El servidor utiliza Socket.io para manejar la conexión de los clientes y la emisión de mensajes en tiempo real.

## Dependencias Principales

- Express: Para la creación de la API.
- Socket.io: Para la comunicación bidireccional en tiempo real.
- MongoDB: Base de datos utilizada para almacenar mensajes y usuarios.

## Estructura del Código

El código está organizado en varios archivos para mantener la modularidad:

- `server.js`: Archivo principal que contiene la configuración del servidor.
- `models/message_eschema.js`: Modelo para los mensajes en MongoDB.
- `models/users_eschema.js`: Modelo para los usuarios en MongoDB.
- `mongo.js`: Configuración de la base de datos MongoDB.

## Contribución

Si deseas contribuir al proyecto, no dudes en enviar tus sugerencias o mejoras mediante pull requests.
